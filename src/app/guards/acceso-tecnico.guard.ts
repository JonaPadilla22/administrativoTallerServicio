import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Globals } from '../globals';

@Injectable({
  providedIn: 'root',
})
export class AccesoTecnicoGuard implements CanActivate {
  constructor(private router: Router, private globals: Globals) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.globals.usuario.TIPO_USUARIO.ID == 3) {
      return false;
    }
    return true;
  }
}
