import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs'; // Import for handling Observables

@Injectable()
export class AuthService {
    constructor(
        private httpService: HttpService,
        private configService: ConfigService,
    ) {}

    async exchangeCodeForToken(code: string): Promise<any> {
        const client_id = this.configService.get<string>('YAHOO_CLIENT_ID');
        const client_secret = this.configService.get<string>('YAHOO_CLIENT_SECRET');
        const redirect_uri = this.configService.get<string>('YAHOO_REDIRECT_URI');

        const tokenUrl = 'https://api.login.yahoo.com/oauth2/get_token';
        const params = new URLSearchParams();
        params.append('client_id', client_id);
        params.append('client_secret', client_secret);
        params.append('redirect_uri', redirect_uri);
        params.append('code', code);
        params.append('grant_type', 'authorization_code');

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
        };

        try {
            // Convert Axios Observable to Promise using firstValueFrom
            const response = await firstValueFrom(this.httpService.post(tokenUrl, params.toString(), { headers }));
            console.log('Access Token:', response.data.access_token);
            // Store the access token and refresh token as needed
            return response.data;
        } catch (error) {
            console.error('Failed to exchange code for token:', error);
            throw new Error('Failed to exchange code for token');
        }
    }
}