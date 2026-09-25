import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdmissionService {

  private apiUrl = environment.apiURL + "/admissions";

  constructor(private http: HttpClient) {}

  // élèves admis par classe + année
getElevesAdmis(classeId: number, anneeId: number, ecoleId: number) {
    return this.http.get<any[]>(
      `${this.apiUrl}/classe/${classeId}/annee/${anneeId}/ecole/${ecoleId}`
    );
  }

  // envoyer à l'examen
  envoyerExamen(data: any) {
  return this.http.post(
    `${this.apiUrl}/valider`,
    data,
    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
  );
}
 //rechercher des admissions avec filtres

rechercherAdmissions(filtres: any) {
  return this.http.post<any[]>(
    `${this.apiUrl}/search`,
    filtres,
    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
  );
}
}
