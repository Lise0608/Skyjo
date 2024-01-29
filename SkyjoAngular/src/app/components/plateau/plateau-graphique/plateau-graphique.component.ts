import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { interval, fromEvent, merge, EMPTY } from 'rxjs';
import completeDeck from './../deck'; // Import des cartes du deck
import { takeUntil, filter } from 'rxjs/operators';

@Component({
  selector: 'app-plateau-graphique',
  templateUrl: './plateau-graphique.component.html',
  styleUrls: ['./plateau-graphique.component.css'],
})
export class PlateauGraphiqueComponent implements OnInit {
  deck: number[] = [];
  defausse: number[] = []; //Tableau de la defausse qui accumule des cartes
  scoreP1 = 0;
  draggedCard: HTMLElement | null = null; // Variable pour stocker la carte en cours de drag
  discardButton = document.getElementById('btnDefausse'); // Recherche le bouton de la carte de la défausse
  isDragging = false; // Variable pour indiquer si le glisser-déposer est en cours
  isDrawCardTurned = false;
  discardOn = true;
  cardDroppedInP1 = false;
  P1CardTurned = false;
  turnP1CardOn = false;

  TourP1 = false; //Pour savoir si le P1 doit jouer
  constructor(private renderer: Renderer2, private el: ElementRef) {
    this.turnP1Card = this.turnP1Card.bind(this);
    this.dragStartDefausse = this.dragStartDefausse.bind(this);
    this.dragStartPioche = this.dragStartPioche.bind(this);
    this.dropAnyToP1 = this.dropAnyToP1.bind(this);
    this.dropPiocheToDefausse = this.dropPiocheToDefausse.bind(this);
    this.replaceAnyToP1 = this.replaceAnyToP1.bind(this);
    this.dragEnter = this.dragEnter.bind(this);
    this.dragOver = this.dragOver.bind(this); //Permet de lier dragOver à toutes les variables déclarées au dessus.
    this.dragEnd = this.dragEnd.bind(this);
    this.P1Round = this.P1Round.bind(this);
    this.updatePlayerScore = this.updatePlayerScore.bind(this);
  }

  // === Déroulé partie ====================================================================================
  // ----- Initialisation du plateau après avoir lu toutes les fonctions -----------------
  ngOnInit() {
    this.deck = this.generateSkyjoCards(); // On génère le deck
    console.log(this.deck); // Affichage du nombre de cartes restantes dans le deck dans la console
    this.distribuerCartesAuJoueurP1(); //
    this.distribuerCartesAuJoueurP2(); //
    this.distribuerPremiereCarteDefausse(); //

    //Manque l'action du tirage au sorte
    this.P1Round(); //Appel de P1 en attendant
  }
  // ----- Chacun tire un carte pour voir qui commence ---------------------------------------
  // À FAIRE
  // Action pour appeler ensuite le tour du P1 ou P2
  // ----- Tour du joueur 1 ------------------------------------------------------
  async P1Round() {
    console.log('Début de P1Round');
    this.TourP1 = true; //Si false, on ne peut ni retourner ni glisser de carte.
    this.afficherTexteP1(0);
    await this.waitForDrawOrDiscard(); //On attend que le joueur choisisse entre pioche et défausse
    if (this.isDrawCardTurned) {
      this.discardOn = false;
      this.afficherTexteP1(1);
      console.log('Une carte de la pioche a été retournée.');
      this.turnP1CardOn = true;
      await this.waitForDrawOrTurn(); //On attend que le joueur choisisse entre glisser ou retourner une carte
      if (this.cardDroppedInP1) {
        console.log('Une carte a été mise de la pioche À P1.');
      } else if (this.P1CardTurned) {
        console.log('Une carte de P1 a été retournée.');
      }
    } else if (this.cardDroppedInP1) {
      console.log('Une carte a été mise de Défausse à P1.');
    }
    this.updatePlayerScore(1);
    this.P1CardTurned = false;
    this.cardDroppedInP1 = false;
    this.turnP1CardOn = false;
    this.discardOn = false;
    this.cacherTexteP1();
  }

