
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
    providedIn: 'root'
})
export class Enseignant{
    private apiUrl = environment.apiURL;
    constructor(private http: HttpClient, private router: Router) {}
    getAllEnseignant(): Observable<Enseignant[]>{
        return this.http.get<Enseignant[]>(this.apiUrl+"/enseignants");
    } 

}