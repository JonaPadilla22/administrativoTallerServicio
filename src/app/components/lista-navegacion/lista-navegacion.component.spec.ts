import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaNavegacionComponent } from './lista-navegacion.component';

describe('ListaNavegacionComponent', () => {
  let component: ListaNavegacionComponent;
  let fixture: ComponentFixture<ListaNavegacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaNavegacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaNavegacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
