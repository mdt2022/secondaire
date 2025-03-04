import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationemploidutempsComponent } from './creationemploidutemps.component';

describe('CreationemploidutempsComponent', () => {
  let component: CreationemploidutempsComponent;
  let fixture: ComponentFixture<CreationemploidutempsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreationemploidutempsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreationemploidutempsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
