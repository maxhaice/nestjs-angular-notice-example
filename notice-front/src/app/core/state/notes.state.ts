import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { NoteInterface } from '../../main/notice/models/note.interface';
import { tap } from 'rxjs';
import {
  CreateNote, CreateNoteWS,
  DeleteNote, DeleteNoteWS,
  GetNotes,
  GetNotesByTitleAndTag, GetTags,
  SetSelectedNote,
  UpdateNote, UpdateNoteWS,
} from '../actions/note.action';
import { NoticeService } from '../../main/notice/service/notice.service';
import { TagInterface } from '../../main/notice/models/tag.interface';
import { stat } from 'fs';

export interface NotesStateModel {
  notes: NoteInterface[];
  selectedNote: NoteInterface | null;
  tags: TagInterface[];
}

@State<NotesStateModel>({
  name: 'notes',
  defaults: {
    notes: [],
    selectedNote: null,
    tags: []
  }
})
@Injectable()
export class NoteState {

  constructor(private noteService: NoticeService) {

  }

  @Selector()
  static getNotes(state: NotesStateModel) {
    return state.notes;
  }

  @Selector()
  static getSelectedNote(state: NotesStateModel) {
    return state.selectedNote;
  }

  @Action(GetNotes)
  getNotes({getState, setState}: StateContext<NotesStateModel>) {
    return this.noteService.getNotes$().pipe(tap((result) => {
      const state = getState();
      setState({
        ...state,
        notes: result.data!.getNotes,
      });
    }));
  }

  handleError(noteErrorType: any){
    try{
      throw 'Error'
    } catch (error){
      console.log(`Error catched inside ${noteErrorType}`)
    }
  }

  //TODO investigate how to check is this our websocket changes

  @Action(CreateNoteWS)
  createNoteWS({getState, setState}: StateContext<NotesStateModel>, {payload}: CreateNoteWS) {
    const state = getState();
    const notesList = [...state.notes];
    const status = state.notes.filter((note)=> note.id == payload.id).length > 0;
      setState({
        ...state,
        notes: [...notesList, payload],
        //TODO: investigate, selectedNote is redundant and we can store this note in component.
        selectedNote: (payload.id == state.selectedNote?.id) ? payload : state.selectedNote
      });
    }


  @Action(CreateNote)
  createNote({getState, setState}: StateContext<NotesStateModel>) {

    return this.noteService.createNote$().pipe(tap((result) => {
      const state = getState();
      if(result.data) {
        const status = state.notes.filter((note)=> note.id == result.data?.createNote.id).length > 0;
        setState({
          ...state,
          notes: status ? [...state.notes] : [...state.notes, result.data.createNote],
          selectedNote: result.data.createNote
        });
      } else {
        this.handleError(CreateNote);
      }
    }));
  }

  @Action(UpdateNote)
  updateNote({getState, setState}: StateContext<NotesStateModel>, {payload}: UpdateNote) {
    return this.noteService.updateNotes$({...payload, id: +payload.id }).pipe(tap((result) => {
      const state = getState();
      const notesList = [...state.notes];
      const noteIndex = notesList.findIndex(item => item.id == payload.id);
      if(result.data){
        notesList[noteIndex] = result.data.updateNote;
        setState({
          ...state,
          notes: notesList,
          selectedNote: (payload.id == state.selectedNote?.id) ? payload : state.selectedNote
        });
      }
    }));
  }

  @Action(UpdateNoteWS)
  updateNoteWS({getState, setState}: StateContext<NotesStateModel>, {payload}: UpdateNote) {
      const state = getState();
      const notesList = [...state.notes];

      const noteIndex = notesList.findIndex(item => item.id == payload.id);
        notesList[noteIndex] = payload;
        setState({
          ...state,
          notes: notesList,
          //TODO: investigate, mb selectedNote is redundant and we can store this note in component.
          selectedNote: (payload.id == state.selectedNote?.id) ? payload : state.selectedNote
        });
  }

  @Action(DeleteNoteWS)
  deleteNoteWS({getState, setState}: StateContext<NotesStateModel>, {payload}: UpdateNote) {
    const state = getState();
    let notesList = [...state.notes];

    notesList = notesList.filter(item => item.id != payload.id);
    const isCurrent = payload.id == state.selectedNote?.id;
    setState({
      ...state,
      notes: notesList,
      selectedNote: isCurrent ? null : state.selectedNote
    });
  }


  @Action(DeleteNote)
  deleteNote({getState, setState}: StateContext<NotesStateModel>, {id}: DeleteNote) {
    return this.noteService.deleteNote$(id).pipe(tap((result) => {
      if(!result.errors){
        this.handleError(DeleteNote);
      }
      const state = getState();
      const filteredArray = state.notes.filter(item => {
        return item.id != id
      });
      const isCurrent = id == state.selectedNote?.id;

      setState({
        ...state,
        selectedNote: isCurrent ? null : state.selectedNote,
        notes: filteredArray,
      });
    }));
  }

  @Action(SetSelectedNote)
  setSelectedNote({getState, setState}: StateContext<NotesStateModel>, {payload}: SetSelectedNote) {
    const state = getState();
    setState({
      ...state,
      selectedNote: payload
    });
  }

  @Action(GetNotesByTitleAndTag)
  getNotesByTitleAndTag({getState, setState}: StateContext<NotesStateModel>, {filter}: GetNotesByTitleAndTag) {
    return this.noteService.getNotesByFilterAndTag$(filter)
      .pipe(tap((result) => {
        const state = getState();
        setState({
          ...state,
        notes: result.data!.getNotesByTitleAndTag,
        });
      }));
  }

  @Action(GetTags)
  getTags({getState, setState}: StateContext<NotesStateModel>) {
    this.noteService.getTags$().subscribe(result => {
      const state = getState()
      setState({
        ...state,
        tags: result.data?.getAllTags ? result.data.getAllTags : state.tags
      })
    })
  }

  @Selector()
  static getTags(state: NotesStateModel): TagInterface[] {
    return state.tags
  }
}
