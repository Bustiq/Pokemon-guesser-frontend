import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbmComponent } from './abm.component';
import { FormsModule } from '@angular/forms';

describe('AbmComponent', () => {
  let component: AbmComponent;
  let fixture: ComponentFixture<AbmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbmComponent ],
      imports: [ FormsModule ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
