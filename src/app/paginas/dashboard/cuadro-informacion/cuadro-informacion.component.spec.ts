import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuadroInformacionComponent } from './cuadro-informacion.component';

describe('CuadroInformacionComponent', () => {
  let component: CuadroInformacionComponent;
  let fixture: ComponentFixture<CuadroInformacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CuadroInformacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuadroInformacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
