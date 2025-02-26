import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NouvelleEmpreinteComponent } from './nouvelle-empreinte.component';

describe('NouvelleEmpreinteComponent', () => {
  let component: NouvelleEmpreinteComponent;
  let fixture: ComponentFixture<NouvelleEmpreinteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NouvelleEmpreinteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NouvelleEmpreinteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
