import { TestBed } from '@angular/core/testing';

import { Deviceinfo } from './deviceinfo';

describe('Deviceinfo', () => {
  let service: Deviceinfo;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Deviceinfo);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
