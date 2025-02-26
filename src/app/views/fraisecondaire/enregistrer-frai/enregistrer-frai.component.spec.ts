import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnregistrerFraiComponent } from './enregistrer-frai.component';

describe('EnregistrerFraiComponent', () => {
  let component: EnregistrerFraiComponent;
  let fixture: ComponentFixture<EnregistrerFraiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnregistrerFraiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnregistrerFraiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
