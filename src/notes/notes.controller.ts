import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { NoteDto } from './dtos/note.dto';
import { UpdateNoteDto } from './dtos/update-note.dto';
import { NotesService } from './notes.service';

@Controller('notes')
export class NotesController {
  constructor(private notesService: NotesService) {}
  @Get()
  async getAll() {
    const notes = await this.notesService.getAll();
    return notes;
  }

  @Get('/:id')
  async get(@Param('id') id: string) {
    const note = await this.notesService.get(id);
    return note;
  }

  @Post()
  async create(@Body() body: NoteDto) {
    const note = this.notesService.create(body);
    return note;
  }

  @Patch('/:id')
  async edit(@Param('id') id: string, @Body() body: UpdateNoteDto) {
    const note = await this.notesService.update(id, body);
    return note;
  }

  @Delete('/:id')
  delete(@Param('id') id: string) {
    return this.notesService.delete(id);
  }
}
