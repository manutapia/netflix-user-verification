import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VerificationModule } from './modules/verification/verification.module';
import { ConfigEnvModule } from './config-env/config-env.module';
import { MailingModule } from './mailing/mailing.module';

@Module({
  imports: [VerificationModule, ConfigEnvModule, MailingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
