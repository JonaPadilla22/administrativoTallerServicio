import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from  '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  url = 'https://tallerservicio-production.up.railway.app';
  headers = new HttpHeaders()
            .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjY2MDYxODU0fQ.aGdISnlimZ-VV0dap8x-xEAvxp3Ssya-RIDuAqpvLqA");
  constructor(private http: HttpClient) { }

  getClientes(){
    return this
            .http
            .get(`${this.url}/usuarios/clientes`, {headers: this.headers}).pipe(
              map(res=>res)
            );
  }
}
