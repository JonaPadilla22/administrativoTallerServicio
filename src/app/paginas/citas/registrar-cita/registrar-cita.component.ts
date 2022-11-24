
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { CitaService } from './../../../servicios/citas/cita.service';
import { VehiculoService } from './../../../servicios/vehiculos/vehiculo.service';
import { ClienteService } from './../../../servicios/clientes/cliente.service';
import { NotificacionService } from 'src/app/servicios/notificaciones/notificacion.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertsComponent } from 'src/app/components/alerts/alerts.component';
import { Globals } from 'src/app/globals';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import {
  NgxQrcodeElementTypes,
  NgxQrcodeErrorCorrectionLevels
} from "@techiediaries/ngx-qrcode";

@Component({
  selector: 'app-registrar-cita',
  templateUrl: './registrar-cita.component.html',
  styleUrls: ['./registrar-cita.component.css']
})
export class RegistrarCitaComponent implements OnInit {
  public formRegistrarCita: FormGroup;
  public formRegistrarVehiculo: FormGroup;
  public formRegistrarCliente: FormGroup;
  tiposServ: any;
  tiposPers: any;
  marcas: any;
  modelos: any = [];

  vehiculos: any[] = [];
  vehiculos$: any = [];
  clientes: any = [];

  matricula: any = "";
  id_cliente: string = "";

  modeloVeh: string = "";
  matriculaVeh: string = "";
  anhoVeh: string = "";
  vinVeh: string = "";
  colorVeh: string = "";

  nombreCliente: string = "";
  rfcCliente: string = "";
  correoCliente: string = "";
  telefCliente: string = "";

  date = new Date();
  fecha: any;
  time: any;

  tipoElemento = NgxQrcodeElementTypes.IMG;
  valor: string = "";
  
  formatterVeh = (x: any) => {this.buscadorVeh(x)};
  formatterClientes = (x: any) => {
    this.buscadorCliente(x); 
  };
  constructor(
      private formBuilder: FormBuilder, 
      private citaService: CitaService,
      private vehService: VehiculoService,
      private clienteService: ClienteService,
      private notifService: NotificacionService,
      private modalService: NgbModal,
      public alertService: AlertsComponent,
      private globals: Globals
    ) 
    { 
      this.formRegistrarCita = this.formBuilder.group({
        DESCRIPCION: ['',
          [
            Validators.required
          ]
        ],
        ID_TIPO_SERVICIO: '',
        MATRICULA: '',
        CLIENTE: '',
        FECHA_CITA: ''
      });

      this.formRegistrarVehiculo = this.formBuilder.group({
        ID_CLIENTE: '',
        ID_MARCA: '',
        ID_MODELO: [{value: '', disabled: true},
         [Validators.required]
        ],
        MATRICULA: ['',
          [Validators.required, Validators.maxLength(7), Validators.minLength(7)]
        ],
        ANIO: [this.date.getFullYear(),
          [Validators.minLength(4), Validators.maxLength(4), Validators.min(1990), Validators.max(this.date.getFullYear()+1)]
        ],
        COLOR: ['',
          [Validators.required] 
        ],
        VIN: ['',
          [Validators.minLength(17), Validators.maxLength(17)]
        ],
      });

      this.formRegistrarCliente = this.formBuilder.group({
        ID_TIPO_USUARIO: '',
        ID_TIPO_PERSONA: ['',
          [Validators.required] 
        ],
        NOMBRE: ['',
          [Validators.required] 
        ],
        CORREO: ['',
          [Validators.required, Validators.email]
        ],
        RFC: ['',
          [Validators.minLength(12), Validators.maxLength(13)]
        ],
        TELEFONO: ['',
          [Validators.minLength(10), Validators.maxLength(10)]
        ],
        DIRECCION: ['']
      });

      this.fecha = { day: this.date.getUTCDay()-1, month: this.date.getUTCMonth()+1, year: this.date.getUTCFullYear()};
      this.time = { hour: this.date.getHours, minute: 0};

      
    }

  async ngOnInit() {
    this.tiposServ = await this.obtenerTiposServ();
    this.vehiculos = await this.obtenerVehiculos();
    this.clientes = await this.obtenerClientes();
    this.tiposPers = await this.obtenerTiposPers();
    this.marcas = await this.obtenerMarcas();
    this.vehiculos$ = this.vehiculos;   
  }

