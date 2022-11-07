import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from  '@angular/common/http';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  url: string;
  headers = new HttpHeaders()
            .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjY2MDYxODU0fQ.aGdISnlimZ-VV0dap8x-xEAvxp3Ssya-RIDuAqpvLqA");
  
  constructor(private http: HttpClient) { 
    this.url = environment.baseUrlAPI; 
  }

  getCitas(){
    return this
            .http
            .get(`${this.url}/tipoServicio`, {headers: this.headers}).pipe(
              map(res=>res)
            );
  }

  getTiposServicios(){
    return this
            .http
            .get(`${this.url}/tipoServicio`, {headers: this.headers}).pipe(
              map(res=>res)
            );
  }

  getTiposPersona(){
    return this
            .http
            .get(`${this.url}/tipoPersona`, {headers: this.headers}).pipe(
              map(res=>res)
            );
  }

  getMarcas(){
    return this
            .http
            .get(`${this.url}/marca`, {headers: this.headers}).pipe(
              map(res=>res)
            );
  }

  getModelos(id: string){
    return this
            .http
            .get(`${this.url}/modeloVehiculo/marca/${id}`, {headers: this.headers}).pipe(
              map(res=>res)
            );
  }

  registrarCita(form: any) {
    return this.http.post(`${this.url}/servicios`, form);
  }

  registrarActualizacioServ(form: any) {
    return this.http.post(`${this.url}/servicios/actualizacion`, form);
  }
}
