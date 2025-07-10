import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SysRoles } from './sys-roles';

describe('SysRoles', () => {
  let component: SysRoles;
  let fixture: ComponentFixture<SysRoles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SysRoles]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SysRoles);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
