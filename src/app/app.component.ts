import { Component } from '@angular/core';
import {
  NgxQrcodeElementTypes,
  NgxQrcodeErrorCorrectionLevels
} from "@techiediaries/ngx-qrcode";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  saludo = "Ejemplo de como hacer un codigo QR con QR Code Generator";
  tipoElemento = NgxQrcodeElementTypes.IMG;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  valor: string = "HOLA QUE TAAL";
}