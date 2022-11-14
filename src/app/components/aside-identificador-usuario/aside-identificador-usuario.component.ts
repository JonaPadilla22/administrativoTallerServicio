import { Component, OnInit } from '@angular/core';
import { Globals } from 'src/app/globals';

@Component({
  selector: 'aside-identificador-usuario',
  templateUrl: './aside-identificador-usuario.component.html',
  styleUrls: ['./aside-identificador-usuario.component.css'],
})
export class AsideIdentificadorUsuarioComponent implements OnInit {
  imagenUsuario: string;
  nombreUsuario: string;

  constructor(public globals: Globals) {
    this.imagenUsuario = '../../assets/usuario/perfil.png';
    this.nombreUsuario = this.globals.usuario.NOMBRE;
  }

  ngOnInit(): void {}
}
