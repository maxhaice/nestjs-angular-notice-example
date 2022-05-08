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
    @InjectRepository(TagEntity)
    private tagRepository: Repository<TagEntity>,
  ) {}

  async findTags(): Promise<TagEntity[]> {
    const tags = await this.tagRepository
      .createQueryBuilder('tags')
      .select('DISTINCT tags.text')
      .getRawMany();
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
    const promises = [];
    addedTags.forEach((dTag) =>
      promises.push(this.addNoteTag(currentNote.id, dTag)),
    );
    await Promise.all(promises);
  }

  async addNoteTag(noteId: number, tagText: string) {
    await this.tagRepository.save({ note: { id: noteId }, text: tagText });
  }

  async deleteNoteTag(tagId: number) {
    await this.tagRepository.delete(tagId);
    return { id: tagId };
  }
}
