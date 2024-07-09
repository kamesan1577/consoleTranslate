import * as openai from "../openai"; // openaiモジュールのインポート
import * as googletranslate from "../googleTranslate"; // googletranslateモジュールのインポート
import * as config from "../config"; // configモジュールのインポート
import { respond, main } from "../index"; // indexモジュールのインポート
import { Command } from "commander"; // commanderモジュールのインポート


describe("respond", () => {
    it("should translate using openai provider", async () => {
        const mockTranslate = jest.spyOn(openai, "translate").mockResolvedValue({ result: "translated text", isSummarized: false });
        const mockGetOpenAIApiKey = jest.spyOn(config, "getOpenAIApiKey").mockReturnValue("openai-api-key");
        const mockValidateModel = jest.spyOn(openai, "validateModel").mockImplementation(() => { });

        const result = await respond("es", { model: "gpt3.5" }, "hello", "openai");

        expect(mockTranslate).toHaveBeenCalledWith("hello", "es", "gpt3.5", "openai-api-key");
        expect(result).toEqual({ result: "translated text", isSummarized: false });

        mockTranslate.mockRestore();
        mockGetOpenAIApiKey.mockRestore();
        mockValidateModel.mockRestore();
    });

    it("should translate using google provider", async () => {
        const mockTranslate = jest.spyOn(googletranslate, "translate").mockResolvedValue({ result: "translated text", isSummarized: false });
        const mockGetGoogleApiKey = jest.spyOn(config, "getGoogleApiKey").mockReturnValue("google-api-key");

        const result = await respond("es", {}, "hello", "google");

        expect(mockTranslate).toHaveBeenCalledWith("hello", "es", "google-api-key");
        expect(result).toEqual({ result: "translated text", isSummarized: false });

        mockTranslate.mockRestore();
        mockGetGoogleApiKey.mockRestore();
    });

    it("should throw error for invalid provider", async () => {
        await expect(respond("es", {}, "hello", "invalid")).rejects.toThrow("Invalid provider");
    });
});

describe("main", () => {
    let mockEnsureAppDirectoryExists: jest.SpyInstance;
    let mockLoadConfig: jest.SpyInstance;
    let mockCommand: jest.SpyInstance;

    beforeEach(() => {
        mockEnsureAppDirectoryExists = jest.spyOn(config, "ensureAppDirectoryExists").mockImplementation(() => { });
        mockLoadConfig = jest.spyOn(config, "loadConfig").mockResolvedValue();
        mockCommand = jest.spyOn(Command.prototype, "command").mockReturnThis();
    });

    afterEach(() => {
        mockEnsureAppDirectoryExists.mockRestore();
        mockLoadConfig.mockRestore();
        mockCommand.mockRestore();
    });

    it("should ensure app directory exists and load config", async () => {
        await main();
        expect(mockEnsureAppDirectoryExists).toHaveBeenCalled();
        expect(mockLoadConfig).toHaveBeenCalled();
    });

    it("should register commands", async () => {
        const mockCommandRegister = jest.spyOn(Command.prototype, "command").mockReturnThis();
        const mockAction = jest.spyOn(Command.prototype, "action").mockReturnThis();

        await main();
        expect(mockCommandRegister).toHaveBeenCalled();
        expect(mockAction).toHaveBeenCalled();
    });
});
