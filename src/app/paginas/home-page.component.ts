import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit {
  listaDeNavegacion: any;
  nombreUsuario: string;
  constructor() {
    this.nombreUsuario = "Pedro Sanchez";
    this.listaDeNavegacion = [
      {
        nombre: 'Cita',
        icono: 'bx bxs-food-menu',
        link: '',
        children: [
          {
            nombre: 'Registrar Cita',
            link: 'citas/registrar',
          },
          {
            nombre: 'Consultar Cita',
            link: 'citas/consultar',
          },
        ],
      },
      {
        nombre: 'Taller',
        icono: 'bx bxs-car-garage',
        children: [
          {
            nombre: 'Ingreso a Taller',
            link: 'taller/ingreso',
          },
          {
            nombre: 'Asignar Citas',
            link: 'taller/asignar-citas',
          },
          {
            nombre: 'Consultar Vehículo',
            link: 'taller/consultar-vehiculo',
          },
          {
            nombre: 'Registrar Salida',
            link: 'taller/registrar-salida',
          },
          {
            nombre: 'Historial Servicio',
            link: 'taller/historial-servicio',
          },
        ],
      },
      {
        nombre: 'Usuarios',
        icono: 'bx bxs-user-rectangle',
        link: 'usuarios'
      },
      {
        nombre: 'Refacciones',
        icono: 'bx bx-package',
        link: 'refacciones'
      },
      {
        nombre: 'Mano De Obra',
        icono: 'bx bxs-bulb',
        link: 'manoDeObra'
      }
      
    ];
  }

  ngOnInit(): void {}
}
