import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CitasPendientesComponent } from './paginas/citas/citas-pendientes/citas-pendientes.component';
import { RegistrarCitaComponent } from './paginas/citas/registrar-cita/registrar-cita.component';
import { HomePageComponent } from './paginas/home-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: HomePageComponent,
    children: [
      {
        path: 'citas',
        children: [
          {
            path: '',
            redirectTo: 'registrar',
            pathMatch: 'full',
          },
          {
            path: 'pendientes',
            component: CitasPendientesComponent,
          },
          {
            path: 'registrar',
            component: RegistrarCitaComponent,
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
