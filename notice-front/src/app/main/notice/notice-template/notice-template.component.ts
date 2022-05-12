import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NoticeService } from '../service/notice.service'
import { NoteInterface } from '../models/note.interface'
import { first, Observable } from 'rxjs';
import { NoteState } from '../../../core/state/notes.state';
import { Store } from '@ngxs/store';
import {
  CreateNote, CreateNoteWS,
  DeleteNote, DeleteNoteWS,
  GetNotes,
  GetNotesByTitleAndTag, GetTags,
  SetSelectedNote,
  UpdateNote, UpdateNoteWS,
} from '../../../core/actions/note.action';
import { NoteFilterInterface } from '../models/note.filter.interface';
import { TagInterface } from '../models/tag.interface';

@Component({
  selector: 'app-notice-template',
  templateUrl: './notice-template.component.html',
  styleUrls: ['./notice-template.component.scss']
})
export class NoticeTemplateComponent implements OnInit {

  titleEdit: string = '';

  textEdit: string = '';

  isTitleEditing: boolean = false;

  searchTimeout: ReturnType<typeof setTimeout>  | null = null;

  @ViewChild('inputTitle')
  inputTitle!: ElementRef;

  //TODO: can be switched to behaviour without this null value.
  selected$: Observable<NoteInterface | null>;
  selected: NoteInterface | null = null;
  tags$: Observable<TagInterface[]>;
  tags: TagInterface[] = [];

  notes$: Observable<NoteInterface[]>;

  filter: NoteFilterInterface = {title: '', tags: []};

  constructor(private notesService: NoticeService, private noteStore: Store) {
    //TODO: investigate how we can use selector without this row && without config changes
    this.selected$= noteStore.select(NoteState.getSelectedNote)
    this.notes$= noteStore.select(NoteState.getNotes)
    this.tags$= noteStore.select(NoteState.getTags)

    //Web Socket Note update
    this.notesService.onNoteUpdate$().subscribe((result) => {
      this.noteStore.dispatch(new UpdateNoteWS(result.data!.noteChanged));
    });
    // Web Socket Note delete
    this.notesService.onNoteDeleted$().subscribe((result) => {
      this.noteStore.dispatch(new DeleteNoteWS(result.data!.noteDeleted));
      this.filter.title = '';
      this.filter.tags = [];
    });
    // Web Socket Note create
    this.notesService.onNoteCreated$().subscribe((result) => {
      this.noteStore.dispatch(new CreateNoteWS(result.data!.noteCreated))
    });
    }

  ngOnInit(): void {
    this.selected$.subscribe(selected => {
      if(selected) {
        this.selected = selected;
        this.titleEdit = selected.title;
        this.textEdit = selected.text;
      } else {
        this.selected = null;
        this.titleEdit = '';
        this.textEdit = '';
      }
    })
    this.notes$.pipe()
      .subscribe((notes) => {
        if(notes?.length > 0 && this.selected === null) {
          this.noteStore.dispatch(new SetSelectedNote(notes[0]))
        }
        this.noteStore.dispatch(new GetTags());
    })
    this.tags$.subscribe(tags => {
        this.tags = tags;
    })
    this.noteStore.dispatch(new GetNotes());
  }

  createNote(): void {
    this.noteStore.dispatch(CreateNote);
  }

  titleEditChangeStatus() {
    if(this.selected !== null) {
      this.isTitleEditing = !this.isTitleEditing;
      if (this.isTitleEditing) {
        setTimeout((inputTitle: ElementRef) => {
          inputTitle.nativeElement.focus();
        }, 50, this.inputTitle)
      } else {
        this.noteUpdate();
      }
    }
  }

  noteUpdate(){
    this.noteStore.dispatch(new UpdateNote({id: this.selected!.id, title: this.titleEdit, text: this.textEdit} as NoteInterface))
  }

  removeNote(id: number){
    this.noteStore.dispatch(new DeleteNote(+id));
    this.filter.title = '';
    this.filter.tags = [];
  }

  addButton() {
    this.selected = null;
    this.titleEdit = '';
    this.textEdit = '';
    this.createNote()
  }

  useFilter($event: Event): void {
    const timeToDie = 1000;
    //Searching timeout
    if(this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(() =>
          this.noteStore.dispatch(new GetNotesByTitleAndTag(this.filter)),
      timeToDie
    )
    const input = $event.target as HTMLInputElement;
    this.filter.title = input.value;
  }

  tagClick($event: MouseEvent) {
    const target = $event.target as HTMLDivElement
    if($event && this.filter.tags?.includes(target.innerText)) {
      this.filter.tags = this.filter.tags?.filter(item => item != target.innerText);
    }
    else {
      this.filter.tags?.push(target.innerText);
    }
    this.noteStore.dispatch(new GetNotesByTitleAndTag(this.filter));
  }
}
