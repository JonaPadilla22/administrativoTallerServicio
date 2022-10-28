import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaNavegacionHijoComponent } from './lista-navegacion-hijo.component';

describe('ListaNavegacionHijoComponent', () => {
  let component: ListaNavegacionHijoComponent;
  let fixture: ComponentFixture<ListaNavegacionHijoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaNavegacionHijoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaNavegacionHijoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
