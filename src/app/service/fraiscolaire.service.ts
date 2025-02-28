import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Fraiscolaire } from '../model/fraiscolaire.model';


@Injectable({
  providedIn: 'root'
})

export class FraiscolaireService{
    private apiUrl = environment.apiURL;

    constructor(private http: HttpClient, private router: Router) {}

    getAllEnseigner(search: any): Observable<Fraiscolaire[]>{
        return this.http.get<Fraiscolaire[]>(this.apiUrl+"/fraiscolaires");
    } 
}