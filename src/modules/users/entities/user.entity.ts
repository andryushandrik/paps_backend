import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

export class UserEntity implements User {
    @ApiProperty({
        example: '1',
        description: 'Id of user',
    })
    id: number;

    @ApiProperty({
        example: 'user@mail.com',
        description: 'Email of user',
    })
    email: string;

    @ApiProperty({
        example: '+79876543210',
        description: 'Phone number of user',
    })
    phone: string;

    @ApiProperty({
        example: 'Denis',
        description: 'Firstname of user',
    })
    name: string;

    @ApiProperty({
        example: 'asdf_1s!@41$#afafg9',
        description: 'Password. Stored in hased form',
    })
    readonly password: string;

    @ApiProperty({
        description: 'DateTime of creation',
    })
    createdAt: Date;

    @ApiProperty({
        description: 'DateTime of latest update',
    })
    updatedAt: Date;
}
