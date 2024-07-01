import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueueDisplayComponent } from './queue-display.component';

describe('QueueDisplayComponent', () => {
  let component: QueueDisplayComponent;
  let fixture: ComponentFixture<QueueDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QueueDisplayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QueueDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
