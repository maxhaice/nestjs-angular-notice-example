import { Injectable } from '@angular/core';
import { Mutation } from 'apollo-angular';
import gql from 'graphql-tag';
import { NoteInterface } from '../models/note.interface'

@Injectable({
  providedIn: 'root'
})
export class CreateNoteQL extends Mutation<{ createNote: NoteInterface }> {
  override document = gql`
      mutation {
        createNote {
            id
            text
            title
            createDate
            updateDate
        }
      }
    `;
}
