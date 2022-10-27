import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiciosPendientesComponent } from './servicios-pendientes.component';

describe('ServiciosPendientesComponent', () => {
  let component: ServiciosPendientesComponent;
  let fixture: ComponentFixture<ServiciosPendientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiciosPendientesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiciosPendientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
