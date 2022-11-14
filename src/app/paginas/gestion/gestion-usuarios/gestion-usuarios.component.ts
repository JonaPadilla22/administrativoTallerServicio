import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ClienteService } from 'src/app/servicios/clientes/cliente.service';
import { lastValueFrom } from 'rxjs';
import { AlertsComponent } from 'src/app/components/alerts/alerts.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
    private formBuilder: FormBuilder
  ) {
    this.filter.valueChanges.subscribe((data) => {
      this.userToShow = this.filtrarUsers(data);
    });

    this.userForm = this.formBuilder.group({
      ID_TIPO_PERSONA: null,
      ID_TIPO_USUARIO: null,
      NOMBRE: '',
      TELEFONO: '',
      CORREO: '',
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

  handleEditUser(ev: any, user: any) {
    ev.preventDefault();
    this.usuarioSeleccionado = user;

    let temp = {
      ID_TIPO_PERSONA: user.TIPO_PERSONA.ID,
      ID_TIPO_USUARIO: user.TIPO_USUARIO.ID,
      NOMBRE: user.NOMBRE,
      TELEFONO: user.TELEFONO,
      CORREO: user.CORREO,
    };

    this.userForm = this.formBuilder.group(temp);
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
              ID_TIPO_PERSONA: null,
              ID_TIPO_USUARIO: null,
              NOMBRE: '',
              TELEFONO: '',
              CORREO: '',
            });
          }
        );
    }
  }

  handleSubmit() {
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
