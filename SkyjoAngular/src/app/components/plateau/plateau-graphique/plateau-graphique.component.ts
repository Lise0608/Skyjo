import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-plateau-graphique',
  templateUrl: './plateau-graphique.component.html',
  styleUrls: ['./plateau-graphique.component.css'],
})
export class PlateauGraphiqueComponent implements OnInit {
  deck: number[] = [];
  draggedCard: HTMLElement | null = null; // Variable pour stocker la carte en cours de drag
  isDragging = false; // Variable pour indiquer si le glisser-déposer est en cours

  constructor(private renderer: Renderer2, private el: ElementRef) {
    this.turnCard = this.turnCard.bind(this);
    this.dragStartP1 = this.dragStartP1.bind(this);
    this.dragStartDefausse = this.dragStartDefausse.bind(this);
    this.dragStartPioche = this.dragStartPioche.bind(this);
    this.dropAnyToP1 = this.dropAnyToP1.bind(this);
    this.replaceAnyToP1 = this.replaceAnyToP1.bind(this);
  }

  ngOnInit() {
    this.deck = this.generateSkyjoCards(); // ### déroulé partie ### : On génère le deck
    console.log(this.deck); // Affichage du nombre de cartes restantes dans le deck dans la console
    this.distribuerCartesAuJoueurP1();
    this.distribuerCartesAuJoueurP2_5();
    this.distribuerPremiereCarteDefausse();

    const buttonsP1 = this.el.nativeElement.querySelectorAll('.P1 button');
    buttonsP1.forEach((button: HTMLButtonElement) => {
      button.addEventListener('click', (event) => this.onClickP1Button(event));
    });
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
    const completeDeck = [
      -2,
      -2,
      -2,
      -2,
      -2, // 5x-2
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1, // 10x-1
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0, // 15x0
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1, // 10x1
      2,
      2,
      2,
      2,
      2,
      2,
      2,
      2,
      2,
      2, // 10x2
      3,
      3,
      3,
      3,
      3,
      3,
      3,
      3,
      3,
      3, // 10x3
      4,
      4,
      4,
      4,
      4,
      4,
      4,
      4,
      4,
      4, // 10x4
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5, // 10x5
      6,
      6,
      6,
      6,
      6,
      6,
      6,
      6,
      6,
      6, // 10x6
      7,
      7,
      7,
      7,
      7,
      7,
      7,
      7,
      7,
      7, // 10x7
      8,
      8,
      8,
      8,
      8,
      8,
      8,
      8,
      8,
      8, // 10x8
      9,
      9,
      9,
      9,
      9,
      9,
      9,
      9,
      9,
      9, // 10x9
      10,
      10,
      10,
      10,
      10,
      10,
      10,
      10,
      10,
      10, // 10x10
      11,
      11,
      11,
      11,
      11,
      11,
      11,
      11,
      11,
      11, // 10x11
      12,
      12,
      12,
      12,
      12,
      12,
      12,
      12,
      12,
      12, // 10x12
    ];

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
  updateImagePioche() {
    let drawnCard = this.drawCard();
    if (drawnCard !== null && drawnCard !== undefined) {
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

      console.log('updateImagePioche avec la carte numéro : ' + drawnCard);
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
        bouton.addEventListener('click', (event) => this.turnCard(event));
        // Ajoute les événements de drag = glisser-déposer carte (expliqué plus tard)
        bouton.setAttribute('draggable', true.toString());
        bouton.addEventListener('dragstart', this.dragStartP1);
        bouton.addEventListener('dragover', this.dragOver);
        bouton.addEventListener('dragenter', this.dragEnter);
        bouton.addEventListener('dragleave', this.dragLeave);
        bouton.addEventListener('drop', this.dropAnyToP1);
      }
    });
    console.log('Cartes distribuées à P1.');
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
    console.log('Cartes distribuées à P2. P3, P4 et P5.');
  }

  // ----- 1 carte dans la défausse ---------------------------------------------------
  distribuerPremiereCarteDefausse() {
    let btnDefausse = document.getElementById('btnDefausse');
    let drawnCard = this.drawCard();
    if (drawnCard !== null && btnDefausse !== null && drawnCard !== undefined) {
      btnDefausse.dataset['cardNumber'] = drawnCard.toString();
      btnDefausse.addEventListener('dragstart', this.dragStartDefausse);
      btnDefausse.innerHTML = `<img src="/assets/images/Card_${drawnCard}.png" style="height: 16vh;" /> `;
    }
    console.log('Première carte de la défausse distribuée.');
  }

  // === Fonctions diverses =================================================================================
  // ----- Fonctions sur cartes des joueurs ------------------------------
  // Fonction appelée au clic sur une carte de P1 [ne doit etre utilisée que quand on jette la carte piochée]
  turnCard(event: MouseEvent) {
    // Vérification si un glisser-déposer est en cours
    if (this.isDragging) {
      let cardNumber = (event.target as HTMLButtonElement).dataset[
        'cardNumber'
      ]; // Récupère le numéro de la carte
      (
        event.target as HTMLButtonElement
      ).innerHTML = `<img src="assets/images/Card_${cardNumber}.png" />`; // Met à jour l'image du bouton avec le nouveau numéro de carte
      (event.target as HTMLButtonElement).removeEventListener(
        'click',
        this.turnCard
      ); // Retire le gestionnaire d'événements
    }
  }

  // --- Gestion du drag (glisser-déposer) -------------------------------

  dragStartP1(event: DragEvent) {
    this.draggedCard = event.target as HTMLElement; // Quand l'utilisateur commence à glisser un bouton
    this.renderer.addClass(this.draggedCard, 'dragP1'); // Quand l'utilisateur commence à glisser un bouton
    if (event.dataTransfer) {
      event.dataTransfer.setData(
        'text/plain',
        this.draggedCard.dataset['cardNumber'] || ''
      ); // Lit le numéro de la carte
    }
    this.isDragging = true; // Le glisser-déposer est activé
  }
  dragStartDefausse(event: DragEvent) {
    this.draggedCard = document.getElementById('btnDefausse'); // Quand l'utilisateur commence à glisser un bouton

    if (this.draggedCard) {
      this.draggedCard.classList.add('ragDefausse'); // Quand l'utilisateur commence à glisser un bouton

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
  dragEnd() {
    this.isDragging = false; // Quand l'utilisateur a terminé de glisser le bouton, action sur ce bouton (et non celui de la zone où on dépose)
  }
  dragOver(event: DragEvent) {
    event.preventDefault(); // Comportement de la zone de dépôt une fois dans la zone de dépôt
  }
  dragEnter(event: DragEvent) {
    event.preventDefault(); // Lorsque le curseur rentre dans la zone de dépôt
    const currentTarget = event.currentTarget as HTMLElement;
    if (currentTarget) {
      currentTarget.style.opacity = '0.7'; // Opacité changée pour savoir sur quelle zone on drop
    }
  }

  dragLeave(event: DragEvent) {
    const currentTarget = event.currentTarget as HTMLElement;
    if (currentTarget) {
      currentTarget.style.opacity = ''; // Lorsque le curseur quitte la zone de dépôt, on retourne à l'opacité normale
    }
  }

  dropAnyToP1(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation(); // On impose d'arrêter le glisser-déposer
    const currentTarget = event.currentTarget as HTMLElement;
    if (currentTarget && event.dataTransfer) {
      currentTarget.style.opacity = ''; // Pour que la carte face visible ne soit pas transparente
      let newCardNumber = event.dataTransfer.getData('text/plain'); // Récupère le numéro de la carte glissée
      let P1CardNumber = currentTarget.dataset['cardNumber']; // Récupère le numéro de la carte qui était dans la zone de dépôt P1
      let dropButtonClass = currentTarget.className; // Pour avoir la classe du bouton du dépôt P1
      this.replaceAnyToP1(newCardNumber, P1CardNumber, dropButtonClass); // La carte de la pioche va dans le plateau, la carte du plateau dans la défausse
    }
  }

  replaceAnyToP1(
    newCardNumber: string | undefined,
    P1CardNumber: string | undefined,
    dropButtonClass: string
  ) {
    let discardButton = document.getElementById('btnDefausse'); // Recherche le bouton de la carte de la défausse
    let P1Button = document.querySelector(
      `.${dropButtonClass}`
    ) as HTMLDivElement; // Recherche le bouton de la carte de P1 à remplacer
    if (P1Button) {
      P1Button.dataset['cardNumber'] = newCardNumber; // Nouveau numéro pour le bouton P1 : anciennement pioche ou defausse
      P1Button.innerHTML = `<img src="assets/images/Card_${newCardNumber}.png" style="height: 16vh;" />`; // Met à jour la carte de P1 avec la carte de la pioche ou defausse
    }
    if (discardButton) {
      discardButton.dataset['cardNumber'] = P1CardNumber; // Nouveau numéro pour le bouton défausse : anciennement P1
      discardButton.innerHTML = `<img src="assets/images/Card_${P1CardNumber}.png" style="height: 16vh;" />`; //Met à jour le bon numéro sur la défausse
    }
    //Si la carte provient de la pioched
    if (this.draggedCard && this.draggedCard.classList.contains('dragPioche')) {
      console.log('La carte provient de la pioche.');
      let drawCard = document.getElementById('btnPioche'); // Recherche le bouton de la carte de la pioche
      if (drawCard) {
        drawCard.innerHTML = `<img src="assets/images/Card.png" style="height: 16vh;"/>`; // On affiche la pioche par une carte face cachée, la prochaine carte est prete à être tirée
      }
    }
  }
}