  async obtenerUsuario(){
    let servicioTemp = this.clienteService.getUsuarioToken();
    return await lastValueFrom(servicioTemp); 
  }

  open(content: any) {
    if(content._declarationTContainer.localNames[0]=="modalVeh" && this.id_cliente == ""){
      this.alertService.warning("DEBE SELECCIONAR UN CLIENTE PARA REGISTRAR UN VEHÍCULO");
    }else{
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
    }		
	}

  async obtenerTiposServ(){
    let servicioTemp = this.citaService.getTiposServicios();
    return await lastValueFrom(servicioTemp); 
  }

  async obtenerTiposPers(){
    let pTemp = this.citaService.getTiposPersona();
    return await lastValueFrom(pTemp); 
  }

  async obtenerMarcas(){
    let mTemp = this.citaService.getMarcas();
    return await lastValueFrom(mTemp); 
  }

  async obtenerModelos(id: string){
    let mTemp = this.citaService.getModelos(id);
    return await lastValueFrom(mTemp); 
  }

  async obtenerVehiculos(): Promise<any>{
    let vehTemp = this.vehService.getVehiculos();
    return await lastValueFrom(vehTemp); 
  }

  obtenerVehiculosByCliente(id: string){
    return this.vehiculos.filter((veh: any) => {
      return (
        veh.ID_CLIENTE == id
      );
    });
  }

  async obtenerClientes(){
    let clientTemp = this.clienteService.getClientes();
    return await lastValueFrom(clientTemp); 
  }

  buscadorVeh(e: any){   
    if(e.length==7){
      this.buscarVeh(e);
    }
  }

  buscarVeh(matricula: string){
    const resultado = this.vehiculos$.find( (veh: any) => veh.MATRICULA === matricula);
    if(resultado!=undefined){
      this.colorVeh = resultado.COLOR;
      this.modeloVeh = resultado.MODELO.MARCA.DESCRIPCION + " " + resultado.MODELO.DESCRIPCION;
      this.anhoVeh = resultado.ANIO;
      this.matriculaVeh = resultado.MATRICULA;
      this.vinVeh = resultado.VIN;
      if(this.id_cliente==""){
        this.buscarClienteId(resultado.ID_CLIENTE);
      }
      this.matricula = this.matriculaVeh;
    }
  }

  buscadorCliente(e: any){  
    if(e.length!=0){
      this.buscarCliente(e);
    }
  }

  async buscarCliente(nombre: any){   
    const resultado = this.clientes.find( (cl: any) => ((cl.NOMBRE === nombre)));
    if(resultado!=undefined){
      
      this.limpiarVeh();
      this.matricula = "";
      this.id_cliente = resultado.ID_USUARIO;
      this.nombreCliente = resultado.NOMBRE;
      this.correoCliente = resultado.CORREO;
      this.telefCliente = resultado.TELEFONO;
      this.rfcCliente = resultado.RFC;

      this.vehiculos$ = this.obtenerVehiculosByCliente(this.id_cliente)  
    }   
  }

  async buscarClienteId(id: any){   
    const resultado = this.clientes.find( (cl: any) => ((cl.ID_USUARIO === parseInt(id))));
    if(resultado!=undefined){
      
      this.limpiarVeh();
      this.matricula = "";
      this.id_cliente = resultado.ID_USUARIO;
      this.nombreCliente = resultado.NOMBRE;
      this.correoCliente = resultado.CORREO;
      this.telefCliente = resultado.TELEFONO;
      this.rfcCliente = resultado.RFC;

      this.vehiculos$ = this.obtenerVehiculosByCliente(this.id_cliente)  
    }   
  }

