import { TestBed } from '@angular/core/testing';

import { AttachmentSevice } from './attachment-sevice';

describe('AttachmentSevice', () => {
  let service: AttachmentSevice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttachmentSevice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
