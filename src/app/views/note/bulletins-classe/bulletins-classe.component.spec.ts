import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulletinsClasseComponent } from './bulletins-classe.component';

describe('BulletinsClasseComponent', () => {
  let component: BulletinsClasseComponent;
  let fixture: ComponentFixture<BulletinsClasseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BulletinsClasseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BulletinsClasseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
