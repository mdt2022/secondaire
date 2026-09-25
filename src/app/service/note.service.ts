import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { NoteClassePayload } from '../model/note-classe';
import { Observable } from 'rxjs';
import { NoteParMatiereDTO } from '../model/note-par-matiere-dto';

@Injectable({ providedIn: 'root' })
export class NoteService {

  private apiUrl = `${environment.apiURL}/notes`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token JWT manquant');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  saveNotesClasse(data: NoteClassePayload): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/classe`, data, {
      headers: this.getAuthHeaders()
    });
  }


  saveNoteEleve(data: {
    eleveEcoleId: number;
    matiereId: number;
    periodeId: number;
    noteClasse: number;
    noteCompo: number;
  }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/eleve`, data, {
      headers: this.getAuthHeaders()
    });
  }

  getListeNotesParMatiere(
    ecoleId: number,
    classeId: number,
    anneeId: number,
    periodeId: number,
    matiereId: number
  ): Observable<NoteParMatiereDTO[]> {

    const params = new HttpParams()
      .set('ecoleId', ecoleId)
      .set('classeId', classeId)
      .set('anneeId', anneeId)
      .set('periodeId', periodeId)
      .set('matiereId', matiereId);

    return this.http.get<NoteParMatiereDTO[]>(`${this.apiUrl}/filtrer`, {
      params,
      headers: this.getAuthHeaders()
    });
  }

  saveNotesParMatiere(
    ecoleId: number,
    classeId: number,
    anneeId: number,
    periodeId: number,
    matiereId: number,
    notes: NoteParMatiereDTO[]
  ): Observable<any> {

    const params = new HttpParams()
      .set('ecoleId', ecoleId)
      .set('classeId', classeId)
      .set('anneeId', anneeId)
      .set('periodeId', periodeId)
      .set('matiereId', matiereId);

    return this.http.put<any>(`${this.apiUrl}/save`, notes, {
      params,
      headers: this.getAuthHeaders()
    });
  }
//RELEVER
  getReleveClasse(
  ecoleId: number,
  classeecoleId: number,
  anneeId: number,
  periodeId: number
): Observable<any[]> {

  const params = new HttpParams()
    .set('ecoleId', ecoleId)
    .set('classeecoleId', classeecoleId)
    .set('anneeId', anneeId)
    .set('periodeId', periodeId);

  return this.http.get<any[]>(`${this.apiUrl}/recherche-releve`, {
    params,
    headers: this.getAuthHeaders()
  });
}

// BULLETIN ELEVE
getBulletinEleve(
  eleveId: number,
  anneeId: number,
  periodeId: number,
  classeId: number,
  ecoleId: number
): Observable<any> {

  const body = [
    eleveId.toString(),
    anneeId.toString(),
    periodeId.toString(),
    classeId.toString(),
    ecoleId.toString()
  ];

  return this.http.post<any>(
    `${this.apiUrl}/noteeleve`,
    body,
    { headers: this.getAuthHeaders() }
  );
}

getBulletinClasse(
  ecoleId: number,
  classeId: number,
  anneeId: number,
  periodeId: number
): Observable<any[]> {

  const params = new HttpParams()
    .set('ecoleId', ecoleId)
    .set('classeId', classeId)
    .set('anneeId', anneeId)
    .set('periodeId', periodeId);

  return this.http.get<any[]>(
    `${this.apiUrl}/bulletin-classe`,
    {
      params,
      headers: this.getAuthHeaders()
    }
  );
}


}
