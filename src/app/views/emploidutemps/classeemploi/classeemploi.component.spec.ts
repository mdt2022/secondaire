import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClasseemploiComponent } from './classeemploi.component';

describe('ClasseemploiComponent', () => {
  let component: ClasseemploiComponent;
  let fixture: ComponentFixture<ClasseemploiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClasseemploiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClasseemploiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
