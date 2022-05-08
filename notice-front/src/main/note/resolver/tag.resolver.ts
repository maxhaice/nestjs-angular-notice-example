import { Parent, Query, ResolveField, ResolveProperty, Resolver } from '@nestjs/graphql';
import { NoteEntity } from '../models/note.entity';
import { TagEntity } from '../models/tag.entity';
import { TagService } from '../service/tag.service';

@Resolver(() => TagEntity)
export class TagResolver {
  constructor(private tagService: TagService) {}

  @Query(() => [TagEntity])
  async getAllTags() {
    return this.tagService.findTags();
  }

  @ResolveProperty('note', () => NoteEntity, { nullable: false })
  async getNoteByTag(@Parent() tag: TagEntity) {
    return tag.note;
  }
}
