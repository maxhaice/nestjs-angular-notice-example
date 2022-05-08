import { Injectable } from '@nestjs/common';
import { NoteEntity } from '../models/note.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder, WhereExpressionBuilder } from 'typeorm';
import { NoteInput } from '../types/note.input';
import { TagEntity } from '../models/tag.entity';
import { TagUtil } from '../utils/task.util';

@Injectable()
export class NoteService {
  //TODO: investigate, mb in future we will need to separate tag features to another service
  constructor(
    @InjectRepository(NoteEntity)
    private noteRepository: Repository<NoteEntity>,
    @InjectRepository(TagEntity)
    private tagRepository: Repository<TagEntity>,
  ) {}

  async findNotes(): Promise<NoteEntity[]> {
    return await this.noteRepository.find();
  }

  async findNoteById(id: number): Promise<NoteEntity> {
    return this.noteRepository.findOneBy({ id: id });
  }

  async findAllNotesByTitleAndTag(
    tags: string[],
    title: string,
  ): Promise<NoteEntity[]> {
    const query = this.noteRepository.createQueryBuilder('note');
    if (title && title !== '') {
      query.where('note.title like :filterText', { filterText: `%${title}%` });
    }
    if (tags && tags.length !== 0) {
      if (title && title !== '') {
        query.andWhere(
          new Brackets((qb) => {
            qb.where('note.text like :filterTag0', {
              filterTag0: `%${tags[0]}%`,
            });
            this.addFilters(qb, tags);
          }),
        );
      } else {
        query.where('note.text like :filterTag0', {
          filterTag0: `%${tags[0]}%`,
        });
        this.addFilters(query, tags);
      }
    }

    return await query.getMany();
  }

  addFilters(
    query: SelectQueryBuilder<NoteEntity> | WhereExpressionBuilder,
    tags: string[],
  ) {
    for (let i = 1; i < tags.length; i++) {
      const params = {};
      params['filterTag' + i] = `%${tags[i]}%`;
      query.orWhere(`note.text like :filterTag${i}`, params);
    }
    return query;
  }

  async createNote(): Promise<NoteEntity> {
    return await this.noteRepository.save(this.noteRepository.create());
  }

  async updateNote(id, noteInput: NoteInput): Promise<NoteEntity> {
    const previousNote = await this.findNoteById(id);
    const previousNoteTags = await this.findNoteTagsById(id);

    await this.noteRepository.update(id, noteInput);

    const currentNote = await this.findNoteById(id);
    const currentNoteTags = TagUtil.getTagsFromText(currentNote.text);

    await this.updateTagsAfterNoteUpdate(
      previousNote,
      previousNoteTags,
      currentNote,
      currentNoteTags,
    );


    return currentNote;
  }

  async deleteNote(id): Promise<{ id: number }> {
    await this.noteRepository.delete(id);
    return { id: id };
  }

  async findTags(): Promise<TagEntity[]> {
    const tags = await this.tagRepository.find();
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
        currentNoteTags.filter((cNote) => cNote === pNote.text).length !== 0,
    );

    const addedTags = currentNoteTags.filter(
      (cNote) =>
        previousNoteTags.filter((pNote) => cNote === pNote.text).length === 0,
    );
    deletedTags.forEach((dTag) => this.deleteNoteTag(dTag.id));
    addedTags.forEach((dTag) => this.addNoteTag(currentNote.id, dTag));
  }

  async findNoteTagsById(id: number): Promise<TagEntity[]> {
    const note = await this.findNoteById(id);
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
