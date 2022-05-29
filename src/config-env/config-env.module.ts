import { Module } from '@nestjs/common';
import { ConfigEnvService } from './config-env.service';

@Module({
    providers: [{
        provide: ConfigEnvService,
        useValue: new ConfigEnvService()
    }],
    exports: [ConfigEnvService]
})
export class ConfigEnvModule { }
