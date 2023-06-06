import { IsString } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFolderDto {
    @ApiProperty({
        description: 'Name of a Folder',
    })
    @IsString({ message: 'Must be string' })
    name: string;
}
