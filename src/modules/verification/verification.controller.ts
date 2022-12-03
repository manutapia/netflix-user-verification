import { Controller, Get, Param, Render, Res } from '@nestjs/common';
import { Response } from 'express';
import { VerificationService } from './verification.service';

@Controller('Verification')
export class VerificationController {

    constructor(private readonly _verification: VerificationService) { }

    @Get('GetCode/:account')
    @Render('index')
    async getCode(@Param('account') account: string) {
        console.log('account: ', account);
        const verificationUrls = await this._verification.getVerificationUrls(account);
        console.log('verificationUrls: ', verificationUrls);
        return { account, verificationUrls }

    }
}
