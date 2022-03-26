import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUUID } from 'class-validator';

export class NoteDto {
  @IsUUID()
  @ApiProperty({ example: '80d01604-930f-459f-9408-0da20354009a' })
  id: string;

  @IsString()
  @ApiProperty({ example: 'Some awesome note title', required: true })
  title: string;

  @IsString()
  @ApiProperty({ example: 'Here you can put the note content', required: true })
  content: string;
  @ApiProperty({ example: 1648323252736 })
  @IsNumber()
  createdAt: number;
}
