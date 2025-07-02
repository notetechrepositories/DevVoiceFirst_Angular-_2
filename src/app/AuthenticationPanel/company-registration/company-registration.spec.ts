import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyRegistration } from './company-registration';

describe('CompanyRegistration', () => {
  let component: CompanyRegistration;
  let fixture: ComponentFixture<CompanyRegistration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyRegistration]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyRegistration);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
