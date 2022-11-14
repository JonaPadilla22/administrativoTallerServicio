import { Injectable } from '@angular/core';
import Swal from 'sweetalert2'

@Injectable({
  providedIn: 'root',
})
export class AlertsComponent{

  constructor() { }

  ngOnInit(): void {
  }

  exito(text: string){  
    Swal.fire({
      icon: 'success',
      title: text,
      showConfirmButton: false,
      timer: 1000
    }) 
  }

  warning(text: string){  
    Swal.fire({
      icon: 'warning',
      title: text,
      showConfirmButton: true,
      timer: 5000
    }) 
  }

  error(text: string)  
  {  
    Swal.fire({
      icon: 'error',  
      title: 'Upsi...',  
      text: text
    })  
  }

  confirmDialog(text: string){
    return Swal.fire({
      text: text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'CANCELAR',
      confirmButtonText: 'CONFIRMAR'
    })
  }
}
