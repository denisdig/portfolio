// === Données du jeu ===
const couleurs = ['♠', '♥', '♦', '♣'];
const valeurs = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];

let deck = [];
const joueur1 = []; // main joueur
const joueur2 = []; // main IA
const pileJoueur1 = []; // cartes prises par le joueur
const pileJoueur2 = []; // cartes prises par l'IA
const table = []; // cartes sur la table

let pointsBonusJoueur1 = 0; // points bonus (+10, +25)
let pointsBonusJoueur2 = 0;
let tourJoueur = 1; // 1 = joueur, 2 = IA

// === Création et distribution des cartes ===
function createDeck() {
  const deck = [];
  for (const couleur of couleurs) {
    for (const valeur of valeurs) {
      deck.push({ couleur, valeur, id: `${valeur}${couleur}` });
    }
  }
  return deck;
}

function shuffle(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function distribuerCartes(deck) {
  for (let i = 0; i < 4; i++) table.push(deck.pop());
  for (let i = 0; i < 4; i++) {
    joueur1.push(deck.pop());
    joueur2.push(deck.pop());
  }
}

// Valeur normale d'une carte (pour le scoring)
function valeurCarte(carte) {
  if (carte.valeur === '10' && carte.couleur === '♦') return 2;
  if (['A','J','Q','K','10','2'].includes(carte.valeur)) return 1;
  return 0;
}

// === Mise à jour des points ===
function majPoints() {
  const pointsNormaux1 = pileJoueur1.reduce((total, carte) => total + valeurCarte(carte), 0);
  const pointsNormaux2 = pileJoueur2.reduce((total, carte) => total + valeurCarte(carte), 0);

  document.getElementById("points1").textContent = pointsNormaux1 + pointsBonusJoueur1;
  document.getElementById("points2").textContent = pointsNormaux2 + pointsBonusJoueur2;
}

// === Gestion de la prise de la pile ===
function verifierPrise(pile, carte, nomJoueur) {
  const derniereCarte = table[table.length - 1];

  // Zing spécial : valet sur valet
  if (carte.valeur === 'J' && table.length === 1 && derniereCarte?.valeur === 'J') {
    if (nomJoueur === 'Joueur 1') pointsBonusJoueur1 += 25;
    else pointsBonusJoueur2 += 25;
    pile.push(...table, carte);
    table.length = 0;
    majPoints();
    return;
  }

  // Valet prend la pile
  if (carte.valeur === 'J') {
    pile.push(...table, carte);
    table.length = 0;
    majPoints();
    return;
  }

  // Zing normal : même valeur, une seule carte sur la table
  if (derniereCarte && carte.valeur === derniereCarte.valeur && table.length === 1) {
    if (nomJoueur === 'Joueur 1') pointsBonusJoueur1 += 10;
    else pointsBonusJoueur2 += 10;
    pile.push(...table, carte);
    table.length = 0;
    majPoints();
    return;
  }

  // Même valeur : prend la pile
  if (derniereCarte && carte.valeur === derniereCarte.valeur) {
    pile.push(...table, carte);
    table.length = 0;
    majPoints();
    return;
  }

  // Sinon, la carte reste sur la table
  table.push(carte);
}

// === Redistribution des cartes ===
function verifierFinMain() {
  if (joueur1.length === 0 && deck.length > 0) {
    for (let i = 0; i < 4 && deck.length > 0; i++) joueur1.push(deck.pop());
    afficherCartes(zoneJoueur1, joueur1, true, false);
  }
  if (joueur2.length === 0 && deck.length > 0) {
    for (let i = 0; i < 4 && deck.length > 0; i++) joueur2.push(deck.pop());
    afficherCartes(zoneJoueur2, joueur2, false, false); // cartes face cachée
  }
}

// === Fin de partie ===
function verifierFinPartie() {
  if (deck.length === 0 && joueur1.length === 0 && joueur2.length === 0) {
    const totalJoueur1 = pileJoueur1.reduce((total, c) => total + valeurCarte(c), 0) + pointsBonusJoueur1;
    const totalJoueur2 = pileJoueur2.reduce((total, c) => total + valeurCarte(c), 0) + pointsBonusJoueur2;

    let message;
    if (totalJoueur1 > totalJoueur2) message = "Joueur 1 gagne ! 🎉";
    else if (totalJoueur2 > totalJoueur1) message = "Joueur 2 gagne ! 🎉";
    else message = "Égalité ! 🤝";

    const finDiv = document.getElementById("fin-partie");
    finDiv.innerHTML = `
      <p>${message}</p>
      <button id="recommencer">Recommencer la partie</button>
    `;
    finDiv.style.display = "block";

    document.getElementById("recommencer").addEventListener("click", () => {
      finDiv.style.display = "none";
      finDiv.innerHTML = "";
      recommencerPartie();
    });
  }
}

// === Recommencer la partie ===
function recommencerPartie() {
  deck = createDeck();
  shuffle(deck);

  joueur1.length = 0;
  joueur2.length = 0;
  pileJoueur1.length = 0;
  pileJoueur2.length = 0;
  table.length = 0;

  pointsBonusJoueur1 = 0;
  pointsBonusJoueur2 = 0;
  tourJoueur = 1;

  distribuerCartes(deck);

  afficherCartes(zoneTable, table, false, true);
  afficherCartes(zoneJoueur1, joueur1, true, false);
  afficherCartes(zoneJoueur2, joueur2, false, false);
  majPoints();
}

// === Affichage des cartes ===
function afficherCartes(zone, cartes, estMainJoueur = false, estTable = false) {
  zone.innerHTML = "";

  cartes.forEach((c, index) => {
    const carteJeu = document.createElement("div");
    carteJeu.classList.add("carte");

    if (estTable) {
      // Table : cartes visibles
      carteJeu.classList.add(c.couleur);
      carteJeu.textContent = c.valeur + c.couleur;
    } else if (!estMainJoueur) {
      // Main IA : cartes cachées
      carteJeu.textContent = "?";
    } else {
      // Main joueur : cartes visibles
      carteJeu.classList.add(c.couleur);
      carteJeu.textContent = c.valeur + c.couleur;

      // clic si c’est le tour du joueur
      if (tourJoueur === 1) {
        carteJeu.addEventListener("click", () => {
          jouerTour(index);
        });
      }
    }

    zone.appendChild(carteJeu);
  });
}

// === Jouer une carte ===
function jouerCarteHTML(joueur, pile, nomJoueur, index, zoneTable, zoneJoueur) {
  const carte = joueur.splice(index, 1)[0];

  verifierPrise(pile, carte, nomJoueur);

  afficherCartes(zoneTable, table, false, true);
  afficherCartes(zoneJoueur, joueur, true, false);
  afficherCartes(zoneJoueur2, joueur2, false, false);

  majPoints();
  verifierFinMain();
  verifierFinPartie();
}

// === Tour du joueur ===
function jouerTour(indexCarte) {
  if (tourJoueur !== 1) return;
  jouerCarteHTML(joueur1, pileJoueur1, "Joueur 1", indexCarte, zoneTable, zoneJoueur1);

  tourJoueur = 2;
  setTimeout(tourOrdinateur, 1000);
}

// === IA intermédiaire ===
function tourOrdinateur() {
  if (joueur2.length === 0) return;

  // Si possible, faire un Zing, sinon carte aléatoire
  let indexChoisi = 0;
  const derniereCarte = table[table.length - 1];
  if (derniereCarte) {
    const indexZing = joueur2.findIndex(c => c.valeur === derniereCarte.valeur);
    if (indexZing !== -1) indexChoisi = indexZing;
  }

  jouerCarteHTML(joueur2, pileJoueur2, "Joueur 2", indexChoisi, zoneTable, zoneJoueur2);

  tourJoueur = 1;
  afficherCartes(zoneJoueur1, joueur1, true, false);
}

// === Initialisation ===
let zoneTable, zoneJoueur1, zoneJoueur2;

document.addEventListener("DOMContentLoaded", () => {
  zoneTable = document.getElementById("table");
  zoneJoueur1 = document.getElementById("main-joueur1");
  zoneJoueur2 = document.getElementById("main-joueur2");

  deck = createDeck();
  shuffle(deck);
  distribuerCartes(deck);

  afficherCartes(zoneTable, table, false, true);
  afficherCartes(zoneJoueur1, joueur1, true, false);
  afficherCartes(zoneJoueur2, joueur2, false, false);

  majPoints();
});


document.getElementById("btn-regles").addEventListener("click", () => {
  document.getElementById("modal-regles").style.display = "flex";
});

document.getElementById("close-modal").addEventListener("click", () => {
  document.getElementById("modal-regles").style.display = "none";
});
