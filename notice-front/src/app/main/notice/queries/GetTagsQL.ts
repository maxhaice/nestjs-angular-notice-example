import { Injectable } from '@angular/core';
import { Mutation, Query } from 'apollo-angular'
import gql from 'graphql-tag';
import { NoteInterface } from '../models/note.interface'
import { TagInterface } from '../models/tag.interface';

@Injectable({
  providedIn: 'root'
})
export class GetTagsQL extends Query<{getAllTags: TagInterface[]}> {
  override document = gql`
        query tags {
          getAllTags {
            text
          }
        }
    `;
}
