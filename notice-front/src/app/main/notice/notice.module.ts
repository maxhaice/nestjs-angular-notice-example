import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoticeListItemComponent } from './notice-list-item/notice-list-item.component';
import {NoticeTemplateComponent} from "./notice-template/notice-template.component";
import { FormsModule } from '@angular/forms'


@NgModule({
  declarations: [
    NoticeTemplateComponent,
    NoticeListItemComponent
  ],
  exports: [
    NoticeTemplateComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
  ],
})
export class NoticeModule { }
