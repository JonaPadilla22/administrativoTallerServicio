import { TestBed } from '@angular/core/testing';

import { AccesoTecnicoGuard } from './acceso-tecnico.guard';

describe('AccesoTecnicoGuard', () => {
  let guard: AccesoTecnicoGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AccesoTecnicoGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
