import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'aside-identificador-usuario',
  templateUrl: './aside-identificador-usuario.component.html',
  styleUrls: ['./aside-identificador-usuario.component.css'],
})
export class AsideIdentificadorUsuarioComponent implements OnInit {
  imagenUsuario: string;
  nombreUsuario: string;

  constructor() {
    this.imagenUsuario = '../../assets/usuario/perfil.png';
    this.nombreUsuario = 'Pedro Sanchez';
  }

  ngOnInit(): void {}
}
