import { TestBed } from '@angular/core/testing';

import { RefaccionService } from './refaccion.service';

describe('RefaccionService', () => {
  let service: RefaccionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RefaccionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
