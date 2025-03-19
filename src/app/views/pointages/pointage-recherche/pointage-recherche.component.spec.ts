import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointageRechercheComponent } from './pointage-recherche.component';

describe('PointageRechercheComponent', () => {
  let component: PointageRechercheComponent;
  let fixture: ComponentFixture<PointageRechercheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PointageRechercheComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PointageRechercheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
