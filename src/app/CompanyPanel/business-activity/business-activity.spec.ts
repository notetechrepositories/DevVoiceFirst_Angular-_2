import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessActivity } from './business-activity';

describe('BusinessActivity', () => {
  let component: BusinessActivity;
  let fixture: ComponentFixture<BusinessActivity>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessActivity]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessActivity);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
