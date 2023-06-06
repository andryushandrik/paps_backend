import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';
import { PrismaService } from '../database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ActionsService {
    constructor(private prismaService: PrismaService) {}

    async create(createActionDto: CreateActionDto) {
        const action = await this.prismaService.action.create({
            data: {
                Task: { connect: { id: createActionDto.taskId } },
                User: { connect: { id: createActionDto.userId } },
            },
        });

        return action;
    }

    async findAll(where: Prisma.ActionWhereInput) {
        const actions = await this.prismaService.action.findMany({ where });

        return actions;
    }

    async getByDays() {
        const actions: Array<{
            duration: number;
            daydate: Date;
            userid: number;
        }> = await this.prismaService.$queryRaw(Prisma.sql`SELECT
        EXTRACT(epoch FROM SUM("endTime" - "startTime"))/3600 As duration,"startTime"::date as dayDate, "userId" as userId
       FROM
         public."Action"
       group by dayDate, userId
       ORDER BY 1 DESC`);

        return actions;
    }

    async getByUsers() {
        const actions: [{
            duration: number;
            userid:   number;
            name:     string;
        }] = await this.prismaService.$queryRaw(Prisma.sql`SELECT
        EXTRACT(epoch FROM SUM("endTime" - "startTime"))/3600 As duration, "userId" as userId, "name" as name
       FROM
         public."Action" LEFT JOIN public."User" on "userId" = "User".id
       group by userId, name
       ORDER BY "userId" DESC`);

        return actions;
    }

    async getByTasks() {
        const actions = await this.prismaService.$queryRaw(Prisma.sql`SELECT
        EXTRACT(epoch FROM SUM("endTime" - "startTime"))/3600 As duration, "taskId" as taskId, "name" as name
       FROM
         public."Action" LEFT JOIN public."Task" on "taskId" = "Task".id
       group by taskId, name
       ORDER BY "taskId" DESC`);
        // console.log(actions);

        return actions;
    }

    // async getByFolders() {
    //     const actions = await this.prismaService.$queryRaw(Prisma.sql`SELECT
    //     EXTRACT(epoch FROM SUM("endTime" - "startTime"))/3600 As duration, "taskId" as taskId,"folderId" as folderId, "name" as name
    //    FROM
    //      public."Action" LEFT JOIN public."Task" on "taskId" = "Task".id
    //    group by taskId, name, folderId
    //    ORDER BY "taskId" DESC`);
    //     console.log(actions);

    //     return actions;
    // }

    async getByFolders() {
        const actions: [{
            duration: number;
            folderid: number;
            name:     string;
        }] = await this.prismaService.$queryRaw(Prisma.sql`SELECT
        SUM(duration) as duration, folderid, "name" as name
       FROM
         (SELECT
            EXTRACT(epoch FROM SUM("endTime" - "startTime"))/3600 As duration, "taskId" as taskId, "folderId" as folderId
           FROM
             public."Action" LEFT JOIN public."Task" on "taskId" = "Task".id
           group by taskId,folderId) AS foo LEFT JOIN public."Folder" on "folderid" = "Folder".id
       group by "folderid", name
       ORDER BY "folderid" DESC`);
        console.log(actions);

        return actions;
    }

    async getTotalTime() {
        const total = await this.prismaService.$queryRaw(Prisma.sql`SELECT
        EXTRACT(epoch FROM SUM("endTime" - "startTime"))/3600 As duration
       FROM
         public."Action"`);

        return total;
    }

    async getDaysForDashboard() {
        const data = await this.getByDays();
        let labels = [],
            durations = [];

        data.forEach((el) => {
            labels.push(el.daydate.toDateString());
            durations.push(+el.duration.toFixed(2))
        });

        return{labels, durations }
    }

    async getUsersForDashboard() {
        const data = await this.getByUsers();
        let labels = [],
            durations = [];

        data.forEach((el) => {
            labels.push(el.name);
            durations.push(+el.duration.toFixed(2))
        });

        return{labels,durations }
    }

    async getFoldersForDashboard() {
        const data = await this.getByFolders();
        let labels = [],
            durations = [];

        data.forEach((el) => {
            labels.push(el.name);
            durations.push(+el.duration.toFixed(2))
        });

        return{labels,durations }
    }

    async getForDashboard() {
        const byDays = await this.getDaysForDashboard(),
            byTasks = await this.getByTasks(),
            byUsers = await this.getUsersForDashboard(),
            byFolders = await this.getFoldersForDashboard(),
            total = (await this.getTotalTime())[0].duration.toFixed(2);

        return { byDays, byTasks, byUsers, byFolders, total };
    }

    async getActionByUsers(actionId:number) {
        const users: [{
            duration: number;
            userid:   number;
            name:     string;
        }] = await this.prismaService.$queryRaw(Prisma.sql`SELECT
        EXTRACT(epoch FROM SUM("endTime" - "startTime"))/3600 As duration, "userId" as userId, "name" as name, "Action"."taskId" 
       FROM
         public."Action" LEFT JOIN public."User" on "userId" = "User".id
        WHERE "Action"."taskId" =${actionId}
       group by userId, name, "Action"."taskId"
       ORDER BY "userId" DESC`);

        return users;
    }

    async findOne(id: number) {
        return await this.prismaService.action.findUnique({ where: { id } });
    }

    async update(id: number, updateActionDto: UpdateActionDto) {
        return await this.prismaService.action.update({
            where: {
                id: id,
            },
            data: updateActionDto,
        });
    }

    async end(id: number) {
        const action = await this.prismaService.action.findUnique({ where: { id } });

        if (action.endTime) {
            throw new BadRequestException({
                message: 'Рабочая сессия уже завершена!',
            });
        }

        return await this.prismaService.action.update({
            where: {
                id: id,
            },
            data: { endTime: new Date(Date.now()) },
        });
    }

    async endForUser(id: number) {
        return await this.prismaService.action.updateMany({
            where: {
                User: { id },
                endTime: undefined,
            },
            data: { endTime: new Date(Date.now()) },
        });
    }

    async remove(id: number) {
        return await this.prismaService.action.delete({
            where: {
                id: id,
            },
        });
    }
}
