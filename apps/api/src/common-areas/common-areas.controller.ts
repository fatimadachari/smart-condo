import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CommonAreasService } from './common-areas.service';
import { CreateCommonAreaDto } from './dto/create-common-area.dto';
import { UpdateCommonAreaDto } from './dto/update-common-area.dto';

@Controller('common-areas')
@UseGuards(AuthGuard('jwt'))
export class CommonAreasController {
    constructor(private readonly commonAreasService: CommonAreasService) { }

    @Post()
    create(@Body() createCommonAreaDto: CreateCommonAreaDto) {
        return this.commonAreasService.create(createCommonAreaDto);
    }

    @Get()
    findAll() {
        return this.commonAreasService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.commonAreasService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCommonAreaDto: UpdateCommonAreaDto) {
        return this.commonAreasService.update(id, updateCommonAreaDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string, @Query('force') force: string) {
        const isForce = force === 'true';
        return this.commonAreasService.remove(id, isForce);
    }
}