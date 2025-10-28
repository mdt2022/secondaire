import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SupportDeCours } from '../model/supportDeCours';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SupportDeCoursService {

  private apiUrl = environment.apiURL+"/supports";

  constructor(private http: HttpClient) {}

  getAll(): Observable<SupportDeCours[]> {
    return this.http.get<SupportDeCours[]>(this.apiUrl);
  }

  getById(id: number) {
    return this.http.get<SupportDeCours>(`${this.apiUrl}/${id}`);
  }

  // create with file (multipart/form-data)
  createWithFile(data: { nom: string; classeId?: number; file?: File }): Observable<SupportDeCours> {
    const form = new FormData();
    form.append('nom', data.nom);
    if (data.classeId != null) {
      // envoie seulement l'id si backend le supporte
      form.append('classe', JSON.stringify({ id: data.classeId }));
      // ou form.append('classeId', String(data.classeId)); selon backend
    }
    if (data.file) {
      form.append('file', data.file, data.file.name);
    }
    return this.http.post<SupportDeCours>(this.apiUrl, form);
  }

  updateWithFile(id: number, data: { nom: string; classeId?: number; file?: File }): Observable<SupportDeCours> {
    const form = new FormData();
    form.append('nom', data.nom);
    if (data.classeId != null) {
      form.append('classe', JSON.stringify({ id: data.classeId }));
    }
    if (data.file) {
      form.append('file', data.file, data.file.name);
    }
    return this.http.put<SupportDeCours>(`${this.apiUrl}/${id}`, form);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  downloadFile(filename: string) {
    return this.http.get(`${this.apiUrl}/download/${filename}`, { responseType: 'blob' });
  }
}