import { GoogleGenAI } from '@google/genai';

const MODELS_TO_TRY = ["gemini-3-flash-preview"];

export async function getAIResponse(text: string, apiKey: string, language: string): Promise<string> {
    if (!apiKey) {
        return "Please set your API Key in the settings to start chatting.";
    }

    const prompt = `
    You are a helpful language tutor helping a user learn ${language}.
    The user said: "${text}".
    
    Respond naturally to keep the conversation going. 
    Correct any major grammatical errors politely if necessary, but prioritize fluency.
    Keep your response concise (1-2 sentences) and suitable for spoken conversation.
    Respond in ${language}.
    `;

    let lastError: any = null;

    for (const modelName of MODELS_TO_TRY) {
        try {
            console.log(`Trying model (SDK: @google/generative-ai): ${modelName}`);
            const genAI = new GoogleGenAI({ apiKey: apiKey.trim() });

            const result = await genAI.models.generateContent({
                model: modelName,
                contents: prompt,
            });
            return result.text || "";

        } catch (error: any) {
            console.warn(`Failed with model ${modelName}:`, error);
            lastError = error;
            // Continue to next model
        }
    }

    console.error("All models failed. Last error:", lastError);

    if (lastError?.message?.includes("404") || lastError?.message?.includes("not found")) {
        return lastError?.message;
    }

    return `Error: ${lastError?.message || "Unknown error occurred"}. Please check your API Key.`;
}
