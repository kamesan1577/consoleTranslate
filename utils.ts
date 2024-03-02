import { OpenAI } from 'openai';

export const translate = async (text: string, language: string, model: string, apiKey: string) => {
    const systemPrompt = `
    You are a language translator.
    Translate the following text to ${language}.
    If the input content is extremely large, please summarize and translate it.
    Do not return any result information other than translations.
    Output the results in the following format with json.
    { result: result, isSummarized: boolean}
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
        const isSummarized = content ? JSON.parse(content).isSummarized : () => { throw new Error("No result") };
        return { result, isSummarized };
    }
    catch (error: any) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}



