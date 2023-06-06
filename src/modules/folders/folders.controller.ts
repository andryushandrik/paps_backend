import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards,Request } from '@nestjs/common';
import { FoldersService } from './folders.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { UpdateTaskDto } from '../tasks/dto/update-task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { log } from 'handlebars';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('folders')
export class FoldersController {
    constructor(private readonly foldersService: FoldersService) {}

    @Post()
    @Roles('ADMIN')
    @UseGuards(JwtAuthGuard, RolesGuard)
    async create(@Body() createTaskDto: CreateFolderDto, @Request() req) {
        // const userId = req.user.id;
        
        return await this.foldersService.create(createTaskDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(@Query() query) {
        return await this.foldersService.findAll(query);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.foldersService.findOne(+id);
    }

    @Roles('ADMIN')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateFolderDto: UpdateFolderDto) {
        return await this.foldersService.update(+id, updateFolderDto);
    }

    @Roles('ADMIN')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return await this.foldersService.remove(+id);
    }
}
