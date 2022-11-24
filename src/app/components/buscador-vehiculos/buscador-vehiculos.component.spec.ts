import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscadorVehiculosComponent } from './buscador-vehiculos.component';

describe('BuscadorVehiculosComponent', () => {
  let component: BuscadorVehiculosComponent;
  let fixture: ComponentFixture<BuscadorVehiculosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuscadorVehiculosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuscadorVehiculosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
