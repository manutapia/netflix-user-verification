import { Injectable } from '@nestjs/common';
import { UserInfo } from './interfaces/userInfo.interface';

const USERS_INFO: UserInfo[] = [
    {
        id: 1,
        name: 'Veronica Caroca',
        accountName: 'Veroo'
    }
]

@Injectable()
export class VerificationService {
    getUserInfo(id: number): UserInfo {
        return USERS_INFO.find(userInfo => userInfo.id == id);
    }
    getCode(userInfo: UserInfo) {
        const code = 123;
        return code;
    }
}
