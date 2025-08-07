import { TestBed } from '@angular/core/testing';

import { IssueStatusService } from './issue-status-service';

describe('IssueStatusService', () => {
  let service: IssueStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IssueStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
