import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  url = environment.baseUrlAPI;
  headers = new HttpHeaders().set(
    'Authorization',
    'Bearer ' + localStorage.getItem('TOKEN')
  );
  constructor(private http: HttpClient) {}

  getUsuarioToken() {
    return this.http
      .get(`${this.url}/usuarios/token`, { headers: this.headers })
      .pipe(map((res) => res));
  }

  getClientes() {
    return this.http
      .get(`${this.url}/usuarios/clientes`, { headers: this.headers })
      .pipe(map((res) => res));
  }

  registrarUsuario(form: any) {
    return this.http.post(`${this.url}/usuarios`, form, {
      headers: this.headers,
    });
  }

  getUsuarios() {
    return this.http
      .get(`${this.url}/usuarios`, { headers: this.headers })
      .pipe(map((res) => res));
  }

  updateUser(data: any, id: any) {
    return this.http.put(`${this.url}/usuarios/${id}`, data, {
      headers: this.headers,
    });
  }

  updatePassword(id: any, oldPass: string, newPass: string) {
    return this.http.put(`${this.url}/usuarios/${id}/pass/${oldPass}`, {CONTRA: newPass}, {
      headers: this.headers,
    });
  }

  updateImageUser(id: any, img: any) {
    console.log(img);
    return this.http.post(`${this.url}/usuarios/actualizarImagen/${id}`, img, {
      headers: this.headers,
    });
  }


  getTiposPersona() {
    return this.http
      .get(`${this.url}/tipoPersona`, { headers: this.headers })
      .pipe(map((res) => res));
  }

  getTiposUsuario() {
    return this.http
      .get(`${this.url}/tipoUsuario`, { headers: this.headers })
      .pipe(map((res) => res));
  }
}
