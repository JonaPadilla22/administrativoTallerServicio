import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'list-item',
  templateUrl: './lista-navegacion.component.html',
  styleUrls: ['./lista-navegacion.component.css']
})
export class ListaNavegacionComponent implements OnInit {

  @Input() items:any;
  imprimirLista = "";

  constructor() { }

  ngOnInit(): void {
    this.imprimirLista = JSON.stringify(this.items)
  }

  convertirAString(item: object){
    return JSON.stringify(item)
  }

}
