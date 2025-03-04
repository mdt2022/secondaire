import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DjournalierComponent } from './djournalier.component';

describe('DjournalierComponent', () => {
  let component: DjournalierComponent;
  let fixture: ComponentFixture<DjournalierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DjournalierComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DjournalierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
