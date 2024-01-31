import { CreationDePartieComponent } from './../../creation-de-partie/creation-de-partie.component';
import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import {
  interval,
  fromEvent,
  merge,
  EMPTY,
  Subject,
  Observable,
  firstValueFrom,
} from 'rxjs';
import completeDeck from './../deck'; // Import des cartes du deck
import { takeUntil, filter, last, take, skip } from 'rxjs/operators';
import { IA } from './../../../model/plateau/ia';
import { ActivatedRoute, Router } from '@angular/router';
type RoundFunction = () => Promise<void>; //Pour aller d'un round à l'autre

interface DynamicProperties {
  [key: string]: any;
}

@Component({
  selector: 'app-plateau-graphique',
  templateUrl: './plateau-graphique.component.html',
  styleUrls: ['./plateau-graphique.component.css'],
})
export class PlateauGraphiqueComponent implements OnInit {
  donneesJoueurs: any;
  nombreDeTours: any;
  scoreAAtteindre: any;
  playersNumber = 0;
  IA_P2: IA = new IA(1, 1);
  IA_P3: IA = new IA(1, 1);
  IA_P4: IA = new IA(1, 1);
  IA_P5: IA = new IA(1, 1);
  dynamicIAs: DynamicProperties = {};

  // ---------------
  completeImportedDeck = completeDeck.slice();
  deck: number[] = [];
  gameScorePlayers: number[] = [0]; //Attention, la première valeur de ce tableau n'est attribuée à aucun joueur, tableau[1] est pour P2 et ainsi du suite
  defausse: number[] = []; //Tableau de la defausse qui accumule des cartes
  changeClass: string[] = [
    'none',
    'd-block',
    'd-none',
    'd-none',
    'd-none',
    'd-none',
  ]; //classes d-none par défaut pour P1,2,3,4,5
  draggedCard: HTMLElement | null = null; // Variable pour stocker la carte en cours de drag
  discardButton = document.getElementById('btnDefausse'); // Recherche le bouton de la carte de la défausse
  isDragging = false; // Variable pour indiquer si le glisser-déposer est en cours
  isDrawCardTurned = false;
  lastClickTime = 0;
  discardOn = true;
  cardDroppedInP1 = false;
  P1CardTurned = false;
  turnP1CardOn = false;
  turnP1CardStart = false;
  gameOver = false;
  P1StartCard1 = false;
  visible = 0;
  event1OK = false;
  P1StartCard2 = false;
  TourP1 = false; //Pour savoir si le P1 doit jouer
  //updateFromTurn = false;
  lastTurn = false;
  turnedP1CardNumber = '';
  playerDidSkyjo = 0;

  private visibleEvent = new Event('visible');
  private visibleEvent2 = new Event('visible');
  private resolveVisibleEvent!: () => void;
  private resolveVisibleEvent2!: () => void;
  private visiblePromise = new Promise<void>((resolve) => {
    this.resolveVisibleEvent = resolve;
  });
  private visiblePromise2 = new Promise<void>((resolve) => {
    this.resolveVisibleEvent2 = resolve;
  });
  private visibleChangeEvent = new Event('visibleChange');
  private visibleChangeEvent2 = new Event('visibleChange2');

