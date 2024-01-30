import { CreationDePartieComponent } from './../../creation-de-partie/creation-de-partie.component';
import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { interval, fromEvent, merge, EMPTY } from 'rxjs';
import completeDeck from './../deck'; // Import des cartes du deck
import { takeUntil, filter, last } from 'rxjs/operators';
import { IA } from './../../../model/plateau/ia';
import { ActivatedRoute } from '@angular/router';
type RoundFunction = () => Promise<void>; //Pour aller d'un round à l'autre

@Component({
  selector: 'app-plateau-graphique',
  templateUrl: './plateau-graphique.component.html',
  styleUrls: ['./plateau-graphique.component.css'],
})
export class PlateauGraphiqueComponent implements OnInit {
  // À MODIFIER EN FCT DU NOMBRE DE JOUEURS
  donneesJoueurs: any;
  playersNumber = 0;
  IA1: IA = new IA(1, 1);

  // ---------------
  deck: number[] = [];
  defausse: number[] = []; //Tableau de la defausse qui accumule des cartes
  scorePlayer = 0;
  draggedCard: HTMLElement | null = null; // Variable pour stocker la carte en cours de drag
  discardButton = document.getElementById('btnDefausse'); // Recherche le bouton de la carte de la défausse
  isDragging = false; // Variable pour indiquer si le glisser-déposer est en cours
  isDrawCardTurned = false;
  discardOn = true;
  cardDroppedInP1 = false;
  P1CardTurned = false;
  turnP1CardOn = false;
  turnP1CardStart = false;
  gameOver = false;
  TourP1 = false; //Pour savoir si le P1 doit jouer
  updateFromTurn = false;
  turnedP1CardNumber = '';
  playerDidSkyjo = 0;
  private resolveCallback: ((event: MouseEvent) => void) | null = null;
  attributsRecus: any;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private route: ActivatedRoute
  ) {
    this.turnP1Card = this.turnP1Card.bind(this);
    this.dragStartDefausse = this.dragStartDefausse.bind(this);
    this.dragStartPioche = this.dragStartPioche.bind(this);
    this.dropAnyToP1 = this.dropAnyToP1.bind(this);
    this.replaceAnyToP1 = this.replaceAnyToP1.bind(this);
    this.dragEnter = this.dragEnter.bind(this);
    this.dragOver = this.dragOver.bind(this); //Permet de lier dragOver à toutes les variables déclarées au dessus.
    this.dragEnd = this.dragEnd.bind(this);
    this.P1Round = this.P1Round.bind(this);
    this.P2Round = this.P2Round.bind(this);
    this.updatePlayerNScore = this.updatePlayerNScore.bind(this);
    this.updateGame = this.updateGame.bind(this);
    this.replaceAnyToP2_5 = this.replaceAnyToP2_5.bind(this);
    this.getValeurDefausse = this.getValeurDefausse.bind(this);
    this.messageWhatPlayed = this.messageWhatPlayed.bind(this);
    this.turnDrawCard = this.turnDrawCard.bind(this);
    this.returnLastCards = this.returnLastCards.bind(this);
    this.pauseInSeconds = this.pauseInSeconds.bind(this);
    this.P1twoCardsDraw = this.P1twoCardsDraw.bind(this);
    this.P2twoCardsDraw = this.P2twoCardsDraw.bind(this);
    this.whoStart = this.whoStart.bind(this);
    this.getScorePlayerN = this.getScorePlayerN.bind(this);
    this.turnP2_5Card = this.turnP2_5Card.bind(this);
    this.turnP2_5CardStart = this.turnP2_5CardStart.bind(this);

    this.waitForDrawOrDiscard = this.waitForDrawOrDiscard.bind(this);
    this.waitForDrawOrTurn = this.waitForDrawOrTurn.bind(this);

    this.attributsRecus = this.route.snapshot.data;
  }

  // === Déroulé partie ====================================================================================
  // ----- Initialisation du plateau après avoir lu toutes les fonctions -----------------
  ngOnInit() {
    this.deck = this.generateSkyjoCards(); // On génère le deck
    console.log(this.deck); // Affichage du nombre de cartes restantes dans le deck dans la console
    this.route.paramMap.subscribe((params) => {
      const donneesJson = params.get('donneesJoueurs')!;
      this.donneesJoueurs = JSON.parse(donneesJson); // Désérialiser les données JSON
      console.log('Données des joueurs:', this.donneesJoueurs);
      // Utilisez les données des joueurs ici
    });
    /* console.log(this.deck); // Affichage du nombre de cartes restantes dans le deck dans la console */
    this.distribuerCartesAuJoueurP1(); //
    this.distribuerCartesAuJoueurP2(); //
    this.distribuerPremiereCarteDefausse(); //
    this.P1twoCardsDraw();
  }

  recevoirDonneesJoueurs(attributsRecus: any) {
    this.playersNumber = attributsRecus.length;
    console.log('Nombre de joueurs:', this.playersNumber);
    console.log('Données des joueurs:', attributsRecus);
  }

  // ----- Chacun tire deux cartes, la plus grande somme commence ---------------------------------------
  async P1twoCardsDraw() {
    this.afficherTexteP1(5);
    this.turnP1CardStart = true; //Pour autoriser le joueur à cliquer sur une des cartes du plateau
    const clickEventPromise1 = new Promise<MouseEvent>((resolve) => {
      this.resolveCallback = resolve;
    });
    await clickEventPromise1; //On attend que P1 retourne la première carte
    this.updatePlayerNScore(1);
    this.turnP1CardStart = true;
    const clickEventPromise2 = new Promise<MouseEvent>((resolve) => {
      this.resolveCallback = resolve;
    });
    await clickEventPromise2; //On attend que P1 retourne la deuxième carte
    this.updatePlayerNScore(1);
    this.P2twoCardsDraw();
  }
  async P2twoCardsDraw() {
    console.log('Tirage au sort : P2 doit tirer 2 cartes.');
    for (let i = 1; i <= 2; i++) {
      let nextCoord = this.IA1.nextCardPosition();
      let nextDiv = `c` + nextCoord[0] + `-` + nextCoord[1] + `P2`; //exemple : "c1-1P2"
      let cardNString = this.turnP2_5CardStart(nextDiv);
      this.messageWhatPlayed(parseInt(cardNString), 2, 0);
      this.updatePlayerNScore(2);
      await this.pauseInSeconds(2);
    }
    this.whoStart();
  }
  async whoStart() {
    let scoreMax: number[] = [1, this.getScorePlayerN(1)]; //Score player 1
    for (let playerN = 2; playerN <= this.playersNumber; playerN++) {
      let scoreP: number[] = [playerN, this.getScorePlayerN(playerN)]; // Prendre score max en fonction des autres players
      if (scoreP[1] > scoreMax[1]) {
        scoreMax = scoreP;
      }
    }
    let texteP1 = this.el.nativeElement.querySelector('#TexteP1');
    this.renderer.removeClass(texteP1, 'd-none');
    this.renderer.addClass(texteP1, 'd-block');
    texteP1.innerHTML = `<b>Player ${scoreMax[0]} a ${scoreMax[1]} points, il commence !</b>`;
    await this.pauseInSeconds(4);
    const nextRoundFunctionName = `P${scoreMax[0]}Round` as keyof this;
    const nextRoundFunction = this[nextRoundFunctionName] as RoundFunction;
    await nextRoundFunction();
  }

  // ----- Tour du joueur 1 ------------------------------------------------------
  async P1Round() {
    console.log('Début de P1Round');
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

  async P2Round() {
    console.log('Début de P2Round');
    let nextCoord = this.IA1.nextCardPosition();
    let nextDiv = `c` + nextCoord[0] + `-` + nextCoord[1] + `P2`; //exemple : "c1-1P2"
    let valeurDefausse = this.getValeurDefausse();
    let choix_pioche_defausse: boolean = false;
    let choix_pioche_tourner: boolean = false;
    if (valeurDefausse !== undefined) {
      choix_pioche_defausse = this.IA1.choixValeur(valeurDefausse); //true : l'IA pioche, false : l'IA prend la défausse
    }
    if (choix_pioche_defausse) {
      //Si personne n'a jamais pioché, il faut tourner la carte une première fois
      if (this.isDrawCardTurned === false) {
        this.turnDrawCard();
      }
      let valeurPioche = this.getValeurPioche();
      /* alert('IA Pioche un ' + valeurPioche?.toString()); */
      if (valeurPioche !== undefined) {
        choix_pioche_tourner = this.IA1.choixValeur(valeurPioche); //true : l'IA retourne une carte, false : l'IA utilise la pioche
      }
      if (choix_pioche_tourner) {
        let cardNString = this.turnP2_5Card(nextDiv);
        this.messageWhatPlayed(parseInt(cardNString), 2, 0);
      } else {
        this.replaceAnyToP2_5(valeurPioche?.toString(), nextDiv);
        if (valeurPioche !== undefined) {
          this.messageWhatPlayed(valeurPioche, 2, 1);
        }
      }
    } else {
      this.replaceAnyToP2_5(valeurDefausse?.toString(), nextDiv);
      if (valeurDefausse !== undefined) {
        this.messageWhatPlayed(valeurDefausse, 2, 2);
      }
    }
    this.updateGame(2);
  }

  async updateGame(lastPlayerNumber: number) {
    let nextPlayerNumber: number;
    this.gameOver = this.updatePlayerNScore(lastPlayerNumber);
    await this.pauseInSeconds(2);
    if (lastPlayerNumber < this.playersNumber) {
      nextPlayerNumber = lastPlayerNumber + 1; // Calculer le numéro du prochain joueur
    } else {
      nextPlayerNumber = 1;
    }
    if (this.gameOver) {
      this.afficherTexteP1(2); //Dernier tour !
      await this.pauseInSeconds(3); //Pause pour voir que c'est le dernier tour
      this.playerDidSkyjo = lastPlayerNumber;
      // Faire jouer autres joueurs puis fin de partie
    }
    if (this.playerDidSkyjo !== nextPlayerNumber) {
      const nextRoundFunctionName = `P${nextPlayerNumber}Round` as keyof this;
      const nextRoundFunction = this[nextRoundFunctionName] as RoundFunction;
      await nextRoundFunction();
    } else {
      this.returnLastCards();
    }
  }

  // === Fonctions =========================================================================================
  pauseInSeconds(secondes: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, secondes * 1000); // 1000 millisecondes équivalent à 1 seconde
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
    for (let playerN = 1; playerN <= this.playersNumber; playerN++) {
      if (playerN == 1 && this.playerDidSkyjo !== playerN) {
        let hiddenButton: NodeListOf<HTMLButtonElement> =
          this.el.nativeElement.querySelectorAll(
            `[class^="btn-"][class$="P${playerN}"]`
          );
        for (let button of Array.from(hiddenButton)) {
          if (button.id !== 'visible') {
            if (button.dataset['cardNumber'] !== undefined) {
              cardNumber = parseInt(button.dataset['cardNumber']);
              this.scorePlayer = this.scorePlayer + cardNumber;

              button.innerHTML = `<img src="assets/images/Card_${cardNumber}.png" style="height: 16vh;" />`; // Affiche la carte
            }
            let scoreTextZone = this.el.nativeElement.querySelector(
              '.tP' + playerN
            );
            if (this.scorePlayer != 1) {
              scoreTextZone.innerHTML =
                '<b>Player ' +
                playerN +
                ' (' +
                this.scorePlayer +
                ' points)</b>';
            } else {
              scoreTextZone.innerHTML =
                '<b>Player ' +
                playerN +
                ' (' +
                this.scorePlayer +
                ' point)</b>';
            }
          }
          await this.pauseInSeconds(1);
        } //});
      } else if (playerN != 1 && this.playerDidSkyjo !== playerN) {
        let hiddenDiv: NodeListOf<HTMLDivElement> =
          this.el.nativeElement.querySelectorAll(
            `[class^="btn-"][class$="P${playerN}"]`
          );
        for (let div of Array.from(hiddenDiv)) {
          if (div.id !== 'visible') {
            if (div.dataset['cardNumber'] !== undefined) {
              cardNumber = parseInt(div.dataset['cardNumber']);
              this.scorePlayer = this.scorePlayer + cardNumber;

              div.innerHTML = `<img src="assets/images/Card_${cardNumber}.png" style="height: 16vh;" />`; // Affiche la carte
            }
            let scoreTextZone = this.el.nativeElement.querySelector(
              '.tP' + playerN
            );
            if (this.scorePlayer != 1) {
              scoreTextZone.innerHTML =
                '<b>Player ' +
                playerN +
                ' (' +
                this.scorePlayer +
                ' points)</b>';
            } else {
              scoreTextZone.innerHTML =
                '<b>Player ' +
                playerN +
                ' (' +
                this.scorePlayer +
                ' point)</b>';
            }
          }
          await this.pauseInSeconds(1);
        } //});
      }
    }

    this.afficherTexteP1(4);
  }

  updatePlayerNScore(playerN: number) {
    this.scorePlayer = 0;
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
            this.scorePlayer =
              this.scorePlayer + parseInt(button.dataset['cardNumber']);
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
            this.scorePlayer =
              this.scorePlayer + parseInt(div.dataset['cardNumber']);
          }
        }
      });
    }
    if (this.scorePlayer != 1) {
      scoreTextZone.innerHTML =
        '<b>Player ' + playerN + ' (' + this.scorePlayer + ' points)</b>';
    } else {
      scoreTextZone.innerHTML =
        '<b>Player ' + playerN + ' (' + this.scorePlayer + ' point)</b>';
    }
    if (turnedCardNumber == CardNumber) {
      return true; //true si c'est le dernier tour
    }
    return false;
  }

  getScorePlayerN(playerN: number): number {
    let score = 0;
    let scoreTextZone = this.el.nativeElement.querySelector('.tP' + playerN);
    if (playerN == 1) {
      let playerButtons;
      playerButtons = this.el.nativeElement.querySelectorAll(
        `[class^="btn-"][class$="P${playerN}"]`
      );
      playerButtons.forEach((button: HTMLButtonElement) => {
        if (button.id === 'visible') {
          if (button.dataset['cardNumber'] !== undefined) {
            score = score + parseInt(button.dataset['cardNumber']);
          }
        }
      });
    } else {
      let playerDivs;
      playerDivs = this.el.nativeElement.querySelectorAll(
        `[class^="c"][class$="P${playerN}"]`
      );
      playerDivs.forEach((div: HTMLDivElement) => {
        if (div.id === 'visible') {
          if (div.dataset['cardNumber'] !== undefined) {
            score = score + parseInt(div.dataset['cardNumber']);
          }
        }
      });
    }
    return score;
  }

  onClickP1Button(event: MouseEvent) {
    // Vérification si un glisser-déposer est en cours
    if (this.isDragging) {
      let cardNumber = (event.target as HTMLButtonElement).dataset[
        'cardNumber'
      ];
      (
        event.target as HTMLButtonElement
      ).innerHTML = `<img src="assets/images/Card_${cardNumber}.png" />`;
      (event.target as HTMLButtonElement).removeEventListener(
        'click',
        this.onClickP1Button
      );
    }
  }

  // === Création du deck ====================================================
  generateSkyjoCards() {
    // Mélange des cartes
    for (let i = completeDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); //Mélange de Fisher-Yates : on prend une carte au hasard dans les cartes restantes
      [completeDeck[i], completeDeck[j]] = [completeDeck[j], completeDeck[i]]; //Échange entre 2 cartes : j va dans i et i va dans j
    }
    return completeDeck;
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
      console.log('turnDrawCard avec la carte numéro : ' + drawnCard);
      this.isDrawCardTurned = true;
    }
  }

  updateDraw() {
    if (
      (this.draggedCard && this.draggedCard.classList.contains('dragPioche')) ||
      this.updateFromTurn === true
    ) {
      /* console.log('On retourne la carte de la pioche.'); */
      this.isDrawCardTurned = false;
      this.turnDrawCard();
      let drawCard = document.getElementById('btnPioche'); // Recherche le bouton de la carte de la pioche
      if (drawCard) {
        drawCard.innerHTML = `<img src="assets/images/Card.png" style="height: 16vh;"/>`; // On affiche la pioche par une carte face cachée, la prochaine carte est prete à être tirée
        this.isDrawCardTurned = false;
        this.updateFromTurn = false;
      }
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

  // ----- 1 carte dans la défausse ---------------------------------------------------
  distribuerPremiereCarteDefausse() {
    let btnDefausse = document.getElementById('btnDefausse');
    let drawnCard = this.drawCard();
    if (drawnCard !== null && btnDefausse !== null && drawnCard !== undefined) {
      btnDefausse.dataset['cardNumber'] = drawnCard.toString();
      btnDefausse.addEventListener('dragstart', this.dragStartDefausse);
      btnDefausse.innerHTML = `<img src="/assets/images/Card_${drawnCard}.png" style="height: 16vh;" /> `;
      /* btnDefausse.setAttribute('draggable', true.toString());
      btnDefausse.addEventListener('dragover', this.dragOver);
      btnDefausse.addEventListener('dragenter', this.dragEnter);
      btnDefausse.addEventListener('dragleave', this.dragLeave); */
      /* btnDefausse.addEventListener('drop', this.dropPiocheToDefausse); */
      this.defausse.push(drawnCard); //On rajoute le numéro de carte à la défausse
    }
    /* console.log('Première carte de la défausse distribuée.'); */
    console.log('La défausse contient ' + this.defausse + '.');
  }

  // === Fonctions diverses =================================================================================
  // Fonction appelée au clic sur une carte de P1
  turnP1Card(event: MouseEvent) {
    const currentTarget = event.currentTarget as HTMLElement;
    if (
      (currentTarget.id != 'visible' && this.TourP1 && this.turnP1CardOn) ||
      this.turnP1CardStart
    ) {
      this.turnedP1CardNumber = currentTarget.dataset['cardNumber'] ?? '';
      console.log(
        'Activation de turnCard. P1CardNumber =',
        this.turnedP1CardNumber
      );
      let P1Button = document.querySelector(
        '.' + currentTarget.className
      ) as HTMLElement; // Pour avoir la classe du bouton du dépôt P1
      P1Button.innerHTML = `<img src="assets/images/Card_${this.turnedP1CardNumber}.png" style="height: 16vh;" />`; // Affiche la carte de P1
      P1Button.id = 'visible';
      this.P1CardTurned = true;
      //Maintenant il faut mettre la carte de la pioche à la défausse
      let newDefausseCardNumber = this.getValeurPioche(); // Récupère le numéro de la carte glissée
      if (newDefausseCardNumber != undefined) {
        this.updateDiscard(newDefausseCardNumber?.toString());
      }
      this.updateFromTurn = true;
      this.turnP1CardStart = false;
      this.updateDraw(); //Si la carte provient de la pioche, on actualise la pioche
      if (this.resolveCallback) {
        this.resolveCallback(event);
        this.resolveCallback = null; // Réinitialiser la fonction de résolution
      }
    }
  }

  turnP2_5Card(dropDivClass: string): string {
    let P2_5Div = document.querySelector(`.${dropDivClass}`) as HTMLDivElement;
    let turnedCardNumber = P2_5Div.dataset['cardNumber'];
    P2_5Div.id = 'visible'; //Information pour dire que la carte est face visible désormais
    P2_5Div.innerHTML = `<img src="assets/images/Card_${turnedCardNumber}.png" style="height: 8vh;" />`; // Affiche la carte de P1
    //Maintenant il faut mettre la carte de la pioche à la défausse
    let newDefausseCardNumber = this.getValeurPioche(); // Récupère le numéro de la carte glissée
    if (newDefausseCardNumber != undefined) {
      this.updateDiscard(newDefausseCardNumber?.toString());
    }
    this.updateFromTurn = true;
    this.updateDraw(); //Si la carte provient de la pioche, on actualise la pioche
    return turnedCardNumber ?? 'defaultValue';
  }

  turnP2_5CardStart(dropDivClass: string): string {
    let P2_5Div = document.querySelector(`.${dropDivClass}`) as HTMLDivElement;
    let turnedCardNumber = P2_5Div.dataset['cardNumber'];
    P2_5Div.id = 'visible'; //Information pour dire que la carte est face visible désormais
    P2_5Div.innerHTML = `<img src="assets/images/Card_${turnedCardNumber}.png" style="height: 8vh;" />`; // Affiche la carte de P1
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
      console.log('La défausse contient ' + this.defausse + '.');
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
    this.updateDraw(); //Si la carte provient de la pioche, on actualise la pioche
  }

  replaceAnyToP2_5(newCardNumber: string | undefined, dropDivClass: string) {
    this.discardButton = document.getElementById('btnDefausse'); //On vient chercher la valeur de la défausse
    let P2_5Div = document.querySelector(`.${dropDivClass}`) as HTMLDivElement; // Recherche le bouton de la carte de P1 à remplacer
    let oldCard = P2_5Div.dataset['cardNumber'];
    if (P2_5Div) {
      P2_5Div.dataset['cardNumber'] = newCardNumber; // Nouveau numéro pour le bouton P1 : anciennement pioche ou defausse
      P2_5Div.innerHTML = `<img src="assets/images/Card_${newCardNumber}.png" style="height: 8vh;" />`; // Met à jour la carte de P1 avec la carte de la pioche ou defausse
      P2_5Div.id = 'visible'; //Information pour dire que la carte de P1 est face visible désormais
    }
    if (oldCard !== undefined) {
      this.updateDiscard(oldCard); //Si la carte va à la défausse, on actualise la défausse
    }
    this.updateFromTurn = true;
    this.updateDraw(); //Si la carte provient de la pioche, on actualise la pioche
  }
}
