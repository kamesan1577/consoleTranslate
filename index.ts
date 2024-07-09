#!/usr/bin/env node

import { Command } from "commander";
import * as openai from "./openai";
import * as googletranslate from "./googleTranslate";
import { ensureAppDirectoryExists, loadConfig, getOpenAIApiKey, setOpenAIApiKey, getGoogleApiKey, setGoogleApiKey, getDefaultProvider, setDefaultProvider } from "./config";

export const respond = async (language: string, options: any, text: string, provider: string) => {

    if (provider === "openai") {
        let model = options.model;
        if (!model) {
            model = "gpt3.5";
        }
        const credential = getOpenAIApiKey();
        openai.validateModel(model);

        const { result, isSummarized } = await openai.translate(text, language, model, credential);
        return { result, isSummarized };
    } else if (provider === "google") {
        const credential = getGoogleApiKey();
        const { result, isSummarized } = await googletranslate.translate(text, language, credential);
        return { result, isSummarized };
    } else {
        throw new Error("Invalid provider");
    }
}

export const main = async () => {
    ensureAppDirectoryExists();
    await loadConfig();
    const program = new Command();

    program
        .name("translate")
        .description("Translate text to a given language")
        .option("-m, --model <model>", "Model to use for translation")
        .option("-p, --provider <provider>", "Translation provider to use (openai or googletranslate)")

    program
        .command("* <language> <text>")
        .description("Translate text to a given language")
        .action(async (language, text, options) => {
            try {
                let provider = options.provider;
                if (!provider) {
                    provider = getDefaultProvider();
                }
                const { result, isSummarized } = await respond(language, options, text, provider);
                console.log("---------------------------------------------------------------------");
                console.log("Provider: " + provider);
                console.log("---------------------------------------------------------------------");
                if (isSummarized) {
                    console.log("The input content is extremely large. The result has been summarized.");
                    console.log("---------------------------------------------------------------------");
                }
                console.log(result);
                console.log("---------------------------------------------------------------------");
            }
            catch (error: any) {
                console.error(`Error: ${error.message}`);
                process.exit(1);
            }
        });


    program
        .command("stdin <language>")
        .description("Translate text from standard input to a given language")
        .action((language, options) => {
            let text = "";
            process.stdin.setEncoding("utf8");
            process.stdin.on("readable", () => {
                let chunk;
                while ((chunk = process.stdin.read()) !== null) {
                    text += chunk;
                }
            }
            );
            process.stdin.on("end", async () => {
                try {
                    let provider = options.provider;
                    if (!provider) {
                        provider = getDefaultProvider();
                    }
                    const { result, isSummarized } = await respond(language, options, text, provider);
                    console.log("---------------------------------------------------------------------");
                    console.log("Provider: " + provider);
                    console.log("---------------------------------------------------------------------");
                    if (isSummarized) {
                        console.log("The input content is extremely large. The result has been summarized.");
                        console.log("---------------------------------------------------------------------");
                    }
                    console.log(result);
                    console.log("---------------------------------------------------------------------");
                }
                catch (error: any) {
                    console.error(`Error: ${error.message}`);
                    process.exit(1);
                }
            })
        });

    program
        .command("set-openai-api-key <apiKey>")
        .description("Set OpenAI API key in config")
        .action((apiKey) => {
            try {
                setOpenAIApiKey(apiKey);
            }
            catch (error: any) {
                console.error(`Error: ${error.message}`);
                process.exit(1);
            }
        }
        );

    program
        .command("set-google-api-key <apiKey>")
        .description("Set Google API key in config")
        .action((apiKey) => {
            try {
                setGoogleApiKey(apiKey);
            }
            catch (error: any) {
                console.error(`Error: ${error.message}`);
                process.exit(1);
            }
        }
        );

    program
        .command("set-default-provider <provider>")
        .description("Set default translation provider in config")
        .action((provider) => {
            try {
                setDefaultProvider(provider);
            }
            catch (error: any) {
                console.error(`Error: ${error.message}`);
                process.exit(1);
            }
        }
        );
    program.parse();
};

main();
