import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class AvanceService {

  private api = environment.apiURL + "/avances";

  constructor(private http: HttpClient) {}

  create(data:any){
    return this.http.post(this.api, data);
  }

  getAll() {
  return this.http.get<any[]>(`${this.api}/all`);
}
  rechercher(data:any){
    return this.http.post<any[]>(this.api + "/search", data);
  }

  payer(id:number){
    return this.http.put(this.api + "/payer/" + id, {});
  }

  supprimer(id:number){
    return this.http.delete(this.api + "/" + id);
  }
}