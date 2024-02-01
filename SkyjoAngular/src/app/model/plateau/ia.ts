export class IA {
  public constructor(public id?: number, public level?: number) {}

  public _lastTurnedCard = [1, 0]; //On initialise la variable à la "position -1"
  public _score = 0;
  private plateau_retourne = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  private pileOuFace = true;

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

  public simpleNextCardPosition(): number[] {
    if (this._lastTurnedCard[1] < 4) {
      this._lastTurnedCard[1]++; //Si la ligne n'est pas finie
    } else {
      this._lastTurnedCard[0]++; //Si la ligne n'est pas finie
      this._lastTurnedCard[1] = 1; //Si la ligne n'est pas finie
    }
    return this._lastTurnedCard;
  }

  public nextCardPositionVierge(): number[] {
    let coordonneesAleatoires = this.choisirCoordonneesAleatoiresVierges(
      this.plateau_retourne
    );
    this.plateau_retourne[coordonneesAleatoires.ligne][
      coordonneesAleatoires.colonne
    ] = 1;
    return [coordonneesAleatoires.ligne + 1, coordonneesAleatoires.colonne + 1]; //+1 pour correspondre aux coordonnes de plateau qui vont de 1 à 4
  }

  public nextCardPosition(doesIASupressAColumn: boolean): number[] {
    let coordonneesAleatoires: { ligne: number; colonne: number };
    if (this.pileOuFace && !doesIASupressAColumn) {
      coordonneesAleatoires = this.choisirCoordonneesAleatoires(
        this.plateau_retourne
      ); //Si pile, ça remplace aléatoirement une des 12 cartes
      this.pileOuFace = false;
    } else {
      coordonneesAleatoires = this.choisirCoordonneesAleatoiresVierges(
        this.plateau_retourne
      ); //Si face, ça remplace aléatoirement une des cartes face cachées
      this.pileOuFace = true;
    }
    this.plateau_retourne[coordonneesAleatoires.ligne][
      coordonneesAleatoires.colonne
    ] = 1;
    return [coordonneesAleatoires.ligne + 1, coordonneesAleatoires.colonne + 1]; //+1 pour correspondre aux coordonnes de plateau qui vont de 1 à 4
  }

  public choixValeur(valeur: number): boolean {
    let choix: boolean;
    if (valeur > 6) {
      return (choix = true);
    } else {
      return (choix = false);
    }
  }

  private choisirCoordonneesAleatoiresVierges(tableau: number[][]): {
    ligne: number;
    colonne: number;
  } {
    let i = 0;
    let case_vierge = false;
    let ligneAleatoire = 0;
    let colonneAleatoire = 0;
    while (i <= 12 && case_vierge === false) {
      const Nlignes = tableau.length;
      const Ncolonnes = tableau[0].length;
      ligneAleatoire = Math.floor(Math.random() * Nlignes);
      colonneAleatoire = Math.floor(Math.random() * Ncolonnes);
      if (this.plateau_retourne[ligneAleatoire][colonneAleatoire] === 0) {
        case_vierge = true;
      }
      i++;
    }
    return { ligne: ligneAleatoire, colonne: colonneAleatoire };
  }

  private choisirCoordonneesAleatoires(tableau: number[][]): {
    ligne: number;
    colonne: number;
  } {
    let ligneAleatoire = 0;
    let colonneAleatoire = 0;
    const Nlignes = tableau.length;
    const Ncolonnes = tableau[0].length;
    ligneAleatoire = Math.floor(Math.random() * Nlignes);
    colonneAleatoire = Math.floor(Math.random() * Ncolonnes);
    return { ligne: ligneAleatoire, colonne: colonneAleatoire };
  }
}
