import { ApiProperty } from '@nestjs/swagger';
import { Folder } from '@prisma/client';

export class FolderEntity implements Folder {
    @ApiProperty({
        example: '1',
        description: 'Id of user',
    })
    id: number;

    @ApiProperty({
        example: 'Admin Tasks',
        description: 'Name of tasks folder',
    })
    name: string;

    @ApiProperty({
        description: 'DateTime of creation',
    })
    createdAt: Date;

    @ApiProperty({
        description: 'DateTime of latest update',
    })
    updatedAt: Date;
}
