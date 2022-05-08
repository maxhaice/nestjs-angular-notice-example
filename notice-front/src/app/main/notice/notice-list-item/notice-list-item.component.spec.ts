import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeListItemComponent } from './notice-list-item.component';

describe('NoticeComponent', () => {
  let component: NoticeListItemComponent;
  let fixture: ComponentFixture<NoticeListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoticeListItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticeListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
