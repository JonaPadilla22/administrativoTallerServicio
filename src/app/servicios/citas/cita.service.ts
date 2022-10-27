import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CitaService {

  constructor() { }

  getCitas(){
    return "Hola citas"
  }
}
