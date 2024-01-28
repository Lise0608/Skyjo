import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthentificationService } from 'src/app/services/authentification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  login: string = '';
  password = '';
  erreur = false;
  form: FormGroup;
  showPassword: boolean = false;

  constructor(
    private router: Router,
    private authSrv: AuthentificationService
  ) {
    this.form = new FormGroup({
      login: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  check() {
    this.authSrv.authentication(this.login, this.password).subscribe({
      next: (compte) => {
        localStorage.setItem(
          'token',
          'Basic ' + window.btoa(this.login + ':' + this.password)
        );
        localStorage.setItem('compte', JSON.stringify(compte));
        this.router.navigateByUrl('/home');
      },
      error: (err) => {
        this.erreur = true;
        console.log('Err : Missing User Account');
      },
    });
  }
}
