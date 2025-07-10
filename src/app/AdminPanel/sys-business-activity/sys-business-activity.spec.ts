import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SysBusinessActivity } from './sys-business-activity';

describe('SysBusinessActivity', () => {
  let component: SysBusinessActivity;
  let fixture: ComponentFixture<SysBusinessActivity>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SysBusinessActivity]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SysBusinessActivity);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
