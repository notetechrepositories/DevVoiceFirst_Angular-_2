import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaType } from './media-type';

describe('MediaType', () => {
  let component: MediaType;
  let fixture: ComponentFixture<MediaType>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaType]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaType);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
