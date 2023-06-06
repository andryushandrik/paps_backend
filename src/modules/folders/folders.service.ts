import { Injectable } from '@nestjs/common';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { PrismaService } from '../database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class FoldersService {
    constructor(private prismaService: PrismaService) {}

    async create(createFolderDto: CreateFolderDto) {
        const folder = await this.prismaService.folder.create({
            data: { ...createFolderDto },
        });

        return folder;
    }

    async findAll(where: Prisma.FolderWhereInput) {
        return await this.prismaService.folder.findMany({ where });
    }

    async findOne(id: number) {
        return await this.prismaService.folder.findUnique({ where: { id } });
    }

    async update(id: number, updateFolderDto: UpdateFolderDto) {
        return await this.prismaService.folder.update({
            where: {
                id: id,
            },
            data: updateFolderDto,
        });
    }

    async remove(id: number) {
        return await this.prismaService.folder.delete({
            where: {
                id: id,
            },
        });
    }
}
