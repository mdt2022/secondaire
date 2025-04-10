import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulletinClasseComponent } from './bulletin-classe.component';

describe('BulletinClasseComponent', () => {
  let component: BulletinClasseComponent;
  let fixture: ComponentFixture<BulletinClasseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BulletinClasseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BulletinClasseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
