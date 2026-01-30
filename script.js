const formulaire = document.querySelector("#todo-form");
const input = document.querySelector("#todo-input");
const liste = document.querySelector("#todo-list");
const erreur = document.querySelector("#error");
const totalTxt = document.querySelector("#count-total");
const restantsTxt = document.querySelector("#count-left");

// Statistiques
const mettreAJourStats = () => {
  const toutes = document.querySelectorAll("li");
  const terminees = document.querySelectorAll("li.done");
  totalTxt.textContent = `Total: ${toutes.length}`;
  restantsTxt.textContent = `Restantes: ${toutes.length - terminees.length}`;
};

formulaire.addEventListener("submit", (event) => {
  event.preventDefault();
  const valeur = input.value.trim();

  if (!valeur) {
    erreur.textContent = "Champ vide !";
    return;
  }
  erreur.textContent = "";

  const li = document.createElement("li");
  li.setAttribute("draggable", "true"); // Pour le Drag & Drop
  li.innerHTML = `
    <span class="texte-tache">${valeur}</span>
    <div class="actions">
      <button class="edit-btn">Modifier</button>
      <button class="delete-btn">Supprimer</button>
    </div>
  `;

  
  li.addEventListener("dblclick", () => editerTache(li));

  li.addEventListener("dragstart", () => li.classList.add("dragging"));
  li.addEventListener("dragend", () => li.classList.remove("dragging"));

  liste.append(li);
  input.value = "";
  input.focus();
  mettreAJourStats();
});

// Fonction pour Éditer
const editerTache = (li) => {
  const span = li.querySelector(".texte-tache");
  const nouveauTexte = prompt("Modifier la tâche :", span.textContent);
  if (nouveauTexte !== null && nouveauTexte.trim() !== "") {
    span.textContent = nouveauTexte.trim();
  }
};

//  Clics (Barrer, Supprimer, Modifier)
liste.addEventListener("click", (event) => {
  const target = event.target;
  const li = target.closest("li");

  if (target.classList.contains("delete-btn")) {
    li.remove();
  } else if (target.classList.contains("edit-btn")) {
    editerTache(li);
  } else if (target.tagName === "SPAN" || target.tagName === "LI") {
    li.classList.toggle("done");
  }
  mettreAJourStats();
});

liste.addEventListener("dragover", (e) => {
  e.preventDefault();
  const draggingItem = document.querySelector(".dragging");
  const siblings = [...liste.querySelectorAll("li:not(.dragging)")];
  
  let nextSibling = siblings.find(sibling => {
    return e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2;
  });

  liste.insertBefore(draggingItem, nextSibling);
});

// Filtres
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const filtre = btn.getAttribute("data-filter");
    document.querySelectorAll("li").forEach(item => {
      if (filtre === "all") item.style.display = "flex";
      else if (filtre === "active") item.style.display = item.classList.contains("done") ? "none" : "flex";
      else if (filtre === "done") item.style.display = item.classList.contains("done") ? "flex" : "none";
    });
  });
});

mettreAJourStats();