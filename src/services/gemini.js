import { GoogleGenerativeAI } from "@google/generative-ai";
import { colleges } from "./mockData";

// Initialize Gemini
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

// System Prompt with Context
const SYSTEM_PROMPT = `
You are 'CapAssistant', an expert engineering admission counselor for Maharashtra (MHT-CET).
Your goal is to help students analyze their chances, understand the CAP process, and choose colleges.

Context Data:
We have a database of 200+ colleges with fields: Name, Branch, Category, Closing Rank, and Type (Top/Medium/Low).
Some examples from our data:
${JSON.stringify(colleges.slice(0, 20))} ...and many more.

Guidelines:
1. Be encouraging, professional, and concise.
2. If asked about a specific college cutoff, estimate based on the "Context Data" provided above (Top ~100-2000, Medium ~20k-70k, Low ~100k+).
3. If the user asks about a college NOT in the snippet, give a general estimation based on its reputation in Maharashtra.
4. The user's input may be short (e.g., "COEP cutoff"), interpret it intelligently.
5. Format responses with bullet points if listing multiple details.
6. Do NOT mention you are an AI model by Google; you are "CapAssistant from CapAdmission.ai".
`;

export const getGeminiResponse = async (history, message) => {
    if (!API_KEY) {
        return "Error: API Key is missing. Please configure VITE_GEMINI_API_KEY.";
    }

    try {
        // Use the comprehensive alias which usually maps to the most stable Flash version
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        // Construct chat history for context
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: SYSTEM_PROMPT }],
                },
                {
                    role: "model",
                    parts: [{ text: "Understood. I am CapAssistant, ready to help." }],
                },
                ...history.map(msg => ({
                    role: msg.sender === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.text }]
                }))
            ],
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        return response.text();

    } catch (error) {
        console.error("Gemini API Error:", error);

        // Graceful Fallback for Quota/Network issues
        if (error.message.includes('429') || error.message.includes('Quota')) {
            return "I am currently at maximum capacity (Quota Limit). Please try again in 30 seconds.";
        }

        return "I'm having trouble connecting to the AI brain directly. Please check these common questions:\n- What are the required documents?\n- What is the cutoff for COEP?\n\n(Error: Connection failed)";
    }
};
