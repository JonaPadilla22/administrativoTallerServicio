import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionManoDeObraComponent } from './gestion-mano-de-obra.component';

describe('GestionManoDeObraComponent', () => {
  let component: GestionManoDeObraComponent;
  let fixture: ComponentFixture<GestionManoDeObraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionManoDeObraComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionManoDeObraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
