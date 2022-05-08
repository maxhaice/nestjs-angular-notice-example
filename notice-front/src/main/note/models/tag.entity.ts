import { Field, ID, ObjectType } from '@nestjs/graphql';
import { IDField } from '@nestjs-query/query-graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NoteEntity } from './note.entity';

@Entity('tags')
@ObjectType()
export class TagEntity {
  @PrimaryGeneratedColumn('increment')
  @IDField(() => ID)
  id: number;

  @Column('number', { nullable: false, name: 'note_id' })
  @ManyToOne(() => NoteEntity, (note) => note.tags, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'note_id',
  })
  @Field(() => NoteEntity)
  note: NoteEntity;

  @Column({ nullable: false, name: 'text' })
  @Field({ nullable: false })
  text: string;
}
