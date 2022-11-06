
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { CitaService } from './../../../servicios/citas/cita.service';
import { VehiculoService } from './../../../servicios/vehiculos/vehiculo.service';
import { ClienteService } from './../../../servicios/clientes/cliente.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-registrar-cita',
  templateUrl: './registrar-cita.component.html',
  styleUrls: ['./registrar-cita.component.css']
})
export class RegistrarCitaComponent implements OnInit {
  public formRegistrarCita: FormGroup;
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
      private modalService: NgbModal
    ) { 
    this.formRegistrarCita = this.formBuilder.group({
      'DESCRIPCION': ['',
        [
          Validators.required
        ]
      ]
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
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) => {
				this.modelos = [];
			}
		);
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
      this.anhoVeh = resultado.AÑO;
      this.matriculaVeh = resultado.MATRICULA;
      this.vinVeh = resultado.VIN;
      this.matricula = this.matriculaVeh;
    }
  }

  async buscarCliente(e: any){   
    if(e.key === 'Enter'){
      const resultado = this.clientes.find( (cl: any) => cl.ID_USUARIO === parseInt(e.target.value));
      if(resultado!=undefined){
        let id = e.target.value;
        this.id_cliente = id;
        e.target.value = "";
        this.nombreCliente = resultado.NOMBRE;
        this.correoCliente = resultado.CORREO;
        this.telefCliente = resultado.TELEFONO;
        this.rfcCliente = resultado.RFC;

        this.vehCliente = [];
        this.vehiculos = await this.obtenerVehiculosByCliente(id);
        for(var i = 0; i<this.vehiculos.length; i++){
          this.vehCliente.push(this.vehiculos[i].VEHICULO);
        }
        this.vehiculos = this.vehCliente;        
      }
    }
  }

  send(): any{
    const formData = new FormData();
    //formData.append("FECHA", this.formarFecha());

    var inputValue = (<HTMLInputElement>document.getElementById("cbxTipoServ")).value;
    var descValue = (<HTMLInputElement>document.getElementById("txtDescripcion")).value;
    if(inputValue!="" && descValue!="" && this.matricula!="" && this.id_cliente!=""){
      formData.append("ID_TIPO_SERVICIO", inputValue);   
      formData.append("DESCRIPCION", descValue);
      formData.append("MATRICULA", this.matricula);
      formData.append("CLIENTE", this.id_cliente);

      this.citaService.registrarCita(formData);
    }
    else{
      alert("DATOS FALTANTES");
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
      if(vin!=""){
        formData.append("VIN", vin);
      }

      this.vehService.registrarVeh(formData);
      this.vehiculos = await this.obtenerVehiculos();
      this.matricula = matricula;
      this.buscarVeh(matricula);

      this.modalService.dismissAll();
    }else{
      alert("DATOS FALTANTES");
    }
    
    
  }

  async cambiarMarca(){
    var id_marca = (<HTMLInputElement>document.getElementById("cbxMarcaVeh")).value;
    this.modelos = await this.obtenerModelos(id_marca);
  }

  formarFecha(): string{
    let fecha: string;
    if(this.fecha.day<10){
      fecha = "0" + this.fecha.day + "/";   
    }else{
      fecha = this.fecha.day + "/";
    }


    if(this.fecha.month<10){
      fecha = fecha + "0" + this.fecha.month + "/";
    }
    else{
      fecha = fecha + this.fecha.month + "/";
    }

    fecha = fecha + this.fecha.year + " ";

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

    return fecha;
  }

  async limpiarCliente(){
    if(this.id_cliente!=""){
      this.id_cliente = "";
      this.nombreCliente = "";
      this.correoCliente = "";
      this.telefCliente = "";
      this.rfcCliente = "";
  
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
    }  
  }

  receiveDate(e: any) {
    this.fecha = e;
  }

  receiveTime(e: any) {
    this.time = e;
  }

}
