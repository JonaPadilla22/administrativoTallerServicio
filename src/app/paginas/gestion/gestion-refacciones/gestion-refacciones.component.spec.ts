import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionRefaccionesComponent } from './gestion-refacciones.component';

describe('GestionRefaccionesComponent', () => {
  let component: GestionRefaccionesComponent;
  let fixture: ComponentFixture<GestionRefaccionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionRefaccionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionRefaccionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
