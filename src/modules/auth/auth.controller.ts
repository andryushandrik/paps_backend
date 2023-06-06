import { UserEntity } from '../users/entities/user.entity';
import AuthResult from 'src/interfaces/AuthResult.interface';
import { ValidateCustomHeadersDto } from '../users/dto/session/validate-custom-headers.dto';
import { Body, Controller, Post, Req, UseGuards, Res, Get, Patch } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Token } from 'src/interfaces/Token.interface';
import { Tokens } from 'src/interfaces/Tokens.interface';
import { AuthService } from './auth.service';
import { JWT_TOKEN_EXAMPLE, TOKEN_OBJECT_EXAMPLE } from '../../constants';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LogInUserDto } from './dto/log-in-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { BrowserDataDto } from 'src/modules/users/dto/session/browser-data.dto';
import { CustomHeaders } from 'src/decorators/headers.decorator';
import { TokenService } from './token.service';
import { refreshCookieOptions } from 'src/config/cookieOptions';
import * as bcrypt from 'bcryptjs';
import { simpleHash } from '../users/helpers/helpers';
import { User } from '@prisma/client';
import { UsersService } from '../users/users.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private tokenService: TokenService,
        private usersService: UsersService,
    ) {}

    @ApiOperation({ summary: 'Log in' })
    @ApiResponse({
        status: 201,
        schema: {
            example: {
                user: UserEntity,
                accessToken: JWT_TOKEN_EXAMPLE,
            },
        },
    })
    @Post('login')
    async logIn(
        @CustomHeaders() headers: ValidateCustomHeadersDto,
        @Req() request: Request,
        @Body() logInUserDto: LogInUserDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const userAgent = request.get('user-agent');
        const browserDataDto: BrowserDataDto = {
            userAgent,
            ip: request.ip,
            fingerprint: simpleHash(userAgent + request.ip),
        };

        const authData: AuthResult = await this.authService.login(logInUserDto, browserDataDto);
        const expires = this.tokenService.getNewExpiresAtForRefreshToken();
        res.cookie('refreshToken', authData.tokens.refreshToken, { ...refreshCookieOptions, expires: expires });
        return { user: authData.user, accessToken: authData.tokens.accessToken };
    }

    @ApiOperation({ summary: 'Sign Up/Registration ' })
    @ApiResponse({
        status: 201,
        schema: {
            example: {
                user: UserEntity,
                accessToken: JWT_TOKEN_EXAMPLE,
            },
        },
    })
    @Post('register')
    async register(
        @CustomHeaders() headers: ValidateCustomHeadersDto,
        @Req() request: Request,
        @Body() userDto: RegisterUserDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const userAgent = request.get('user-agent');
        const browserDataDto: BrowserDataDto = {
            userAgent,
            ip: request.ip,
            fingerprint: simpleHash(userAgent + request.ip),
        };
        const authData: AuthResult = await this.authService.register(userDto, browserDataDto);
        const expires = this.tokenService.getNewExpiresAtForRefreshToken();
        res.cookie('refreshToken', authData.tokens.refreshToken, { ...refreshCookieOptions, expires: expires });
        return { user: authData.user, accessToken: authData.tokens.accessToken };
    }

    @ApiOperation({ summary: 'Log out' })
    @ApiResponse({
        status: 201,
    })
    @Patch('logout')
    @UseGuards(JwtAuthGuard)
    async logout(@Req() request: Request, @Res({ passthrough: true }) res: Response) {
        const refreshToken: Token | undefined = request.cookies.refreshToken;
        if (refreshToken) {
            await this.authService.logout(refreshToken);
            return { status: "You've been logged out" };
        }
        request.user = undefined;
        res.clearCookie('refreshToken');
    }

    // @ApiOperation({ summary: 'verifyEmail' })
    // @Post('emailVerify')
    // async emailVerify(@Req() request: Request) {
    //     return;
    // }

    @ApiOperation({ summary: 'Create new access token, and update refresh token' })
    @ApiResponse({
        status: 200,
        schema: {
            example: {
                accessToken: JWT_TOKEN_EXAMPLE,
            },
        },
    })
    @Patch('refreshToken')
    async refreshToken(
        @Req() request: Request,
        @CustomHeaders() headers: ValidateCustomHeadersDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const userAgent = request.get('user-agent');
        const browserDataDto: BrowserDataDto = {
            userAgent,
            ip: request.ip,
            fingerprint: simpleHash(userAgent + request.ip),
        };

        const cookies = request.cookies;
        const refreshToken: Token = cookies.refreshToken;

        const tokensData: {
            tokens: Tokens;
            user: Omit<User, 'password'>;
        } = await this.authService.refresh(refreshToken, browserDataDto);

        const expires = this.tokenService.getNewExpiresAtForRefreshToken();
        res.cookie('refreshToken', tokensData.tokens.refreshToken, { ...refreshCookieOptions, expires: expires });
        return { user: tokensData.user, accessToken: tokensData.tokens.accessToken };
    }

    @ApiOperation({ summary: 'Check' })
    @ApiResponse({
        status: 201,
    })
    @Get()
    @UseGuards(JwtAuthGuard)
    async check(@Req() request: Request, @Res({ passthrough: true }) res: Response) {
        const userId = request.user.id;

        const user = this.usersService.findOneWithoutPassword(userId);
        return user;
    }
}
