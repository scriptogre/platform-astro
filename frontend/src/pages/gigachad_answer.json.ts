import OpenAI from "openai";
import dotenv from 'dotenv';

dotenv.config()
export async function GET({params, request}) {

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: "user", content: "I don't have any money" }],
        model: "ft:gpt-3.5-turbo-0613:personal::7teyZSgg",
        max_tokens: 150,
    });
    return new Response(
        JSON.stringify({
            message: chatCompletion.choices[0].message.content,
            from: 'gigachad',
        })
    )
}