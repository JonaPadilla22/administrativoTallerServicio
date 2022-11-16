import { Injectable } from '@angular/core';
import Swal from 'sweetalert2'
import { ClienteService } from 'src/app/servicios/clientes/cliente.service';

@Injectable({
  providedIn: 'root',
})
export class AlertsComponent{

  constructor(private clienteService: ClienteService) { }

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

  modalCambiarPass(id_usuario: string){
    return Swal.fire({
      title: 'Cambiar Contraseña',
      html:
        `
          <label>Contraseña Actual</label><input id="swal-OldPass" class="swal2-input">
          <label>Nueva Contraseña</label><input id="swal-NewPass" class="swal2-input">
          <label>Confirmar Contraseña</label><input id="swal-ConfPass" class="swal2-input">
        `,
      focusConfirm: false,
      confirmButtonText:
    'Confirmar <i class="bx bx-check"></i>',
      preConfirm: () => {
        return [
          this.cambiarPass(
            id_usuario,
            (<HTMLInputElement>document.getElementById("swal-OldPass")).value, 
            (<HTMLInputElement>document.getElementById("swal-NewPass")).value, 
            (<HTMLInputElement>document.getElementById("swal-ConfPass")).value
          )
        ]
      }
    });
    
  }

  private cambiarPass(id: string, oldPass: string, newPass: string, confPass: string){
    if(newPass!=confPass){
      this.warning("LA CONFIRMACIÓN NO COINCIDE CON LA NUEVA CONTRASEÑA");
    }else{
      this.clienteService.updatePassword(id, oldPass, newPass).subscribe(
        {
          next: (response: any) => {
            this.exito(response.message)
          },
          error: (e) => {
            this.error("CONTRASEÑA ACTUAL INCORRECTA")
          }
        }
      );
    }
    
  }
  
}
