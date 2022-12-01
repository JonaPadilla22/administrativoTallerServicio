import { Component, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { ServicioService } from './../../../servicios/servicios/servicio.service';
import { NotificacionService } from 'src/app/servicios/notificaciones/notificacion.service';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertsComponent } from 'src/app/components/alerts/alerts.component';
import { Globals } from 'src/app/globals';
import { RefaccionService } from 'src/app/servicios/refacciones/refaccion.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-servicios-pendientes',
  templateUrl: './servicios-pendientes.component.html',
  styleUrls: ['./servicios-pendientes.component.css'],
})
export class ServiciosPendientesComponent implements OnInit {
  servicios: any[] = [];
  servicios$: any[] = [];

  estatus: any;
  baseUrl: string = environment.baseUrlAPI;
  img_tecnico: string = 'default.png';
  img_card: string = '';

  servicio: any = [];
  detalleServicio: any;
  sig_estatus: any;
  closeResult = '';
  modal_activo = false;
  total: any = 0;

  page: any;
  pageSize: any = 6;

  filter: any;

  //agregar mano de obra o refaccion
  //obtenerlas servicios
  //mostrarlas
  //filtrarlas
  //ir agregando

  refacciones: any[] = [];
  mostrarRefacciones: any[] = [];

  agregar = false;
  pageRef: any;
  pageSizeRef: any = 4;
  filterRef = new FormControl('', { nonNullable: true });
  productosCargados: any[] = [];

  constructor(
    private servService: ServicioService,
    private notifService: NotificacionService,
    private modalService: NgbModal,
    public alertService: AlertsComponent,
    private globals: Globals,
    private refactionService: RefaccionService
  ) {
    this.servicios$ = this.filtrarServ('');
    this.filterRef.valueChanges.subscribe((data) => {
      this.mostrarRefacciones = this.filtrarRefaccion(data);
    });
  }

  filtrarRefaccion(text: string) {
    return this.refacciones.filter((refaccion: any) => {
      const term = text.toLowerCase();
      return refaccion.DESCRIPCION.toLowerCase().includes(term);
    });
  }

  async ngOnInit() {
    this.servicios = await this.obtenerServicios();
    if (this.servicios.length == 0) {
      this.alertService.warning('NO HAY SERVICIOS PENDIENTES');
    }
    this.estatus = await this.obtenerEstatus();
    this.page = 1;
    this.pageRef = 1;
    this.servicios$ = this.filtrarServ('');
    this.refacciones = await this.getRefactions();
    this.mostrarRefacciones = this.refacciones;
  }

  delay(n: any) {
    return new Promise(function (resolve) {
      setTimeout(resolve, n * 1000);
    });
  }

  async open(content: any) {
    if (this.modal_activo == false) {
      this.modal_activo = true;
      await this.delay(0.5);
      this.modalService
        .open(content, {
          ariaLabelledBy: 'modal-basic-title',
          scrollable: true,
          size: 'lg',
        })
        .result.then(
          (result) => {},
          async (reason) => {
            this.activarCards();
            this.servicios = await this.obtenerServicios();
            if (
              (<HTMLInputElement>(
                document.getElementById('table-filtering-search')
              )).value != ''
            ) {
              this.servicios$ = this.filtrarServ(
                (<HTMLInputElement>(
                  document.getElementById('table-filtering-search')
                )).value.trim()
              );
            } else {
              this.servicios$ = this.servicios;
            }
          }
        );
    }
  }

  async getRefactions(): Promise<Array<any>> {
    let tempArr1 = lastValueFrom(this.refactionService.getRefactions());
    let tempArr2 = lastValueFrom(this.refactionService.getWorkforce());

    let resul = Object.values(await tempArr1);

    resul = resul.concat(Object.values(await tempArr2));
    console.log(resul);
    return Object.values(resul);
  }

  activarCards() {
    this.modal_activo = false;
  }

  async obtenerServicios(): Promise<any> {
    let servTemp = this.servService.getServiciosPendientes();
    return await lastValueFrom(servTemp);
  }

  async obtenerEstatus() {
    let estTemp = this.servService.getEstatus();
    return await lastValueFrom(estTemp);
  }

  async obtenerDetalleServicio(id: string) {
    let detTemp = this.servService.getDetalleServicio(id);
    return await lastValueFrom(detTemp);
  }

  async abrirModal(id: any) {
    const resultado = this.servicios.find(
      (serv: any) => serv.ID_SERVICIO === id
    );
    this.servicio = [];
    this.servicio.push(resultado);
    console.log(this.servicio);
    this.detalleServicio = await this.obtenerDetalleServicio(id);
    this.sig_estatus = this.getSigEstatus(this.servicio[0].ESTATUS.ID_ESTATUS);
    this.calcularTotalServicio();
  }

