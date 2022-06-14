import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { VerificationController } from './verification.controller';
import { GmailModule } from 'src/mailing/gmail/gmail.module';

@Module({
  imports: [GmailModule],
  providers: [VerificationService],
  controllers: [VerificationController]
})
export class VerificationModule { }
