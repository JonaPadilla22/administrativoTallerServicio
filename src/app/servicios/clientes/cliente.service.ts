import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from  '@angular/common/http';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  url = environment.baseUrlAPI;
  headers = new HttpHeaders()
            .set("Authorization", "Bearer "+localStorage.getItem("TOKEN"));
  constructor(private http: HttpClient) { }

  getUsuarioToken(){
    return this
            .http
            .get(`${this.url}/usuarios/token`, {headers: this.headers}).pipe(
              map(res=>res)
            );
  }

  getClientes(){
    return this
            .http
            .get(`${this.url}/usuarios/clientes`, {headers: this.headers}).pipe(
              map(res=>res)
            );
  }

  registrarCliente(form: any){
    return this.http.post(`${this.url}/usuarios`, form, {headers: this.headers});
  }
}
