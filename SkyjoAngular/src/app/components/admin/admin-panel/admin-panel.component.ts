import { Component } from '@angular/core';

@Component({
  selector: 'admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css'],
})
export class AdminPanelComponent {
  showGameList = false;
  showUserList = false;

  toggleGameList() {
    this.showGameList = !this.showGameList;
  }

  toggleUserList() {
    this.showUserList = !this.showUserList;
  }
}
