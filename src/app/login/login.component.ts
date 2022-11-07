import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../servicios/login/login.service';

@Component({
  selector: 'login-component',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    CORREO: new FormControl(''),
    CONTRA: new FormControl(''),
  });

  response: string = '';

  constructor(private loginService: LoginService, private router: Router) {}

  ngOnInit(): void {
    if (localStorage.getItem('TOKEN')) this.router.navigate(['/cita']);
  }

  async validarLogin() {
    let correo = this.loginForm.value.CORREO;
    let contra = this.loginForm.value.CONTRA;

    if (correo == '' || contra == '') {
      alert('Porfavor asegurese de introducir todos los campos requeridos');
      return;
    }

    this.loginService.validateLogin(this.loginForm.value).subscribe(
      (response: any) => {
        localStorage.setItem('TOKEN', response.TOKEN);
        this.router.navigate(['/cita']);
      }
    );
  }
}
