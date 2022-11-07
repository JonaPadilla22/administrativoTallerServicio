import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit {
  listaDeNavegacion: any;
  nombreUsuario: string;
  constructor(private router: Router) {
    this.nombreUsuario = 'Pedro Sanchez';
    this.listaDeNavegacion = [
      {
        nombre: 'Cita',
        icono: 'bx bxs-food-menu',
        link: '',
        children: [
          {
            nombre: 'Registrar Cita',
            link: 'cita/registrar',
          },
          {
            nombre: 'Consultar Cita',
            link: 'cita/pendientes',
          },
        ],
      },
      {
        nombre: 'Taller',
        icono: 'bx bxs-car-garage',
        children: [
          {
            nombre: 'Servicios Pendientes',
            link: 'taller/serviciosPendientes',
          },
          {
            nombre: 'Historial Servicio',
            link: 'taller/historialServicio',
          },
          {
            nombre: 'Ingreso Sin Cita',
            link: 'taller/ingresoSinCita',
          },
        ],
      },
      {
        nombre: 'Usuarios',
        icono: 'bx bxs-user-rectangle',
        link: 'usuarios',
      },
      {
        nombre: 'Recursos',
        icono: 'bx bx-package',
        link: 'recursos',
      },
    ];
  }

  ngOnInit(): void {
    if (!localStorage.getItem('TOKEN')) this.router.navigate(['/']);
  }
}
