import exp from 'constants';
import fs from 'fs';
import os from 'os';
import path from 'path';

type Provider = "openai" | "google";

type Config = {
    OPENAI_API_KEY?: string;
    GOOGLE_API_KEY?: string;
    DEFAULT_PROVIDER?: Provider;
};

let config: Config = {};

const appDirectoryPath = path.join(os.homedir(), '.consoleTransrate');
const configFilePath = path.join(appDirectoryPath, 'config.json');

export const ensureAppDirectoryExists = () => {
    if (!fs.existsSync(appDirectoryPath)) {
        fs.mkdirSync(appDirectoryPath);
    }
};

const initConfig = () => {
    config = {};
    fs.writeFileSync(configFilePath, JSON.stringify(config));
}

export const loadConfig = async () => {
    try {
        if (!fs.existsSync(configFilePath)) {
            console.log("Config file not found. Creating new config file.");
            initConfig();
        }
        const data = await fs.promises.readFile(configFilePath, 'utf-8');
        config = JSON.parse(data);

    } catch (error: any) {
        console.error(`Error loading config file: ${error.message}`);
        process.exit(1);
    }
};

export const getOpenAIApiKey = () => {
    if (!config.OPENAI_API_KEY) {
        throw new Error("OpenAI API key not set. Use the set-api-key command to set the API key.");
    }
    return config.OPENAI_API_KEY;
};

export const setOpenAIApiKey = (apiKey: string) => {
    config.OPENAI_API_KEY = apiKey;
    fs.writeFileSync(configFilePath, JSON.stringify(config));
    console.log("OpenAI API key set");
};

export const getGoogleApiKey = () => {
    if (!config.GOOGLE_API_KEY) {
        throw new Error("Google API key not set. Use the set-google-credentials command to set the API key.");
    }
    return config.GOOGLE_API_KEY;
}

export const setGoogleApiKey = (apiKey: string) => {
    config.GOOGLE_API_KEY = apiKey;
    fs.writeFileSync(configFilePath, JSON.stringify(config));
    console.log("Google API key set");
}

export const getDefaultProvider = () => {
    if (!config.DEFAULT_PROVIDER) {
        return "openai";
    }
    return config.DEFAULT_PROVIDER;
}

export const setDefaultProvider = (provider: Provider) => {
    config.DEFAULT_PROVIDER = provider;
    fs.writeFileSync(configFilePath, JSON.stringify(config));
    console.log("Default provider set to", provider);
}
