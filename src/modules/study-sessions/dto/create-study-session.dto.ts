import { IsDateString, IsIn, IsInt, IsOptional, IsPositive, Max, Min } from 'class-validator';

export const STUDY_TECHNIQUES = ['Pomodoro', 'Mapas mentales', 'Active Recall', 'Lectura'] as const;

export class CreateStudySessionDto {
  @IsInt()
  @IsPositive()
  userId!: number;

  @IsInt()
  @IsPositive()
  subjectId!: number;

  @IsOptional()
  @IsIn(STUDY_TECHNIQUES)
  technique?: (typeof STUDY_TECHNIQUES)[number];

  // Fecha y hora en formato ISO, por ejemplo 2026-11-18T19:00:00
  @IsDateString()
  startedAt!: string;

  @IsInt()
  @Min(1)
  @Max(600)
  durationMinutes!: number;
}
