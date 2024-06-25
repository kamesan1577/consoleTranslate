import { translate } from "../googleTranslate";
import { getGoogleApiKey, loadConfig } from "../config";

let apiKey: string;

beforeAll(async () => {
    await loadConfig();
    apiKey = getGoogleApiKey();
});


test("翻訳の正常系", async () => {
    const result = await translate("Hello", "ja", apiKey);
    console.log(result);
    expect(result).not.toBe("");
});

test("翻訳の異常系", async () => {
    //無効なAPIキー
    const invalidApiKey = "invalid";
    await expect(translate("Hello", "ja", invalidApiKey)).rejects.toThrow("Invalid API key");
    //無効な言語
    await expect(translate("Hello", "invalid", apiKey)).rejects.toThrow("Invalid language");
});
