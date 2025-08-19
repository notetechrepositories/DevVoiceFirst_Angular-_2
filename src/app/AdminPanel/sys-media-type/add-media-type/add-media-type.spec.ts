import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMediaType } from './add-media-type';

describe('AddMediaType', () => {
  let component: AddMediaType;
  let fixture: ComponentFixture<AddMediaType>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMediaType]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMediaType);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
