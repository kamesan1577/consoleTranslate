import fs from 'fs';
import os from 'os';
import path from 'path';


type Config = {
    OPENAI_API_KEY?: string;
};

let config: Config = {};

const appDirectoryPath = path.join(os.homedir(), '.consoleTransrate');

export const ensureAppDirectoryExists = () => {
    if (!fs.existsSync(appDirectoryPath)) {
        fs.mkdirSync(appDirectoryPath);
    }
};

const initConfig = () => {
    config = {};
    fs.writeFileSync(configFilePath, JSON.stringify(config));
}

const configFilePath = path.join(appDirectoryPath, 'config.json');

export const loadConfig = async () => {
    try {
        if (!fs.existsSync(configFilePath)) {
            initConfig();
        }
        const data = await fs.promises.readFile(configFilePath, 'utf-8');
        config = JSON.parse(data);
    } catch (error: any) {
        console.error(`Error loading config file: ${error.message}`);
        process.exit(1);
    }
};

export const getApiKey = () => {
    if (!config.OPENAI_API_KEY) {
        throw new Error("OpenAI API key not set. Use the set-api-key command to set the API key.");
    }
    return config.OPENAI_API_KEY;
};

export const setApiKey = (apiKey: string) => {
    config.OPENAI_API_KEY = apiKey
    fs.writeFileSync(configFilePath, JSON.stringify(config));
    console.log("API key set");
}
