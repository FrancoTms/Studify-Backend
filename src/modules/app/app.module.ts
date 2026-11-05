import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UsersModule } from '../users/users.module.js';
import { AuthModule } from '../auth/auth.module.js';
import { SubjectsModule } from '../subjects/subjects.module.js';
import { NotesModule } from '../notes/notes.module.js';
import { ExamsModule } from '../exams/exams.module.js';
import { TasksModule } from '../tasks/tasks.module.js';
import { StudySessionsModule } from '../study-sessions/study-sessions.module.js';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    SubjectsModule,
    NotesModule,
    ExamsModule,
    TasksModule,
    StudySessionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}