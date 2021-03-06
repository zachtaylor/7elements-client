import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleBodyComponent } from './body.component';

describe('ArticleBodyComponent', () => {
  let component: ArticleBodyComponent;
  let fixture: ComponentFixture<ArticleBodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticleBodyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
