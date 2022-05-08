import { TagInterface } from './tag.interface';

export interface NoteInterface {
  id: number;

  title: string;

  text: string;

  tags: TagInterface[]

  updateDate: Date;

  createDate: Date;
}
