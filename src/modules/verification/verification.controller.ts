import { Controller, Get, Param } from '@nestjs/common';
import { VerificationService } from './verification.service';

@Controller('Verification')
export class VerificationController {

    constructor(private readonly _verification: VerificationService) { }

    @Get('GetCode/:account')
    getCode(@Param('account') account: string) {
        return this._verification.getVerificationUrls(account);
    }
}
