import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookConsultation } from './book-consultation';

describe('BookConsultation', () => {
  let component: BookConsultation;
  let fixture: ComponentFixture<BookConsultation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookConsultation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookConsultation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
