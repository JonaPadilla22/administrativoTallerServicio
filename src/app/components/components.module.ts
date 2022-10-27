import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListaNavegacionComponent } from './lista-navegacion/lista-navegacion.component';



@NgModule({
  declarations: [
    ListaNavegacionComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ListaNavegacionComponent
  ]
})
export class ComponentsModule { }
