import { Injectable } from '@angular/core';
import { Subscription } from 'apollo-angular';
import gql from 'graphql-tag';
import { NoteInterface } from '../models/note.interface';

@Injectable({
  providedIn: 'root'
})
export class SubscribeNoteDeletedQL extends Subscription<{ noteDeleted: NoteInterface}> {
  override document = gql`
      subscription noteDeleted{
        noteDeleted{
          id
          text
          title
          createDate
          updateDate
        }
      }
    `;
}
