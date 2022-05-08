import { NoteInterface } from '../../main/notice/models/note.interface';
import { NoteFilterInterface } from '../../main/notice/models/note.filter.interface';

export class CreateNote {
  static readonly type = '[Note] Add';

  constructor() {
  }
}

export class CreateNoteWS {
  static readonly type = '[Note] AddWS';

  constructor(public payload: NoteInterface) {
  }
}

export class GetNotes {
  static readonly type = '[Note] Get';

}

export class UpdateNote {
  static readonly type = '[Note] Update';

  constructor(public payload: NoteInterface) {
  }
}

export class UpdateNoteWS {
  static readonly type = '[Note] UpdateWS';

  constructor(public payload: NoteInterface) {
  }
}

export class DeleteNoteWS {
  static readonly type = '[Note] DeleteWS';

  constructor(public payload: NoteInterface) {
  }
}

export class DeleteNote {
  static readonly type = '[Note] Delete';

  constructor(public id: number) {
  }
}

export class SetSelectedNote {
  static readonly type = '[Note] Set';

  constructor(public payload: NoteInterface) {
  }
}

export class GetNotesByTitleAndTag {
  static readonly type = '[Note] Get by filter';

  constructor(public filter: NoteFilterInterface) {
  }
}

export class GetTags {
  static readonly type = '[Tag] Get tags';

  constructor() {
  }
}

