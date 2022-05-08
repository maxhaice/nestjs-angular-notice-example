import { Injectable } from '@angular/core';
import { Mutation } from 'apollo-angular';
import gql from 'graphql-tag';
import { NoteInterface } from '../models/note.interface'

@Injectable({
  providedIn: 'root'
})
export class DeleteNoteQL extends Mutation<NoteInterface> {
  override document = gql`
      mutation($id: Int!) {
        deleteNote(id: $id) {
          id
        }
      }
    `;
}
