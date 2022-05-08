import { Injectable } from '@angular/core';
import {Apollo, MutationResult, SubscriptionResult} from 'apollo-angular';
import { Observable, tap } from 'rxjs';
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
import {ApolloQueryResult} from "@apollo/client/core";

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

  getNotes$(): Observable<ApolloQueryResult<any>> {
    return this.apollo.watchQuery<any>({
      query: this.getNotesQL.document,
      fetchPolicy: 'network-only'
    }).valueChanges
  }

  getNotesByFilterAndTag$(filter: NoteFilterInterface): Observable<MutationResult<{ getNotesByTitleAndTag: NoteInterface[]}>>{
    return this.getNotesByTitleAndTagQL.fetch(filter);
  }

  updateNotes$({id, title, text}: NoteInterface): Observable<MutationResult<{updateNote: NoteInterface}>>{
    return this.updateNotesQL.mutate({
      input: {
        id: id,
        title: title,
        text: text,
      }
    });
  }

  createNote$(): Observable<MutationResult<{createNote: NoteInterface}>> {
    return this.createNotesQL.mutate()
  }

  deleteNote$(id: number): Observable<MutationResult<NoteInterface>>{
    return this.deleteNoteQL.mutate({
      id: +id,
    })
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

  getTags$(): Observable<ApolloQueryResult<any>>{
    return this.apollo.watchQuery({
      query: this.getTagsQL.document,
      fetchPolicy: 'network-only'
    }).valueChanges
  }
}
