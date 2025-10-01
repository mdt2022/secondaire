import { environment } from "../../../../adminsup/src/environments/environment";
import { Region } from "../model/region.model";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
    providedIn: 'root'
  })
  export class RegionService {
    private apiUrl = environment.apiURL+"/regions";
  
    constructor(private http: HttpClient) {}
  
    getRegions(): Observable<Region[]> {
      return this.http.get<Region[]>(this.apiUrl);
    }
  
    getRegion(id: number): Observable<Region> {
      return this.http.get<Region>(`${this.apiUrl}/${id}`);
    }
  
    createRegion(region: Region): Observable<Region> {
      return this.http.post<Region>(this.apiUrl, region);
    }
  
    updateRegion(id: number, region: Region): Observable<Region> {
      return this.http.put<Region>(`${this.apiUrl}/${id}`, region);
    }
  
    deleteRegion(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
  }