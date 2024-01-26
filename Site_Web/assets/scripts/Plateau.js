// === Création du deck ====================================================
function generateSkyjoCards() {
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

// Génération de la liste des cartes
let Deck = generateSkyjoCards(); // ### déroulé partie ### : On génère le deck

// Affichage du nombre de cartes restantes dans le deck dans la console
console.log(Deck);

// ---- Pioche ------------------------------------------------------------------------
// Retourne la carte du dessus du deck et la retire du deck
function drawCard(deck) {
  if (deck.length === 0) {
    alert("Le deck est vide !");
    return null;
  }
  return deck.pop(); //Retire le dernier élément du tableau (retire une carte)
}

// Met à jour l'image du bouton pioche avec la carte tirée
function updateImagePioche() {
  let drawnCard = drawCard(Deck);
  if (drawnCard !== null) {
    let btnPioche = document.getElementById("btnPioche");
    btnPioche.innerHTML = `<img src="./assets/images/Card_${drawnCard}.png" />`;
    btnPioche.dataset.cardNumber = drawnCard;
    console.log(
      "updateImagePioche avec la carte numéro : " + btnPioche.dataset.cardNumber
    );
  }
}

// Gestionnaire d'événements pour le clic sur le bouton pioche
document
  .getElementById("btnPioche")
  .addEventListener("click", updateImagePioche);
document
  .getElementById("btnPioche")
  .addEventListener("dragstart", dragStartPioche); //On lit les infos quand il commenc à etre glissé

// === Distribution Cartes ================================================================================
// ----- P1 -----------------------------------------------------------------------
let boutonsCartesP1 = document.querySelectorAll(".P1 button"); // Tous les boutons de carte du joueur 1

// Distribuer une carte à chaque bouton du joueur P1
function distribuerCartesAuJoueurP1() {
  boutonsCartesP1.forEach((bouton) => {
    let drawnCard = drawCard(Deck); // On pioche une carte
    // Si il reste des cartes dans le deck
    if (drawnCard !== null) {
      bouton.dataset.cardNumber = drawnCard; // Ajoute l'attribut "data-card-number" au bouton avec le numéro de la carte
      bouton.addEventListener("click", turnCard);
      // Ajoute les événements de drag = glisser-déposer carte (expliqué plus tard)
      bouton.setAttribute("draggable", true);
      bouton.addEventListener("dragstart", dragStartP1);
      bouton.addEventListener("dragover", dragOver);
      bouton.addEventListener("dragenter", dragEnter);
      bouton.addEventListener("dragleave", dragLeave);
      bouton.addEventListener("drop", dropAnyToP1);
    }
  });
  console.log("Cartes distribuées à P1.");
}
distribuerCartesAuJoueurP1(); // ### déroulé partie ### : distribution des cartes à P1

// ----- P2 à P5 -------------------------------------------------------------------
let classesCartesP2_5 = document.querySelectorAll(
  ".P2 [class^='c'], .P3 [class^='c'], .P4 [class^='c'], .P5 [class^='c']"
); //Sélectionne toutes les classes des adversaires | console.log(boutonsCartesP2_5);
function distribuerCartesAuJoueurP2_5() {
  classesCartesP2_5.forEach((classe) => {
    let drawnCard = drawCard(Deck);
    if (drawnCard !== null) {
      classe.dataset.cardNumber = drawnCard;
    }
  });
  console.log("Cartes distribuées à P2. P3, P4 et P5.");
}
distribuerCartesAuJoueurP2_5(); // ### déroulé partie ### : distribution des cartes à P2, P3, P4, P5

// ----- 1 carte dans la défausse ---------------------------------------------------
let btnDefausse = document.getElementById("btnDefausse");
function distribuerPremiereCarteDefausse() {
  let drawnCard = drawCard(Deck);
  if (drawnCard !== null) {
    btnDefausse.dataset.cardNumber = drawnCard;
  }
  btnDefausse.addEventListener("dragstart", dragStartDefausse);
  btnDefausse.innerHTML = `<img src="./assets/images/Card_${drawnCard}.png" />`;
  console.log("Première carte de la défausse distribuée.");
}
distribuerPremiereCarteDefausse(); // ### déroulé partie ### : distribution d'une carte sur la défausse

// === Fonctions diverses =================================================================================
// ----- Fonctions sur cartes des joueurs ------------------------------
// Fonction appelée au clic sur une carte de P1 [ne doit etre utilisée que quand on jette la carte piochée]
function turnCard() {
  // Vérification si un glisser-déposer est en cours
  if (isDragging) {
    let cardNumber = this.dataset.cardNumber; // Récupère le numéro de la carte
    this.innerHTML = `<img src="./assets/images/Card_${cardNumber}.png" />`; // Met à jour l'image du bouton avec le nouveau numéro de carte
    this.removeEventListener("click", turnCard); // Retire le gestionnaire d'événements
  }
}

// --- Gestion du drag (glisser-déposer) -------------------------------
let draggedCard; // Variable pour stocker la carte en cours de drag
let isDragging = false; // Variable pour indiquer si le glisser-déposer est en cours
function dragStartP1(event) {
  draggedCard = event.target; // Quand l'utilisateur commence à glisser un bouton
  draggedCard.classList.add("dragP1"); // Quand l'utilisateur commence à glisser un bouton
  event.dataTransfer.setData("text/plain", draggedCard.dataset.cardNumber); // Lit le numéro de la carte
  isDragging = true; // Le glisser-déposer est activé
}
function dragStartDefausse(event) {
  draggedCard = document.getElementById("btnDefausse"); // Quand l'utilisateur commence à glisser un bouton
  draggedCard.classList.add("dragDefausse"); // Quand l'utilisateur commence à glisser un bouton
  event.dataTransfer.setData("text/plain", draggedCard.dataset.cardNumber); // Lit le numéro de la carte
  isDragging = true; // Le glisser-déposer est activé
}
function dragStartPioche(event) {
  draggedCard = document.getElementById("btnPioche");
  draggedCard.classList.add("dragPioche"); // Quand l'utilisateur commence à glisser un bouton
  event.dataTransfer.setData("text/plain", draggedCard.dataset.cardNumber); // Lit le numéro de la carte
  console.log(
    "dragStartPioche avec la carte numéro : " + draggedCard.dataset.cardNumber
  );
  isDragging = true; // Le glisser-déposer est activé
}
function dragEnd() {
  isDragging = false; // Quand l'utilisateur a terminé de glisser le bouton, action sur ce bouton (et non celui de la zone où on dépose)
}
function dragOver(event) {
  event.preventDefault(); // Comportement de la zone de dépôt une fois dans la zone de dépôt
}
function dragEnter(event) {
  event.preventDefault(); // Lorsque le curseur rentre dans la zone de dépôt
  event.currentTarget.style.opacity = 0.7; // Opacité changée pour savoir sur quelle zone on drop
}
function dragLeave(event) {
  event.currentTarget.style.opacity = ""; // Lorsque le curseur quitte la zone de dépôt, on retourne à l'opacité normale
}
function dropAnyToP1(event) {
  event.preventDefault();
  event.stopPropagation(); // On impose d'arrêter le glisser-déposer
  event.currentTarget.style.opacity = ""; // Pour que la carte face visible ne soit pas transparente
  let newCardNumber = event.dataTransfer.getData("text/plain"); // Récupère le numéro de la carte glissée
  let P1CardNumber = event.currentTarget.dataset.cardNumber; // Récupère le numéro de la carte qui était dans la zone de dépôt P1
  let dropButtonClass = event.currentTarget.className; // Pour avoir la classe du bouton du dépôt P1
  replaceAnyToP1(newCardNumber, P1CardNumber, dropButtonClass); // La carte de la pioche va dans le plateau, la carte du plateau dans la défausse
}
function replaceAnyToP1(newCardNumber, P1CardNumber, dropButtonClass) {
  let discardButton = document.getElementById("btnDefausse"); // Recherche le bouton de la carte de la défausse
  let P1Button = document.querySelector(`.${dropButtonClass}`); // Recherche le bouton de la carte de P1 à remplacer
  P1Button.dataset.cardNumber = newCardNumber; // Nouveau numéro pour le bouton P1 : anciennement pioche ou defausse
  P1Button.innerHTML = `<img src="./assets/images/Card_${newCardNumber}.png" />`; // Met à jour la carte de P1 avec la carte de la pioche ou defausse
  discardButton.dataset.cardNumber = P1CardNumber; // Nouveau numéro pour le bouton défausse : anciennement P1
  discardButton.innerHTML = `<img src="./assets/images/Card_${P1CardNumber}.png" />`; //Met à jour le bon numéro sur la défausse
  //Si la carte provient de la pioched
  if (draggedCard.classList.contains("dragPioche")) {
    console.log("La carte provient de la pioche.");
    let drawCard = document.getElementById("btnPioche"); // Recherche le bouton de la carte de la pioche
    drawCard.innerHTML = `<img src="./assets/images/Card.png" />`; // On affiche la pioche par une carte face cachée, la prochaine carte est prete à être tirée
  }
}
