import { action } from "./_generated/server";
import { v } from "convex/values";

export const generatePostsFromGemini = action({
    args:{
        layout: v.string(),
        instructions: v.optional(v.string()),
        productDescription: v.optional(v.string()),
    },

    handler: async (_,args) => {
        const apiKey = process.env.GOOGLE_GEMINI_API;
        if(!apiKey) throw new Error("Missing Gemini API key")

        const prompt = `
            You are an expert social media content creator.
            
            Generate 5 short, catchy marketing posts using the layout style:"${args.layout}".
            Each post should follow the given layout and be suitable for platforms like Instagram or LinkedIn.

            Instructions from user:
            ${args.instructions || "No special instructions provided."}

            Product description:
            ${args.productDescription || "No product description provided."}

            Respond with JSON array of 5 strings (text only). No formatting or explanations.
        `.trim();

        const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + apiKey, {
            method: "POST",
            headers : {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: prompt }],
                    }
                ]
            })
        })

        const json = await res.json()

        try{
            const text = json.candidates?.[0]?.content?.parts?.[0]?.text || "";
            return JSON.parse(text);
        }
        catch(error){
            console.error("Failed to parse Gemini output", error);
      return [];
        }
    }

})