import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAnswerType } from './add-answer-type';

describe('AddAnswerType', () => {
  let component: AddAnswerType;
  let fixture: ComponentFixture<AddAnswerType>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAnswerType]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAnswerType);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
