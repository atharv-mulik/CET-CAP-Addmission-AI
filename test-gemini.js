import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyD0GOXT-g_UTvsG9Uj6v5-KdbFYzP3GlLU";
const genAI = new GoogleGenerativeAI(API_KEY);

async function listModels() {
    try {
        console.log("Fetching available models...");
        // Direct REST call to list models since SDK helper might be obscure
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
        const data = await response.json();

        const fs = await import('fs');
        if (data.models) {
            const list = data.models.map(m => m.name).join('\n');
            await fs.promises.writeFile('models.txt', list);
            console.log("Written to models.txt");
        } else {
            await fs.promises.writeFile('models.txt', JSON.stringify(data, null, 2));
        }
    } catch (error) {
        const fs = await import('fs');
        await fs.promises.writeFile('models.txt', `Error: ${error.message}`);
    }
}

listModels();
