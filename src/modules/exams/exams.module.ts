import { Module } from '@nestjs/common';
import { ExamsService } from './exams.service.js';
import { ExamsController } from './exams.controller.js';

@Module({
  controllers: [ExamsController],
  providers: [ExamsService],
})
export class ExamsModule {}
