import { TestBed } from '@angular/core/testing';

import { BusinessActivity } from './business-activity';

describe('BusinessActivity', () => {
  let service: BusinessActivity;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessActivity);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
