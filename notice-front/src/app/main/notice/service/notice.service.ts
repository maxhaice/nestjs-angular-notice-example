import { Injectable } from '@angular/core';
import { Apollo, MutationResult, SubscriptionResult } from 'apollo-angular';
import { from, Observable, tap } from 'rxjs';
import { NoteInterface } from '../models/note.interface'
import { CreateNoteQL } from '../queries/CreateNoteQL'
import { UpdateNoteQL } from '../queries/UpdateNoteQL'
import { GetNotesQL } from '../queries/GetNotesQL'
import { DeleteNoteQL } from '../queries/DeleteNoteQL';
import { SubscribeNoteQL } from '../queries/SubscribeNoteQL';
import { NoteFilterInterface } from '../models/note.filter.interface';
import { GetNotesByTitleAndTagsQL } from '../queries/GetNotesByTitleAndTags';
import { TagInterface } from '../models/tag.interface';
import { GetTagsQL } from '../queries/GetTagsQL';
import { SubscribeNoteDeletedQL } from '../queries/SubscribeNoteDeletedQL';
import { SubscribeNoteCreatedQL } from '../queries/SubscribeNoteCreatedQL';

@Injectable({
  providedIn: 'root'
})
export class NoticeService {

  constructor(private apollo: Apollo,
              private createNotesQL: CreateNoteQL,
              private updateNotesQL: UpdateNoteQL,
              private getNotesQL: GetNotesQL,
              private getNotesByTitleAndTagQL: GetNotesByTitleAndTagsQL,
              private deleteNoteQL: DeleteNoteQL,
              private subscribeNoteQL: SubscribeNoteQL,
              private subscribeNoteDeletedQL: SubscribeNoteDeletedQL,
              private subscribeNoteCreatedQL: SubscribeNoteCreatedQL,
              private getTagsQL: GetTagsQL) { }

  getNotes$(): Observable<MutationResult<{getNotes: NoteInterface[]}>>{
    return this.getNotesQL.fetch()
      .pipe(tap(success =>{
        return success;
      }
    ))
  }

  getNotesByFilterAndTag$(filter: NoteFilterInterface): Observable<MutationResult<{ getNotesByTitleAndTag: NoteInterface[]}>>{
    return this.getNotesByTitleAndTagQL.fetch(filter)
      .pipe(tap(success =>{
          console.log('success filtered', success)
        }
      ))
  }

  updateNotes$({id, title, text}: NoteInterface): Observable<MutationResult<{updateNote: NoteInterface}>>{
    return this.updateNotesQL.mutate({
      input: {
        id: id,
        title: title,
        text: text,
      }
    }).pipe(tap(success =>
      console.log('updated note')
    ));
  }

  createNote$(): Observable<MutationResult<{createNote: NoteInterface}>> {
    return this.createNotesQL.mutate().pipe(tap(success =>
      console.log('created note')
    ));
  }

  deleteNote$(id: number): Observable<MutationResult<NoteInterface>>{
    return this.deleteNoteQL.mutate({
      id: +id,
    }).pipe(tap(success =>
      console.log('delete note')
    ));
  }

  onNoteUpdate$(): Observable<SubscriptionResult<{noteChanged: NoteInterface}>>{
    return this.subscribeNoteQL.subscribe();
  }

  onNoteDeleted$(): Observable<SubscriptionResult<{noteDeleted: NoteInterface}>>{
    return this.subscribeNoteDeletedQL.subscribe();
  }

  onNoteCreated$(): Observable<SubscriptionResult<{noteCreated: NoteInterface}>>{
    return this.subscribeNoteCreatedQL.subscribe();
  }

  getTags$(): Observable<MutationResult<{getAllTags: TagInterface[]}>>{
    return this.getTagsQL.fetch();
  }

}
