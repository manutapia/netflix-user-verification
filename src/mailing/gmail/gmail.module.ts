import { Module } from '@nestjs/common';
import { GmailService } from './gmail.service';
import { ConfigEnvModule } from 'src/config-env/config-env.module';

@Module({
  imports: [ConfigEnvModule],
  providers: [GmailService],
  exports: [GmailService]
})
export class GmailModule { }
