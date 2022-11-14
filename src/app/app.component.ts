import { Component, OnInit } from '@angular/core';
import { Globals } from './globals';
import { ClienteService } from './servicios/clientes/cliente.service';
import { lastValueFrom } from 'rxjs';
import {
  NgxQrcodeElementTypes,
  NgxQrcodeErrorCorrectionLevels
} from "@techiediaries/ngx-qrcode";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    public globals: Globals,
    private clienteService: ClienteService
  ) { 
    
  }

  async ngOnInit(){
    if(localStorage.getItem("TOKEN")!=null){
      this.globals.usuario = await this.obtenerUsuario();
      this.globals.usuario = this.globals.usuario[0];
    }  
  }

  async obtenerUsuario(){
    let servicioTemp = this.clienteService.getUsuarioToken();
    return await lastValueFrom(servicioTemp); 
  }
}