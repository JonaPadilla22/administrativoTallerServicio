import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from  '@angular/common/http';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {
  url = environment.baseUrlAPI;
  headers = new HttpHeaders()
            .set("Authorization", "Bearer "+localStorage.getItem("TOKEN"));
  constructor(private http: HttpClient) { }

  getVehiculos(){
    return this
            .http
            .get(`${this.url}/vehiculos`, {headers: this.headers}).pipe(
              map(res=>res)
            );
  }

  registrarVeh(form: any){
    return this.http.post(`${this.url}/vehiculos`, form, {headers: this.headers});
  }

  getVehiculosByCliente(id: string){
    return this
            .http
            .get(`${this.url}/vehiculos/cliente-veh/` + id, {headers: this.headers}).pipe(
              map(res=>res)
            );
  }
}
