import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { AnneeuvService } from '../../../service/anneeuv.service';
import { EmploidutempsService } from '../../../service/emploidutemps.service';
import { Emploidutemps } from '../../../model/emploidutemps';
import { JourComponent } from './jour.component';

describe('JourComponent', () => {
  let component: JourComponent;
  let fixture: ComponentFixture<JourComponent>;
  let emploiService: jasmine.SpyObj<EmploidutempsService>;
  let anneeService: jasmine.SpyObj<AnneeuvService>;

  const makeEmploi = (overrides: Partial<Emploidutemps> = {}): Emploidutemps => ({
    id: 1,
    date: null,
    nbreheure: 0,
    enseignant: {},
    jour: 'Lundi',
    heuredebut: '08:30',
    heurefin: '10:00',
    matiere: {} as Emploidutemps['matiere'],
    professeur: {} as Emploidutemps['professeur'],
    classe: { nom: 'Sixième A' } as Emploidutemps['classe'],
    ecole: { idEcole: 7 } as Emploidutemps['ecole'],
    anneeuv: { id: 3, nom: '2025-2026' },
    ...overrides
  });

  beforeEach(async () => {
    localStorage.setItem('user', JSON.stringify({
      administrateur: { ecole: { idEcole: 7 } }
    }));
    emploiService = jasmine.createSpyObj<EmploidutempsService>('EmploidutempsService', ['parJour']);
    anneeService = jasmine.createSpyObj<AnneeuvService>('AnneeuvService', ['getAll']);
    emploiService.parJour.and.returnValue(of([]));
    anneeService.getAll.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [JourComponent],
      providers: [
        { provide: EmploidutempsService, useValue: emploiService },
        { provide: AnneeuvService, useValue: anneeService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(JourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => localStorage.removeItem('user'));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load only the selected day, year, and school and calculate decimal hours', () => {
    emploiService.parJour.and.returnValue(of([
      makeEmploi(),
      makeEmploi({ id: 5, heuredebut: 'heure invalide' }),
      makeEmploi({ id: 2, jour: 'Mardi' }),
      makeEmploi({ id: 3, anneeuv: { id: 4, nom: '2026-2027' } }),
      makeEmploi({ id: 4, ecole: { idEcole: 8 } as Emploidutemps['ecole'] })
    ]));
    component.emploiForm.setValue({ jour: 'Lundi', anneeuv: 3 });

    component.onSubmit();

    expect(emploiService.parJour).toHaveBeenCalledWith('Lundi', 3, 7);
    expect(component.emplois.map(emploi => emploi.id)).toEqual([1, 5]);
    expect(component.emplois[0].nbreheure).toBe(1.5);
    expect(component.emplois[1].nbreheure).toBe(0);
    expect(component.emploisParClasse[0].classe).toBe('Sixième A');
    expect(component.rechercheEffectuee).toBeTrue();
    expect(component.chargement).toBeFalse();
  });

  it('should not query when the search form is invalid', () => {
    component.onSubmit();

    expect(emploiService.parJour).not.toHaveBeenCalled();
  });

  it('should not query when the school id is missing', () => {
    component.idEcole = null;
    component.emploiForm.setValue({ jour: 'Lundi', anneeuv: 3 });

    component.onSubmit();

    expect(emploiService.parJour).not.toHaveBeenCalled();
    expect(component.erreurChargement).toContain('école');
  });

  it('should clear prior results and expose an error when loading fails', () => {
    component.emplois = [makeEmploi()];
    component.emploisParClasse = [{ classe: 'Sixième A', emplois: component.emplois }];
    emploiService.parJour.and.returnValue(throwError(() => new Error('Network failure')));
    spyOn(console, 'error');
    component.emploiForm.setValue({ jour: 'Lundi', anneeuv: 3 });

    component.onSubmit();

    expect(component.emplois).toEqual([]);
    expect(component.emploisParClasse).toEqual([]);
    expect(component.erreurChargement).toContain('a échoué');
    expect(component.chargement).toBeFalse();
  });
});
