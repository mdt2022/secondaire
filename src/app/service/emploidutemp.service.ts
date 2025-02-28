import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class Emploidutemp{
    private apiUrl = environment.apiURL;

    constructor(private http: HttpClient, private router: Router) {}
    
    getAllEnseignant(): Observable<Emploidutemp[]>{
        return this.http.get<Emploidutemp[]>(this.apiUrl+"/emploidutemps");
    }
}