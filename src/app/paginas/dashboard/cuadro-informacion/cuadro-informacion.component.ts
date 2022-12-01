import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cuadro-informacion',
  templateUrl: './cuadro-informacion.component.html',
  styleUrls: ['./cuadro-informacion.component.css'],
})
export class CuadroInformacionComponent implements OnInit {
  @Input() title: string;
  @Input() icon: string;

  constructor() {
    this.title = '';
    this.icon = '';
  }

  ngOnInit(): void {}
}
