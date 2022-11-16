import { Component, OnInit } from '@angular/core';

import { ClienteService } from './servicios/clientes/cliente.service';
import { lastValueFrom } from 'rxjs';

import { Globals } from './globals';

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
    // if(localStorage.getItem("TOKEN")!=null){
    //   this.globals.usuario = await this.obtenerUsuario();
    //   this.globals.usuario = this.globals.usuario[0];
    //   localStorage.setItem("NOMBRE", this.globals.usuario.NOMBRE); 
    //   localStorage.setItem("IMAGEN", this.globals.usuario.IMG); 
    // }  
  }

  async obtenerUsuario(){
    let servicioTemp = this.clienteService.getUsuarioToken();
    return await lastValueFrom(servicioTemp); 
  }
}