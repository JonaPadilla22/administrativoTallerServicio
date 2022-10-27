import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialServiciosComponent } from './historial-servicios.component';

describe('HistorialServiciosComponent', () => {
  let component: HistorialServiciosComponent;
  let fixture: ComponentFixture<HistorialServiciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistorialServiciosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
