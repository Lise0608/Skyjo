import { Component } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, map, switchMap, timer } from 'rxjs';
import { RegisterService } from 'src/app/services/register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  form: FormGroup;
  showPassword: boolean;

  constructor(private RegisterSrv: RegisterService, private router: Router) {
    this.form = new FormGroup({
      login: new FormControl('', Validators.required, this.loginLibre()),
      passwordGroup: new FormGroup(
        {
          password: new FormControl('', [
            Validators.required,
            Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{3,}$/),
          ]),
          confirm: new FormControl(''),
        },
        this.passwordAndConfirmEqual
      ),
      email: new FormControl(
        '',
        [
          Validators.required,
          Validators.pattern(
            /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/
          ),
        ],
        this.emailLibre()
      ),
    });
    this.showPassword = false;
  }

  passwordAndConfirmEqual(control: AbstractControl): ValidationErrors | null {
    if (control.get('password')?.invalid) {
      return null;
    }
    return control.get('password')?.value == control.get('confirm')?.value
      ? null
      : { notEquals: true };
  }

  loginLibre(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return timer(500).pipe(
        switchMap(() => {
          return this.RegisterSrv.checkLogin(control.value).pipe(
            map((bool) => {
              return bool ? { loginExist: true } : null;
            })
          );
        })
      );
    };
  }

  emailLibre(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return timer(500).pipe(
        switchMap(() => {
          return this.RegisterSrv.checkEmail(control.value).pipe(
            map((bool) => {
              return bool ? { emailExist: true } : null;
            })
          );
        })
      );
    };
  }

  showHidePassword(e: Event) {
    this.showPassword = (e.target as HTMLInputElement).checked;
  }

  save() {
    this.RegisterSrv.register(
      this.form.get('login')?.value,
      this.form.get('passwordGroup.password')?.value,
      this.form.get('email')?.value
    ).subscribe(() => {
      this.router.navigateByUrl('/auth');
    });
  }
}
