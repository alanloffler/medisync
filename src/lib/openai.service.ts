import { OpenAI } from 'openai';

const OPENAI_API_KEY: string = import.meta.env.VITE_OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export class OpenAIService {
  // TODO: catch errors
  public static async translate(content: string, language: string) {
    const translation = await openai.chat.completions.create({
      model: 'gpt-4o',
      temperature: 0.5,
      messages: [
        {
          role: 'system',
          content: `Act as a translator. Translate the word ${content} to ${language}. Do not include explanations.`,
        },
      ],
    });
    
    return translation.choices[0].message.content;
  }
}
