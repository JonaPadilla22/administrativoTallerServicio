import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CitasPendientesComponent } from './paginas/citas/citas-pendientes/citas-pendientes.component';
import { RegistrarCitaComponent } from './paginas/citas/registrar-cita/registrar-cita.component';
import { GestionRefaccionesComponent } from './paginas/gestion/gestion-refacciones/gestion-refacciones.component';
import { GestionUsuariosComponent } from './paginas/gestion/gestion-usuarios/gestion-usuarios.component';
import { HistorialServiciosComponent } from './paginas/historial/historial-servicios/historial-servicios.component';
import { HomePageComponent } from './paginas/home-page.component';
import { ServiciosPendientesComponent } from './paginas/servicios/servicios-pendientes/servicios-pendientes.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: HomePageComponent,
    children: [
      {
        path: 'cita',
        children: [
          {
            path: '',
            redirectTo: 'registrar',
            pathMatch: 'full',
          },
          {
            path: 'registrar',
            component: RegistrarCitaComponent,
          },
          {
            path: 'pendientes',
            component: CitasPendientesComponent,
          },
        ],
      },
      {
        path: 'taller',
        children: [
          {
            path: '',
            redirectTo: 'ingreso',
            pathMatch: 'full',
          },
          {
            path: 'serviciosPendientes',
            component: ServiciosPendientesComponent,
          },
          {
            path: 'historialServicio',
            component: HistorialServiciosComponent,
          },
        ],
      },
      {
        path: 'usuarios',
        pathMatch: 'full',
        component: GestionUsuariosComponent,
      },
      {
        path: 'recursos',
        pathMatch: 'full',
        component: GestionRefaccionesComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
