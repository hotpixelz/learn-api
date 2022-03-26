import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { CreateNoteDto } from './dtos/create-note.dto';
import { NoteDto } from './dtos/note.dto';
import { UpdateNoteDto } from './dtos/update-note.dto';
import { NotesService } from './notes.service';

@Controller('notes')
export class NotesController {
  constructor(private notesService: NotesService) {}
  @ApiOperation({ description: 'Returns all notes in the database' })
  @ApiOkResponse({ type: NoteDto, isArray: true })
  @Get()
  async getAll() {
    const notes = await this.notesService.getAll();
    return notes;
  }
  @ApiOperation({ description: 'Returns single note by url parameter id' })
  @ApiOkResponse({ type: NoteDto })
  @Get('/:id')
  async get(@Param('id') id: string) {
    const note = await this.notesService.get(id);
    return note;
  }
  @ApiOperation({ description: 'Creates a note' })
  @ApiCreatedResponse({ type: NoteDto })
  @Post()
  async create(@Body() body: CreateNoteDto) {
    const note = this.notesService.create(body);
    return note;
  }
  @ApiOperation({ description: 'Updates a note by url parameter id' })
  @ApiCreatedResponse({ type: NoteDto })
  @Patch('/:id')
  async edit(@Param('id') id: string, @Body() body: UpdateNoteDto) {
    const note = await this.notesService.update(id, body);
    return note;
  }
  @ApiOperation({ description: 'Deletes a note by parameter id' })
  @ApiOkResponse()
  @Delete('/:id')
  delete(@Param('id') id: string) {
    this.notesService.delete(id);
  }
}
