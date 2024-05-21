export const validateLanguage = (language: string, languageMap: any) => {
    if (!languageMap[language]) {
        throw new Error("Invalid language code");
    }
};
