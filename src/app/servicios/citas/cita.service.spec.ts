import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CitaService } from './cita.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('CitaService', () => {
  let httpTestingController: HttpTestingController;
  let httpClientSpy: { get: jasmine.Spy };
  let service: CitaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);

    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    service = new CitaService(httpClientSpy as any);
  });

  it('should return expected tiposService', () => {
    
    const expectedTipos =
    [{ ID: 1, DESCRIPCION: "CORRECTIVO" }, { ID: 2, DESCRIPCION: "PREVENTIVO"}];

    httpClientSpy.get.and.returnValue(of([expectedTipos]));

    service.getTiposServicios()
    .subscribe(data =>
      expect(data).toEqual([expectedTipos])
    );

    expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
  });
});