  // === Fonctions =========================================================================================
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
    const texteP1 = this.el.nativeElement.querySelector('#TexteP1');
    this.renderer.addClass(texteP1, 'd-none');
    this.renderer.removeClass(texteP1, 'd-block');
  }
  afficherTexteP1(indexTexteP1: number) {
    const texteP1 = this.el.nativeElement.querySelector('#TexteP1');
    this.renderer.removeClass(texteP1, 'd-none');
    this.renderer.addClass(texteP1, 'd-block');
    let textes = [
      '<b>À toi de jouer !</b><br />Pioche une carte <b>ou</b> glisse celle de la défausse vers le plateau.',
      '<b>Carte piochée !</b><br />Glisse la carte vers le plateau <b>ou</b> retourne une des cartes du plateau.',
    ];
    texteP1.innerHTML = textes[indexTexteP1];
  }
  updatePlayerScore(playerN: number) {
    const scoreTextZone = this.el.nativeElement.querySelector('.tP1');
    scoreTextZone.innerHTML =
      '<b>Player ' + playerN + ' (' + '#####' + ' points)</b>';
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

  // Met à jour l'image du bouton pioche avec la carte tirée
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
    console.log('Cartes distribuées à P1.');
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
    console.log('Cartes distribuées à P2.');
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
    console.log('Cartes distribuées à P2, P3, P4 et P5.');
  }

  // ----- 1 carte dans la défausse ---------------------------------------------------
  distribuerPremiereCarteDefausse() {
    let btnDefausse = document.getElementById('btnDefausse');
    let drawnCard = this.drawCard();
    if (drawnCard !== null && btnDefausse !== null && drawnCard !== undefined) {
      btnDefausse.dataset['cardNumber'] = drawnCard.toString();
      btnDefausse.addEventListener('dragstart', this.dragStartDefausse);
      btnDefausse.innerHTML = `<img src="/assets/images/Card_${drawnCard}.png" style="height: 16vh;" /> `;
      btnDefausse.setAttribute('draggable', true.toString());
      btnDefausse.addEventListener('dragover', this.dragOver);
      btnDefausse.addEventListener('dragenter', this.dragEnter);
      btnDefausse.addEventListener('dragleave', this.dragLeave);
      btnDefausse.addEventListener('drop', this.dropPiocheToDefausse);
      this.defausse.push(drawnCard); //On rajoute le numéro de carte à la défausse
    }
    console.log('Première carte de la défausse distribuée.');
    console.log('La défausse contient ' + this.defausse + '.');
  }

  // === Fonctions diverses =================================================================================
  // Fonction appelée au clic sur une carte de P1
  turnP1Card(event: MouseEvent) {
    if (this.TourP1 && this.turnP1CardOn) {
      const currentTarget = event.currentTarget as HTMLElement;
      let P1CardNumber = currentTarget.dataset['cardNumber'];
      console.log('Activation de turnCard. P1CardNumber =', P1CardNumber);
      let P1Button = document.querySelector(
        '.' + currentTarget.className
      ) as HTMLElement; // Pour avoir la classe du bouton du dépôt P1
      P1Button.innerHTML = `<img src="assets/images/Card_${P1CardNumber}.png" style="height: 16vh;" />`; // Affiche la carte de P1
    }
    this.P1CardTurned = true;
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
        console.log(
          'dragStartPioche avec la carte numéro : ' +
            this.draggedCard.dataset['cardNumber']
        );
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
    //console.log('dragEnter!'); //Une fois
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
        console.log('drag de la carte venant de', this.draggedCard?.id + '.');
        this.cardDroppedInP1 = true;
      }
    }
  }

  updateDraw() {
    if (this.draggedCard && this.draggedCard.classList.contains('dragPioche')) {
      console.log('La carte provient de la pioche.');
      let drawCard = document.getElementById('btnPioche'); // Recherche le bouton de la carte de la pioche
      if (drawCard) {
        drawCard.innerHTML = `<img src="assets/images/Card.png" style="height: 16vh;"/>`; // On affiche la pioche par une carte face cachée, la prochaine carte est prete à être tirée
        this.isDrawCardTurned = false;
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
    }
    //console.log('Dans replaceAnyToP1, P1CardNumber = ' + P1CardNumber);
    if (P1CardNumber !== undefined) {
      //console.log('Dans replaceAnyToP1, on lance updateDiscard.');
      this.updateDiscard(P1CardNumber); //Si la carte va à la défausse, on actualise la défausse
    }
    this.updateDraw(); //Si la carte provient de la pioche, on actualise la pioche
  }

  dropPiocheToDefausse(event: DragEvent) {
    if (this.TourP1) {
      this.discardButton = document.getElementById('btnDefausse'); //On vient chercher la valeur de la défausse
      event.preventDefault();
      event.stopPropagation(); // On impose d'arrêter le glisser-déposer
      const currentTarget = event.currentTarget as HTMLElement;
      if (currentTarget && event.dataTransfer) {
        currentTarget.style.opacity = ''; // Pour que la carte face visible ne soit pas transparente
        let newDefausseCardNumber = event.dataTransfer.getData('text/plain'); // Récupère le numéro de la carte glissée
        this.updateDiscard(newDefausseCardNumber);
      }
      this.updateDraw(); //Si la carte provient de la pioche, on actualise la pioche
    }
  }
}
