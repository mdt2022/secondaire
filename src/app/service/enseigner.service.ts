import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Enseigner } from '../model/enseigner.model';

@Injectable({
  providedIn: 'root'
})

export class EnseignerService{
    private apiUrl = environment.apiURL;

    constructor(private http: HttpClient, private router: Router) {}

    getAllEnseigner(search: any): Observable<Enseigner[]>{
        return this.http.get<Enseigner[]>(this.apiUrl+"/enseigners");
    } 
}