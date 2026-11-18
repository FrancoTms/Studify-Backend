import { IsIn, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, Max, MaxLength, Min } from 'class-validator';

export const SUBJECT_TONES = ['primary', 'success', 'warning', 'info'] as const;

export class CreateSubjectDto {
  @IsInt()
  @IsPositive()
  userId!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  progress?: number;

  @IsOptional()
  @IsIn(SUBJECT_TONES)
  tone?: (typeof SUBJECT_TONES)[number];
}
