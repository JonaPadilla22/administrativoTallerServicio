import { Component, Input, OnInit } from '@angular/core';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

@Component({
  selector: 'app-buscador-vehiculos',
  templateUrl: './buscador-vehiculos.component.html',
  styleUrls: ['./buscador-vehiculos.component.css']
})
export class BuscadorVehiculosComponent implements OnInit {
  @Input() vehiculos$: any[] = [];
  @Input() formatterVeh: any;

  searchVeh: OperatorFunction<string, readonly { MATRICULA: any }[]> = (text$: Observable<string>) => 	
  text$.pipe(
    debounceTime(200),
    map((term) =>
      term === ''
        ? []
        : this.vehiculos$.filter((v: any) => v.MATRICULA.toLowerCase().indexOf(term.toLowerCase()) > -1).map(
          function(x: any) {
            return x.MATRICULA
          }
        ).slice(0, 10)
    ),
  );
  

  constructor() { }

  ngOnInit(): void {
  }

}
