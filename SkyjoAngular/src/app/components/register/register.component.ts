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
import { RegisterService } from 'src/app/services/register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  form: FormGroup;

  constructor(private RegisterSrv: RegisterService, private router: Router) {
    this.form = new FormGroup({
      login: new FormControl('', Validators.required),
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
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(
          /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/
        ),
      ]),
    });
  }

  passwordAndConfirmEqual(control: AbstractControl): ValidationErrors | null {
    if (control.get('password')?.invalid) {
      return null;
    }
    return control.get('password')?.value == control.get('confirm')?.value
      ? null
      : { notEquals: true };
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
