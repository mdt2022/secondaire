import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FicheValideeComponent } from './fiche-validee.component';
import { AuthService } from '../../../../service/auth.service';
import { PointageService } from '../../../../service/pointage.service';

describe('FicheValideeComponent', () => {
  let component: FicheValideeComponent;
  let fixture: ComponentFixture<FicheValideeComponent>;
  let pointageService: jasmine.SpyObj<PointageService>;

  beforeEach(async () => {
    pointageService = jasmine.createSpyObj<PointageService>('PointageService', ['rechercher']);
    pointageService.rechercher.and.returnValue(of([]));
    const authService = jasmine.createSpyObj<AuthService>('AuthService', ['getEcoleId']);
    authService.getEcoleId.and.returnValue(11);

    await TestBed.configureTestingModule({
      imports: [FicheValideeComponent],
      providers: [
        { provide: PointageService, useValue: pointageService },
        { provide: AuthService, useValue: authService },
        { provide: ActivatedRoute, useValue: { queryParams: of({}) } }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FicheValideeComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => window.history.replaceState({}, ''));

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load the selected teacher and period from navigation state without URL parameters', () => {
    window.history.replaceState({
      enseignantId: 205,
      dateDebut: '19/10/2026',
      dateFin: '19/10/2026'
    }, '');

    fixture.detectChanges();

    expect(pointageService.rechercher).toHaveBeenCalledWith({
      ecoleId: 11,
      enseignantId: 205,
      dateDebut: '2026-10-19',
      dateFin: '2026-10-19'
    });
  });
});
