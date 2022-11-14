import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from  '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {
  url = environment.baseUrlAPI;
  headers = new HttpHeaders()
            .set("Authorization", "Bearer "+localStorage.getItem("TOKEN"));
  constructor(private http: HttpClient) { }

  sendNotificationUser(id:string, title: string, body: string){
    return this.http.post(`${this.url}/firebase/notification/${id}`, {
      "NOTIFICATION": 
      {
        "title": title, 
        "body": body
      }
    }, {headers: this.headers});
  }
}
