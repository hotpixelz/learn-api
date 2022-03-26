import { IsOptional, IsString } from 'class-validator';
import { NoteDto } from './note.dto';

export class UpdateNoteDto implements Partial<NoteDto> {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;
}
