import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SupportDeCours, SupportDTO } from '../model/supportDeCours';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SupportDeCoursService {

  private apiUrl = environment.apiURL + "/supports";

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
      form.append('classe', JSON.stringify({ id: data.classeId }));
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

  // création avec progression (corrigée)
  createWithFiles(dto: any, livreFile?: File, chapitreFiles?: File[], progressCb?: (p: number) => void): Observable<any> {
    const form = new FormData();
    form.append('support', JSON.stringify(dto));

    if (livreFile) {
      form.append('livreFile', livreFile, livreFile.name);
    }

    if (chapitreFiles && chapitreFiles.length) {
      chapitreFiles.forEach(f => {
        if (f) {
          form.append('chapitreFiles', f, f.name);
        }
      });
    }

    const req = new HttpRequest('POST', this.apiUrl, form, { reportProgress: true });

    return this.http.request(req).pipe(
      map((event: HttpEvent<any>) => {
        if (event.type === HttpEventType.UploadProgress) {
          const percent = Math.round(100 * (event.loaded / (event.total ?? 1)));
          if (progressCb) progressCb(percent);
          return { status: 'progress', message: percent };
        } else if (event.type === HttpEventType.Response) {
          if (progressCb) progressCb(100);
          return { status: 'done', body: event.body };
        } else {
          return { status: 'other' };
        }
      })
    );
  }

  update(id: number, dto: SupportDTO) { return this.http.put(`${this.apiUrl}/${id}`, dto); }
  
  updateSupportWithFiles(id: number, dto: any, livreFile?: File, chapitreFiles?: File[]): Observable<any> {
  const formData = new FormData();

  formData.append("support", JSON.stringify(dto));

  if (livreFile) {
    formData.append("livreFile", livreFile);
  }

  if (chapitreFiles && chapitreFiles.length > 0) {
    chapitreFiles.forEach(f => formData.append("chapitreFiles", f));
  }

  const req = new HttpRequest("PUT", `${this.apiUrl}/${id}`, formData, {
    reportProgress: true
  });

  return this.http.request(req).pipe(
    map((event: HttpEvent<any>) => {
      if (event.type === HttpEventType.Response) return event.body;
      return null;
    })
  );
}

}
