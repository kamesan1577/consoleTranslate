import { OpenAI } from 'openai';

export const translate = async (text: string, language: string, model: string, apiKey: string) => {
    const systemPrompt = `
    You are a language translator.
    Translate the following text to ${language}.
    Do not return any result information other than translations.
    Output the results in the following format with json.
    { result: result }
    `;

    try {
        const openAi = new OpenAI({
            apiKey: apiKey
        })

        const response = await openAi.chat.completions.create(
            {
                model: model,
                messages: [
                    {
                        role: "system",
                        content: systemPrompt
                    },
                    {
                        role: "user",
                        content: text
                    }
                ],
                response_format: {
                    type: "json_object"
                }
            }
        )
        const content = response.choices[0]?.message.content;
        const result = content ? JSON.parse(content).result : () => { throw new Error("No result") };
        return result;
    }
    catch (error: any) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}



