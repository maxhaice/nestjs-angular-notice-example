import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { NoteEntity } from '../models/note.entity';
import { NoteService } from '../service/note.service';
import { PubSub } from 'graphql-subscriptions';
import { NoteUpdateInput } from '../types/note-update.input';
import { TagEntity } from '../models/tag.entity';

const pubSub = new PubSub();

@Resolver(() => NoteEntity)
export class NoteResolver {
  constructor(private noteService: NoteService) {}

  @Query(() => NoteEntity, { name: 'note' })
  async getNoteById(@Args('id', { type: () => Int }) id: number) {
    return this.noteService.findNoteById(id);
  }

  @Query(() => [NoteEntity])
  async getNotesByTitleAndTag(
    @Args('tag', { type: () => [String] }) tag?: string[],
    @Args('title') title?: string,
  ) {
    return this.noteService.findAllNotesByTitleAndTag(tag, title);
  }

  @Query(() => [NoteEntity])
  async getNotes() {
    return this.noteService.findNotes();
  }

  @Mutation(() => NoteEntity)
  async updateNote(@Args('input') input: NoteUpdateInput) {
    const updatedNote = await this.noteService.updateNote(input.id, input);
    pubSub.publish('noteChanged', { noteChanged: updatedNote });
    return updatedNote;
  }

  @Mutation(() => NoteEntity, { name: 'createNote' })
  async createNote() {
    const createdNote = await this.noteService.createNote();
    pubSub.publish('noteCreated', {
      noteCreated: createdNote,
    });
    return createdNote;
  }

  @Mutation(() => NoteEntity, { name: 'deleteNote' })
  async deleteNote(@Args({ name: 'id', type: () => Int }) id: number) {
    const deletedNote = await this.noteService.findNoteById(id);
    deletedNote.tags = await this.getTagsByNote(deletedNote);
    pubSub.publish('noteDeleted', {
      noteDeleted: deletedNote,
    });
    return await this.noteService.deleteNote(id);
  }

  @Subscription(() => NoteEntity, { name: 'noteChanged' })
  noteChanged(data) {
    return pubSub.asyncIterator('noteChanged');
  }

  @Subscription(() => NoteEntity, { name: 'noteCreated' })
  noteCreated(data) {
    return pubSub.asyncIterator('noteCreated');
  }

  @Subscription(() => NoteEntity, { name: 'noteDeleted' })
  noteDeleted(data) {
    return pubSub.asyncIterator('noteDeleted');
  }

  @ResolveField('tags', () => [TagEntity], { nullable: false })
  async getTagsByNote(@Parent() note: NoteEntity) {
    return await note.tags;
  }
}
