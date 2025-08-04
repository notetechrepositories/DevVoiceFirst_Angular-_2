import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyMediaType } from './company-media-type';

describe('CompanyMediaType', () => {
  let component: CompanyMediaType;
  let fixture: ComponentFixture<CompanyMediaType>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyMediaType]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyMediaType);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
