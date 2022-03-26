import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNoteDto } from './dtos/create-note.dto';
import { UpdateNoteDto } from './dtos/update-note.dto';
import { Note } from './note.entity';

@Injectable()
export class NotesService {
  constructor(@InjectRepository(Note) private repo: Repository<Note>) {}
  async getAll() {
    const notes = await this.repo.find();
    return notes;
  }

  async get(id: string) {
    if (!id) return null;

    const note = await this.repo.findOneBy({ id });
    if (!note) {
      throw new NotFoundException('No note with this id was found...');
    }
    return note;
  }

  create(body: CreateNoteDto) {
    const note = this.repo.create(body);
    return this.repo.save(note);
  }
  async update(id: string, body: UpdateNoteDto) {
    if (!id) {
      throw new BadRequestException('No id for note was provided...');
    }

    const note = await this.get(id);
    if (!note) {
      throw new NotFoundException('No note with this id was found...');
    }
    Object.assign(note, body);
    return this.repo.save(note);
  }
  async delete(id: string) {
    if (!id) {
      throw new BadRequestException('No id for note was provided...');
    }

    const note = await this.get(id);
    if (!note) {
      throw new NotFoundException('No note with this id was found...');
    }
    return this.repo.remove(note);
  }
}
