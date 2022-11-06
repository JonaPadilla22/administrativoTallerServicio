import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './home-page.component';
import { ServiciosPendientesComponent } from './servicios/servicios-pendientes/servicios-pendientes.component';
import { HistorialServiciosComponent } from './historial/historial-servicios/historial-servicios.component';
import { GestionRefaccionesComponent } from './gestion/gestion-refacciones/gestion-refacciones.component';
import { GestionUsuariosComponent } from './gestion/gestion-usuarios/gestion-usuarios.component';
import { CitasPendientesComponent } from './citas/citas-pendientes/citas-pendientes.component';
import { RegistrarCitaComponent } from './citas/registrar-cita/registrar-cita.component';
import { AppRoutingModule } from '../app-routing.module';
import { ComponentsModule } from '../components/components.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    HomePageComponent,
    ServiciosPendientesComponent,
    HistorialServiciosComponent,
    GestionRefaccionesComponent,
    GestionUsuariosComponent,
    CitasPendientesComponent,
    RegistrarCitaComponent
  ],
  imports: [
    CommonModule, 
    AppRoutingModule, 
    ComponentsModule,
    ReactiveFormsModule
  ],
  exports: [
    HomePageComponent,
    ServiciosPendientesComponent,
    HistorialServiciosComponent,
    GestionRefaccionesComponent,
    GestionUsuariosComponent,
    CitasPendientesComponent,
    RegistrarCitaComponent,
    CommonModule
  ],
})
export class PaginasModule {}
