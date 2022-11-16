import { ClienteService } from 'src/app/servicios/clientes/cliente.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../servicios/login/login.service';
import { Globals } from '../globals';
import { AlertsComponent } from '../components/alerts/alerts.component';
import { lastValueFrom } from 'rxjs';
@Component({
  selector: 'login-component',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: any;

  response: string = '';

  constructor(
    private loginService: LoginService,
    private router: Router,
    private formBuilder: FormBuilder, 
    public globals: Globals,
    private alerts: AlertsComponent,
    public clienteService: ClienteService
  ) {
    this.loginForm = this.formBuilder.group({
      CORREO: '',
      CONTRA: '',
    });
  }

  ngOnInit(): void {
    if (localStorage.getItem('TOKEN')) this.router.navigate(['/cita']);
  }

  async validarLogin() {
    let correo = this.loginForm.value.CORREO;
    let contra = this.loginForm.value.CONTRA;

    if (correo == '' || contra == '') {
      this.alerts.warning(
        'Porfavor asegurese de introducir todos los campos requeridos'
      );
      return;
    }

    this.loginService.validateLogin(this.loginForm.value).subscribe({
      next: async (v: any) => {
        if(v.USUARIO.TIPO_USUARIO.ID==4){
          this.alerts.error("PERMISOS INVÁLIDOS");
        }else{
          
          localStorage.setItem('TOKEN', v.TOKEN);

          //this.globals.usuario = await this.obtenerUsuario();
          this.globals.usuario = v.USUARIO;
          console.log(this.globals.usuario);
          localStorage.setItem("NOMBRE", this.globals.usuario.NOMBRE); 
          localStorage.setItem("IMAGEN", this.globals.usuario.IMG); 

          this.alerts.exito("BIENVENIDO "+v.USUARIO.NOMBRE);
          this.router.navigate(['/cita']);
        }
        // this.alerts.exito('BIENVENIDO ' + v.USUARIO.NOMBRE);
        // localStorage.setItem('TOKEN', v.TOKEN);
        // this.globals.usuario = v.USUARIO.ID;
        // this.router.navigate(['/cita']);
        // this.router.navigate(['/cita']);
      },
      error: (e) => this.alerts.error(e.error),
    });
  }

  async obtenerUsuario(){
    let servicioTemp = this.clienteService.getUsuarioToken();
    return await lastValueFrom(servicioTemp); 
  }

  
}
