import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Pointage } from '../model/pointage.model';

@Injectable({
  providedIn: 'root'
})

export class PointageService{
    private apiUrl = environment.apiURL;

    constructor(private http: HttpClient, private router: Router) {}

    getAllPointage(search: any): Observable<Pointage[]>{
        return this.http.get<Pointage[]>(this.apiUrl+"/pointages");
    }
}
