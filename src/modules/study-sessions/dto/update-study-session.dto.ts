import { PartialType } from '@nestjs/mapped-types';
import { CreateStudySessionDto } from './create-study-session.dto.js';

export class UpdateStudySessionDto extends PartialType(CreateStudySessionDto) {}
