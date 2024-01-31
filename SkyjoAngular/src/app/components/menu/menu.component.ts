import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent {
  constructor(private router: Router) {}

  logout() {
    localStorage.clear();
    this.router.navigateByUrl('/auth');
  }

  get logged(): boolean {
    return localStorage.getItem('token') !== null;
  }

  get admin(): boolean {
    const token = localStorage.getItem('token');
    const compte = localStorage.getItem('compte');

    if (token && compte) {
      const role = JSON.parse(compte).role;
      return role === 'ROLE_ADMIN';
    } else {
      return false;
    }
  }
}
