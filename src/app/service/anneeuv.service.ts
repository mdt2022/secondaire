import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'
import { Anneeuv } from '../model/anneeuv';

@Injectable({
  providedIn: 'root'
})
export class AnneeuvService {
  getEnseignantEcole() {
    throw new Error('Method not implemented.');
  }
  private apiUrl = environment.apiURL+"/annees";

  constructor(private http: HttpClient) {}

  getAll(): Observable<Anneeuv[]> {
    return this.http.get<Anneeuv[]>(this.apiUrl);
  }
}
