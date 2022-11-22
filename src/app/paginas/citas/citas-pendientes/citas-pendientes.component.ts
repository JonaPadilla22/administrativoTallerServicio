import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CitaService } from 'src/app/servicios/citas/cita.service';
import { NotificacionService } from 'src/app/servicios/notificaciones/notificacion.service';
import { lastValueFrom } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClienteService } from 'src/app/servicios/clientes/cliente.service';
import { environment } from 'src/environments/environment';
import { AlertsComponent } from 'src/app/components/alerts/alerts.component';
import { ServicioService } from 'src/app/servicios/servicios/servicio.service';
import { Globals } from 'src/app/globals';

@Component({
  selector: 'app-citas-pendientes',
  templateUrl: './citas-pendientes.component.html',
  styleUrls: ['./citas-pendientes.component.css'],
})
export class CitasPendientesComponent implements OnInit {
  page: any;
  pageSize: any = 9;
  collectionSize: number = 0;

  pageTechnicial: any = 1;
  pageSizeTechnicial: any = 3;
  collectionSizeTechnicial: number = 0;

  filter = new FormControl('', { nonNullable: true });
  filterTecnicos = new FormControl('', { nonNullable: true });

  baseUrl: string = environment.baseUrlAPI;

  arrayCitas: any[] = [];
  citasMostrar: any[] = [];

  citaSeleccionada: any;
  
  modal_activo = false;

  tecnicos: any[] = [];
  mostrarTecnicos: any[] = [];
  sig_estatus: any;
  estatus: any;

  constructor(
    private citaService: CitaService,
    private modalCitas: NgbModal,
    private alertService: AlertsComponent,
    private userService: ClienteService,
    private servService: ServicioService,
    private notifService: NotificacionService,
    private globals: Globals
  ) {
    this.arrayCitas = [];
    this.filter.valueChanges.subscribe((data) => {
      this.citasMostrar = this.filtrarServ(data);
    });
    this.filterTecnicos.valueChanges.subscribe((data) => {
      this.mostrarTecnicos = this.filtrarTecnico(data);
    });
  }

  async ngOnInit() {
    this.arrayCitas = await this.obtenerCitasPendientes();
    this.collectionSize = this.arrayCitas.length;
    this.estatus = await this.obtenerEstatus();
    this.citasMostrar = this.arrayCitas;
    this.page = 1;
    this.tecnicos = await this.obtenerTecnicos();
    this.mostrarTecnicos = this.tecnicos;
    this.collectionSizeTechnicial = this.tecnicos.length;
  }

  async obtenerCitasPendientes(): Promise<any> {
    let citaTemp = this.citaService.getCitasPendientes();
    return await lastValueFrom(citaTemp);
  }

  async obtenerTecnicos(): Promise<any> {
    let usersTemp = await lastValueFrom(this.userService.getUsuarios());
    let users = Object.values(usersTemp);

    return users.filter((user) => user.TIPO_USUARIO.ID == 3);
  }

  filtrarServ(text: string) {
    return this.arrayCitas.filter((cita: any) => {
      const term = text.toLowerCase();
      return (
        cita.VEHICULO.MATRICULA.toLowerCase().includes(term) ||
        cita.CLIENTE.NOMBRE.toLowerCase().includes(term)
      );
    });
  }

  filtrarTecnico(text: string) {
    return this.tecnicos.filter((tecnico: any) => {
      const term = text.toLowerCase();
      return tecnico.NOMBRE.toLowerCase().includes(term);
    });
  }

  async handleAccionClick(ev: any, cita: any) {
    ev.preventDefault();
    this.citaSeleccionada = cita;
    console.log(cita);
  }

  delay(n: any) {
    return new Promise(function (resolve) {
      setTimeout(resolve, n * 1000);
    });
  }

  async open(content: any) {
    if (this.modal_activo == false) {
      this.pageTechnicial = 1;
      this.modal_activo = true;
      await this.delay(0.5);
      this.modalCitas
        .open(content, {
          ariaLabelledBy: 'modal-basic-title',
          scrollable: true,
          size: 'lg',
        })
        .result.then(
          (result) => {},
          async (reason) => {
            this.activarCards();
            this.arrayCitas = await this.obtenerCitasPendientes();
          }
        );
    }
  }

  activarCards() {
    this.modal_activo = false;
  }

  async actualizarTabla() {
    this.arrayCitas = await this.obtenerCitasPendientes();
    this.citasMostrar = this.arrayCitas;
  }

  async handleClickTecnico(ev: any, tecnico: any) {
    ev.preventDefault();
    let data = {
      TECNICO_ENCARGADO: tecnico.ID,
    };
    this.citaService
      .actualizarCita(data, this.citaSeleccionada.ID_SERVICIO)
      .subscribe((response: any) => {
        this.alertService.exito(response.message);
        this.actualizarTabla();
        setTimeout(() => {
          this.modalCitas.dismissAll();
        }, 1000);
        // this.limpiar();
      });
  }

  getSigEstatus(id_est: string): any {
    const resultado = this.estatus.find(
      (est: any) => est.ID_ESTATUS === id_est
    );
    let sig_id = this.estatus.indexOf(resultado) + 1;

    return this.estatus[sig_id];
  }

  async obtenerEstatus() {
    let estTemp = this.servService.getEstatus();
    return await lastValueFrom(estTemp);
  }

  handleClickIngreso() {
    const formIngreso = new FormData();
    formIngreso.append('ID_SERVICIO', this.citaSeleccionada.ID_SERVICIO);
    
    //this.sig_estatus = this.getSigEstatus(this.citaSeleccionada.ID_ESTATUS);
    formIngreso.append('ID_ESTATUS', "I");
    formIngreso.append('ID_USUARIO', this.globals.usuario.ID);
    
    this.servService.actualizarEstatus(formIngreso).subscribe(
      {
        next: (response: any) => {
          this.alertService.exito(response.message);

          var title = "ACTUALIZACIÓN DE SERVICIO";
          var body = "HOLA " + this.citaSeleccionada.CLIENTE.NOMBRE + ", SU VEHÍCULO " + this.citaSeleccionada.VEHICULO.MODELO.MARCA.DESCRIPCION + " " + this.citaSeleccionada.VEHICULO.MODELO.DESCRIPCION + " CON MATRÍCULA: " + this.citaSeleccionada.VEHICULO.MATRICULA + " ACABA DE INGRESAR A TALLER";
          this.notifService.sendNotificationUser(this.citaSeleccionada.CLIENTE.ID, title, body).subscribe();

          this.actualizarTabla();
          setTimeout(() => {
            this.modalCitas.dismissAll();
          }, 1000);
        },
        error: (e) => this.alertService.error(e.error)
      }
    )
  }
}
