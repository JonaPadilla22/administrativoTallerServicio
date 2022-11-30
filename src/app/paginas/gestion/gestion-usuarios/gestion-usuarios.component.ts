import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ClienteService } from 'src/app/servicios/clientes/cliente.service';
import { lastValueFrom } from 'rxjs';
import { AlertsComponent } from 'src/app/components/alerts/alerts.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Globals } from 'src/app/globals';

@Component({
  selector: 'app-gestion-usuarios',
  templateUrl: './gestion-usuarios.component.html',
  styleUrls: ['./gestion-usuarios.component.css'],
})
export class GestionUsuariosComponent implements OnInit {
  filter = new FormControl('', { nonNullable: true });

  page: any = 1;
  pageSize: any = 9;
  collectionSize: number = 0;

  userList: any[] = [];
  userToShow: any[] = [];

  modal_activo = false;

  usuarioSeleccionado: any;

  tipoPersonaList: any[] = [];
  tipoUsuarioList: any[] = [];

  userForm: any;
  constructor(
    private userService: ClienteService,
    private alertService: AlertsComponent,
    private modalUser: NgbModal,
    private formBuilder: FormBuilder,
    public globals: Globals
  ) {
    this.filter.valueChanges.subscribe((data) => {
      this.userToShow = this.filtrarUsers(data);
    });

    this.userForm = this.formBuilder.group({
      ID_TIPO_PERSONA: [null, [Validators.required]],
      ID_TIPO_USUARIO: [null, [Validators.required]],
      NOMBRE: ['', [Validators.required]],
      TELEFONO:  ['', [Validators.minLength(10), Validators.maxLength(10)]],
      CORREO: ['', [Validators.required, Validators.email]],
    });
  }

  async ngOnInit() {
    this.userList = await this.obtenerUsuarios();
    this.userToShow = this.userList;
    this.collectionSize = this.userList.length;
    this.tipoUsuarioList = await this.obtenerTipoUsuario();
    this.tipoPersonaList = await this.obtenerTipoPersona();
  }

  filtrarUsers(text: string) {
    return this.userList.filter((user: any) => {
      const term = text.toLowerCase();
      return (
        user.NOMBRE.toLowerCase().includes(term)
      );
    });
  }

  async obtenerUsuarios(): Promise<Array<any>> {
    let tempUsers = await lastValueFrom(this.userService.getUsuarios());
    return Object.values(tempUsers);
  }

  async obtenerTipoPersona(): Promise<Array<any>> {
    let temp = await lastValueFrom(this.userService.getTiposPersona());
    return Object.values(temp);
  }

  async obtenerTipoUsuario(): Promise<Array<any>> {
    let temp = await lastValueFrom(this.userService.getTiposUsuario());
    return Object.values(temp).filter((user) => user.ID_TIPO_USUARIO > 1);
  }

  obtenerEstilosUser(estatus: any) {
    if (estatus != 'A') {
      return 'inactivo';
    }
    return 'activo';
  }
  async actualizarTabla() {
    this.userList = await this.obtenerUsuarios();
    this.userToShow = this.userList;
  }

  actualizarEstatusUsr(user: any) {
    if(user.ID == this.globals.usuario.ID || user.TIPO_USUARIO.ID == 1 || user.TIPO_USUARIO.ID == 2){
      console.log(user)
      this.alertService.warning("ACCIÓN NO PERMITIDA")
    }else{
      let estatusTemp = {
        ESTATUS: user.ESTATUS == 'A' ? 'I' : 'A',
      };
      this.userService.updateUser(estatusTemp, user.ID).subscribe({
        next: (response: any) => {
          this.actualizarTabla();
        },
        error: (e) => this.alertService.error(e.error),
      });
    }
    
  }

  handleEditUser(ev: any, user: any) {
    ev.preventDefault();
    this.usuarioSeleccionado = user;

    this.userForm = this.formBuilder.group({
      ID_TIPO_PERSONA: [user.TIPO_PERSONA.ID, [Validators.required]],
      ID_TIPO_USUARIO: [user.TIPO_USUARIO.ID, [Validators.required]],
      NOMBRE: [user.NOMBRE, [Validators.required]],
      TELEFONO:  [user.TELEFONO, [Validators.minLength(10), Validators.maxLength(10)]],
      CORREO: [user.CORREO, [Validators.required, Validators.email]],
    });
  }

  delay(n: any) {
    return new Promise(function (resolve) {
      setTimeout(resolve, n * 1000);
    });
  }

  activarCards() {
    this.modal_activo = false;
  }

  async open(content: any) {
    if (this.modal_activo == false) {
      this.modal_activo = true;
      await this.delay(0.5);
      this.modalUser
        .open(content, {
          ariaLabelledBy: 'modal-basic-title',
          scrollable: true,
          size: 'lg',
        })
        .result.then(
          (result) => {},
          async (reason) => {
            this.activarCards();
            this.actualizarTabla();
            this.usuarioSeleccionado = null;
            
            this.userForm = this.formBuilder.group({
              ID_TIPO_PERSONA: [null, [Validators.required]],
              ID_TIPO_USUARIO: [null, [Validators.required]],
              NOMBRE: ['', [Validators.required]],
              TELEFONO:  ['', [Validators.minLength(10), Validators.maxLength(10)]],
              CORREO: ['', [Validators.required, Validators.email]],
            });
          }
        );
    }
  }

  validAlpha(e: any){
    if (!(e.keyCode == 32 ||
      (e.keyCode >= 65 && e.keyCode <= 90) ||
      (e.keyCode >= 97 && e.keyCode <= 122))){
      e.preventDefault();
    }
  }
  
  validNum(e: any){
    if ((e.keyCode < '48' || e.keyCode > '57') && e.keyCode != '8') {
      e.preventDefault();
    }
  }

  handleSubmit() {

    if(this.userForm.valid){
      if (this.usuarioSeleccionado) {
        this.userService
          .updateUser(this.userForm.value, this.usuarioSeleccionado.ID)
          .subscribe({
            next: (response: any) => {
              this.alertService.exito(response.message);
  
              setTimeout(() => {
                this.modalUser.dismissAll();
              });
            },
            error: (e) => this.alertService.error(e.error),
          });
        return;
      }
      
      this.userService.registrarUsuario(this.userForm.value).subscribe({
        next: (response: any) => {
          this.alertService.exito(response.message);
  
          setTimeout(() => {
            this.modalUser.dismissAll();
          });
        },
        error: (e) => this.alertService.error(e.error),
      });
    }  
  }
}
