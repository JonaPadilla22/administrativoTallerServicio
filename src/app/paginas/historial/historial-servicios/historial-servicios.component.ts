
import { Component, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { ServicioService } from './../../../servicios/servicios/servicio.service';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertsComponent } from 'src/app/components/alerts/alerts.component';

@Component({
  selector: 'app-historial-servicios',
  templateUrl: './historial-servicios.component.html',
  styleUrls: ['./historial-servicios.component.css']
})
export class HistorialServiciosComponent implements OnInit {

  servicios: any[] = [];
  servicios$: any[] = [];

  estatus: any;
  baseUrl: string = environment.baseUrlAPI;
  img_tecnico: string = "default.png";
  img_card: string = "";

  servicio: any = [];
  detalleServicio: any;
  actualizaciones_servicio: any = [];
  sig_estatus: any;
  closeResult = '';
  modal_activo = false;
  total: any = 0;

  page: any;
  pageSize: any = 6;

  filter: any;

  constructor(
    private servService: ServicioService,
    private modalService: NgbModal,
    public alertService: AlertsComponent
  ) 
  { 
    this.servicios$ = this.filtrarServ("");
  }

  async ngOnInit() {
    this.servicios = await this.obtenerServicios();
    if(this.servicios.length==0){
      this.alertService.warning("NO HAY SERVICIOS TERMINADOS");
    }
    this.estatus = await this.obtenerEstatus();
    this.page = 1;
    this.servicios$ = this.filtrarServ("");
  }

  delay(n: any){
    return new Promise(function(resolve){
        setTimeout(resolve,n*1000);
    });
  }

  async open(content: any){
    if(this.modal_activo==false){
      this.modal_activo=true;
      await this.delay(0.5);    
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' , scrollable: true, size: 'lg'}).result.then(
        (result) => {
        },
        async (reason) => {
          this.activarCards();
        },
      );
    }
    
  }

  activarCards(){
    this.modal_activo=false;
  }

  async obtenerServicios(): Promise<any>{
    let servTemp = this.servService.getServiciosTerminados();
    return await lastValueFrom(servTemp); 
  }

  async obtenerEstatus(){
    let estTemp = this.servService.getEstatus();
    return await lastValueFrom(estTemp); 
  }

  async obtenerDetalleServicio(id: string){
    let detTemp = this.servService.getDetalleServicio(id);
    return await lastValueFrom(detTemp); 
  }

  async obtenerActualizacionesServicio(id: string){
    let detTemp = this.servService.getActualizacionesServicios(id);
    return await lastValueFrom(detTemp); 
  }

  async abrirModal(id: any){
    const resultado = this.servicios.find( (serv: any) => serv.ID_SERVICIO === id);
    this.servicio = [];
    this.servicio.push(resultado);

    this.detalleServicio = await this.obtenerDetalleServicio(id);
    this.actualizaciones_servicio = await this.obtenerActualizacionesServicio(id);
    console.log(this.actualizaciones_servicio);
    this.calcularTotalServicio();
  }

  calcularTotalServicio(){
    this.total = 0;
    for(var k = 0; k<this.detalleServicio.length; k++){
      this.total += parseFloat(this.detalleServicio[k].PRECIO) * parseFloat(this.detalleServicio[k].CANTIDAD)
    }
  }

  search(e: any) {
    let text = e.target.value;
    this.servicios$ = this.filtrarServ(text.trim());
  }

  filtrarServ(text: string){
    return this.servicios.filter((serv: any) => {
      const term = text.toLowerCase();
      return (
        serv.VEHICULO.MATRICULA.toLowerCase().includes(term) ||
        serv.CLIENTE.NOMBRE.toLowerCase().includes(term) ||
        serv.TECNICO_ENCARGADO.NOMBRE.toLowerCase().includes(term) ||
        (serv.VEHICULO.MODELO.MARCA.DESCRIPCION.toLowerCase()+ " " +serv.VEHICULO.MODELO.DESCRIPCION.toLowerCase() + " " + serv.VEHICULO.COLOR.toLowerCase() + " " + serv.VEHICULO.ANIO.toLowerCase()).includes(term)
      );
    });
  }
}
