import OpenAI from 'openai';
import { type Message } from '@/generated/prisma';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getAIChatCompletion(
  messages: Message[],
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content:
          'You are a helpful career counselor. Provide concise and helpful advice.',
      },
      ...messages.map((msg) => ({
        role: msg.role.toLowerCase() as 'user' | 'assistant',
        content: msg.content,
      })),
    ],
  });
  return response.choices[0].message.content || '';
}
