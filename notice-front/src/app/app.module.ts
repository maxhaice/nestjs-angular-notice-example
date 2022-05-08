import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { NoticeModule } from './main/notice/notice.module'
import {NgxsModule} from "@ngxs/store";
import {environment} from "../environments/environment";
import { NoteState } from './core/state/notes.state';
import {NgxsReduxDevtoolsPluginModule} from "@ngxs/devtools-plugin";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    GraphQLModule,
    HttpClientModule,
    NoticeModule,
    NgxsModule.forRoot([NoteState], {
      developmentMode: !environment.production
    }),
    NgxsReduxDevtoolsPluginModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