  attributsRecus: any;
  multiplicateurMilisecondes = 1; //1000 pour une partie

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private router: Router
  ) {
    this.turnP1Card = this.turnP1Card.bind(this);
    this.dragStartDefausse = this.dragStartDefausse.bind(this);
    this.dragStartPioche = this.dragStartPioche.bind(this);
    this.dropAnyToP1 = this.dropAnyToP1.bind(this);
    this.replaceAnyToP1 = this.replaceAnyToP1.bind(this);
    this.dragEnter = this.dragEnter.bind(this);
    this.dragOver = this.dragOver.bind(this); //Permet de lier dragOver à toutes les variables déclarées au dessus.
    this.dragEnd = this.dragEnd.bind(this);
    this.humanRound = this.humanRound.bind(this);
    this.updatePlayerNScore = this.updatePlayerNScore.bind(this);
    this.updateGame = this.updateGame.bind(this);
    this.replaceAnyToP2_PN = this.replaceAnyToP2_PN.bind(this);
    this.getValeurDefausse = this.getValeurDefausse.bind(this);
    this.messageWhatPlayed = this.messageWhatPlayed.bind(this);
    this.turnDrawCard = this.turnDrawCard.bind(this);
    this.returnLastCards = this.returnLastCards.bind(this);
    this.pauseInSeconds = this.pauseInSeconds.bind(this);
    this.humanTwoCardsDraw = this.humanTwoCardsDraw.bind(this);
    this.P2_PNtwoCardsDraw = this.P2_PNtwoCardsDraw.bind(this);
    this.whoStart = this.whoStart.bind(this);
    this.getVisibleScorePN = this.getVisibleScorePN.bind(this);
    this.turnP2_PNCard = this.turnP2_PNCard.bind(this);
    this.IAturn1CardAtStart = this.IAturn1CardAtStart.bind(this);
    this.distributeCardsP2ToPN = this.distributeCardsP2ToPN.bind(this);
    this.waitForDrawOrDiscard = this.waitForDrawOrDiscard.bind(this);
    this.waitForDrawOrTurn = this.waitForDrawOrTurn.bind(this);
    this.IARound = this.IARound.bind(this);
    this.nextRound = this.nextRound.bind(this);
    this.hideDraw = this.hideDraw.bind(this);
    this.envoyerTexteP1 = this.envoyerTexteP1.bind(this);
    this.newRound = this.newRound.bind(this);
    this.hideAllCards = this.hideAllCards.bind(this);
    this.generateSkyjoCards = this.generateSkyjoCards.bind(this);
    this.distribuerCartesAuJoueurP1 =
      this.distribuerCartesAuJoueurP1.bind(this);
    this.distribuerPremiereCarteDefausse =
      this.distribuerPremiereCarteDefausse.bind(this);
    /* this.twoVisibleCardsP1 = this.twoVisibleCardsP1.bind(this); */

    const navigation = this.router.getCurrentNavigation(); //On récupère le formulaire de création de partie
    if (navigation && navigation.extras.state) {
      let data = navigation.extras.state['data'];
      this.donneesJoueurs = data.donneesJoueurs;
      this.nombreDeTours = data.nombreDeTours;
      this.scoreAAtteindre = data.scoreAAtteindre;
      this.multiplicateurMilisecondes = data.playingSpeed;
      if (this.scoreAAtteindre === undefined) {
        this.scoreAAtteindre = 100;
      }
    }
    this.playersNumber = this.donneesJoueurs.length;
  }

  // === Déroulé partie ====================================================================================
  // ----- Initialisation du plateau après avoir lu toutes les fonctions -----------------
  ngOnInit() {
    console.log('Il y a', this.playersNumber, 'joueurs.'); //Récupération infos création partie
    console.log(`Le score maximal est de`, this.scoreAAtteindre, `points.`);
    console.log(`Le nombre maximal de tours est ` + this.nombreDeTours + `.`);
    for (let n = 1; n <= this.playersNumber; n++) {
      console.log('P' + n + ' est un', this.donneesJoueurs[n - 1].type);
      this.donneesJoueurs.IA = 'IA' + n;
      this.gameScorePlayers[n] = 0;
    }
    /* console.log(this.gameScorePlayers); */
    this.deck = this.generateSkyjoCards(); // On génère le deck
    /* console.log(this.deck); // Affichage du nombre de cartes restantes dans le deck dans la console */
    this.distribuerCartesAuJoueurP1(); //
    this.distributeCardsP2ToPN(this.playersNumber); //
    this.distribuerPremiereCarteDefausse(); //

    this.dynamicIAs = {
      //Initialisation des variables
      IA_P2: this.IA_P2,
      IA_P3: this.IA_P3,
      IA_P4: this.IA_P4,
      IA_P5: this.IA_P5,
    };

    console.log(`Vitesse de jeu :`, this.multiplicateurMilisecondes);

    this.humanTwoCardsDraw();
  }

  // ----- Chacun tire deux cartes, la plus grande somme commence ---------------------------------------
  async humanTwoCardsDraw() {
    this.visible = 0;
    this.afficherTexteP1(5);
    this.turnP1CardStart = true;
    const cardSelectionHandler = (event: any) => {
      if (this.visible === 1) {
        this.updatePlayerNScore(1);
        this.resolveVisibleEvent();
      }
    };
    const cardSelectionHandler2 = (event: any) => {
      if (this.visible === 2) {
        this.updatePlayerNScore(1);
        this.resolveVisibleEvent2();
      }
    };
    document.addEventListener('visibleChange', cardSelectionHandler);
    console.log(
      'En attente des sélections de carte 1, visible =',
      this.visible
    );
    this.visiblePromise.then(() => {
      this.event1OK = true;
      console.log(
        'En attente des sélections de carte 2, visible =',
        this.visible
      );
      this.turnP1CardStart = true;
      document.addEventListener('visibleChange2', cardSelectionHandler2);
    });
    this.visiblePromise2.then(() => {
      this.P2_PNtwoCardsDraw(this.playersNumber);
    });
  }

  async P2_PNtwoCardsDraw(playersNumber: number) {
    await this.pauseInSeconds(2);
    for (let PN = 2; PN <= playersNumber; PN++) {
      /*  console.log(`Tirage au sort pour P${PN}`); */
      /* alert(this.donneesJoueurs[PN - 1].type); */
      let dynamicPropertyName = `IA_P${PN}`;
      let IA = this.dynamicIAs[dynamicPropertyName];
      if (this.donneesJoueurs[PN - 1].type === `IA`) {
        for (let i = 1; i <= 2; i++) {
          let nextCoord = IA.nextCardPosition();
          let nextDiv = `c${nextCoord[0]}-${nextCoord[1]}P${PN}`; //exemple : "c1-1P2"
          let cardNString = this.IAturn1CardAtStart(nextDiv);
          this.messageWhatPlayed(parseInt(cardNString), PN, 0);
          this.updatePlayerNScore(PN);
          await this.pauseInSeconds(1);
        }
      }
    }
    await this.pauseInSeconds(1);
    this.whoStart();
  }

  async whoStart() {
    let scoreMax: number[] = [1, this.getVisibleScorePN(1)]; //Score player 1
    for (let playerN = 2; playerN <= this.playersNumber; playerN++) {
      let scoreP: number[] = [playerN, this.getVisibleScorePN(playerN)]; // Prendre score max en fonction des autres players
      if (scoreP[1] > scoreMax[1]) {
        scoreMax = scoreP;
      }
    }
    let texteP1 = this.el.nativeElement.querySelector('#TexteP1');
    this.renderer.removeClass(texteP1, 'd-none');
    this.renderer.addClass(texteP1, 'd-block');
    texteP1.innerHTML = `<b>Player ${scoreMax[0]} a ${scoreMax[1]} points, il commence !</b>`;
    await this.pauseInSeconds(4);
    const nextRoundFunction = this.nextRound.bind(
      this,
      scoreMax[0],
      this.donneesJoueurs[scoreMax[0] - 1].type
    );
    if (typeof nextRoundFunction === 'function') {
      await nextRoundFunction();
    } else {
      console.error("La fonction extraite n'est pas une fonction valide.");
    }
  }

  // ----- Tour du joueur 1 ------------------------------------------------------
  async humanRound() {
    /* console.log('Round de P1'); */
    this.TourP1 = true; //Si false, on ne peut ni retourner ni glisser de carte.
    this.discardOn = true;
    this.P1CardTurned = false;
    this.afficherTexteP1(0);
    let valeurDefausse = this.getValeurDefausse();
    await this.waitForDrawOrDiscard(); //On attend que le joueur choisisse entre pioche et défausse
    let valeurPioche = this.getValeurPioche();
    if (this.isDrawCardTurned) {
      this.discardOn = false;
      this.afficherTexteP1(1);
      this.turnP1CardOn = true;
      await this.waitForDrawOrTurn(); //On attend que le joueur choisisse entre glisser ou retourner une carte
      if (this.cardDroppedInP1) {
        if (valeurPioche !== undefined) {
          this.messageWhatPlayed(valeurPioche, 1, 1);
        }
      } else if (this.P1CardTurned) {
        this.messageWhatPlayed(parseInt(this.turnedP1CardNumber), 1, 0);
      }
    } else if (this.cardDroppedInP1) {
      if (valeurDefausse !== undefined) {
        this.messageWhatPlayed(valeurDefausse, 1, 2);
      }
    }
    this.P1CardTurned = false;
    this.cardDroppedInP1 = false;
    this.turnP1CardOn = false;
    this.discardOn = false;
    this.TourP1 = false;
    this.updateGame(1);
  }

  async IARound(PN: number) {
    /* console.log(`Round de P${PN}`); */
    let dynamicPropertyName = `IA_P${PN}`;
    let IA = this.dynamicIAs[dynamicPropertyName];
    let nextCoord = IA.nextCardPosition();
    let nextDiv = `c` + nextCoord[0] + `-` + nextCoord[1] + `P${PN}`; //exemple : "c1-1P2"
    let valeurDefausse = this.getValeurDefausse();
    let choix_pioche_defausse: boolean = false;
    let choix_pioche_tourner: boolean = false;
    if (valeurDefausse !== undefined) {
      choix_pioche_defausse = IA.choixValeur(valeurDefausse); //true : l'IA pioche, false : l'IA prend la défausse
    }
    if (choix_pioche_defausse) {
      //Si personne n'a jamais pioché, il faut tourner la carte une première fois
      if (this.isDrawCardTurned === false) {
        this.turnDrawCard();
      }
      let valeurPioche = this.getValeurPioche();
      /* alert('IA Pioche un ' + valeurPioche?.toString()); */
      if (valeurPioche !== undefined) {
        choix_pioche_tourner = IA.choixValeur(valeurPioche); //true : l'IA retourne une carte, false : l'IA utilise la pioche
      }
      if (choix_pioche_tourner) {
        let cardNString = this.turnP2_PNCard(nextDiv);
        this.messageWhatPlayed(parseInt(cardNString), PN, 0);
      } else {
        this.replaceAnyToP2_PN(valeurPioche?.toString(), nextDiv);
        if (valeurPioche !== undefined) {
          this.messageWhatPlayed(valeurPioche, PN, 1);
        }
      }
    } else {
      this.replaceAnyToP2_PN(valeurDefausse?.toString(), nextDiv);
      if (valeurDefausse !== undefined) {
        this.messageWhatPlayed(valeurDefausse, PN, 2);
      }
    }
    this.updateGame(PN);
  }

  async nextRound(playerNumber: number, playerType: String) {
    if (playerType === 'Human') {
      this.humanRound();
    } else if (playerType === 'IA') {
      this.IARound(playerNumber);
    }
  }

  async updateGame(lastPlayerNumber: number) {
    console.log(
      'Défausse :',
      this.defausse.length,
      'et pioche :',
      this.deck.length
    );
    let nextPlayerNumber: number;
    this.gameOver = this.updatePlayerNScore(lastPlayerNumber);
    await this.pauseInSeconds(2);
    if (lastPlayerNumber < this.playersNumber) {
      nextPlayerNumber = lastPlayerNumber + 1; // Calculer le numéro du prochain joueur
    } else {
      nextPlayerNumber = 1;
    }
    if (this.gameOver && !this.lastTurn) {
      this.afficherTexteP1(2); //Dernier tour !
      await this.pauseInSeconds(3); //Pause pour voir que c'est le dernier tour
      this.playerDidSkyjo = lastPlayerNumber;
      this.lastTurn = true;
    }
    // Lancement vers Next Player
    if (this.playerDidSkyjo !== nextPlayerNumber) {
      const nextRoundFunction = this.nextRound.bind(
        this,
        nextPlayerNumber,
        this.donneesJoueurs[nextPlayerNumber - 1].type
      );
      if (typeof nextRoundFunction === 'function') {
        await nextRoundFunction();
      } else {
        console.error("La fonction extraite n'est pas une fonction valide.");
      }
    } else {
      this.returnLastCards();
    }
  }

  // === Fonctions =========================================================================================
  pauseInSeconds(secondes: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, secondes * this.multiplicateurMilisecondes); // 1000 millisecondes équivalent à 1 seconde
    });
  }

  getValeurDefausse(): number | undefined {
    let discardButton = document.querySelector(
      `#btnDefausse`
    ) as HTMLDivElement | null;

    if (discardButton) {
      let discardCardNumberStr = discardButton.dataset['cardNumber'];

      if (discardCardNumberStr !== undefined) {
        let discardCardNumber = parseInt(discardCardNumberStr, 10);

        if (!isNaN(discardCardNumber)) {
          return discardCardNumber;
        }
      }
    }
    return undefined;
  }

  getValeurPioche(): number | undefined {
    let drawButton = document.querySelector(
      `#btnPioche`
    ) as HTMLDivElement | null;

    if (drawButton) {
      let discardCardNumberStr = drawButton.dataset['cardNumber'];

      if (discardCardNumberStr !== undefined) {
        let discardCardNumber = parseInt(discardCardNumberStr, 10);

        if (!isNaN(discardCardNumber)) {
          return discardCardNumber;
        }
      }
    }
    return undefined;
  }

  waitForDrawOrDiscard(): Promise<void> {
    return new Promise<void>((resolve) => {
      const intervalId = setInterval(() => {
        if (this.isDrawCardTurned || this.cardDroppedInP1) {
          clearInterval(intervalId);
          resolve();
        }
      }, 10); //Temps avant de revenir à la méthode
    });
  }

  waitForDrawOrTurn(): Promise<void> {
    return new Promise<void>((resolve) => {
      const intervalId = setInterval(() => {
        if (this.cardDroppedInP1 || this.P1CardTurned) {
          clearInterval(intervalId);
          resolve();
        }
      }, 10); //Temps avant de revenir à la méthode
    });
  }

  cacherTexteP1() {
    let texteP1 = this.el.nativeElement.querySelector('#TexteP1');
    this.renderer.addClass(texteP1, 'd-none');
    this.renderer.removeClass(texteP1, 'd-block');
  }
  afficherTexteP1(indexTexteP1: number) {
    let texteP1 = this.el.nativeElement.querySelector('#TexteP1');
    this.renderer.removeClass(texteP1, 'd-none');
    this.renderer.addClass(texteP1, 'd-block');
    let textes = [
      '<b>À toi de jouer !</b><br />Pioche une carte <b>ou</b> glisse celle de la défausse vers le plateau.',
      '<b>Carte piochée !</b><br />Glisse la carte vers le plateau <b>ou</b> retourne une des cartes du plateau.',
      '<b>SKYJO ! Dernier Tour …</b>',
      '<b>Fin de partie, on retourne les cartes !</b>',
      '<b>Sauvegarde de la partie !</b>',
      '<b>Retourne deux cartes sur ton plateau pour savoir qui commence.</b>',
    ];
    texteP1.innerHTML = textes[indexTexteP1];
  }

  envoyerTexteP1(message: string) {
    this.el.nativeElement.querySelector('#TexteP1').innerHTML = message;
  }

  messageWhatPlayed(carteN: number, playerN: number, typeOfPlay: number) {
    let texteP1 = this.el.nativeElement.querySelector('#TexteP1');
    this.renderer.removeClass(texteP1, 'd-none');
    this.renderer.addClass(texteP1, 'd-block');
    let textes = [
      `<b>Player ${playerN}</b> a retourné un <b>${carteN}</b> !`,
      `<b>Player ${playerN}</b> a pioché un <b>${carteN}</b> !`,
      `<b>Player ${playerN}</b> récupère un <b>${carteN}</b> de la défausse !`,
    ];
    texteP1.innerHTML = textes[typeOfPlay];
  }

  async returnLastCards() {
    this.afficherTexteP1(3);
    let cardNumber: number;
    for (let PN = 1; PN <= this.playersNumber; PN++) {
      let scorePlayer = this.getVisibleScorePN(PN);
      if (PN == 1 && this.playerDidSkyjo !== PN) {
        let P1Buttons: NodeListOf<HTMLButtonElement> =
          this.el.nativeElement.querySelectorAll(
            `[class^="btn-"][class$="P${PN}"]`
          );
        for (let button of Array.from(P1Buttons)) {
          if (button.id !== 'visible') {
            if (button.dataset['cardNumber'] !== undefined) {
              cardNumber = parseInt(button.dataset['cardNumber']);
              scorePlayer += cardNumber;
              button.innerHTML = `<img src="assets/images/Card_${cardNumber}.png" style="height: 16vh;" />`; // Affiche la carte
              button.id = 'visible';
            }
            let scoreTextZone = this.el.nativeElement.querySelector('.tP' + PN);
            if (scorePlayer != 1) {
              scoreTextZone.innerHTML =
                '<b>Player ' +
                PN +
                ' (manche : ' +
                scorePlayer +
                ' pts, partie : ' +
                this.gameScorePlayers[PN] +
                ' pts)</b>';
            } else {
              scoreTextZone.innerHTML =
                '<b>Player ' +
                PN +
                ' (manche : ' +
                scorePlayer +
                ' pt, partie : ' +
                this.gameScorePlayers[PN] +
                ' pts)</b>';
            }
          }
          await this.pauseInSeconds(1);
        }
      } else if (PN != 1 && this.playerDidSkyjo !== PN) {
        let PNDiv: NodeListOf<HTMLDivElement> =
          this.el.nativeElement.querySelectorAll(
            `[class^="btn-"][class$="P${PN}"]`
          );
        for (let div of Array.from(PNDiv)) {
          if (div.id !== 'visible') {
            if (div.dataset['cardNumber'] !== undefined) {
              cardNumber = parseInt(div.dataset['cardNumber']);
              scorePlayer += cardNumber;
              div.innerHTML = `<img src="assets/images/Card_${cardNumber}.png" style="height: 16vh;" />`; // Affiche la carte
              div.id = 'visible';
            }
            let scoreTextZone = this.el.nativeElement.querySelector('.tP' + PN);
            if (scorePlayer != 1) {
              scoreTextZone.innerHTML =
                '<b>Player ' +
                PN +
                ' (manche : ' +
                scorePlayer +
                ' pts, partie : ' +
                this.gameScorePlayers[PN] +
                ' pts)</b>';
            } else {
              scoreTextZone.innerHTML =
                '<b>Player ' +
                PN +
                ' (manche : ' +
                scorePlayer +
                ' pt, partie : ' +
                this.gameScorePlayers[PN] +
                ' pts)</b>';
            }
          }
          await this.pauseInSeconds(1);
        }
      }
    }
    // On affiche qui remporte la manche
    let scoreMin = this.getVisibleScorePN(1); //Le score max est celui du P1 pour le moment
    this.gameScorePlayers[1] += scoreMin; //Score total de P1
    let winnerRound = 1;
    for (let PN = 2; PN <= this.playersNumber; PN++) {
      let scorePN = this.getVisibleScorePN(PN);
      this.gameScorePlayers[PN] += scorePN;
      /* console.log(`scorePN`, scorePN,`scoreMin`, scoreMin); */
      if (scorePN < scoreMin) {
        scoreMin = scorePN;
        winnerRound = PN;
      }
    }
    // Si fin de partie
    for (let gSP of this.gameScorePlayers) {
      if (gSP >= this.scoreAAtteindre) {
        this.afficherTexteP1(4); // Que quand toutes les manches sont effectuées ou score dépasse
        alert(
          `Lancer fonction de sauvegarde de partie et redirection vers la page des scores de l'utilisateur.`
        );
        //Lancer fonction de fin de partie ici
      }
    }
    // Si pas fin de partie, on met un bouton "Manche suivante"
    this.envoyerTexteP1(
      `Player ${winnerRound} remporte la manche avec ${scoreMin} points !`
    );
    let txtDiv = this.el.nativeElement.querySelector('#TexteP1');
    if (txtDiv) {
      let txtButton = document.createElement('button');
      txtButton.textContent = `Manche suivante`;
      txtButton.addEventListener('click', () => {
        if (txtDiv.contains(txtButton)) {
          txtDiv.removeChild(txtButton);
        }
        this.newRound();
      });
      txtDiv.appendChild(txtButton); //On ajoute le bouton à la division
    }
  }

  updatePlayerNScore(playerN: number) {
    let scorePlayer = 0;
    let turnedCardNumber = 0;
    let CardNumber = 0;
    let scoreTextZone = this.el.nativeElement.querySelector('.tP' + playerN);
    if (playerN == 1) {
      let visibleButton;
      visibleButton = this.el.nativeElement.querySelectorAll(
        `[class^="btn-"][class$="P${playerN}"]`
      );
      visibleButton.forEach((button: HTMLButtonElement) => {
        CardNumber++;
        if (button.id === 'visible') {
          turnedCardNumber++;
          if (button.dataset['cardNumber'] !== undefined) {
            /* console.log('avant calcul score :', this.scorePlayer); */
            scorePlayer += parseInt(button.dataset['cardNumber']);
            /* console.log('après calcul score :', this.scorePlayer); */
          }
        }
      });
    } else {
      let visibleDiv;
      visibleDiv = this.el.nativeElement.querySelectorAll(
        `[class^="c"][class$="P${playerN}"]`
      );
      visibleDiv.forEach((div: HTMLDivElement) => {
        CardNumber++;
        if (div.id === 'visible') {
          turnedCardNumber++;
          if (div.dataset['cardNumber'] !== undefined) {
            scorePlayer += parseInt(div.dataset['cardNumber']);
          }
        }
      });
    }
    if (scorePlayer != 1) {
      scoreTextZone.innerHTML =
        '<b>Player ' +
        playerN +
        ' (manche : ' +
        scorePlayer +
        ' pts, partie : ' +
        this.gameScorePlayers[playerN] +
        ' pts)</b>';
    } else {
      scoreTextZone.innerHTML =
        '<b>Player ' +
        playerN +
        ' (manche :' +
        scorePlayer +
        ' pt, partie : ' +
        this.gameScorePlayers[playerN] +
        ' pts)</b>';
    }
    if (turnedCardNumber == CardNumber) {
      return true; //true si c'est le dernier tour
    }
    return false;
  }

  getVisibleScorePN(PN: number): number {
    let score = 0;
    if (PN == 1) {
      let playerButtons;
      playerButtons = this.el.nativeElement.querySelectorAll(
        `[class^="btn-"][class$="P${PN}"]`
      );
      /* console.log([playerButtons]); */
      playerButtons.forEach((button: HTMLButtonElement) => {
        if (button.id === 'visible') {
          /* console.log(`Visible ? Oui`); */
          if (button.dataset['cardNumber'] !== undefined) {
            score += parseInt(button.dataset['cardNumber']);
          }
        }
        /* console.log(`getVisibleScorePN :`, score); */
      });
    } else {
      let playerDivs;
      playerDivs = this.el.nativeElement.querySelectorAll(
        `[class^="c"][class$="P${PN}"]`
      );
      playerDivs.forEach((div: HTMLDivElement) => {
        if (div.id === 'visible') {
          if (div.dataset['cardNumber'] !== undefined) {
            score += parseInt(div.dataset['cardNumber']);
          }
        }
      });
    }
    return score;
  }

  // === Création du deck ====================================================
  generateSkyjoCards() {
    // Mélange des cartes
    for (let i = this.completeImportedDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); //Mélange de Fisher-Yates : on prend une carte au hasard dans les cartes restantes
      [this.completeImportedDeck[i], this.completeImportedDeck[j]] = [
        this.completeImportedDeck[j],
        this.completeImportedDeck[i],
      ]; //Échange entre 2 cartes : j va dans i et i va dans j
    }
    return this.completeImportedDeck;
  }

  // ---- Pioche ------------------------------------------------------------------------
  // Retourne la carte du dessus du deck et la retire du deck
  drawCard() {
    if (this.deck.length === 0) {
      alert('Le deck est vide !');
      return null;
    }
    return this.deck.pop(); //Retire le dernier élément du tableau (retire une carte)
  }

  // Met à jour l'image du bouton pioche avec la carte tirée au déclenchement du (clic) ou à l'appel
  turnDrawCard() {
    let drawnCard = this.drawCard();
    if (
      drawnCard !== null &&
      drawnCard !== undefined &&
      !this.isDrawCardTurned
    ) {
      let btnPioche = this.el.nativeElement.querySelector('#btnPioche');
      const imagePath = `/assets/images/Card_${drawnCard}.png`;

      // Utilisation de Renderer2 pour mettre à jour le contenu de l'élément
      this.renderer.setProperty(
        btnPioche,
        'innerHTML',
        `<img src="${imagePath}" style="height: 16vh;"/>`
      );
      this.renderer.setAttribute(
        btnPioche,
        'data-card-number',
        drawnCard.toString()
      );
      /* console.log('turnDrawCard avec la carte numéro : ' + drawnCard); */
      this.isDrawCardTurned = true;
    }
  }

  hideDraw() {
    /* console.log('On met face cachée la pioche.'); */
    this.isDrawCardTurned = false;
    let drawCard = document.getElementById('btnPioche'); // Recherche le bouton de la carte de la pioche
    if (drawCard) {
      drawCard.innerHTML = `<img src="assets/images/Card.png" style="height: 16vh;"/>`; // On affiche la pioche par une carte face cachée, la prochaine carte est prete à être tirée
    }
  }

  // === Distribution Cartes ================================================================================
  // ----- P1 -----------------------------------------------------------------------
  // Distribuer une carte à chaque bouton du joueur P1
  distribuerCartesAuJoueurP1() {
    let boutonsCartesP1 = this.el.nativeElement.querySelectorAll('.P1 button'); // Tous les boutons de carte du joueur 1
    boutonsCartesP1.forEach((bouton: HTMLButtonElement) => {
      let drawnCard = this.drawCard(); // On pioche une carte
      // Si il reste des cartes dans le deck
      if (drawnCard !== null && drawnCard !== undefined) {
        bouton.dataset['cardNumber'] = drawnCard.toString(); // Ajoute l'attribut "data-card-number" au bouton avec le numéro de la carte
        bouton.addEventListener('click', (event) => this.turnP1Card(event));
        // Ajoute les événements de drag = glisser-déposer carte (expliqué plus tard)
        bouton.setAttribute('draggable', true.toString());
        bouton.addEventListener('dragover', this.dragOver);
        bouton.addEventListener('dragenter', this.dragEnter);
        bouton.addEventListener('dragleave', this.dragLeave);
        bouton.addEventListener('drop', this.dropAnyToP1);
      }
    });
    /* console.log('Cartes distribuées à P1.'); */
  }

  // ----- P2 à P5 -------------------------------------------------------------------
  distribuerCartesAuJoueurP2() {
    let classesCartesAdv =
      this.el.nativeElement.querySelectorAll(".P2 [class^='c']"); //Sélectionne toutes les classes des adversaires | console.log(boutonsCartesP2_5);
    classesCartesAdv.forEach((classe: HTMLDivElement) => {
      let drawnCard = this.drawCard();
      if (drawnCard !== null && drawnCard !== undefined) {
        classe.dataset['cardNumber'] = drawnCard.toString();
      }
    });
    /* console.log('Cartes distribuées à P2.'); */
  }

  // ----- P2 à P5 -------------------------------------------------------------------
  distribuerCartesAuJoueurP2_5() {
    let classesCartesP2_5 = this.el.nativeElement.querySelectorAll(
      ".P2 [class^='c'], .P3 [class^='c'], .P4 [class^='c'], .P5 [class^='c']"
    ); //Sélectionne toutes les classes des adversaires | console.log(boutonsCartesP2_5);
    classesCartesP2_5.forEach((classe: HTMLDivElement) => {
      let drawnCard = this.drawCard();
      if (drawnCard !== null && drawnCard !== undefined) {
        classe.dataset['cardNumber'] = drawnCard.toString();
      }
    });
    /* console.log('Cartes distribuées à P2, P3, P4 et P5.'); */
  }
  distributeCardsP2ToPN(playerN: number) {
    let classes = '';
    for (let PN = 2; PN <= playerN; PN++) {
      classes += `.P` + PN + ` [class^='c'],`; //Pour prendre en compte chaque classe de PN
      this.changeClass[PN] = 'P${PN}';
    }
    classes = classes.slice(0, -1); // on retire la derniere virgule | console.log('classes');
    let classesCardsP2_N = this.el.nativeElement.querySelectorAll(classes); //Sélectionne toutes les classes des adversaires
    classesCardsP2_N.forEach((classe: HTMLDivElement) => {
      let drawnCard = this.drawCard();
      if (drawnCard !== null && drawnCard !== undefined) {
        classe.dataset['cardNumber'] = drawnCard.toString();
      }
    });
    /* console.log('Cartes distribuées à P2, P3, P4 et P5.'); */
  }

  // ----- 1 carte dans la défausse ---------------------------------------------------
  distribuerPremiereCarteDefausse() {
    let btnDefausse = document.getElementById('btnDefausse');
    let drawnCard = this.drawCard();
    if (drawnCard !== null && btnDefausse !== null && drawnCard !== undefined) {
      btnDefausse.dataset['cardNumber'] = drawnCard.toString();
      btnDefausse.addEventListener('dragstart', this.dragStartDefausse);
      btnDefausse.innerHTML = `<img src="/assets/images/Card_${drawnCard}.png" style="height: 16vh;" /> `;
      this.defausse.push(drawnCard); //On rajoute le numéro de carte à la défausse
    }
    /* console.log('Première carte de la défausse distribuée.'); */
    /* console.log('La défausse contient ' + this.defausse + '.'); */
  }

  // === Fonctions diverses =================================================================================
  // Fonction appelée au clic sur une carte de P1
  turnP1Card(event: MouseEvent) {
    console.log('Rentre dans turnP1Card');
    const currentTime = event.timeStamp;

    // Vérifier si le temps écoulé depuis le dernier clic est supérieur au délai minimum (par exemple, 1000 ms)
    if (currentTime - this.lastClickTime > 10) {
      console.log("L'événement a été déclenché!");
      this.lastClickTime = currentTime; // Mettre à jour le temps du dernier clic

      const currentTarget = event.currentTarget as HTMLElement;

      console.log(`this.turnP1CardStart :`, this.turnP1CardStart);
      if (
        (currentTarget.id != 'visible' && this.TourP1 && this.turnP1CardOn) ||
        this.turnP1CardStart
      ) {
        console.log('Rentre dans boucle 1');
        this.turnedP1CardNumber = currentTarget.dataset['cardNumber'] ?? '';
        /* console.log(
        'Activation de turnCard. P1CardNumber =',
        this.turnedP1CardNumber
      ); */
        let P1Button = document.querySelector(
          '.' + currentTarget.className
        ) as HTMLElement; // Pour avoir la classe du bouton du dépôt P1
        P1Button.innerHTML = `<img src="assets/images/Card_${this.turnedP1CardNumber}.png" style="height: 16vh;" />`; // Affiche la carte de P1
        P1Button.id = 'visible';
        console.log('Carte rendue visible');
        this.visible++;
        document.dispatchEvent(this.visibleChangeEvent);
        if (this.event1OK) {
          console.log('event1OK, dispatchEvent !');
          document.dispatchEvent(this.visibleChangeEvent2);
        }
        this.P1CardTurned = true;
        //Maintenant il faut mettre la carte de la pioche à la défausse ssi on est en plein jeu et pas au début
        if (!this.turnP1CardStart) {
          console.log('Passe par turnP1CardStart');
          let newDefausseCardNumber = this.getValeurPioche(); // Récupère le numéro de la carte glissée
          if (newDefausseCardNumber != undefined) {
            this.updateDiscard(newDefausseCardNumber?.toString());
          }
          //this.updateFromTurn = true;
          this.hideDraw(); //Si la carte provient de la pioche, on cache la pioche. Elle sera actualisé en cliquant dessus
        } else {
          this.turnP1CardStart = false;
        }
        /* if (this.P1StartCard1 && !this.P1StartCard2) {
        this.P1StartCard2 = true;
      }
      if (!this.P1StartCard1) {
        this.P1StartCard1 = true;
      } */
      }
    }
  }

  turnP2_PNCard(dropDivClass: string): string {
    let Div = document.querySelector(`.${dropDivClass}`) as HTMLDivElement;
    let turnedCardNumber = Div.dataset['cardNumber'];
    Div.id = 'visible'; //Information pour dire que la carte est face visible désormais
    Div.innerHTML = `<img src="assets/images/Card_${turnedCardNumber}.png" style="height: 8vh;" />`; // Affiche la carte de P1
    //Maintenant il faut mettre la carte de la pioche à la défausse
    let newDefausseCardNumber = this.getValeurPioche(); // Récupère le numéro de la carte glissée
    if (newDefausseCardNumber != undefined) {
      this.updateDiscard(newDefausseCardNumber?.toString());
    }
    //this.updateFromTurn = true;
    this.hideDraw(); //Si la carte provient de la pioche, on actualise la pioche
    return turnedCardNumber ?? 'defaultValue';
  }

  // Fonction pour que l'IA tire deux cartes au début (il faut l'appeler 2 fois)
  IAturn1CardAtStart(dropDivClass: string): string {
    let cardDiv = document.querySelector(`.${dropDivClass}`) as HTMLDivElement;
    let turnedCardNumber = cardDiv.dataset['cardNumber'];
    cardDiv.id = 'visible'; //Information pour dire que la carte est face visible désormais
    cardDiv.innerHTML = `<img src="assets/images/Card_${turnedCardNumber}.png" style="height: 8vh;" />`; // Affiche la carte de P1
    return turnedCardNumber ?? 'defaultValue';
  }

  // --- Gestion du drag (glisser-déposer) -------------------------------
  dragStartDefausse(event: DragEvent) {
    this.draggedCard = document.getElementById('btnDefausse'); // Quand l'utilisateur commence à glisser un bouton
    if (this.draggedCard && this.discardOn) {
      this.draggedCard.classList.add('dragDefausse'); // Quand l'utilisateur commence à glisser un bouton
      if (event.dataTransfer) {
        event.dataTransfer.setData(
          'text/plain',
          this.draggedCard.dataset['cardNumber'] || ''
        ); // Lit le numéro de la carte
      }
      this.isDragging = true; // Le glisser-déposer est activé
    }
  }

  dragStartPioche(event: DragEvent) {
    if (this.TourP1 && this.isDrawCardTurned) {
      this.draggedCard = document.getElementById('btnPioche');
      if (this.draggedCard) {
        this.draggedCard.classList.add('dragPioche'); // Quand l'utilisateur commence à glisser un bouton
        if (event.dataTransfer) {
          event.dataTransfer.setData(
            'text/plain',
            this.draggedCard.dataset['cardNumber'] || ''
          ); // Lit le numéro de la carte
        }
        /* console.log(
          'dragStartPioche avec la carte numéro : ' +
            this.draggedCard.dataset['cardNumber']
        ); */
        this.isDragging = true; // Le glisser-déposer est activé
      }
    }
  }

  dragEnd() {
    this.isDragging = false; // Quand l'utilisateur a terminé de glisser le bouton, action sur ce bouton (et non celui de la zone où on dépose)
  }

  dragOver(event: DragEvent) {
    // Lorsqu'on lache la carte dans la zone
    if (this.isDragging) {
      event.preventDefault(); // Comportement de la zone de dépôt une fois dans la zone de dépôt
    }
  }

  dragEnter(event: DragEvent) {
    if (this.TourP1) {
      event.preventDefault(); // Lorsque le curseur rentre dans la zone de dépôt
      const currentTarget = event.currentTarget as HTMLElement;
      if (currentTarget && this.isDragging) {
        currentTarget.style.opacity = '0.7'; // Opacité changée pour savoir sur quelle zone on drop
      }
    }
  }

  dragLeave(event: DragEvent) {
    const currentTarget = event.currentTarget as HTMLElement;
    if (currentTarget) {
      currentTarget.style.opacity = ''; // Lorsque le curseur quitte la zone de dépôt, on retourne à l'opacité normale
    }
  }

  dropAnyToP1(event: DragEvent) {
    if (this.TourP1) {
      event.preventDefault();
      event.stopPropagation(); // On impose d'arrêter le glisser-déposer
      const currentTarget = event.currentTarget as HTMLElement;
      if (currentTarget && event.dataTransfer) {
        currentTarget.style.opacity = ''; // Pour que la carte face visible ne soit pas transparente
        let newCardNumber = event.dataTransfer.getData('text/plain'); // Récupère le numéro de la carte glissée
        let P1CardNumber = currentTarget.dataset['cardNumber']; // Récupère le numéro de la carte qui était dans la zone de dépôt P1
        let dropButtonClass = currentTarget.className; // Pour avoir la classe du bouton du dépôt P1
        this.replaceAnyToP1(newCardNumber, P1CardNumber, dropButtonClass); // La carte de la pioche va dans le plateau, la carte du plateau dans la défausse
        this.isDragging = false;
        /* console.log('drag de la carte venant de', this.draggedCard?.id + '.'); */
        this.cardDroppedInP1 = true;
      }
    }
  }

  updateDiscard(newDefausseCardNumber: string) {
    if (this.discardButton) {
      this.discardButton.dataset['cardNumber'] = newDefausseCardNumber; // Nouveau numéro pour le bouton défausse : anciennement P1
      this.discardButton.innerHTML = `<img src="assets/images/Card_${newDefausseCardNumber}.png" style="height: 16vh;" />`; //Met à jour le bon numéro sur la défausse
      if (newDefausseCardNumber !== undefined) {
        if (this.draggedCard?.id === 'btnDefausse') {
          this.defausse.pop();
        } //Si la carte vient de la défausse, on la retire du tableau
        this.defausse.push(parseInt(newDefausseCardNumber)); //On rajoute le numéro de carte à la défausse
      }
      /* console.log('La défausse contient ' + this.defausse + '.'); */
    }
  }

  replaceAnyToP1(
    newCardNumber: string | undefined,
    P1CardNumber: string | undefined,
    dropButtonClass: string
  ) {
    this.discardButton = document.getElementById('btnDefausse'); //On vient chercher la valeur de la défausse
    let P1Button = document.querySelector(
      `.${dropButtonClass}`
    ) as HTMLDivElement; // Recherche le bouton de la carte de P1 à remplacer
    if (P1Button) {
      P1Button.dataset['cardNumber'] = newCardNumber; // Nouveau numéro pour le bouton P1 : anciennement pioche ou defausse
      P1Button.innerHTML = `<img src="assets/images/Card_${newCardNumber}.png" style="height: 16vh;" />`; // Met à jour la carte de P1 avec la carte de la pioche ou defausse
      P1Button.id = 'visible'; //Information pour dire que la carte de P1 est face visible désormais
    }
    if (P1CardNumber !== undefined) {
      this.updateDiscard(P1CardNumber); //Si la carte va à la défausse, on actualise la défausse
    }
    this.hideDraw(); //Si la carte provient de la pioche, on actualise la pioche
  }

  replaceAnyToP2_PN(newCardNumber: string | undefined, dropDivClass: string) {
    this.discardButton = document.getElementById('btnDefausse'); //On vient chercher la valeur de la défausse
    let Div = document.querySelector(`.${dropDivClass}`) as HTMLDivElement; // Recherche le bouton de la carte de P1 à remplacer
    let oldCard = Div.dataset['cardNumber'];
    if (Div) {
      Div.dataset['cardNumber'] = newCardNumber; // Nouveau numéro pour le bouton P1 : anciennement pioche ou defausse
      Div.innerHTML = `<img src="assets/images/Card_${newCardNumber}.png" style="height: 8vh;" />`; // Met à jour la carte de P1 avec la carte de la pioche ou defausse
      Div.id = 'visible'; //Information pour dire que la carte de P1 est face visible désormais
    }
    if (oldCard !== undefined) {
      this.updateDiscard(oldCard); //Si la carte va à la défausse, on actualise la défausse
    }
    /* this.updateFromTurn = true; */
    this.hideDraw(); //Si la carte provient de la pioche, on actualise la pioche
  }

  newRound() {
    // promesses
    this.visibleEvent = new Event('visible');
    this.visibleEvent2 = new Event('visible');
    this.resolveVisibleEvent = () => {};
    this.resolveVisibleEvent2 = () => {};
    this.visiblePromise = new Promise<void>((resolve) => {
      this.resolveVisibleEvent = resolve;
    });
    this.visiblePromise2 = new Promise<void>((resolve) => {
      this.resolveVisibleEvent2 = resolve;
    });
    this.visibleChangeEvent = new Event('visibleChange');
    this.visibleChangeEvent2 = new Event('visibleChange2');
    // autre
    this.hideAllCards();
    this.defausse = []; //Tableau de la defausse qui accumule des cartes
    this.isDragging = false; // Variable pour indiquer si le glisser-déposer est en cours
    this.isDrawCardTurned = false;
    this.discardOn = true;
    this.cardDroppedInP1 = false;
    this.P1CardTurned = false;
    this.turnP1CardOn = false;
    this.turnP1CardStart = false;
    this.gameOver = false;
    this.P1StartCard1 = false;
    this.P1StartCard2 = false;
    this.event1OK = false;
    this.TourP1 = false; //Pour savoir si le P1 doit jouer
    this.lastTurn = false;
    this.playerDidSkyjo = 0;
    this.IA_P2 = new IA(1, 1);
    this.IA_P3 = new IA(1, 1);
    this.IA_P4 = new IA(1, 1);
    this.IA_P5 = new IA(1, 1);
    this.completeImportedDeck = completeDeck.slice(); //On réimporte 150 cartes
    this.deck = this.generateSkyjoCards(); // On regénère le deck
    this.distribuerCartesAuJoueurP1(); //
    this.distributeCardsP2ToPN(this.playersNumber); //
    this.distribuerPremiereCarteDefausse(); //
    this.dynamicIAs = {
      //Réinitialisation des variables
      IA_P2: this.IA_P2,
      IA_P3: this.IA_P3,
      IA_P4: this.IA_P4,
      IA_P5: this.IA_P5,
    };
    this.humanTwoCardsDraw();
  }

  hideAllCards() {
    let linkHiddenCardP1 = `<img src="./assets/images/Card.png" style="height: 16vh;" />`;
    let linkHiddenCardP2_P5 = `<img src="./assets/images/Card.png" style="height: 8vh;" />`;
    // Player 1
    let P1Buttons: NodeListOf<HTMLButtonElement> =
      this.el.nativeElement.querySelectorAll('[class^="btn-"][class$="P1"]');
    for (let button of Array.from(P1Buttons)) {
      button.innerHTML = linkHiddenCardP1;
      button.id = '';
    }
    // Player 2 à Player 5
    for (let PN = 2; PN <= this.playersNumber; PN++) {
      let PNDiv: NodeListOf<HTMLDivElement> =
        this.el.nativeElement.querySelectorAll(`[class^="c"][class$="P${PN}"]`);
      for (let div of Array.from(PNDiv)) {
        div.innerHTML = linkHiddenCardP2_P5;
        div.id = '';
      }
    }
  }
}
