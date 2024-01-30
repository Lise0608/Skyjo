import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent {
  form: FormGroup;
  showPassword: boolean;

  constructor(private router: Router) {
    this.form = new FormGroup({
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

  showHidePassword(e: Event) {
    this.showPassword = (e.target as HTMLInputElement).checked;
  }
}
