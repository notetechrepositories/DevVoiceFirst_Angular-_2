import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIssueStatus } from './add-issue-status';

describe('AddIssueStatus', () => {
  let component: AddIssueStatus;
  let fixture: ComponentFixture<AddIssueStatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddIssueStatus]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddIssueStatus);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
