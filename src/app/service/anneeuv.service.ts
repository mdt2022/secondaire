import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Anneeuv } from '../model/anneeuv.model';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AnneeuvService {
  readonly apiUrl =  environment.apiURL;

  constructor(private httpClient: HttpClient) { }

  getAllAnnee(): Observable<Anneeuv[]>{
    return this.httpClient.get<Anneeuv[]>(this.apiUrl+"/annees");
  }
  
  getAnnee(id: number): Observable<Anneeuv>{
    return this.httpClient.get<Anneeuv>(this.apiUrl+'/annees'+{id});
  }

  createAnnee(anneeuv: Anneeuv): Observable<Anneeuv>{
    return this.httpClient.post<Anneeuv>(this.apiUrl+'/annees', anneeuv);
  }

  updateAnnee(id: number, anneeuv: Anneeuv){
    return this.httpClient.put<Anneeuv>(this.apiUrl+'/annees'+'/'+{id}, anneeuv);
  }

  deleteAnnee(id: number): Observable<any>{
    return this.httpClient.delete(this.apiUrl+'/annees'+'/'+{id});
  }

  
}
