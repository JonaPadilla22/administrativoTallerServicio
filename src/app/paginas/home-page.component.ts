import { AlertsComponent } from './../components/alerts/alerts.component';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Globals } from '../globals';
import Swal from 'sweetalert2'
import { environment } from 'src/environments/environment';
import { ClienteService } from '../servicios/clientes/cliente.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit {
  listaDeNavegacion: any;
  nombreUsuario: string = "";
  imagen: string = "";
  urlImagen: string = "";
  user: any = {};

  url = environment.baseUrlAPI;
  constructor(
    private router: Router,
    public globals: Globals,
    private alerts: AlertsComponent,
    public clienteService: ClienteService
  ) {
  
    this.listaDeNavegacion = [
      {
        nombre: 'DashBoard',
        icono: 'bx bxs-bar-chart-square',
        link: 'dashboard',
      },
      {
        nombre: 'Cita',
        icono: 'bx bxs-food-menu',
        link: '',
        children: [
          {
            nombre: 'Registrar Cita',
            link: 'cita/registrar',
          },
          {
            nombre: 'Consultar Cita',
            link: 'cita/pendientes',
          },
        ],
      },
      {
        nombre: 'Taller',
        icono: 'bx bxs-car-mechanic',
        children: [
          {
            nombre: 'Servicios Pendientes',
            link: 'taller/serviciosPendientes',
          },
          {
            nombre: 'Historial Servicio',
            link: 'taller/historialServicio',
          },
          {
            nombre: 'Ingreso Sin Cita',
            link: 'taller/ingresoSinCita',
          },
        ],
      },
      {
        nombre: 'Usuarios',
        icono: 'bx bxs-user-rectangle',
        link: 'usuarios',
      },
      {
        nombre: 'Refacciones',
        icono: 'bx bx-package',
        link: 'recursos',
      },
      {
        nombre: 'Mano De Obra',
        icono: 'bx bx-bulb',
        link: 'manoObra',
      },
    ];
  }

  async ngOnInit(){

    if (!localStorage.getItem('TOKEN')) this.router.navigate(['/']);
    this.user = await this.obtenerUsuario();
    this.globals.usuario = this.user[0];

    this.imagen = this.user[0].IMG;
    this.nombreUsuario = this.user[0].NOMBRE;

    if(this.imagen==null){
      this.imagen = "default.png";
    }
    this.urlImagen= this.url + "/usuarios/" + this.imagen;

  }

  async obtenerUsuario(){
    let servicioTemp = this.clienteService.getUsuarioToken(localStorage.getItem('TOKEN')!);
    return await lastValueFrom(servicioTemp); 
  }

  cerrarSesion() {
    this.alerts.confirmDialog('¿DESEA CERRAR SESIÓN?').then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('TOKEN');
        localStorage.removeItem('USUARIO');
        this.router.navigate(['/']);
      }
    });
  }

  async modalCambiarImg(){
    let result: any;
    let urlImage: any;

    const file: any = Swal.mixin({
      title: 'IMAGEN DE USUARIO',
      input: 'file',
      inputValue: result,
      html: 
      `    
        <img src="${this.url}/usuarios/${this.imagen}" alt="" width="250" height="250">
      `,
      confirmButtonText:
        'Previsualizar <i class="bx bx-check"></i>',
      inputAttributes: {
        'accept': 'image/*',
        'aria-label': 'Upload your profile picture'
      }
    })

    const confirm: any = Swal.mixin({
      title: 'Imagen',
      imageUrl: urlImage,
      imageAlt: 'Imagen previsualizada',
      showCancelButton: true,
      cancelButtonText: 'Regresar'
    })

    result = await file.fire({
    }) 
    
    if(result.value && result.isConfirmed){
      const reader = new FileReader()
      reader.readAsDataURL(result.value)
      reader.onload = async (e: any) => {
        await confirm.fire({
          title: '¿Desea actualizar su imagen de usuario a esta?',
          html: 
          `    
            <img src="${e.target.result}" alt="" width="250" height="250">
          `,
          imageAlt: 'The uploaded picture',
          showCancelButton: true,
          cancelButtonText: 'Regresar',
          confirmButtonText: 'Actualizar'
        }).then((res: any) => {
          if(!res.isConfirmed){
            this.modalCambiarImg();
          }else{
            //ACTUALIZAR IMAGEN
            const img = new FormData();
                  
            img.append("file", result.value);
            this.clienteService.updateImageUser(this.globals.usuario.ID, img).subscribe(
              {
                next: (response: any) => {
                  const url = URL.createObjectURL(result.value);
                  let imagenUsuario = <HTMLInputElement>document.getElementById("imagenUsuario");
                  imagenUsuario.src = url;
                  this.alerts.exito("IMAGEN ACTUALIZADA")
                },
                error: (e) => {
                  this.alerts.error("CONTRASEÑA ACTUAL INCORRECTA")
                }
              }
            );
          }
        });
      }
    }else{
      this.alerts.warning("IMAGEN NO SELECCIONADA");
      //this.modalCambiarImg();
    }
    
  }

  cambiarImg() {
    this.modalCambiarImg();
  }

  modalCambiarPass(){
    this.alerts.modalCambiarPass(this.user[0].ID);
  }
  
}
