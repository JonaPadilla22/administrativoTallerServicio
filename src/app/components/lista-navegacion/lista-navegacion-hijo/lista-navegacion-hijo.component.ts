import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'child-list',
  templateUrl: './lista-navegacion-hijo.component.html',
  styleUrls: ['./lista-navegacion-hijo.component.css']
})
export class ListaNavegacionHijoComponent implements OnInit {
  @Input() item : any;

  constructor() { }

  ngOnInit(): void {
  }

}
