
import { GoogleGenAI } from '@google/genai';

console.log("GoogleGenAI imported successfully.");

try {
    const genAI = new GoogleGenAI({ apiKey: 'TEST_KEY' });
    console.log("Instance created.");
    console.log("Methods on genAI.models:", Object.getOwnPropertyNames(Object.getPrototypeOf(genAI.models)));

    // Check if generateContent exists
    if (typeof genAI.models.generateContent === 'function') {
        console.log("generateContent method exists!");
    } else {
        console.log("generateContent method NOT found.");
    }

} catch (e) {
    console.error("Error:", e);
}
