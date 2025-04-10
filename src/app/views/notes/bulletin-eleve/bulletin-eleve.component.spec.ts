import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulletinEleveComponent } from './bulletin-eleve.component';

describe('BulletinEleveComponent', () => {
  let component: BulletinEleveComponent;
  let fixture: ComponentFixture<BulletinEleveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BulletinEleveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BulletinEleveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
