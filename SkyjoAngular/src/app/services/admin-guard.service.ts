import { Injectable } from '@angular/core';
import { AuthentificationService } from './authentification.service';
import { Router, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AdminGuardService {
  constructor(
    private router: Router,
    private authSrv: AuthentificationService
  ) {}

  canActivate(): boolean | UrlTree {
    if (this.authSrv.isAdmin()) {
      return true;
    }
    return this.router.parseUrl('/home');
  }
}
