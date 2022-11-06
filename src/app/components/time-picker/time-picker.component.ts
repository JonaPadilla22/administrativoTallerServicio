import { Component, Output, EventEmitter } from '@angular/core';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.css']
})
export class TimePickerComponent {
	time: NgbTimeStruct = { hour: 8, minute: 0, second: 0 };
	hourStep = 1;
	minuteStep = 15;
  	meridian = true;
	@Output() cambioTime = new EventEmitter<any>();

	toggleMeridian() {
		this.meridian = !this.meridian;
	};

	cambioHora(){
		if(this.time.hour<8){
			this.time = { hour: 8, minute: 0, second: 0 };
		}
		else if(this.time.hour>22){
			this.time = { hour: 22, minute: 0, second: 0 };
		}
		else if(this.time.hour==22 && this.time.minute>0){
			this.time = { hour: 22, minute: 0, second: 0 };
		}

		this.cambioTime.emit(this.time);
	}
}
