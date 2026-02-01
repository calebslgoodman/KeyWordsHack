import { Platform } from 'react-native';

const INSTACART_MCP_URL = 'https://mcp.dev.instacart.tools/mcp';

// Schema from Gemini
export interface GroceryItem {
    name: string;
    quantity: number;
    unit?: string;
    category?: string;
    notes?: string;
}

export interface GroceryListJSON {
    items: GroceryItem[];
    total_estimated_cost?: number;
    currency?: string;
}

// Tool definitions
interface InstacartToolResponse {
    content: {
        type: string;
        text: string;
    }[];
    isError?: boolean;
}

/**
 * Connects to the Instacart MCP server to generate a shoppable link.
 */
export async function generateInstacartLink(groceryData: GroceryListJSON): Promise<string | null> {
    const ingredients = groceryData.items.map(item => {
        // Clean and format the ingredient string for better matching
        const unitStr = item.unit ? ` ${item.unit}` : '';
        return `${item.quantity}${unitStr} ${item.name}`;
    });

    console.log('Generating Instacart link for ingredients:', ingredients);

    try {
        // We construct a JSON-RPC 2.0 request for the 'tools/call' method
        // Note: This implements a lightweight MCP client over HTTP
        const response = await fetch(INSTACART_MCP_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.EXPO_PUBLIC_INSTACART_API_KEY || ''}`,
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: Date.now(),
                method: 'tools/call',
                params: {
                    name: 'create-shopping-list',
                    arguments: {
                        ingredients: ingredients,
                    },
                },
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Instacart API Error:', response.status, errorText);
            throw new Error(`Instacart API failed with status ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
            console.error('Instacart MCP Error:', data.error);
            throw new Error(data.error.message || 'Unknown MCP error');
        }

        // Parse the result
        // The create-shopping-list tool typically returns a text result with the URL
        // or a specialized result structure. We'll look for the first text content.
        const result = data.result as InstacartToolResponse;

        if (result.isError) {
            console.error('Tool execution error:', result);
            throw new Error('Instacart tool execution returned an error');
        }

        const content = result.content.find(c => c.type === 'text');
        if (!content) {
            throw new Error('No text content in Instacart response');
        }

        // Extract URL from the text (it might be just the URL, or text containing it)
        // Assuming the tool returns the raw URL or a markdown link
        console.log('Instacart Tool Output:', content.text);

        // Simple regex to find a URL in the text
        const urlMatch = content.text.match(/https?:\/\/[^\s]+/);
        if (urlMatch) {
            return urlMatch[0];
        }

        return null;

    } catch (error) {
        console.error('Failed to generate Instacart link:', error);
        // Fallback: Create a direct search URL if the API fails, or re-throw
        // For now, we strictly follow the instruction to use the MCP server.
        throw error;
    }
}
