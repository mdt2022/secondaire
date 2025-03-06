import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Site } from '../model/site.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SiteService {
  readonly apiUrl = environment.apiURL;

  constructor(private httpClient: HttpClient) { }

  getAllSite(): Observable<Site[]>{
    return this.httpClient.get<Site[]>(this.apiUrl+'/sites');
  }
}
