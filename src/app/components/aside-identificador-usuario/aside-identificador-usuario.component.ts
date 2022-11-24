import { Component, OnInit } from '@angular/core';
import { Globals } from 'src/app/globals';

@Component({
  selector: 'aside-identificador-usuario',
  templateUrl: './aside-identificador-usuario.component.html',
  styleUrls: ['./aside-identificador-usuario.component.css'],
})
export class AsideIdentificadorUsuarioComponent implements OnInit {
  nombreUsuario: string;

  constructor(public globals: Globals) {
    this.nombreUsuario = this.globals.usuario.NOMBRE;
  }

  ngOnInit(): void {}
}
