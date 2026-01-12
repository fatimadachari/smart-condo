import { Module } from '@nestjs/common';
import { CommonAreasService } from './common-areas.service';
import { CommonAreasController } from './common-areas.controller';

@Module({
    controllers: [CommonAreasController],
    providers: [CommonAreasService],
})
export class CommonAreasModule { }