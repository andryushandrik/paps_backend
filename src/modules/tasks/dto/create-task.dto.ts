import { IsInt, IsNumber, IsOptional, IsString } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumberString } from 'class-validator';

export class CreateTaskDto {    
    @ApiProperty({
        description: 'Name of a Task',
    })
    @IsString({ message: 'Must be string' })
    name: string;

    @ApiProperty({
        description: 'Description of a Task',
    })
    @IsOptional()
    @IsString({ message: 'Must be string' })
    description: string;

    @IsInt()
    @Type(() => Number)
    folderId: number;
}
