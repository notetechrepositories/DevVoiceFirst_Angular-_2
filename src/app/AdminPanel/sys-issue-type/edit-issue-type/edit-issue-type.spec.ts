import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditIssueType } from './edit-issue-type';

describe('EditIssueType', () => {
  let component: EditIssueType;
  let fixture: ComponentFixture<EditIssueType>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditIssueType]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditIssueType);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
