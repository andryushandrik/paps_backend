import { IsEmail, IsOptional, IsPhoneNumber, IsString } from '@nestjs/class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiProperty({
        example: 'Denis',
        description: 'Firstname of a user',
    })
    @IsString({ message: 'Must be string' })
    @IsOptional()
    readonly name: string;

    @ApiProperty({
        example: '79876543210',
        description: 'Phone number of a user',
    })
    @IsPhoneNumber()
    @IsOptional()
    readonly phone: string;

    @ApiProperty({
        example: 'user@mail.com',
        description: 'Email of user, unique ',
    })
    @IsString({ message: 'Must be string' })
    @IsEmail({}, { message: 'Must be email' })
    @IsOptional()
    readonly email: string;
}
