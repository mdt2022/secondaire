import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { HonorairesComponent } from './honoraires.component';
import { AuthService } from '../../../../service/auth.service';
import { PointageService } from '../../../../service/pointage.service';

describe('HonorairesComponent', () => {
  let component: HonorairesComponent;
  let fixture: ComponentFixture<HonorairesComponent>;
  let pointageService: jasmine.SpyObj<PointageService>;

  beforeEach(async () => {
    pointageService = jasmine.createSpyObj<PointageService>('PointageService', ['calculerHonoraires']);
    pointageService.calculerHonoraires.and.returnValue(of({
      details: [],
      totalMontant: 0,
      totalAvances: 0
    }));
    const authService = jasmine.createSpyObj<AuthService>('AuthService', ['getAdminData', 'getEcoleId']);
    authService.getAdminData.and.returnValue({});
    authService.getEcoleId.and.returnValue(12);

    await TestBed.configureTestingModule({
      imports: [HonorairesComponent],
      providers: [
        { provide: PointageService, useValue: pointageService },
        { provide: AuthService, useValue: authService }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HonorairesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should request fees for the signed-in school only', () => {
    expect(pointageService.calculerHonoraires).toHaveBeenCalledWith(12, component.dateDebut, component.dateFin);
  });
});
