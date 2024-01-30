import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  joueurs: { numero: number; type: string }[] = [];
  partieCommencee: boolean = false;

  joueur1Selection: { numero: number; type: string } = {
    numero: 1,
    type: 'Joueur',
  };
  joueur2Selection: { numero: number; type: string } = {
    numero: 2,
    type: 'Joueur',
  };
  @Output() envoyerDonnesFormulaire: EventEmitter<any> =
    new EventEmitter<any>();

  constructor(private iaServ: IAService, private router: Router) {}

  ajouterJoueur() {
    if (this.numeroJoueur <= this.limiteJoueurs) {
      this.joueurs.push({ numero: this.numeroJoueur, type: 'Joueur' });
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
      if (optionSelected === 'Ordinateur') {
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
    this.router.navigateByUrl('/plateau', {
      state: { data: donneesJoueurs },
    });
  }

  appelerIA() {
    this.iaServ.basicIA();
  }
  commencerPartie() {
    this.partieCommencee = true;
  }
}
