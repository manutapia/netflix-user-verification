import { Injectable } from '@nestjs/common';
import { ConfigEnvService } from 'src/config-env/config-env.service';
import { GmailService } from 'src/mailing/gmail/gmail.service';
import { UserInfo } from './interfaces/userInfo.interface';

const USERS_INFO: UserInfo[] = [
    {
        id: 1,
        name: 'Manuel Tapia',
        accountName: 'Manu'
    },
    {
        id: 2,
        name: 'Veronica Caroca',
        accountName: 'Veroo'
    }
]

@Injectable()
export class VerificationService {

    constructor(private _gmail: GmailService) { }

    getUserInfo(id: number): UserInfo {
        return USERS_INFO.find(userInfo => userInfo.id == id);
    }
    getVerificationUrls(userInfo: UserInfo) {
        const lastVerificationUrls = this.getLastVerificationUrls(userInfo.accountName);
        return lastVerificationUrls;
    }
    private async getLastVerificationUrls(accountName: string) {
        const from = 'info@mailer.netflix.com'
        const subject = "Tu código de verificación de Netflix"
        const lastweek = new Date();
        lastweek.setDate(lastweek.getDate() - 7);
        const around = `"Perfil AROUND ${accountName}"`
        const messages = await this._gmail.getMessageFrom(from, subject, lastweek, around);

        if (messages.length == 0) {
            return []
        }

        const messagesContent = await Promise.all(messages.map(async (message) => await this._gmail.readGmailContent(message.id)))
        const urls = messagesContent.map((message: any) => {
            const encodedMessage = message.payload["parts"][0].body.data;
            const decodedStr = Buffer.from(encodedMessage, "base64").toString(
                "ascii"
            );
            const decodedArrayStr = decodedStr.split(/[\s\\]+/);
            return decodedArrayStr.find(word => word.includes('http://msg.netflix.com/'));
        })
        return urls;
    }
}
