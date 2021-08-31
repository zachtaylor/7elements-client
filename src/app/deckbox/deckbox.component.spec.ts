import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckboxComponent } from './deckbox.component';

describe('DeckboxComponent', () => {
  let component: DeckboxComponent;
  let fixture: ComponentFixture<DeckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeckboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
