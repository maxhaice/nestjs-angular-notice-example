import { Module } from '@nestjs/common';
import { NoteService } from './service/note.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoteEntity } from './models/note.entity';
import { NoteResolver } from './resolver/note.resolver';
import { TagEntity } from './models/tag.entity';
import { TagResolver } from './resolver/tag.resolver';
import { TagService } from './service/tag.service';

@Module({
  providers: [NoteService, NoteResolver, TagResolver, TagService],
  imports: [TypeOrmModule.forFeature([NoteEntity, TagEntity])],
})
export class NoteModule {}
