import { Component, Output, EventEmitter } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbDate, NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-date-picker-component',
  templateUrl: './date-picker-component.component.html',
  styleUrls: ['./date-picker-component.component.css']
})
export class DatePickerComponentComponent{
  model: NgbDateStruct;
  minDate: any;
  maxDate: any;
  maxMonth: any;
  maxYear: any;
  isDisabled: any;
  @Output() cambioDate = new EventEmitter<any>();

  constructor() {
    
    var date = new Date();
    var mes_max = 1; //numero de meses de rango maximo para una cita

    this.model = { day: date.getDate(), month: date.getMonth()+1, year: date.getUTCFullYear()};
    
    this.minDate = this.model;
    this.maxYear = this.model.year;
    this.maxMonth = this.model.month + mes_max;
  
    if(this.maxMonth>12){
      this.maxYear = this.maxYear + 1;
      this.maxMonth = this.maxMonth -12;
    }

    this.maxDate = { day: date.getDate(), month: this.maxMonth, year: this.maxYear };
    this.isDisabled = (date: NgbDate, current: {month: number}) => date.day === 14;
    this.cambioFecha();
  }

  cambioFecha(){
    this.cambioDate.emit(this.model);
  }
}
