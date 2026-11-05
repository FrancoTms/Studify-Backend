import { Module } from '@nestjs/common';
import { StudySessionsService } from './study-sessions.service.js';
import { StudySessionsController } from './study-sessions.controller.js';

@Module({
  controllers: [StudySessionsController],
  providers: [StudySessionsService],
})
export class StudySessionsModule {}
