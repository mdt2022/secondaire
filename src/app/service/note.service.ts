import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Note } from '../model/note.model';

@Injectable({
  providedIn: 'root'
})

export class NoteService{
    private apiUrl = environment.apiURL;

    constructor(private http: HttpClient, private router: Router) {}

    getAllEnseignant(search: any): Observable<Note[]>{
        return this.http.post<Note[]>(this.apiUrl+"/notes/noteeleve", search);
    } 
}