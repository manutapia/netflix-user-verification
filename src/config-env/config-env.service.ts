import * as fs from "fs";
import { parse } from "dotenv"

export class ConfigEnvService {
    private readonly envConfig: { [key: string]: string };

    constructor() {
        const isDevelopmentEnv = process.env.NODE_ENV !== "production";

        if (isDevelopmentEnv) {
            const envFilePath = __dirname + "/../../.env";
            const existsPath = fs.existsSync(envFilePath);

            if (!existsPath) {
                console.log('.env file doest not exist');
                process.exit(0);
            } else {
                this.envConfig = parse(fs.readFileSync(envFilePath));
            }
        } else {
            this.envConfig = {
                GC_GMAIL_CLIENT_ID: process.env.GC_GMAIL_CLIENT_ID,
                GC_GMAIL_CLIENT_SECRET: process.env.GC_GMAIL_CLIENT_SECRET,
                GC_GMAIL_CLIENT_REFRESH_TOKEN: process.env.GC_GMAIL_CLIENT_REFRESH_TOKEN
            }
        }
    }

    get(key: string): string {
        return this.envConfig[key];
    }
}