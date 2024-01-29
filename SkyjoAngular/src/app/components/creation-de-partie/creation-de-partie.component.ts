import { Component } from '@angular/core';
import { IAService } from 'src/app/services/iaservice.service';

@Component({
  selector: 'creation-de-partie',
  templateUrl: './creation-de-partie.component.html',
  styleUrls: ['./creation-de-partie.component.css'],
})
export class CreationDePartieComponent {
  numeroJoueur = 3;
  limiteJoueurs = 8;
  boutonAjouterJoueurDesactive = false;
  ajouterJoueurClicked: boolean = false;
  joueurs: any[] = [];
  partieCommencee: boolean = false;

  constructor(private iaServ: IAService) {}

  ajouterJoueur() {
    if (this.numeroJoueur <= this.limiteJoueurs) {
      this.joueurs.push({ numero: this.numeroJoueur });
      this.numeroJoueur++;
      this.ajouterJoueurClicked = true;
    } else {
      this.boutonAjouterJoueurDesactive = true;
    }
  }
  gererSelection(event: Event) {
    if (this.partieCommencee) {
      const selectElement = event.target as HTMLSelectElement;
      const optionSelected = selectElement.value;
      if (optionSelected === 'Ordinateur') {
        this.appelerIA();
      }
    }
  }

  appelerIA() {
    this.iaServ.basicIA();
  }
  commencerPartie() {
    this.partieCommencee = true;
  }
}
