import { IsString } from 'class-validator';

export class NoteDto {
  @IsString()
  title: string;

  @IsString()
  content: string;
}
