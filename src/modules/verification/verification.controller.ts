import { Controller, Get, Param } from '@nestjs/common';
import { VerificationService } from './verification.service';

@Controller('Verification')
export class VerificationController {

    constructor(private readonly _verification: VerificationService) { }

    @Get('GetCode/:id')
    getCode(@Param('id') id: string) {
        const userInfo = this._verification.getUserInfo(parseInt(id))
        return this._verification.getVerificationUrls(userInfo);
    }
}
