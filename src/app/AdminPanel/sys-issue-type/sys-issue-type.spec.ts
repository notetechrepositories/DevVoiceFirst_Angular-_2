import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SysIssueType } from './sys-issue-type';

describe('SysIssueType', () => {
  let component: SysIssueType;
  let fixture: ComponentFixture<SysIssueType>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SysIssueType]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SysIssueType);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
