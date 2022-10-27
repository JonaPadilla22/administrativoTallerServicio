import { TimePickerComponent } from './time-picker/time-picker.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListaNavegacionComponent } from './lista-navegacion/lista-navegacion.component';
import { DatePickerComponentComponent } from './date-picker-component/date-picker-component.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ListaNavegacionComponent,
    DatePickerComponentComponent,
    TimePickerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule
  ],
  exports: [
    ListaNavegacionComponent,
    DatePickerComponentComponent,
    TimePickerComponent
  ]
})
export class ComponentsModule { }
