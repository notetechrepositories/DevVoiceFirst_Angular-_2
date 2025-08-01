import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswerType } from './answer-type';

describe('AnswerType', () => {
  let component: AnswerType;
  let fixture: ComponentFixture<AnswerType>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnswerType]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnswerType);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
