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
        const from = 'info@account.netflix.com'
        const subject = "Tu código de verificación de Netflix"
        const lastweek = new Date();
        lastweek.setDate(lastweek.getDate() - 1);
        const around = `"Perfil AROUND ${accountName}"`
        const messages = await this._gmail.getMessageFrom(from, subject, null, around);
        if (!messages) {
            return []
        }

        const messagesContent = await Promise.all(messages.map(async (message) => await this._gmail.readGmailContent(message.id)))
        const userVerificationMessages = messagesContent.map((message: any) => {
            const encodedMessage = message.payload["parts"][0].body.data;
            const dateaux = new Date(message.payload["headers"][3].value.split(";")[1])
            // dateaux.setHours(dateaux.getHours() - 4)
            const fulldate = dateaux.toLocaleDateString('es-CL');
            const fulltime = dateaux.toLocaleTimeString('es-CL');
            const decodedStr = Buffer.from(encodedMessage, "base64").toString(
                "ascii"
            );
            const decodedArrayStr = decodedStr.split(/[\s\\]+/);
            return {
                date: { fulldate, fulltime },
                url: decodedArrayStr.find(word => word.includes('http://msg.netflix.com/'))
            }
        })
        return userVerificationMessages;
    }
}
