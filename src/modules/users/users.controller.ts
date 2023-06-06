import { Controller, Get, UseGuards , Request, Delete} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { SessionService } from './session/session.service';

@UseGuards(JwtAuthGuard)
@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService, private readonly sessionService: SessionService) {}

    @Get('my-sessions')
    @UseGuards(JwtAuthGuard)
    async findMySessions(@Request() req) {
        const userId = req.user.id
        return await this.sessionService.findByUserId(userId);
    }

    @Delete('my-sessions')
    @UseGuards(JwtAuthGuard)
    async deleteMySessions(@Request() req) {
        const userId = req.user.id
        return await this.sessionService.deleteByUserId(userId);
    }
}
