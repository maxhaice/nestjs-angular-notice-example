import { Injectable } from '@angular/core';
import { Mutation, Query } from 'apollo-angular'
import gql from 'graphql-tag';
import { NoteInterface } from '../models/note.interface'

@Injectable({
  providedIn: 'root'
})
export class GetNotesQL extends Query<{getNotes: NoteInterface[]}> {
  override document = gql`
        query notes {
          getNotes {
            id
            title
            text
            createDate
            updateDate
          }
        }
    `;
}
