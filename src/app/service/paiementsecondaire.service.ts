import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Paiementsecondaire } from '../model/paiementsecondaire.model';


@Injectable({
  providedIn: 'root'
})

export class PaiementsecondaireService{
    private apiUrl = environment.apiURL;
    
    constructor(private http: HttpClient, private router: Router) {}

    getAllEnseigner(search: any): Observable<Paiementsecondaire[]>{
        return this.http.get<Paiementsecondaire[]>(this.apiUrl+"/paiementsecondaires");
    } 

}