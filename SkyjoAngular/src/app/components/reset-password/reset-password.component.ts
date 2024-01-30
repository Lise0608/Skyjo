import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompteService } from 'src/app/services/compte.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  form: FormGroup;
  // showPassword: boolean;
  compteId?: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private compteSrv: CompteService
  ) {
    this.form = new FormGroup({
      passwordGroup: new FormGroup(
        {
          password: new FormControl('', [
            // Validators.required,
            // Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{3,}$/),
          ]),
          confirm: new FormControl(''),
        }
        // this.passwordAndConfirmEqual
      ),
    });
    // this.showPassword = false;
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => [
      (this.compteId = params['compteId']),
    ]);
  }

  // passwordAndConfirmEqual(control: AbstractControl): ValidationErrors | null {
  //   if (control.get('password')?.invalid) {
  //     return null;
  //   }
  //   return control.get('password')?.value == control.get('confirm')?.value
  //     ? null
  //     : { notEquals: true };
  // }

  // showHidePassword(e: Event) {
  //   this.showPassword = (e.target as HTMLInputElement).checked;
  // }

  save() {
    console.log('test');
    this.compteSrv
      .reset(this.form.get('passwordGroup.password')?.value, this.compteId!)
      .subscribe(() => {
        this.router.navigateByUrl('/auth');
      });
  }
}
