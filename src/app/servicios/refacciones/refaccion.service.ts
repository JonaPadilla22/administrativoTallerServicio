import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RefaccionService {
  url = environment.baseUrlAPI;
  headers = new HttpHeaders().set(
    'Authorization',
    'Bearer ' + localStorage.getItem('TOKEN')
  );
  constructor(private http: HttpClient) {}

  getRefactions() {
    return this.http
      .get(`${this.url}/refacciones`, { headers: this.headers })
      .pipe(map((res) => res));
  }

  postRefaction(form: any) {
    return this.http.post(`${this.url}/refacciones`, form, {
      headers: this.headers,
    });
  }

  updateRefaction(data: any, id: any) {
    return this.http.put(`${this.url}/refacciones/${id}`, data, {
      headers: this.headers,
    });
  }

  getTypeRefactions() {
    return this.http
      .get(`${this.url}/tipoRefaccion`, { headers: this.headers })
      .pipe(map((res) => res));
  }
}
