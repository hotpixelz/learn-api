import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateNoteDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Some awesome note title', required: false })
  title?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'Here you can put the note content',
    required: false,
  })
  content?: string;
}
