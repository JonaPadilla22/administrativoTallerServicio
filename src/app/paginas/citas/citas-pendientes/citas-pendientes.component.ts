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

  filtros = [
    {
      title: 'Por ingresar',
    },
    {
      title: 'Por asignar',
    },
  ];

  tipoFiltro: any;

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
    if (this.arrayCitas.length == 0) {
      this.alertService.warning('NO HAY CITAS PENDIENTES');
    }
    this.collectionSize = this.arrayCitas.length;
    this.estatus = await this.obtenerEstatus();
    this.citasMostrar = this.arrayCitas;
    this.page = 1;
    this.tecnicos = await this.obtenerTecnicos();
    this.mostrarTecnicos = this.tecnicos;
    this.collectionSizeTechnicial = this.tecnicos.length;
  }

  async obtenerCitasPendientes(): Promise<any> {
    let citaTemp: any = await lastValueFrom(
      this.citaService.getCitasPendientes()
    );
    citaTemp = Object.values(citaTemp);
    // console.log(this.globals.usuario)
    if (this.globals.usuario.TIPO_USUARIO.ID == 3) {
      citaTemp = citaTemp.filter((cita: any) => cita.TECNICO_ENCARGADO != null);
      citaTemp = citaTemp.filter(
        (cita: any) => cita.TECNICO_ENCARGADO.ID == this.globals.usuario.ID
      );
    }

    return citaTemp;
  }

  async obtenerTecnicos(): Promise<any> {
    let usersTemp: any = await lastValueFrom(this.userService.getUsuarios());
    let users = Object.values(usersTemp);

    return users.filter((user: any) => user.TIPO_USUARIO.ID == 3);
  }

  async filtrarSelect(selected: any) {
    //FIXME: no hacer fetch a base de datos simplemente usar otro array
    this.arrayCitas = await this.obtenerCitasPendientes();

    if (selected == 0) {  
      if (this.arrayCitas.length == 0) {
        this.alertService.warning('NO HAY CITAS PENDIENTES');
      }
    } else if (selected == 1) {
      this.arrayCitas = this.arrayCitas.filter((cita)=>cita.TECNICO_ENCARGADO);
    } else {
      this.arrayCitas = this.arrayCitas.filter((cita)=>!cita.TECNICO_ENCARGADO);
    }

    this.collectionSize = this.arrayCitas.length;
    this.citasMostrar = this.arrayCitas;

  }

  filtrarServ(text: string) {
    return this.arrayCitas.filter((cita: any) => {
      const term = text.toLowerCase();

      const fecha = new Date(cita.FECHA_CITA).toLocaleDateString('es-mx');

      return (
        cita.VEHICULO.MATRICULA.toLowerCase().includes(term) ||
        cita.CLIENTE.NOMBRE.toLowerCase().includes(term) ||
        fecha.toLowerCase().includes(term) ||
        cita.TECNICO_ENCARGADO?.NOMBRE.toLowerCase().includes(term)
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
    // console.log(cita);
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

    if(this.validDate()){
      const formIngreso = new FormData();
      formIngreso.append('ID_SERVICIO', this.citaSeleccionada.ID_SERVICIO);
      formIngreso.append('MATRICULA', this.citaSeleccionada.VEHICULO.MATRICULA);
      formIngreso.append('ID_ESTATUS', 'I');
      formIngreso.append('ID_USUARIO', this.globals.usuario.ID);

      this.servService.actualizarEstatus(formIngreso).subscribe({
        next: (response: any) => {
          if(response.data){
            this.alertService.exito(response.message);

            var title = 'ACTUALIZACIÓN DE SERVICIO';
            var body =
              'HOLA ' +
              this.citaSeleccionada.CLIENTE.NOMBRE +
              ', SU VEHÍCULO ' +
              this.citaSeleccionada.VEHICULO.MODELO.MARCA.DESCRIPCION +
              ' ' +
              this.citaSeleccionada.VEHICULO.MODELO.DESCRIPCION +
              ' CON MATRÍCULA: ' +
              this.citaSeleccionada.VEHICULO.MATRICULA +
              ' ACABA DE INGRESAR A TALLER';
            this.notifService
              .sendNotificationUser(
                this.citaSeleccionada.CLIENTE.ID,
                title,
                body,
                this.citaSeleccionada.ID_SERVICIO
              )
              .subscribe();
  
            this.actualizarTabla();
            setTimeout(() => {
              this.modalCitas.dismissAll();
            }, 1000);
          }else{
            this.alertService.warning(response.message)
          }
          
        },
        error: (e) => {
          console.log(e)
          this.alertService.error(e.error)
        },
      });

      this.actualizarTabla();
    }else{
      this.alertService.warning("AÚN NO ES LA FECHA DE CITA DEL SERVICIO SELECCIONADO")
    }

  
    
  }

  validDate(): boolean{
    var isValid = true;
    var fecha_aux: any = this.citaSeleccionada.FECHA_CITA.split("T")[0].split("-");

    var Hoy = new Date();
    
    var AnyoFecha = fecha_aux[0]
    var MesFecha = fecha_aux[1]
    var DiaFecha = fecha_aux[2]
  
    var AnyoHoy = Hoy.getFullYear();
    var MesHoy = Hoy.getMonth()+1;
    var DiaHoy = Hoy.getDate();

    if (AnyoFecha < AnyoHoy){
      return isValid
    }
    else{
      if (AnyoFecha == AnyoHoy && MesFecha < MesHoy){
        return isValid
      }
      else{
        if (AnyoFecha == AnyoHoy && MesFecha == MesHoy && DiaFecha < DiaHoy){
          return isValid
        }
        else{
            if (AnyoFecha == AnyoHoy && MesFecha == MesHoy && DiaFecha == DiaHoy){
              return isValid
            }
            else{
              isValid = false
              return isValid
            }
        }
      }
    }
  }
}
