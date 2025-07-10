import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestModule } from './test-module';

describe('TestModule', () => {
  let component: TestModule;
  let fixture: ComponentFixture<TestModule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestModule);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
