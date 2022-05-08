import { Injectable } from '@angular/core';
import {Query } from 'apollo-angular';
import gql from 'graphql-tag';
import { NoteInterface } from '../models/note.interface'

@Injectable({
  providedIn: 'root'
})
export class GetNotesByTitleAndTagsQL extends Query<{ getNotesByTitleAndTag: NoteInterface[]}> {
  override document = gql`
  query ($tags: [String!]!, $title: String!) {
    getNotesByTitleAndTag(tag: $tags, title: $title) {
      id,
      title,
      text,
      createDate,
      updateDate,
    }
  }`;
}
