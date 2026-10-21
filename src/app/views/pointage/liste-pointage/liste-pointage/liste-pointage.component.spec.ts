import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ListePointageComponent } from './liste-pointage.component';
import { AuthService } from '../../../../service/auth.service';
import { EnseignantService } from '../../../../service/enseignant.service';
import { PointageService } from '../../../../service/pointage.service';

describe('ListePointageComponent', () => {
  let component: ListePointageComponent;
  let fixture: ComponentFixture<ListePointageComponent>;
  let pointageService: jasmine.SpyObj<PointageService>;

  beforeEach(async () => {
    pointageService = jasmine.createSpyObj<PointageService>('PointageService', ['getByEcole']);
    pointageService.getByEcole.and.returnValue(of([]));
    const enseignantService = jasmine.createSpyObj<EnseignantService>('EnseignantService', ['getEnseignantEcole']);
    enseignantService.getEnseignantEcole.and.returnValue(of([]));
    const authService = jasmine.createSpyObj<AuthService>('AuthService', ['getEcoleId']);
    authService.getEcoleId.and.returnValue(12);

    await TestBed.configureTestingModule({
      imports: [ListePointageComponent],
      providers: [
        { provide: PointageService, useValue: pointageService },
        { provide: EnseignantService, useValue: enseignantService },
        { provide: AuthService, useValue: authService }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListePointageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load pointages for the signed-in school only', () => {
    expect(pointageService.getByEcole).toHaveBeenCalledWith(12);
  });
});
