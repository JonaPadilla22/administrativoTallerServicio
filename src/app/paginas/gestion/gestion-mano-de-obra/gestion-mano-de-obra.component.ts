import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertsComponent } from 'src/app/components/alerts/alerts.component';
import { RefaccionService } from 'src/app/servicios/refacciones/refaccion.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-gestion-mano-de-obra',
  templateUrl: './gestion-mano-de-obra.component.html',
  styleUrls: ['./gestion-mano-de-obra.component.css']
})
export class GestionManoDeObraComponent implements OnInit {
  filter = new FormControl('', { nonNullable: true });

  page: any = 1;
  pageSize: any = 9;
  collectionSize: number = 0;

  workforceList: any[] = [];
  workforceToShow: any[] = [];

  modal_activo = false;

  workforceSelected: any;

  workforceForm: any;

  constructor(
    private alertService: AlertsComponent,
    private workforceModal: NgbModal,
    private formBuilder: FormBuilder,
    private workforceService: RefaccionService
  ) {
    this.filter.valueChanges.subscribe((data) => {
      this.workforceToShow = this.filtrateResource(data);
    });

    this.workforceForm = this.formBuilder.group({
      DESCRIPCION: ['', [Validators.required]],
      PRECIO: ['0', [Validators.required]],
    });
  }

  async ngOnInit() {
    this.workforceList = await this.getWorkforce();
    this.workforceToShow = this.workforceList;
    this.collectionSize = this.workforceList.length;
  }

  filtrateResource(text: string) {
    return this.workforceList.filter((workforce: any) => {
      const term = text.toLowerCase();
      return workforce.DESCRIPCION.toLowerCase().includes(term);
    });
  }

  async getWorkforce(): Promise<Array<any>> {
    let tempWorkforceList = await lastValueFrom(
      this.workforceService.getWorkforce()
    );
    return Object.values(tempWorkforceList);
  }

  async actualizarTabla() {
    this.workforceList = await this.getWorkforce();
    this.workforceToShow = this.workforceList;
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
      this.workforceModal
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
            this.workforceSelected = null;
            this.workforceForm = this.formBuilder.group({
              DESCRIPCION: ['', [Validators.required]],
              PRECIO: ['0', [Validators.required]],
            });
          }
        );
    }
  }

  getStylesWorkforce(status: any) {
    if (status != 'A') {
      return 'inactivo';
    }
    return 'activo';
  }

  updateStatusWorkforce(workforce: any) {
    let estatusTemp = {
      ESTATUS: workforce.ESTATUS == 'A' ? 'I' : 'A',
    };
    this.workforceService.updateWorkforce(estatusTemp, workforce.ID_MANO_OBRA).subscribe({
      next: (response: any) => {
        this.actualizarTabla();
      },
      error: (e) => this.alertService.error(e.error),
    });
  }


  handleEditWorkforce(ev:any, workforce:any){
    ev.preventDefault();
    this.workforceSelected = workforce;
    
    this.workforceForm = this.formBuilder.group({
      DESCRIPCION: [workforce.DESCRIPCION, [Validators.required]],
      PRECIO: [workforce.PRECIO, [Validators.required]],
    });
  }


  handleSubmit(){
    if (this.workforceSelected) {
      this.workforceService
        .updateWorkforce(this.workforceForm.value, this.workforceSelected.ID_MANO_OBRA)
        .subscribe({
          next: (response: any) => {
            this.alertService.exito(response.message);

            setTimeout(() => {
              this.workforceModal.dismissAll();
            });
          },
          error: (e) => this.alertService.error(e.error),
        });
      return;
    }
    this.workforceService.postWorkforce(this.workforceForm.value).subscribe({
      next: (response: any) => {
        this.alertService.exito(response.message);

        setTimeout(() => {
          this.workforceModal.dismissAll();
        });
      },
      error: (e) => this.alertService.error(JSON.stringify(e.error)),
    });
  }
}
