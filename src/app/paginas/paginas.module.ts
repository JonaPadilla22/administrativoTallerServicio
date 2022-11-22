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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DecimalPipe } from '@angular/common';
import { IngresoSinCitaComponent } from './taller/ingreso-sin-cita/ingreso-sin-cita.component';
import { FormUsuarioComponent } from './gestion/gestion-usuarios/form-usuario/form-usuario.component';
import { NgxQRCodeModule } from "@techiediaries/ngx-qrcode";
@NgModule({
  declarations: [
    HomePageComponent,
    ServiciosPendientesComponent,
    HistorialServiciosComponent,
    GestionRefaccionesComponent,
    GestionUsuariosComponent,
    CitasPendientesComponent,
    RegistrarCitaComponent,
    IngresoSinCitaComponent,
    FormUsuarioComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    ComponentsModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    NgxQRCodeModule
  ],
  providers: [DecimalPipe],
  exports: [
    HomePageComponent,
    ServiciosPendientesComponent,
    HistorialServiciosComponent,
    GestionRefaccionesComponent,
    GestionUsuariosComponent,
    CitasPendientesComponent,
    RegistrarCitaComponent,
    CommonModule,
  ],
})
export class PaginasModule {}