  send(): any{
    let descripcion = this.formRegistrarCita.value.DESCRIPCION;
    let tipo_serv = this.formRegistrarCita.value.ID_TIPO_SERVICIO;
    this.formRegistrarCita.value.MATRICULA = this.matricula;
    this.formRegistrarCita.value.CLIENTE = this.id_cliente;
    this.formRegistrarCita.value.FECHA_CITA = this.formarFecha();

    if(tipo_serv!="" && descripcion!="" && this.matricula!="" && this.id_cliente!=""){
      
      this.citaService.registrarCita(this.formRegistrarCita.value).subscribe(
        (response: any) => {   
          const formAct = new FormData();
          formAct.append("ID_SERVICIO", response.data.ID_SERVICIO);

          this.valor = response.data.ID_SERVICIO;
          console.log(this.valor);
          // const div = <HTMLInputElement>document.getElementById("htmlData");
          // div.innerHTML += `<ngx-qrcode [elementType]="${this.tipoElemento}" [value]="50"> </ngx-qrcode>`
          // console.log(div.innerHTML);
          formAct.append("ID_ESTATUS", "C");
          formAct.append("ID_USUARIO", this.globals.usuario.ID);     
          this.citaService.registrarActualizacioServ(formAct).subscribe(
            {
              next: (v: any) => {
                this.alertService.exito(v.message);
  
                var title = "ACTUALIZACIÓN DE SERVICIO";
                var body = "HOLA " + this.nombreCliente + ", SU VEHÍCULO "+ this.modeloVeh + " CON MATRÍCULA: " + this.matricula + " ACABA DE REGISTRAR UNA CITA DE SERVICIO";
                this.notifService.sendNotificationUser(this.id_cliente, title, body).subscribe();
                
                this.downloadPDF(response.data.ID_SERVICIO);

                this.limpiar();
                this.formRegistrarCita.reset({ID_TIPO_SERVICIO: [null]});
              },
              error: (e) => this.alertService.error(e.error)
            }        
          );    
        }
      );
    }
    else{
      this.alertService.warning("DATOS FALTANTES");
    }  
  }

  downloadPDF(id_serv: string) {
    let DATA: any = <HTMLInputElement>document.getElementById("htmlData");
    DATA.hidden = false;
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 3
    };
    html2canvas(DATA, options).then((canvas) => {
      const img = canvas.toDataURL('image/PNG');
      const bufferX = 15;
      const bufferY = 15;
      const imgProps = (doc as any).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(img, 'png', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
      return doc;
    }).then((docResult) => {
      docResult.save(id_serv+'.pdf');
    });
    DATA.hidden = true;
  }

  async regVeh(){
    this.formRegistrarVehiculo.get('ID_MODELO')?.enable();
    if(this.formRegistrarVehiculo.value.MATRICULA!="" && this.formRegistrarVehiculo.value.ID_MODELO!="" && this.formRegistrarVehiculo.value.ANIO!="" && this.formRegistrarVehiculo.value.COLOR!=""){

      this.formRegistrarVehiculo.value.MATRICULA = this.formRegistrarVehiculo.value.MATRICULA.toUpperCase();

      if(this.formRegistrarVehiculo.value.VIN!=undefined){
        this.formRegistrarVehiculo.value.VIN = this.formRegistrarVehiculo.value.VIN.toUpperCase();
      }else{
        this.formRegistrarVehiculo.value.VIN = null;
      }

      this.formRegistrarVehiculo.get('ID_MARCA')?.disable();
      
      this.formRegistrarVehiculo.value.ID_CLIENTE = this.id_cliente;
      this.vehService.registrarVeh(this.formRegistrarVehiculo.value).subscribe(
        (response: any) => {
          this.alertService.exito(response.message);
          this.vehiculos.push(response.data);  
          this.vehiculos$ = this.obtenerVehiculosByCliente(this.id_cliente); 
          this.matricula = this.formRegistrarVehiculo.value.MATRICULA;
          this.buscarVeh(this.matricula);
          this.limpiarFormVehiculo();
        }
      );
      
      this.modalService.dismissAll();
    }else{
      this.alertService.warning("DATOS FALTANTES");
    }
     
  }

  async regCliente(){

    this.formRegistrarCliente.value.ID_TIPO_USUARIO = "4";

    if(this.formRegistrarCliente.value.NOMBRE!="" && this.formRegistrarCliente.value.CORREO!="" && this.formRegistrarCliente.value.ID_TIPO_PERSONA!=""){

      this.formRegistrarCliente.value.NOMBRE = this.formRegistrarCliente.value.NOMBRE.toUpperCase();
      this.formRegistrarCliente.value.CORREO = this.formRegistrarCliente.value.CORREO.toUpperCase();

      if(this.formRegistrarCliente.value.RFC!=""){
        this.formRegistrarCliente.value.RFC = this.formRegistrarCliente.value.RFC.toUpperCase();
      }else{
        this.formRegistrarCliente.value.RFC = null;
      }

      if(this.formRegistrarCliente.value.TELEFONO==""){
        this.formRegistrarCliente.value.TELEFONO = null;
      }

      if(this.formRegistrarCliente.value.DIRECCION==""){
        this.formRegistrarCliente.value.DIRECCION = null;
      }

      this.clienteService.registrarUsuario(this.formRegistrarCliente.value).subscribe(
        (response: any) => {
          this.alertService.exito(response.message);
          this.id_cliente = response.data.ID;
          let n_cl = response.data;
          delete n_cl.ID;
          n_cl.ID_USUARIO = this.id_cliente;
          this.clientes.push(n_cl);
          this.buscarCliente(this.id_cliente);
          this.limpiarFormCliente();    
        }
      );

      this.modalService.dismissAll();
    }else{
      this.alertService.warning("DATOS FALTANTES");
    }
  }

