import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueType } from './issue-type';

describe('IssueType', () => {
  let component: IssueType;
  let fixture: ComponentFixture<IssueType>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IssueType]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IssueType);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
