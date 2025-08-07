import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SysIssueStatus } from './sys-issue-status';

describe('SysIssueStatus', () => {
  let component: SysIssueStatus;
  let fixture: ComponentFixture<SysIssueStatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SysIssueStatus]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SysIssueStatus);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
