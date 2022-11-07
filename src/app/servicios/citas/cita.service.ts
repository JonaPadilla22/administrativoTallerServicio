import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from  '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  //url = 'http://localhost:3000';
  url = 'https://tallerservicio-production.up.railway.app';
  headers = new HttpHeaders()
            .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjY2MDYxODU0fQ.aGdISnlimZ-VV0dap8x-xEAvxp3Ssya-RIDuAqpvLqA");
  constructor(private http: HttpClient) { }

  getCitas(){
    return "Hola citas"
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