  actualizarEstatus() {
    if (
      this.globals.usuario.ID != this.servicio[0].TECNICO_ENCARGADO.ID &&
      this.globals.usuario.TIPO_USUARIO.ID == 3
    ) {
      this.alertService.warning(
        'SÓLO EL TÉCNICO ENCARGADO PUEDE ACTUALIZAR EL SERVICIO'
      );
    } else {
      this.alertService
        .confirmDialog(
          '¿DESEA ACTUALIZAR EL ESTATUS DEL SERVICIO A "' +
            this.sig_estatus.DESCRIPCION +
            '"?'
        )
        .then((result) => {
          if (result.isConfirmed) {
            const formActServ = new FormData();
            formActServ.append('ID_SERVICIO', this.servicio[0].ID_SERVICIO);
            formActServ.append('ID_ESTATUS', this.sig_estatus.ID_ESTATUS);
            formActServ.append('ID_USUARIO', this.globals.usuario.ID);

            this.servService.actualizarEstatus(formActServ).subscribe({
              next: (response: any) => {
                this.alertService.exito(response.message);

                var nom_cliente = this.servicio[0].CLIENTE.NOMBRE;
                var veh =
                  this.servicio[0].VEHICULO.MODELO.MARCA.DESCRIPCION +
                  ' ' +
                  this.servicio[0].VEHICULO.MODELO.DESCRIPCION;
                var mat = this.servicio[0].VEHICULO.MATRICULA;
                var title = 'ACTUALIZACIÓN DE SERVICIO';

                var body =
                  'HOLA ' +
                  nom_cliente +
                  ', SU VEHÍCULO ' +
                  veh +
                  ' CON MATRÍCULA: ' +
                  mat;
                if (this.sig_estatus.ID_ESTATUS == 'I') {
                  body += ' ACABA DE INGRESAR A TALLER';
                } else if (this.sig_estatus.ID_ESTATUS == 'R') {
                  body += ' ACABA DE ENTRAR EN REVISIÓN';
                } else if (this.sig_estatus.ID_ESTATUS == 'S') {
                  body += ' ACABA DE ENTRAR EN SALIDA';
                } else if (this.sig_estatus.ID_ESTATUS == 'T') {
                  body += ' ACABA DE SALIR DE TALLER';
                }

                this.notifService
                  .sendNotificationUser(
                    this.servicio[0].CLIENTE.ID,
                    title,
                    body,
                    this.servicio[0].ID_SERVICIO
                  )
                  .subscribe();

                this.modalService.dismissAll();
              },
              error: (e) => this.alertService.error(e.error),
            });
          }
        });
    }
  }

  getSigEstatus(id_est: string): any {
    const resultado = this.estatus.find(
      (est: any) => est.ID_ESTATUS === id_est
    );
    let sig_id = this.estatus.indexOf(resultado) + 1;

    return this.estatus[sig_id];
  }

  calcularTotalServicio() {
    this.total = 0;
    for (var k = 0; k < this.detalleServicio.length; k++) {
      this.total +=
        parseFloat(this.detalleServicio[k].PRECIO) *
        parseFloat(this.detalleServicio[k].CANTIDAD);
    }
  }

  search(e: any) {
    let text = e.target.value;
    this.servicios$ = this.filtrarServ(text.trim());
  }

  filtrarServ(text: string) {
    return this.servicios.filter((serv: any) => {
      const term = text.toLowerCase();
      return (
        serv.VEHICULO.MATRICULA.toLowerCase().includes(term) ||
        serv.ESTATUS.DESCRIPCION.toLowerCase().includes(term) ||
        serv.CLIENTE.NOMBRE.toLowerCase().includes(term) ||
        serv.TECNICO_ENCARGADO.NOMBRE.toLowerCase().includes(term) ||
        (
          serv.VEHICULO.MODELO.MARCA.DESCRIPCION.toLowerCase() +
          ' ' +
          serv.VEHICULO.MODELO.DESCRIPCION.toLowerCase() +
          ' ' +
          serv.VEHICULO.COLOR.toLowerCase() +
          ' ' +
          serv.VEHICULO.ANIO.toLowerCase()
        ).includes(term)
      );
    });
  }

  agregarProductos(prod: any) {
    if (this.productosCargados.find((prd: any) => prd.ID == prod.ID)) {
      this.alertService.warning('Ya existe ese producto en lista por agregar');
      return;
    }

    if (prod.STOCK && prod.STOCK < 1) {
      this.alertService.warning('Insuficiente existencia');
    }

    prod.CANTIDAD = 1;
    this.productosCargados.push(prod);
  }

  handleChangeInputCantidadProd(ev: any, prod: any) {
    if (!ev.target.value.match(/^\d+$/)) {
      this.alertService.warning('Asegurate de introducir bien la cantidad');
      ev.target.value = prod.CANTIDAD;
    }

    if (prod.STOCK && prod.STOCK < ev.target.value) {
      this.alertService.warning('Insuficiente existencia');
      ev.target.value = prod.CANTIDAD;
    }

    this.productosCargados.map((item) => {
      if (item.ID == prod.ID) {
        item.CANTIDAD = ev.target.value;
      }
    });
  }

  async handleSubmitCargarProductos() {
    const resp = await this.alertService.confirmDialog(
      '¿Esta seguro desea agregar estos productos al servicio?'
    );

    if (resp.value != true) {
      return;
    }

    this.productosCargados.forEach((prod: any, index: any) => {
      let id_prod: number = prod.ID ?? prod.ID_MANO_OBRA;
      let tipo_prod: string = prod.ID ? 'R' : 'M';

      const formAct = new FormData();
      formAct.append('ID_SERVICIO', this.servicio[0].ID_SERVICIO);
      formAct.append('ID_PRODUCTO', id_prod.toString());
      formAct.append('TIPO_PROD', tipo_prod);
      formAct.append('PRECIO', prod.PRECIO);
      formAct.append('CANTIDAD', prod.CANTIDAD ?? 1);

      this.servService.insertarDetalleServ(formAct).subscribe({
        next: async (response: any) => {
          this.detalleServicio = await this.servService
            .getDetalleServicio(this.servicio[0].ID_SERVICIO)
            .toPromise();
          this.calcularTotalServicio();

          this.refacciones = await this.getRefactions();
          this.mostrarRefacciones = this.refacciones;
          this.productosCargados = [];
          this.agregar = !this.agregar
        },
        error: async (e: any) => {
          // console.log(e);
          this.alertService.error('ERROR AL AGREGAR EL PRODUCTO');
        },
      });
    });
  }
}
