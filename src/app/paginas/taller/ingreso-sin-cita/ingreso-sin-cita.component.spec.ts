import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresoSinCitaComponent } from './ingreso-sin-cita.component';

describe('IngresoSinCitaComponent', () => {
  let component: IngresoSinCitaComponent;
  let fixture: ComponentFixture<IngresoSinCitaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IngresoSinCitaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IngresoSinCitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
