import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SysAnswerType } from './sys-answer-type';

describe('SysAnswerType', () => {
  let component: SysAnswerType;
  let fixture: ComponentFixture<SysAnswerType>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SysAnswerType]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SysAnswerType);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
