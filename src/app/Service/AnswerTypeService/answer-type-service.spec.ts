import { TestBed } from '@angular/core/testing';

import { AnswerTypeService } from './answer-type-service';

describe('AnswerTypeService', () => {
  let service: AnswerTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnswerTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
