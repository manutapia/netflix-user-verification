import { Injectable } from '@nestjs/common';
import { GmailService } from 'src/mailing/gmail/gmail.service';

@Injectable()
export class VerificationService {

    constructor(private _gmail: GmailService) { }

    getVerificationUrls(account: string) {
        const lastVerificationUrls = this.getLastVerificationUrls(account);
        return lastVerificationUrls;
    }
    private async getLastVerificationUrls(accountName: string) {
        const from = 'info@mailer.netflix.com'
        const subject = "Tu código de verificación de Netflix"
        const lastweek = new Date();
        lastweek.setDate(lastweek.getDate() - 1);
        const around = `"Perfil AROUND ${accountName}"`
        const messages = await this._gmail.getMessageFrom(from, subject, lastweek, around);
        console.log(messages);
        if (!messages) {
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
