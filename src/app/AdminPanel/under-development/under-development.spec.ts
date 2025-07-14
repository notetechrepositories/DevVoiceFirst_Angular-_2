import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnderDevelopment } from './under-development';

describe('UnderDevelopment', () => {
  let component: UnderDevelopment;
  let fixture: ComponentFixture<UnderDevelopment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnderDevelopment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnderDevelopment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
