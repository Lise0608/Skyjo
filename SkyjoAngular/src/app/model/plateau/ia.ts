export class IA {
  public constructor(public id?: number, public level?: number) {}

  public _lastTurnedCard = [1, 0]; //On initialise la variable à la "position -1"
  public _score = 0;

  public pickCard(lastTurnedCard: number): any {}

  get score(): number {
    return this._score;
  }
  set score(value: number) {
    this._score = value;
  }

  get lastTurnedCard(): number[] {
    return this._lastTurnedCard;
  }
  set lastTurnedCard(value: number[]) {
    this._lastTurnedCard = value;
  }

  public nextCardPosition(): number[] {
    if (this._lastTurnedCard[1] < 4) {
      this._lastTurnedCard[1]++; //Si la ligne n'est pas finie
    } else {
      this._lastTurnedCard[0]++; //Si la ligne n'est pas finie
      this._lastTurnedCard[1] = 1; //Si la ligne n'est pas finie
    }
    return this._lastTurnedCard;
  }

  public choixValeur(valeur: number): boolean {
    let choix: boolean;
    if (valeur > 6) {
      return (choix = true);
    } else {
      return (choix = false);
    }
  }
}
