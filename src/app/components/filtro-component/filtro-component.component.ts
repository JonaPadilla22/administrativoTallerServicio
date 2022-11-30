import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'filtro-component',
  templateUrl: './filtro-component.component.html',
  styleUrls: ['./filtro-component.component.css']
})
export class FiltroComponent{

  @Input() listaTiposfiltros : any;

  @Output() itemSelected = new EventEmitter<any>();

  constructor() {
    this.listaTiposfiltros = []
  }

  handleChangeSelect(ev: any){
    let value = ev.target.value;

    this.itemSelected.emit(value);
  }

}
