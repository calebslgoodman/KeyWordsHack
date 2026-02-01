import AsyncStorage from '@react-native-async-storage/async-storage';
import { Buffer } from 'buffer';

const KROGER_BASE_URL = 'https://api.kroger.com/v1';
const KROGER_AUTH_URL = 'https://api.kroger.com/v1/connect/oauth2';

// Credentials
const CLIENT_ID = process.env.EXPO_PUBLIC_KROGER_CLIENT_ID || '';
const CLIENT_SECRET = process.env.EXPO_PUBLIC_KROGER_CLIENT_SECRET || '';
const REDIRECT_URI = process.env.EXPO_PUBLIC_KROGER_REDIRECT_URI || 'http://localhost:8000/callback';

export interface KrogerToken {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
    token_type: string;
}

export interface KrogerLocation {
    locationId: string;
    chain: string;
    name: string;
    address: {
        addressLine1: string;
        city: string;
        state: string;
        zipCode: string;
    };
}

export interface KrogerProduct {
    productId: string;
    description: string;
    price?: {
        regular: number;
        promo: number;
    };
    fulfillment?: {
        curbside: boolean;
        delivery: boolean;
    };
    images: {
        url: string;
        perspective: string;
    }[];
}

/**
 * Service to interact with Kroger Public API
 */
export const KrogerService = {
    /**
     * Generates the OAuth2 Authorization URL
     */
    getAuthUrl: () => {
        console.log('Using Kroger Client ID:', CLIENT_ID); // Debug
        if (!CLIENT_ID) {
            console.error('Kroger Client ID is missing. Check your .env file and ensure EXPO_PUBLIC_KROGER_CLIENT_ID is set.');
        }
        const scope = encodeURIComponent('product.compact cart.basic:write profile.compact');
        return `${KROGER_AUTH_URL}/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${scope}`;
    },

    /**
     * Exchanges authorization code for access token
     * Note: In a production mobile app, client secret is unsafe to store.
     *Ideally, this exchange happens on a backend proxy.
     * For this "hackathon" context/MCP demo, we do it client-side as requested.
     */
    exchangeCodeForToken: async (code: string): Promise<KrogerToken> => {
        const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

        const params = new URLSearchParams();
        params.append('grant_type', 'authorization_code');
        params.append('code', code);
        params.append('redirect_uri', REDIRECT_URI);

        const response = await fetch(`${KROGER_AUTH_URL}/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${credentials}`,
            },
            body: params.toString(),
        });

        if (!response.ok) {
            const text = await response.text();
            console.error('Kroger Token Exchange Error:', text);
            throw new Error(`Token exchange failed: ${response.status}`);
        }

        const data = await response.json();
        await KrogerService.saveToken(data);
        return data;
    },

    /**
     * Get Client Credentials Token (Cart/Profile access requires User Token, 
     * but Location/Product Search *can* use Client Token if no user is logged in.
     * For simplicity here, we stick to User Token flow for everything or implement specific Client Token fallback).
     */
    getClientToken: async (): Promise<string> => {
        // Basic implementation for public data access if needed
        // ...
        return '';
    },

    saveToken: async (token: KrogerToken) => {
        await AsyncStorage.setItem('kroger_token', JSON.stringify({
            ...token,
            timestamp: Date.now(),
        }));
    },

    getToken: async (): Promise<string | null> => {
        const json = await AsyncStorage.getItem('kroger_token');
        if (!json) return null;

        const token = JSON.parse(json);
        // Simple expiration check (expires_in is usually seconds, default 1800 aka 30 mins)
        const isExpired = Date.now() - token.timestamp > (token.expires_in * 1000);

        if (isExpired) {
            // Ideally refresh here using refresh_token
            // await KrogerService.refreshToken(token.refresh_token);
            return null;
        }

        return token.access_token;
    },

    /**
     * Search for Store Locations
     */
    searchLocations: async (zipCode: string): Promise<KrogerLocation[]> => {
        const token = await KrogerService.getToken();
        if (!token) throw new Error('Not authenticated with Kroger');

        const response = await fetch(`${KROGER_BASE_URL}/locations?filter.zipCode.near=${zipCode}&filter.limit=5`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
        });

        if (!response.ok) throw new Error('Failed to fetch locations');
        const data = await response.json();
        return data.data;
    },

    /**
     * Search for Products with Dietary "Smarts"
     */
    searchProducts: async (term: string, locationId: string, dietaryRestrictions: string[] = []): Promise<KrogerProduct[]> => {
        const token = await KrogerService.getToken();
        if (!token) throw new Error('Not authenticated');

        // "AI-Powered" Search Logic: Append restrictions to term
        // e.g., "Milk" + ["Dairy Free"] -> "Dairy Free Milk"
        // e.g., "Bread" + ["Gluten Free"] -> "Gluten Free Bread"
        let searchTerm = term;

        // Simple logic: if restriction is highly relevant, prepend it
        // This is where "recipe_adaptation_v1" context comes in handy
        const commonAllergens = ['Gluten Free', 'Dairy Free', 'Vegan', 'Peanut Free'];
        const relevantFilters = dietaryRestrictions.filter(r => commonAllergens.includes(r));

        if (relevantFilters.length > 0) {
            searchTerm = `${relevantFilters.join(' ')} ${term}`;
        }

        const url = `${KROGER_BASE_URL}/products?filter.term=${encodeURIComponent(searchTerm)}&filter.locationId=${locationId}&filter.limit=1`;

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
        });

        if (!response.ok) return [];

        const data = await response.json();
        return data.data;
    },

    /**
     * Bulk Add to Cart
     * Kroger API allows adding one item at a time. We verify and add sequentially.
     */
    addToCart: async (items: Array<{ upc: string; quantity: number }>): Promise<number> => {
        const token = await KrogerService.getToken();
        if (!token) throw new Error('Not authenticated');

        let successCount = 0;

        for (const item of items) {
            try {
                const response = await fetch(`${KROGER_BASE_URL}/cart/add`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        items: [{ upc: item.upc, quantity: item.quantity }]
                    })
                });

                if (response.ok) successCount++;
            } catch (err) {
                console.error(`Failed to add UPC ${item.upc}`, err);
            }
        }

        return successCount;
    }
};
