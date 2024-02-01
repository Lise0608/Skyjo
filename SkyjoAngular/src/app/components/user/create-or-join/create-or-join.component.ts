import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Compte } from 'src/app/model/compte';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-create-or-join',
  templateUrl: './create-or-join.component.html',
  styleUrls: ['./create-or-join.component.css'],
})
export class CreateOrJoinComponent {
  showLinkInput = false;
  link = '';
  userAccount!: Compte;

  constructor(private router: Router, private gameSrv: GameService) {}

  toggleShowLinkInput() {
    this.showLinkInput = !this.showLinkInput;
  }

  goToCreate() {
    this.router.navigateByUrl('/creation-de-partie');
  }

  joinGame() {
    this.userAccount = this.getUserAccount();
    const result = this.gameSrv.joinGame(this.link, this.userAccount);

    //temporaire
    let donneesJoueurs = [
      { numero: 'Joueur 1', type: 'j' },
      { numero: 'Joueur 2', type: 'j' },
    ];
    let gameData = {
      scoreAAtteindre: 50,
      nombreDeTours: 2,
      playingSpeed: 10,
      donneesJoueurs,
    };
    //temporaire jusqu'ici

    if (result === false) {
      console.log('lien incorrect');
    } else {
      this.router.navigateByUrl(`/plateau?token=${this.link}`, {
        state: { data: gameData },
      });
    }
  }

  getUserAccount() {
    return localStorage.getItem('token')
      ? JSON.parse(localStorage.getItem('compte')!)
      : null;
  }
}
