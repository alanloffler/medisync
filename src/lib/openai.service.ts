import { OpenAI } from 'openai';

const OPENAI_API_KEY: string = import.meta.env.VITE_OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function translateOpenAi(content: string, lng: string) {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    temperature: 0.5,
    messages: [{ role: 'user', content: `Act as a translator. Translate this text to ${lng}: ${content}` }],
  });
  // console.log(completion);
  return completion;
}

export class OpenAIService {
  public static async translate(content: string, language: string) {
    console.log('OPENAI Translation');
    console.log('--------------------');
    console.log('Content:', content);
    console.log('Translate to: ', language);
    console.log('Default language: ');
  }
}