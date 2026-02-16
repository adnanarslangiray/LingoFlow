export async function getAIResponse(text: string): Promise<string> {
    console.log("AI received:", text);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const responses = [
        "That is a very interesting perspective. Could you tell me more about it?",
        "I see. How long have you been learning this language?",
        "Great pronunciation! Let's try a harder sentence next.",
        "Can you describe your daily routine in more detail?",
        "Imagine you are at a restaurant. How would you order a meal?",
        "What is your favorite hobby and why do you like it?",
        "That sounds wonderful. I'd love to visit that place someday."
    ];

    return responses[Math.floor(Math.random() * responses.length)];
}
