import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueStatus } from './issue-status';

describe('IssueStatus', () => {
  let component: IssueStatus;
  let fixture: ComponentFixture<IssueStatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IssueStatus]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IssueStatus);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
