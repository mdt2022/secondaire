import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { PointageComponent } from './pointage.component';
import { AuthService } from '../../service/auth.service';
import { EcoleService } from '../../service/ecole.service';
import { EnseignantService } from '../../service/enseignant.service';
import { Enseignant } from '../../model/enseignant';

describe('PointageComponent', () => {
  let component: PointageComponent;
  let fixture: ComponentFixture<PointageComponent>;
  let enseignantService: jasmine.SpyObj<EnseignantService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    enseignantService = jasmine.createSpyObj<EnseignantService>('EnseignantService', ['getEnseignantEcole']);
    enseignantService.getEnseignantEcole.and.returnValue(of([{ id: 21 } as Enseignant]));
    const authService = jasmine.createSpyObj<AuthService>('AuthService', ['getEcoleId']);
    authService.getEcoleId.and.returnValue(12);
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [PointageComponent],
      providers: [
        { provide: EcoleService, useValue: {} },
        { provide: EnseignantService, useValue: enseignantService },
        { provide: Router, useValue: router },
        { provide: AuthService, useValue: authService }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PointageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load teachers for the signed-in school only', () => {
    expect(enseignantService.getEnseignantEcole).toHaveBeenCalledWith(12);
    expect(component.enseignants.map(enseignant => enseignant.id)).toEqual([21]);
  });

  it('should navigate to fees without query parameters while preserving the selected period', () => {
    component.dateDebut = '01/10/2026';
    component.dateFin = '18/10/2026';

    component.goToPaiement();

    expect(router.navigate).toHaveBeenCalledWith(['/pointage/honoraires'], {
      state: {
        dateDebut: '01/10/2026',
        dateFin: '18/10/2026'
      }
    });
  });

  it('should navigate to the validated sheet without query parameters', () => {
    component.selectedEnseignantId = 205;
    component.dateDebut = '19/10/2026';
    component.dateFin = '19/10/2026';

    component.simuler();

    expect(router.navigate).toHaveBeenCalledWith(['/pointage/fiche-validee'], {
      state: {
        enseignantId: 205,
        dateDebut: '19/10/2026',
        dateFin: '19/10/2026'
      }
    });
  });
});
