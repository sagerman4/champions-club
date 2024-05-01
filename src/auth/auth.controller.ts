import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    @Get('callback')
    handleOAuthCallback(@Query('code') code: string, @Res() res: Response) {
        console.log('Authorization code:', code);
        // Here you would typically exchange the code for an access token
        res.redirect('/success'); // Redirect user after handling the code
    }
}
