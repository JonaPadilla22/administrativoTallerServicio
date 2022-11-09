import { AlertsComponent } from './../../../components/alerts/alerts.component';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { CitaService } from './../../../servicios/citas/cita.service';
import { VehiculoService } from './../../../servicios/vehiculos/vehiculo.service';
import { ClienteService } from './../../../servicios/clientes/cliente.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ingreso-sin-cita',
  templateUrl: './ingreso-sin-cita.component.html',
  styleUrls: ['./ingreso-sin-cita.component.css']
})
export class IngresoSinCitaComponent implements OnInit {
  public formIngresoTaller: FormGroup;
  tiposServ: any;
  tiposPers: any;
  marcas: any;
  modelos: any = [];
  vehiculos: any;
  clientes: any;
  vehCliente: any = [];
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

  constructor(
      private formBuilder: FormBuilder, 
      private citaService: CitaService,
      private vehService: VehiculoService,
      private clienteService: ClienteService,
      private modalService: NgbModal,
      public alertService: AlertsComponent
    ) { 
      this.formIngresoTaller = this.formBuilder.group({
        DESCRIPCION: ['',
          [
            Validators.required
          ]
        ],
        ID_TIPO_SERVICIO: '',
        MATRICULA: '',
        CLIENTE: '',
        TIEMPO_ESTIMADO: '',
        ID_ESTATUS: ''
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

  async obtenerVehiculos(){
    let vehTemp = this.vehService.getVehiculos();
    return await lastValueFrom(vehTemp); 
  }

  async obtenerVehiculosByCliente(id: string){
    let vehTemp = this.vehService.getVehiculosByCliente(id);
    return await lastValueFrom(vehTemp); 
  }

  async obtenerClientes(){
    let clientTemp = this.clienteService.getClientes();
    return await lastValueFrom(clientTemp); 
  }

  buscadorVeh(e: any){   
    if(e.key === 'Enter'){
      this.buscarVeh(e.target.value);
      e.target.value = "";   
    }
  }

  buscarVeh(matricula: string){
    const resultado = this.vehiculos.find( (veh: any) => veh.MATRICULA === matricula);
    if(resultado!=undefined){
      this.colorVeh = resultado.COLOR;
      this.modeloVeh = resultado.MODELO.MARCA.DESCRIPCION + " " + resultado.MODELO.DESCRIPCION;
      this.anhoVeh = resultado.ANIO;
      this.matriculaVeh = resultado.MATRICULA;
      this.vinVeh = resultado.VIN;
      this.buscarCliente(resultado.ID_CLIENTE);
      this.matricula = this.matriculaVeh;
    }
  }

  buscadorCliente(e: any){   
    if(e.key === 'Enter'){
      this.buscarCliente(e.target.value);
      e.target.value = "";   
    }
  }

  async buscarCliente(id: any){   
    const resultado = this.clientes.find( (cl: any) => ((cl.ID_USUARIO === parseInt(id))));
    if(resultado!=undefined){
      this.id_cliente = id;
      this.nombreCliente = resultado.NOMBRE;
      this.correoCliente = resultado.CORREO;
      this.telefCliente = resultado.TELEFONO;
      this.rfcCliente = resultado.RFC;

      this.vehCliente = [];
      this.vehiculos = await this.obtenerVehiculosByCliente(id);
      // for(var i = 0; i<this.vehiculos.length; i++){
      //   this.vehCliente.push(this.vehiculos[i].VEHICULO);
      // }
      // this.vehiculos = this.vehCliente;     
    }   
  }

  send(): any{

    let descripcion = this.formIngresoTaller.value.DESCRIPCION;
    let tipo_serv = this.formIngresoTaller.value.ID_TIPO_SERVICIO;
    this.formIngresoTaller.value.MATRICULA = this.matricula;
    this.formIngresoTaller.value.CLIENTE = this.id_cliente;
    this.formIngresoTaller.value.ID_ESTATUS = "I";
    let tiempo_estim;
    if(this.formIngresoTaller.value.TIEMPO_ESTIMADO!=""){
      tiempo_estim = this.formIngresoTaller.value.TIEMPO_ESTIMADO + (<HTMLInputElement>document.getElementById("cbxTiempoEstimado")).value;
      this.formIngresoTaller.value.TIEMPO_ESTIMADO += (<HTMLInputElement>document.getElementById("cbxTiempoEstimado")).value;
    }

    if(tipo_serv!="" && descripcion!="" && this.matricula!="" && this.id_cliente!="" && tiempo_estim!=""){
      
      this.citaService.registrarCita(this.formIngresoTaller.value).subscribe(
        (response: any) => {   
          const formAct = new FormData();
          formAct.append("ID_SERVICIO", response.data.ID_SERVICIO);
          formAct.append("ID_ESTATUS", "I");
          formAct.append("ID_USUARIO", "1");     
          this.citaService.registrarActualizacioServ(formAct).subscribe(
            (response: any) => {
              this.alertService.exito(response.message);
              this.limpiar();
            }
          );
        }
      );
    }
    else{
      this.alertService.warning("DATOS FALTANTES");
    }  
  }

  async regVeh(){
    var modelo_veh = (<HTMLInputElement>document.getElementById("cbxModeloVeh")).value;
    var matricula = (<HTMLInputElement>document.getElementById("txtMatricula")).value;
    var anho = (<HTMLInputElement>document.getElementById("txtAnho")).value;
    var color = (<HTMLInputElement>document.getElementById("cbxColor")).value;
    var vin = (<HTMLInputElement>document.getElementById("txtVIN")).value;
  
    if(matricula!="" && modelo_veh!="" && anho!="" && color!=""){
      const formData = new FormData();
      formData.append("MATRICULA", matricula);
      formData.append("ID_MODELO", modelo_veh);
      formData.append("ANIO", anho);
      formData.append("COLOR", color);
      formData.append("ID_CLIENTE", this.id_cliente);
      if(vin!=""){
        formData.append("VIN", vin);
      }

      this.vehService.registrarVeh(formData).subscribe(
        (response: any) => {
          this.alertService.exito(response.message);
          this.vehiculos.push(response.data);   
          this.matricula = matricula;
          this.buscarVeh(this.matricula);
        }
      );
      
      this.modalService.dismissAll();
    }else{
      this.alertService.warning("DATOS FALTANTES");
    }
    
    
  }

  async regCliente(){
    var tipo_persona = (<HTMLInputElement>document.getElementById("cbxTipoPersonaCliente")).value;
    var nombre = (<HTMLInputElement>document.getElementById("txtNombreCliente")).value;
    var rfc = (<HTMLInputElement>document.getElementById("txtRFC")).value;
    var correo = (<HTMLInputElement>document.getElementById("txtCorreo")).value;
    var telef = (<HTMLInputElement>document.getElementById("txtTelefono")).value;
    var direccion = (<HTMLInputElement>document.getElementById("txtDireccion")).value;

    if(nombre!="" && correo!="" && tipo_persona!=""){
      const formData = new FormData();
      
      formData.append("ID_TIPO_USUARIO", "4");
      formData.append("ID_TIPO_PERSONA", tipo_persona);
      formData.append("NOMBRE", nombre.toUpperCase());
      formData.append("CORREO", correo.toUpperCase());

      if(rfc!=""){
        formData.append("RFC", rfc.toUpperCase());
      }
      if(telef!=""){
        formData.append("TELEFONO", telef);
      }
      if(direccion!=""){
        formData.append("DIRECCION", direccion.toUpperCase());
      }

      this.clienteService.registrarCliente(formData).subscribe(
        (response: any) => {
          this.alertService.exito(response.message);
          this.id_cliente = response.data.ID;
          let n_cl = response.data;
          delete n_cl.ID;
          n_cl.ID_USUARIO = this.id_cliente;
          this.clientes.push(n_cl);
          this.buscarCliente(this.id_cliente);          
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

  async limpiarCliente(){
    if(this.id_cliente!=""){
      this.id_cliente = "";
      this.nombreCliente = "";
      this.correoCliente = "";
      this.telefCliente = "";
      this.rfcCliente = "";
      this.limpiarVeh();
      this.vehiculos = await this.obtenerVehiculos();
    }  
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
    (<HTMLInputElement>document.getElementById("txtTiempoEstimado")).value = "";
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