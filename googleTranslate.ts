import { Translate } from '@google-cloud/translate/build/src/v2';
import { validateLanguage } from './validation';
export const languageMap: { [key: string]: string } = {
    "en": "English",
    "ja": "Japanese",
    "eo": "Esperanto",
};


export const translate = async (text: string, language: string, credential: string) => {
    validateLanguage(language, languageMap);
    try {
        const translateClient = new Translate({ key: credential });
        const [translations] = await translateClient.translate(text, language);

        const translatedText = Array.isArray(translations) ? translations[0] : translations;

        return {
            result: translatedText,
            isSummarized: false
        };
    }
    catch (error: any) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};



