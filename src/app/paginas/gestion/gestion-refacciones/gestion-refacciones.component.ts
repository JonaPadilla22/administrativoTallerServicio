import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertsComponent } from 'src/app/components/alerts/alerts.component';
import { lastValueFrom } from 'rxjs';
import { RefaccionService } from 'src/app/servicios/refacciones/refaccion.service';

@Component({
  selector: 'app-gestion-refacciones',
  templateUrl: './gestion-refacciones.component.html',
  styleUrls: ['./gestion-refacciones.component.css'],
})
export class GestionRefaccionesComponent implements OnInit {
  filter = new FormControl('', { nonNullable: true });

  page: any = 1;
  pageSize: any = 9;
  collectionSize: number = 0;

  refactionList: any[] = [];
  refactionToShow: any[] = [];

  modal_activo = false;

  refactionSelected: any;

  refactionForm: any;

  refationTypeList: any[] = [];

  constructor(
    private alertService: AlertsComponent,
    private refactionModal: NgbModal,
    private formBuilder: FormBuilder,
    private refactionService: RefaccionService
  ) {
    this.filter.valueChanges.subscribe((data) => {
      this.refactionToShow = this.filtrateResource(data);
    });

    this.refactionForm = this.formBuilder.group({
      DESCRIPCION: '',
      ID_TIPO_REFACCION: null,
      PRECIO: null,
      STOCK: null,
    });
  }

  async ngOnInit() {
    this.refactionList = await this.getRefaction();
    this.refactionToShow = this.refactionList;
    this.collectionSize = this.refactionList.length;
    this.refationTypeList = await this.getTypeRefaction();
  }

  filtrateResource(text: string) {
    return this.refactionList.filter((refaction: any) => {
      const term = text.toLowerCase();
      return refaction.DESCRIPCION.toLowerCase().includes(term);
    });
  }

  async getRefaction(): Promise<Array<any>> {
    let tempRefactions = await lastValueFrom(
      this.refactionService.getRefactions()
    );
    return Object.values(tempRefactions);
  }

  async getTypeRefaction(): Promise<Array<any>> {
    let tempRefactions = await lastValueFrom(
      this.refactionService.getTypeRefactions()
    );
    return Object.values(tempRefactions);
  }

  async actualizarTabla() {
    this.refactionList = await this.getRefaction();
    this.refactionToShow = this.refactionList;
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
      this.refactionModal
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
            this.refactionSelected = null;
            this.refactionForm = this.formBuilder.group({
              DESCRIPCION: '',
              ID_TIPO_REFACCION: null,
              PRECIO: null,
              STOCK: null,
            });
          }
        );
    }
  }

  getStylesRefaction(status: any) {
    if (status != 'A') {
      return 'inactivo';
    }
    return 'activo';
  }

  updateStatusRefaction(refaction: any) {
    let estatusTemp = {
      ESTATUS: refaction.ESTATUS == 'A' ? 'I' : 'A',
    };
    this.refactionService.updateRefaction(estatusTemp, refaction.ID).subscribe({
      next: (response: any) => {
        this.actualizarTabla();
      },
      error: (e) => this.alertService.error(e.error),
    });
  }

  handleEditRefaction(ev:any, refaction:any){
    ev.preventDefault();
    this.refactionSelected = refaction;

    let temp = {
      DESCRIPCION: refaction.DESCRIPCION,
      ID_TIPO_REFACCION: refaction.TIPO_REFACCION.ID,
      PRECIO: refaction.PRECIO,
      STOCK: refaction.STOCK,
    };

    this.refactionForm = this.formBuilder.group(temp);
  }

  handleSubmit(){
    if (this.refactionSelected) {
      this.refactionService
        .updateRefaction(this.refactionForm.value, this.refactionSelected.ID)
        .subscribe({
          next: (response: any) => {
            this.alertService.exito(response.message);

            setTimeout(() => {
              this.refactionModal.dismissAll();
            });
          },
          error: (e) => this.alertService.error(e.error),
        });
      return;
    }
    this.refactionService.postRefaction(this.refactionForm.value).subscribe({
      next: (response: any) => {
        this.alertService.exito(response.message);

        setTimeout(() => {
          this.refactionModal.dismissAll();
        });
      },
      error: (e) => this.alertService.error(JSON.stringify(e.error)),
    });
  }
}
