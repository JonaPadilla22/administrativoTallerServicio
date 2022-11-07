import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../servicios/login/login.service';

@Component({
  selector: 'login-component',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  // loginForm = new FormGroup({
  //   CORREO: new FormControl(''),
  //   CONTRA: new FormControl(''),
  // });

  loginForm: any;

  response: string = '';

  constructor(
    private loginService: LoginService,
    private router: Router,
    private formBuilder: FormBuilder
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

    alert(correo + " " +contra);

    if (correo == '' || contra == '') {
      alert('Porfavor asegurese de introducir todos los campos requeridos');
      return;
    }

    this.loginService
      .validateLogin(this.loginForm.value)
      .subscribe((response: any) => {
        localStorage.setItem('TOKEN', response.TOKEN);
        this.router.navigate(['/cita']);
      });
  }
}
