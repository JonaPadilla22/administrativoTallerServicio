import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit {
  listaDeNavegacion: any;

  constructor() {
    this.listaDeNavegacion = [
      {
        nombre: 'Cita',
        icono: 'nombre icono',
        link: '',
        children: [
          {
            nombre: 'Registrar Cita',
            icono: 'nombre icono',
            link: 'registrar',
          },
          {
            nombre: 'Consultar Cita',
            icono: 'nombre icono',
            link: 'consultar',
          },
        ],
      },
      {
        nombre: 'Taller',
        icono: 'nombre icono',
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
      }
      
    ];
  }

  ngOnInit(): void {}
}
