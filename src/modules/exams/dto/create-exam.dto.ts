import { IsDateString, IsInt, IsNotEmpty, IsPositive, IsString, MaxLength } from 'class-validator';

export class CreateExamDto {
  @IsInt()
  @IsPositive()
  subjectId!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title!: string;
  
  //Formato AAAA-MM-DD, por ejemplo 2026-11-27
  @IsDateString()
  examDate!: string;
}
