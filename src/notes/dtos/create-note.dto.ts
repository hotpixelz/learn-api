import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  @ApiProperty({ example: 'Some awesome note title', required: true })
  title: string;

  @IsString()
  @ApiProperty({ example: 'Here you can put the note content', required: true })
  content: string;
}
