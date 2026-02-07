import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

// This is a placeholder. You'll need to set OPENAI_API_KEY in .env
export async function POST(req: Request) {
    const { messages } = await req.json();

    const result = streamText({
        model: openai('gpt-4o'),
        messages,
        system: "You are an Arcane AI Agent built with the Forboc SDK. Speak in a scholarly, slightly medieval tone.",
    });

    return result.toTextStreamResponse();
}
