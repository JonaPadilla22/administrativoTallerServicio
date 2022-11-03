import { TimePickerComponent } from './time-picker/time-picker.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListaNavegacionComponent } from './lista-navegacion/lista-navegacion.component';
import { DatePickerComponentComponent } from './date-picker-component/date-picker-component.component';
import { FormsModule } from '@angular/forms';
import { ListaNavegacionHijoComponent } from './lista-navegacion/lista-navegacion-hijo/lista-navegacion-hijo.component';
import { AsideIdentificadorUsuarioComponent } from './aside-identificador-usuario/aside-identificador-usuario.component';
import { AppRoutingModule } from '../app-routing.module';



@NgModule({
  declarations: [
    ListaNavegacionComponent,
    DatePickerComponentComponent,
    TimePickerComponent,
    ListaNavegacionHijoComponent,
    AsideIdentificadorUsuarioComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    AppRoutingModule,
  ],
  exports: [
    ListaNavegacionComponent,
    DatePickerComponentComponent,
    TimePickerComponent,
    AsideIdentificadorUsuarioComponent
  ]
})
export class ComponentsModule { }
