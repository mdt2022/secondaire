import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClasseecoleComponent } from './classeecole.component';

describe('ClasseecoleComponent', () => {
  let component: ClasseecoleComponent;
  let fixture: ComponentFixture<ClasseecoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClasseecoleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClasseecoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
