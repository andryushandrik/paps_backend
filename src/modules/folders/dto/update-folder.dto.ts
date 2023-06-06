import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateFolderDto } from './create-folder.dto';
import { IsOptional, IsString } from '@nestjs/class-validator';

export class UpdateFolderDto extends PartialType(CreateFolderDto) {

    @ApiProperty({
        description: 'Name of a Folder',
    })
    @IsOptional()
    @IsString({ message: 'Must be string' })
    name: string;
}
