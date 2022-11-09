
import { Component, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { ServicioService } from './../../../servicios/servicios/servicio.service';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertsComponent } from 'src/app/components/alerts/alerts.component';

@Component({
  selector: 'app-servicios-pendientes',
  templateUrl: './servicios-pendientes.component.html',
  styleUrls: ['./servicios-pendientes.component.css']
})
export class ServiciosPendientesComponent implements OnInit {
  servicios: any;
  estatus: any;
  baseUrl: string = environment.baseUrlAPI;
  img_tecnico: string = "default.png";

  servicio: any = [];
  detalleServicio: any;
  sig_estatus: any;

  constructor(
    private servService: ServicioService,
    private modalService: NgbModal,
    public alertService: AlertsComponent
  ) 
  { 

  }

  async ngOnInit() {
    this.servicios = await this.obtenerServicios();
    this.estatus = await this.obtenerEstatus();
  }

  delay(n: any){
    return new Promise(function(resolve){
        setTimeout(resolve,n*1000);
    });
  }

  async open(content: any){
    await this.delay(0.5);
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' , scrollable: true, size: 'lg'})  	
  }

  async obtenerServicios(){
    let servTemp = this.servService.getServiciosPendientes();
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

  async abrirModal(id: any){
    const resultado = this.servicios.find( (serv: any) => serv.ID_SERVICIO === id);
    this.servicio = [];
    this.servicio.push(resultado);

    this.detalleServicio = await this.obtenerDetalleServicio(id);
    this.sig_estatus = this.getSigEstatus(this.servicio[0].ESTATUS.ID_ESTATUS);
  }

  actualizarEstatus(){

    let id_tecn = "2";

    if(id_tecn!=this.servicio[0].TECNICO_ENCARGADO.ID){
      this.alertService.warning("SÓLO EL TÉCNICO ENCARGADO PUEDE ACTUALIZAR EL SERVICIO");
    }else{
      this.alertService.confirmDialog("¿DESEA ACTUALIZAR EL ESTATUS DEL SERVICIO A \""+this.sig_estatus.DESCRIPCION+ "\"?").then((result) => {
        if (result.isConfirmed) {
          this.alertService.exito("ACTUALIZADO CON ÉXITO");
        }
      });
    }

    // this.alertService.errorAlert("ERROR AL ACTUALIZAR ESTATUS");

    // this.alertService.alertWithSuccess();
  }

  getSigEstatus(id_est: string): any{
    const resultado = this.estatus.find( (est: any) => est.ID_ESTATUS === id_est);
    let sig_id = this.estatus.indexOf(resultado) + 1;

    return this.estatus[sig_id];
  }
}
