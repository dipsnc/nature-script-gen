import Groq from "groq-sdk";

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { location } = req.body;

    if (!location) {
        return res.status(400).json({ error: 'Location is required' });
    }

    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    if (!GROQ_API_KEY || GROQ_API_KEY === 'your_groq_api_key_here') {
        return res.status(500).json({ 
            error: "Groq API Key is missing. Please add it to your .env file as GROQ_API_KEY." 
        });
    }

    const groq = new Groq({
        apiKey: GROQ_API_KEY,
    });

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a calming meditation guide. Generate a 1-minute breathing exercise script based on the provided location. Use the location's atmosphere to make it immersive. The script MUST be exactly 6 short, soothing sentences. Return ONLY a JSON object with a 'script' key containing an array of 6 strings."
                },
                {
                    role: "user",
                    content: `Location: ${location}`
                }
            ],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" }
        });

        const responseContent = JSON.parse(chatCompletion.choices[0].message.content);
        const script = responseContent.script;

        if (Array.isArray(script) && script.length === 6) {
             return res.status(200).json({ script });
        } else {
             return res.status(500).json({ error: 'Unexpected AI response format' });
        }

    } catch (error) {
        console.error('Groq API Error:', error);
        return res.status(500).json({ error: 'Failed to generate meditation script' });
    }
}
