import { Injectable } from '@nestjs/common';
import { NoteEntity } from '../models/note.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagEntity } from '../models/tag.entity';
import { NoteService } from './note.service';

@Injectable()
export class TagService {
  //TODO: investigate, mb in future we will need to separate tag features to another service
  constructor(
    @InjectRepository(NoteEntity)
    private noteRepository: Repository<NoteEntity>,
    @InjectRepository(TagEntity)
    private tagRepository: Repository<TagEntity>,
    private noteService: NoteService,
  ) {}

  async findTags(): Promise<TagEntity[]> {
    const tags = await this.tagRepository
      .createQueryBuilder('tags')
      .select('DISTINCT tags.text')
      .getRawMany();
    console.log(tags);
    return tags;
  }

  async updateTagsAfterNoteUpdate(
    previousNote: NoteEntity,
    previousNoteTags: TagEntity[],
    currentNote: NoteEntity,
    currentNoteTags: string[],
  ) {
    if (!previousNoteTags) previousNoteTags = [];

    const deletedTags = previousNoteTags.filter(
      (pNote) =>
        currentNoteTags.filter((cNote) => cNote === pNote.text).length !==
        0,
    );

    const addedTags = currentNoteTags.filter(
      (cNote) =>
        previousNoteTags.filter((pNote) => cNote === pNote.text).length ===
        0,
    );
    console.log('new tag', addedTags);
    deletedTags.forEach((dTag) => this.deleteNoteTag(dTag.id));
    addedTags.forEach((dTag) => this.addNoteTag(currentNote.id, dTag));
  }

  async findTagsByNoteId(id: number): Promise<TagEntity[]> {
    const note = await this.noteService.findNoteById(id);
    return note.tags;
  }

  async addNoteTag(noteId: number, tagText: string) {
    await this.tagRepository.save({ note: { id: noteId }, text: tagText });
  }

  async deleteNoteTag(tagId: number) {
    await this.tagRepository.delete(tagId);
    return { id: tagId };
  }
}
