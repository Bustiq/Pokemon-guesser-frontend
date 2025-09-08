import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndlessModeComponent } from './endless-mode.component';

describe('EndlessModeComponent', () => {
  let component: EndlessModeComponent;
  let fixture: ComponentFixture<EndlessModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EndlessModeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EndlessModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
