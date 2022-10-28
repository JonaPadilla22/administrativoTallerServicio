import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsideIdentificadorUsuarioComponent } from './aside-identificador-usuario.component';

describe('AsideIdentificadorUsuarioComponent', () => {
  let component: AsideIdentificadorUsuarioComponent;
  let fixture: ComponentFixture<AsideIdentificadorUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsideIdentificadorUsuarioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsideIdentificadorUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
