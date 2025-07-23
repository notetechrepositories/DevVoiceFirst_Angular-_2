import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIssueType } from './add-issue-type';

describe('AddIssueType', () => {
  let component: AddIssueType;
  let fixture: ComponentFixture<AddIssueType>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddIssueType]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddIssueType);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
