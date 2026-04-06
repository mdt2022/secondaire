import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { Exclusion } from "../model/exclusion";

@Injectable({
  providedIn: 'root'
})
export class ExclusionService {

  private apiUrl = environment.apiURL + "/exclusions";

  constructor(private http: HttpClient) {}

  /**
   * Exclure une liste d'élèves
   */
  exclure(data: Exclusion): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

}
