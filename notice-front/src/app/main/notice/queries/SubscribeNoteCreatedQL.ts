import { Injectable } from '@angular/core';
import { Subscription } from 'apollo-angular';
import gql from 'graphql-tag';
import { NoteInterface } from '../models/note.interface';

@Injectable({
  providedIn: 'root'
})
export class SubscribeNoteCreatedQL extends Subscription<{ noteCreated: NoteInterface}> {
  override document = gql`
      subscription noteCreated{
        noteCreated{
          id
          text
          title
          createDate
          updateDate
        }
      }
    `;
}
