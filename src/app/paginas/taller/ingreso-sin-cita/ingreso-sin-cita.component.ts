import { AlertsComponent } from './../../../components/alerts/alerts.component';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { CitaService } from './../../../servicios/citas/cita.service';
import { VehiculoService } from './../../../servicios/vehiculos/vehiculo.service';
import { ClienteService } from './../../../servicios/clientes/cliente.service';
import { NotificacionService } from 'src/app/servicios/notificaciones/notificacion.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Globals } from '../../../globals';

@Component({
  selector: 'app-ingreso-sin-cita',
  templateUrl: './ingreso-sin-cita.component.html',
  styleUrls: ['./ingreso-sin-cita.component.css']
})
export class IngresoSinCitaComponent implements OnInit {
  public formIngresoTaller: FormGroup;
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
      public globals: Globals
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
      TECNICO_ENCARGADO: '',
      ID_ESTATUS: ''
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
    const resultado = this.vehiculos.find( (veh: any) => veh.MATRICULA === matricula);
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

    let descripcion = this.formIngresoTaller.value.DESCRIPCION;
    let tipo_serv = this.formIngresoTaller.value.ID_TIPO_SERVICIO;
    this.formIngresoTaller.value.MATRICULA = this.matricula;
    this.formIngresoTaller.value.CLIENTE = this.id_cliente;
    this.formIngresoTaller.value.TECNICO_ENCARGADO = this.globals.usuario.ID;
    if((<HTMLInputElement>document.getElementById("flexCheckDefault")).checked){
      this.formIngresoTaller.value.ID_ESTATUS = "E";
    }else{
      this.formIngresoTaller.value.ID_ESTATUS = "I";
    }

    let tiempo_estim = "";
    if(this.formIngresoTaller.value.TIEMPO_ESTIMADO!=""){
      tiempo_estim = this.formIngresoTaller.value.TIEMPO_ESTIMADO + (<HTMLInputElement>document.getElementById("cbxTiempoEstimado")).value;
      this.formIngresoTaller.value.TIEMPO_ESTIMADO += (<HTMLInputElement>document.getElementById("cbxTiempoEstimado")).value;
    }

    if(tipo_serv!="" && descripcion!="" && this.matricula!="" && this.id_cliente!="" && tiempo_estim!=""){
      var id_e = "";
      this.citaService.registrarCita(this.formIngresoTaller.value).subscribe(
        (response: any) => {   
          const formAct = new FormData();
          formAct.append("ID_SERVICIO", response.data.ID_SERVICIO);
          if((<HTMLInputElement>document.getElementById("flexCheckDefault")).checked){
            id_e = "E";
          }else{
            id_e = "I";        
          }    
          formAct.append("ID_ESTATUS", id_e);
          formAct.append("ID_USUARIO", this.globals.usuario.ID);     
          this.citaService.registrarActualizacioServ(formAct).subscribe(
            {
              next: (response: any) => {
                this.alertService.exito(response.message);

                var title = "ACTUALIZACIÓN DE SERVICIO";
                if(id_e=="E"){
                  var body = "HOLA " + this.nombreCliente + ", SU VEHÍCULO "+ this.modeloVeh + " CON MATRÍCULA: " + this.matricula + " ACABA DE ENTRAR EN ESPERA PARA INGRESAR A TALLER";
                }else{
                  var body = "HOLA " + this.nombreCliente + ", SU VEHÍCULO "+ this.modeloVeh + " CON MATRÍCULA: " + this.matricula + " ACABA DE INGRESAR A TALLER";
                }
                
                this.notifService.sendNotificationUser(this.id_cliente, title, body).subscribe();

                this.limpiar();
                this.formIngresoTaller.reset({ID_TIPO_SERVICIO: [null]});
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
    (<HTMLInputElement>document.getElementById("txtTiempoEstimado")).value = "";
    (<HTMLInputElement>document.getElementById("flexCheckDefault")).checked = false;
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
