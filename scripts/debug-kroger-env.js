console.log('--- Kroger Env Debugger ---');

// Manually load dotenv to simulate what Expo does
require('dotenv').config();

const clientID = process.env.EXPO_PUBLIC_KROGER_CLIENT_ID;
const clientSecret = process.env.EXPO_PUBLIC_KROGER_CLIENT_SECRET;
const redirectUri = process.env.EXPO_PUBLIC_KROGER_REDIRECT_URI;

console.log('Raw Client ID:', clientID);
if (clientID) {
    console.log('Client ID Length:', clientID.length);
    console.log('ID + invisible char check:', JSON.stringify(clientID));
    if (clientID === 'mealswipe3-bbcc3v2h') {
        console.log('✅ Client ID matches expected value.');
    } else {
        console.log('❌ Client ID DOES NOT match expected value (mealswipe3-bbcc3v2h)');
    }
} else {
    console.log('❌ EXPO_PUBLIC_KROGER_CLIENT_ID is undefined or empty.');
}

console.log('--- End Debug ---');
