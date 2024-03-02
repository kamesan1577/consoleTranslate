#!/usr/bin/env node

import { Command } from "commander";
import { translate } from "./utils";
import * as dotenv from 'dotenv';
import { promises as fs } from 'fs';

dotenv.config();

const languageMap: { [key: string]: string } = {
    "en": "English",
    "ja": "Japanese",
    "cn": "Chinese",
    "eo": "Esperanto",
    "tok": "Toki Pona"
};

const modelMap: { [key: string]: string } = {
    "gpt3.5": "gpt-3.5-turbo-1106",
    "gpt4": "gpt-4-0125-preview"
};

const validateLanguage = (language: string) => {
    if (!languageMap[language]) {
        throw new Error("Invalid language code");
    }
}

const validateModel = (model: string) => {
    if (!modelMap[model]) {
        throw new Error("Invalid model");
    }
}

const getApiKey = () => {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error("OpenAI API key not set. Use the set-api-key command to set the API key.");
    }
    return process.env.OPENAI_API_KEY;
}


const program = new Command();

program
    .name("translate")
    .description("Translate text to a given language")

program
    .command("* <language> <text>")
    .description("Translate text to a given language")
    .option("-m, --model <model>", "Model to use for translation", "gpt3.5")
    .action(async (language, text, options) => {
        try {
            const apiKey = getApiKey();
            const languageName = languageMap[language];
            validateLanguage(language);
            const model = modelMap[options.model];
            validateModel(options.model);
            const response = await translate(text, languageName, model, apiKey);
            console.log(response);
        }
        catch (error: any) {
            console.error(`Error: ${error.message}`);
            process.exit(1);
        }
    });


program
    .command("stdin <language>")
    .description("Translate text from standard input to a given language")
    .option("-m, --model <model>", "Model to use for translation", "gpt3.5")
    .action((language, options) => {
        const apiKey = getApiKey();
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
                const languageName = languageMap[language];
                validateLanguage(language);
                const model = modelMap[options.model];
                validateModel(options.model);
                const response = await translate(text, languageName, model, apiKey);
                console.log(response);
            }
            catch (error: any) {
                console.error(`Error: ${error.message}`);
                process.exit(1);
            }
        })
    });

program
    .command("set-api-key <apiKey>")
    .description("Set OpenAI API key in the .env file")
    .action((apiKey) => {
        try {
            const data = `OPENAI_API_KEY=${apiKey}`;
            fs.writeFile(".env", data);
            console.log("API key set");
        }
        catch (error: any) {
            console.error(`Error: ${error.message}`);
            process.exit(1);
        }
    }
    );

program.parse();
