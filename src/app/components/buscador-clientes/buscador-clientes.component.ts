import { Component, Input, OnInit } from '@angular/core';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

@Component({
  selector: 'app-buscador-clientes',
  templateUrl: './buscador-clientes.component.html',
  styleUrls: ['./buscador-clientes.component.css']
})
export class BuscadorClientesComponent implements OnInit {
  @Input() clientes: any[] = [];
  @Input() formatterClientes: any;

  searchClientes: OperatorFunction<string, readonly { NOMBRE: any }[]> = (text$: Observable<string>) => 	
  text$.pipe(
    debounceTime(200),
    map((term) =>
      term === ''
        ? []
        : this.clientes.filter((v: any) => v.NOMBRE.toLowerCase().indexOf(term.toLowerCase()) > -1).map(
          function(x: any) {
            return x.NOMBRE
          }
        ).slice(0, 10)
    ),
  );

  constructor() { }

  ngOnInit(): void {
  }

}
