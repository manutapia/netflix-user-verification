import { Injectable } from '@nestjs/common';
var axios = require("axios");
var qs = require("qs");
import { ConfigurationEnvEnum } from 'src/config-env/config-env.enum';
import { ConfigEnvService } from 'src/config-env/config-env.service';

@Injectable()
export class GmailService {
    accessToken: Promise<string>;
    constructor(private _configEnv: ConfigEnvService) {
        this.accessToken = this.getAcceToken();
    }

    async getAcceToken() {
        console.log(this._configEnv.get(ConfigurationEnvEnum.GC_GMAIL_CLIENT_ID))
        var data = qs.stringify({
            client_id: this._configEnv.get(ConfigurationEnvEnum.GC_GMAIL_CLIENT_ID),
            client_secret: this._configEnv.get(ConfigurationEnvEnum.GC_GMAIL_CLIENT_SECRET),
            refresh_token: this._configEnv.get(ConfigurationEnvEnum.GC_GMAIL_CLIENT_REFRESH_TOKEN),
            grant_type: "refresh_token",
        });
        var config = {
            method: "post",
            url: "https://accounts.google.com/o/oauth2/token",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            data: data,
        };

        let accessToken = "";

        await axios(config)
            .then(async function (response) {
                accessToken = await response.data.access_token;
                // console.log("Access Token " + accessToken);
            })
            .catch(function (error) {
                console.log(error.response.data);
            });

        return accessToken;
    };

    async readGmailContent(messageId) {
        var config = {
            method: "get",
            url: `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}`,
            headers: {
                Authorization: `Bearer ${await this.accessToken}`,
            },
        };

        var data = {};

        await axios(config)
            .then(async function (response) {
                data = await response.data;
            })
            .catch(function (error) {
                console.log(error);
            });

        return data;
    };

    async getMessageFrom(from?: string, subject?: string, after?: Date, around?: string) {
        let query = "";
        if (around)
            query = `${query}${around} `;
        if (from)
            query = `${query}from:${from} `;
        if (subject)
            query = `${query}subject:${subject} `;
        if (after) {
            query = `${query}after:${after.getFullYear()}/${after.getMonth()}/${after.getDate()}`;
        }
        query = encodeURIComponent(query);
        var config1 = {
            method: "get",
            url:
                `https://www.googleapis.com/gmail/v1/users/me/messages${query != "" ? `?q=${query}` : ''}`,
            headers: {
                Authorization: `Bearer ${await this.accessToken} `,
            },
        };
        var messages: any[] = [];
        await axios(config1)
            .then(async function (response) {
                messages = await response.data["messages"];
            })
            .catch(function (error) {
                console.log(error);
            });

        return messages;
    }
}