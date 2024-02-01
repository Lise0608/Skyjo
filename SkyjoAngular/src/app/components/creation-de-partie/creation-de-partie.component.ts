import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Compte } from 'src/app/model/compte';
import { GameService } from 'src/app/services/game.service';
import { IAService } from 'src/app/services/iaservice.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'creation-de-partie',
  templateUrl: './creation-de-partie.component.html',
  styleUrls: ['./creation-de-partie.component.css'],
})
export class CreationDePartieComponent {
  numeroJoueur = 3;
  limiteJoueurs = 5;
  boutonAjouterJoueurDesactive = false;
  ajouterJoueurClicked: boolean = false;
  joueurs: { numero: number; type: string }[] = [];
  partieCommencee: boolean = false;
  userAccount!: Compte;
  token!: string;

  joueur1Selection: { numero: number; type: string } = {
    numero: 1,
    type: 'Human',
  };
  joueur2Selection: { numero: number; type: string } = {
    numero: 2,
    type: 'IA',
  };

  choixDuScore: number = 100;
  choixDuNombreDeTours: number = 10;
  playingSpeed: number = 1000;
  playingSpeedOptions: { value: number; label: string }[] = [
    { value: 1, label: 'Fast' },
    { value: 1000, label: 'Normal' },
    { value: 2000, label: 'Slow' },
  ];

  constructor(
    private iaServ: IAService,
    private router: Router,
    private gameSrv: GameService
  ) {}

  ajouterJoueur() {
    if (this.numeroJoueur <= this.limiteJoueurs) {
      this.joueurs.push({ numero: this.numeroJoueur, type: 'IA' });
      this.numeroJoueur++;
      this.ajouterJoueurClicked = true;
    } else {
      this.boutonAjouterJoueurDesactive = true;
    }
  }
  gererSelection(event: Event, index: number) {
    if (this.partieCommencee) {
      const selectElement = event.target as HTMLSelectElement;
      const optionSelected = selectElement.value;
      if (optionSelected === 'IA') {
        this.appelerIA();
      }
    } else {
      this.joueurs[index].type = (event.target as HTMLSelectElement).value;
    }
  }

  public recupererDonneesFormulaire() {
    let donneesJoueurs = [
      { numero: 'Joueur 1', type: this.joueur1Selection.type },
      { numero: 'Joueur 2', type: this.joueur2Selection.type },
      ...this.joueurs.map((joueur) => ({
        numero: `Joueur ${joueur.numero}`,
        type: joueur.type,
      })),
    ];

    let gameData = {
      scoreAAtteindre: this.choixDuScore,
      nombreDeTours: this.choixDuNombreDeTours,
      playingSpeed: this.playingSpeed,
      donneesJoueurs,
    };

    this.token = uuidv4();
    this.userAccount = this.getUserAccount();

    this.gameSrv.createGame(this.token, this.userAccount);

    this.router.navigateByUrl(`/plateau?token=${this.token}`, {
      state: { data: gameData },
    });
  }

  appelerIA() {
    this.iaServ.basicIA();
  }
  commencerPartie() {
    this.partieCommencee = true;
  }

  getUserAccount() {
    return localStorage.getItem('token')
      ? JSON.parse(localStorage.getItem('compte')!)
      : null;
  }
}
