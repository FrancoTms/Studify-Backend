import { IsBoolean, IsDateString, IsIn, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';

export const TASK_PRIORITIES = ['Alta', 'Normal', 'Baja'] as const;

export class CreateTaskDto {
  @IsInt()
  @IsPositive()
  userId!: number;

  // La materia es opcional
  @IsOptional()
  @IsInt()
  @IsPositive()
  subjectId?: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title!: string;

  @IsOptional()
  @IsIn(TASK_PRIORITIES)
  priority?: (typeof TASK_PRIORITIES)[number];

  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @IsOptional()
  @IsDateString()
  dueDate?: string;
}
