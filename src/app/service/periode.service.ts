import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Periode } from '../model/periode';

@Injectable({
  providedIn: 'root'
})
export class PeriodeService {
  private apiUrl = `${environment.apiURL}/periodes`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Periode[]> {
    return this.http.get<Periode[]>(this.apiUrl);
  }
}