  async cambiarMarca(){
    var id_marca = (<HTMLInputElement>document.getElementById("cbxMarcaVeh")).value;
    this.modelos = await this.obtenerModelos(id_marca);
    (<HTMLInputElement>document.getElementById("cbxModeloVeh")).disabled = false;
  }

  formarFecha(): string{
    let fecha: string;

    fecha = this.fecha.year + "-";
    if(this.fecha.month<10){
      fecha = fecha + "0" + this.fecha.month + "-";
    }
    else{
      fecha = fecha + this.fecha.month + "-";
    }

    if(this.fecha.day<10){
      fecha = fecha + "0" + this.fecha.day + " ";   
    }else{
      fecha = fecha + this.fecha.day + " ";
    }

    if(this.time.hour<10){
      fecha = fecha + "0" + this.time.hour + ":";
    }else{
      fecha = fecha + this.time.hour + ":";
    }

    if(this.time.minute<10){
      fecha = fecha + "0" + this.time.minute;
    }else{
      fecha = fecha + this.time.minute;
    }

    fecha = fecha + ":00";

    return fecha;
  }

  limpiarFormCliente(){
    this.formRegistrarCliente.reset({ID_TIPO_PERSONA: [null]});
  }

  async limpiarCliente(){
    if(this.id_cliente!=""){
      this.id_cliente = "";
      this.nombreCliente = "";
      this.correoCliente = "";
      this.telefCliente = "";
      this.rfcCliente = "";
      this.limpiarVeh();
      this.vehiculos$ = this.vehiculos;
    }  
  }

  limpiarFormVehiculo(){
    this.formRegistrarVehiculo.get('ID_MARCA')?.enable();
    this.formRegistrarVehiculo.reset({ID_MARCA: [null], ID_MODELO: {value: [null], disabled: true}, COLOR: [null], ANIO: this.date.getFullYear()});
  }

  limpiarVeh(){
    if(this.matricula!=""){
      this.colorVeh = "";
      this.modeloVeh = "";
      this.anhoVeh = "";
      this.matriculaVeh = "";
      this.matricula = "";
      this.vinVeh = "";
    }  
  }

  limpiar(){
    this.limpiarCliente();
    this.id_cliente = "";
    this.matricula = "";
    this.fecha = { day: this.date.getUTCDay()-1, month: this.date.getUTCMonth()+1, year: this.date.getUTCFullYear()};
    this.time = { hour: this.date.getHours, minute: 0}; 
    (<HTMLInputElement>document.getElementById("txtDescripcion")).value = "";
  }

  validAnio(e: any){
    if ((e.keyCode < '48' || e.keyCode > '57') && e.keyCode != '8') {
      e.preventDefault();    
    }
    if(e.target.value.length==4){
      e.preventDefault();
    }
  }

  validAlphanum(e: any){
    if (!(e.keyCode > 47 && e.keyCode < 58) &&
        !(e.keyCode > 64 && e.keyCode < 91) && 
        !(e.keyCode > 96 && e.keyCode < 123)){
      e.preventDefault();    
    }
  }

  validAlpha(e: any){
    if (!(e.keyCode == 32 ||
      (e.keyCode >= 65 && e.keyCode <= 90) ||
      (e.keyCode >= 97 && e.keyCode <= 122))){
      e.preventDefault();
    }
  }

  receiveDate(e: any) {
    this.fecha = e;
  }

  receiveTime(e: any) {
    this.time = e;
  }

  validNum(e: any){
    if ((e.keyCode < '48' || e.keyCode > '57') && e.keyCode != '8') {
      e.preventDefault();
    }
  }
}
