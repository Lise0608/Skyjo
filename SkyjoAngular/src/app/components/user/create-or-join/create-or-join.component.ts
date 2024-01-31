import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-or-join',
  templateUrl: './create-or-join.component.html',
  styleUrls: ['./create-or-join.component.css'],
})
export class CreateOrJoinComponent {
  showLinkInput = false;

  constructor(private router: Router) {}

  toggleShowLinkInput() {
    this.showLinkInput = !this.showLinkInput;
  }

  goToCreate() {
    this.router.navigateByUrl('/creation-de-partie');
  }
}
