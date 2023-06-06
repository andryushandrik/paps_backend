import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { ActionsService } from './actions.service';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';

@Controller('actions')
export class ActionsController {
    constructor(private readonly actionsService: ActionsService) {}

    // @Post()
    // async create(@Body() createActionDto: CreateActionDto) {
    //     return await this.actionsService.create(createActionDto);
    // }

    @Post()
    async start(@Body() createActionDto: CreateActionDto) {
        return await this.actionsService.create(createActionDto);
    }

    @Get()
    async findAll(@Query() query: UpdateActionDto) {
        return await this.actionsService.findAll(query);
    }

    @Get('by-days')
    async getByDays() {
        return await this.actionsService.getByDays();
    }

    @Get('by-users')
    async getByUsers() {
        return await this.actionsService.getByUsers();
    }

    @Get('by-tasks')
    async getByTasks() {
        return await this.actionsService.getByTasks();
    }

    @Get('dashboard')
    async getForDashboard() {
        return await this.actionsService.getForDashboard();
    }

    @Get(':id/admin')
    async findOneAdmin(@Param('id') id: string) {
        return await this.actionsService.getActionByUsers(+id);
    }
    
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.actionsService.findOne(+id);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateActionDto: UpdateActionDto) {
        return await this.actionsService.update(+id, updateActionDto);
    }

    @Put(':id/end')
    async end(@Param('id') id: string) {
        return await this.actionsService.end(+id);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return await this.actionsService.remove(+id);
    }
}
