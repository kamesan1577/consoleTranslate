import { OpenAI } from 'openai';
import { validateLanguage } from './validation';

export const languageMap: { [key: string]: string } = {
    "en": "English",
    "ja": "Japanese",
    "cn": "Chinese",
    "eo": "Esperanto",
    "tok": "Toki Pona"
};


export const modelMap: { [key: string]: string } = {
    "gpt3.5": "gpt-3.5-turbo-1106",
    "gpt4": "gpt-4-turbo",
    "gpt4o": "gpt-4o"
};

export const validateModel = (model: string) => {
    if (!modelMap[model]) {
        throw new Error("Invalid model");
    }
};


export const translate = async (text: string, language: string, model: string, credential: string) => {
    validateLanguage(language, languageMap);

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
            apiKey: credential
        })

        const response = await openAi.chat.completions.create(
            {
                model: modelMap[model],
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
        // console.log(error);
        if (error.message === "Invalid language code") {
            throw new Error("Invalid language code");
        }
        // TODO APIキーのエラーメッセージを追加
        else {
            throw new Error("An error occurred while translating the text");
        }
    }
}



