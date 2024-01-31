import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CompteService } from 'src/app/services/compte.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  form: FormGroup;
  message = 'dededede';
  style = '';

  constructor(private compteSrv: CompteService) {
    this.form = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(
          /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/
        ),
      ]),
    });
  }

  sendEmail() {
    const email = this.form.get('email')?.value;
    console.log('email composant ', email);
    this.compteSrv.sendEmail(email!).subscribe({
      next: () => {
        console.log('Email sent successfully');
        this.message = 'Email sent successfully';
        this.style = 'text-success';
      },
      error: (error) => {
        console.error('Error sending email:', error);
        this.message = 'We encountered an error while emailing you';
        this.style = 'text-danger';
      },
    });
  }
}
