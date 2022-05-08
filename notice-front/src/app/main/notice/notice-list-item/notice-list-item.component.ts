import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck, EventEmitter,
  Input,
  OnChanges,
  OnInit, Output,
  SimpleChanges,
} from '@angular/core';
import { NoteInterface } from '../models/note.interface'
import { Store } from '@ngxs/store';
import { SetSelectedNote } from '../../../core/actions/note.action';

@Component({
  selector: 'app-notice-list-item',
  templateUrl: './notice-list-item.component.html',
  styleUrls: ['./notice-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoticeListItemComponent implements OnInit, OnChanges, DoCheck {

  @Input()
  note?: NoteInterface;

  @Output()
  removeEvent = new EventEmitter<number>();

  constructor(private cdr: ChangeDetectorRef, private store: Store) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.note = changes['note'].currentValue;
  }

  ngDoCheck(): void {
    this.cdr.markForCheck();
  }

  setSelected(): void {
    if (this.note)
      this.store.dispatch(new SetSelectedNote(this.note));
  }

  removeItemEvent($event: MouseEvent): void {
    $event.stopPropagation();
    this.removeEvent.emit(this.note!.id)
  }

}
