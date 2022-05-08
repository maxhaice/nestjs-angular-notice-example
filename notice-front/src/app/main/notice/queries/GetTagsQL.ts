import { Injectable } from '@angular/core';
import { Query } from 'apollo-angular'
import gql from 'graphql-tag';
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
