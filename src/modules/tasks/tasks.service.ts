import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '../database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TasksService {
    constructor(private prismaService: PrismaService) {}

    async create(createTaskDto: CreateTaskDto) {
        const task = await this.prismaService.task.create({
            data: { ...createTaskDto },
        });

        return task;
    }

    async findAll(where: Prisma.TaskWhereInput) {
        return await this.prismaService.task.findMany({ where });
    }

    async findOne(id: number) {
        return await this.prismaService.task.findUnique({ where: { id } });
    }

    async update(id: number, updateTaskDto: UpdateTaskDto) {
        return await this.prismaService.task.update({
            where: {
                id: id,
            },
            data: updateTaskDto,
        });
    }

    async remove(id: number) {
        return await this.prismaService.task.delete({
            where: {
                id: id,
            },
        });
    }
}
