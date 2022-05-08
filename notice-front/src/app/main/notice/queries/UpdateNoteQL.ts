import { Injectable } from '@angular/core';
import { Mutation } from 'apollo-angular';
import gql from 'graphql-tag';
import { NoteInterface } from '../models/note.interface'

@Injectable({
  providedIn: 'root'
})
export class UpdateNoteQL extends Mutation<{ updateNote: NoteInterface }> {
  override document = gql`
      mutation($input: NoteUpdateInput!) {
        updateNote(input: $input) {
          id
          title
          text
          createDate
          updateDate
        }
      }
    `;
}
