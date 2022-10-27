import { Component } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbDate, NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-date-picker-component',
  templateUrl: './date-picker-component.component.html',
  styleUrls: ['./date-picker-component.component.css']
})
export class DatePickerComponentComponent{
  model: NgbDateStruct;

  constructor() {
    var date = new Date();
    this.model = { day: date.getUTCDay(), month: date.getUTCMonth(), year: date.getUTCFullYear()};
  }
}
