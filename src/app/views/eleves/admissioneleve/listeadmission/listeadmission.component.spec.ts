import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeadmissionComponent } from './listeadmission.component';

describe('ListeadmissionComponent', () => {
  let component: ListeadmissionComponent;
  let fixture: ComponentFixture<ListeadmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeadmissionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListeadmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
