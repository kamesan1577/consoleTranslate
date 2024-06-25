import { Translate } from '@google-cloud/translate/build/src/v2';
import { validateLanguage } from './validation';
export const languageMap: { [key: string]: string } = {
    "en": "English",
    "ja": "Japanese",
    "eo": "Esperanto",
};


export const translate = async (text: string, language: string, credential: string) => {
    try {
        validateLanguage(language, languageMap);
        const translateClient = new Translate({ key: credential });
        const [translations] = await translateClient.translate(text, language);

        const translatedText = Array.isArray(translations) ? translations[0] : translations;

        return {
            result: translatedText,
            isSummarized: false
        };
    }
    catch (error: any) {
        // console.log(error);
        if (error.message === "Invalid language code") {
            throw new Error("Invalid language code");
        }
        else if (error.message === "API key not valid. Please pass a valid API key.") {
            throw new Error("Invalid API key");
        }
        else {
            throw new Error("An error occurred while translating the text");
        }
    }
};



