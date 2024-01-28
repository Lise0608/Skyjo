import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class IAService {
  private deck: number[] = [];
  private CardIndex: number = 0;
  private defausse: number[] = [];
  private pioche: number[] = [];

  public flipCard() {}

  public flipCardFromDeck() {}

  public dropCard(card: number): void {
    this.defausse[0] = card; // Mettre la carte dans la défausse à la première position
  }
  public dropCardFromDeck(): { card: number | null; newIndex: number } {
    if (this.deck.length === 0) {
      alert('Le deck est vide !');
      return { card: null, newIndex: -1 };
    }
    const newIndex = this.CardIndex % this.deck.length; // Calcule le nouvel index de la carte à remplacer dans le deck
    const replacedCard = this.deck[newIndex]; // Sélectionne la carte à l'index calculé précédament
    this.dropCard(replacedCard); // Place la carte dans la défausse
    this.CardIndex++; // Incrémente l'indice pour préparer le prochain appel de la fonction

    return { card: replacedCard, newIndex }; // Renvoi la carte sélectionnée avec son nouvel index
  }

  public addToDeck(card: number) {
    const drawResult = this.dropCardFromDeck(); // Sélectionne une carte du deck à remplacer

    if (drawResult.card !== null) {
      this.deck[drawResult.newIndex] = card; // Remplacer la carte sélectionnée par la nouvelle carte
    }
  }
  public pickCardFromPioche(): number | null {
    if (this.pioche.length === 0) {
      alert('La pioche est vide !');
      return null;
    }
    let card = this.pioche[0];
    return card;
  }

  public pickCardFromDefausse(): number | null {
    if (this.defausse.length === 0) {
      alert('La defausse est vide !');
      return null;
    }
    let cardFromDefausse = this.defausse[0];
    return cardFromDefausse;
  }

  public basicIA(): void {
    let pickedCard = this.pickCardFromPioche();

    if (pickedCard !== null) {
      if (pickedCard < 6) {
        this.addToDeck(pickedCard);
      } else {
        this.dropCard(pickedCard);
        this.flipCardFromDeck();
      }
    }
  }

  public normalIA(): void {
    let cartePioche = this.pickCardFromPioche();
    let carteDefausse = this.pickCardFromDefausse();
    if (carteDefausse !== null && cartePioche !== null) {
      if (carteDefausse < 4) {
        this.addToDeck(carteDefausse);
      }
      if (cartePioche < 5) {
        this.addToDeck(cartePioche);
      } else {
        this.dropCard(cartePioche);
        this.flipCardFromDeck();
      }
    }
  }
}
