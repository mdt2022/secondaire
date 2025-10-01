import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Cap } from "../model/cap.model";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
providedIn: 'root'
})
export class CapService {
    private apiUrl = environment.apiURL+"/caps";

    constructor(private http: HttpClient) {}

    getCercles(): Observable<Cap[]> {
        return this.http.get<Cap[]>(this.apiUrl);
    }

    get(id: number): Observable<Cap> {
        return this.http.get<Cap>(`${this.apiUrl}/${id}`);
    }

    create(cap: Cap): Observable<Cap> {
        return this.http.post<Cap>(this.apiUrl, cap);
    }

    update(id: number, cap: Cap): Observable<Cap> {
        return this.http.put<Cap>(`${this.apiUrl}/${id}`, cap);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}