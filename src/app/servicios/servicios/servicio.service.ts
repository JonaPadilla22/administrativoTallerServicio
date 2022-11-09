import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from  '@angular/common/http';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {
  url: string;
  headers = new HttpHeaders()
            .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjY2MDYxODU0fQ.aGdISnlimZ-VV0dap8x-xEAvxp3Ssya-RIDuAqpvLqA");
  
  constructor(private http: HttpClient) { 
    this.url = environment.baseUrlAPI; 
  }

  getServiciosPendientes(){
    return this
            .http
            .get(`${this.url}/servicios/pendientes`, {headers: this.headers}).pipe(
              map(res=>res)
            );
  }

  getEstatus(){
    return this
            .http
            .get(`${this.url}/servicios/estatus`, {headers: this.headers}).pipe(
              map(res=>res)
            );
  }

  getDetalleServicio(id: string){
    return this
            .http
            .get(`${this.url}/servicios/detalle/${id}`, {headers: this.headers}).pipe(
              map(res=>res)
            );
  }

}
