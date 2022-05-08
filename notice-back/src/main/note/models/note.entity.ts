import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { IDField } from '@nestjs-query/query-graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TagEntity } from './tag.entity';

@Entity('notes')
@ObjectType()
export class NoteEntity {
  @PrimaryGeneratedColumn('increment')
  @IDField(() => ID)
  id: number;

  @Column({ nullable: true, default: '' })
  @Field({ nullable: true })
  title?: string;

  @Column({ nullable: true, default: '' })
  @Field({ nullable: true })
  text?: string;

  //TODO: many to many?
  @OneToMany((type) => TagEntity, (tag) => tag.note, { onDelete: 'CASCADE' })
  @Field(() => [TagEntity], { nullable: false })
  tags: TagEntity[];

  @Field(() => GraphQLISODateTime)
  @CreateDateColumn()
  createDate: Date;

  @Field(() => GraphQLISODateTime, {})
  @UpdateDateColumn()
  updateDate: Date;
}
