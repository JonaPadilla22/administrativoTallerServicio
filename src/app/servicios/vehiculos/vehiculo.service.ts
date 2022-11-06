import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from  '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {
  url = 'https://tallerservicio-production.up.railway.app';
  headers = new HttpHeaders()
            .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjY2MDYxODU0fQ.aGdISnlimZ-VV0dap8x-xEAvxp3Ssya-RIDuAqpvLqA");
  constructor(private http: HttpClient) { }

  getVehiculos(){
    return this
            .http
            .get(`${this.url}/vehiculos`, {headers: this.headers}).pipe(
              map(res=>res)
            );
  }

  registrarVeh(form: any){
    this.http.post(`${this.url}/vehiculos`, form).subscribe({
      next: (response: any) => {
        console.log(response)
        console.log(response.status)
      }, 
      error: () =>{
        alert('ocurrió un error al hacer la petición')
      }
    })
  }

  getVehiculosByCliente(id: string){
    return this
            .http
            .get(`${this.url}/vehiculos/cliente-veh/` + id, {headers: this.headers}).pipe(
              map(res=>res)
            );
  }
}
