import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SysMediaType } from './sys-media-type';

describe('SysMediaType', () => {
  let component: SysMediaType;
  let fixture: ComponentFixture<SysMediaType>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SysMediaType]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SysMediaType);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
