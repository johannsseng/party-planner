/**
 * @typedef Party
 * @property {number} id
 * @property {string} name
 * @property {string} description
 * @property {string} date
 * @property {string} location
 * @property {Array} guests
 */

// =====================
// Constants
// =====================
const BASE = "https://fsa-crud-2aa9294fe819.herokuapp.com/api";
const COHORT = "/2601-Chanthon"; // <-- Make sure this is YOUR real cohort
const RESOURCE = "/events";
const API = BASE + COHORT + RESOURCE;

// =====================
// State
// =====================
let parties = [];
let selectedParty = null;

// =====================
// API Functions
// =====================

async function getParties() {
  try {
    const response = await fetch(API);
    const result = await response.json();
    parties = result.data;
    render();
  } catch (error) {
    console.error("Error fetching parties:", error);
  }
}

async function getParty(id) {
  try {
    const response = await fetch(`${API}/${id}`);
    const result = await response.json();
    selectedParty = result.data;
    render();
  } catch (error) {
    console.error("Error fetching party:", error);
  }
}

// =====================
// Components
// =====================

function PartyListItem(party) {
  const $li = document.createElement("li");

  const $link = document.createElement("a");
  $link.href = "#selected";
  $link.textContent = party.name;

  // Highlight selected party
  if (selectedParty && selectedParty.id === party.id) {
    $link.style.fontWeight = "bold";
    $link.style.fontStyle = "italic";
  }

  $link.addEventListener("click", () => {
    getParty(party.id);
  });

  $li.appendChild($link);
  return $li;
}

function PartyList() {
  const $ul = document.createElement("ul");
  $ul.classList.add("lineup");

  const $items = parties.map(PartyListItem);
  $ul.replaceChildren(...$items);

  return $ul;
}

function PartyDetails() {
  if (!selectedParty) {
    const $p = document.createElement("p");
    $p.textContent = "Please select a party to learn more.";
    return $p;
  }

  const $section = document.createElement("section");

  const guestList = selectedParty.guests
    ? selectedParty.guests
        .map((guest) => `<li>${guest.name}</li>`)
        .join("")
    : "";

  $section.innerHTML = `
    <h3>${selectedParty.name} #${selectedParty.id}</h3>
    <p>${selectedParty.date.split("T")[0]}</p>
    <p><em>${selectedParty.location}</em></p>
    <p>${selectedParty.description}</p>
    <ul>${guestList}</ul>
  `;

  return $section;
}

// =====================
// Render
// =====================

function render() {
  const $app = document.querySelector("#app");

  $app.innerHTML = `
    <h1>Party Planner</h1>
    <main>
      <section>
        <h2>Upcoming Parties</h2>
        <PartyList></PartyList>
      </section>
      <section id="selected">
        <h2>Party Details</h2>
        <PartyDetails></PartyDetails>
      </section>
    </main>
  `;

  $app.querySelector("PartyList").replaceWith(PartyList());
  $app.querySelector("PartyDetails").replaceWith(PartyDetails());
}

// =====================
// Init
// =====================

async function init() {
  await getParties();
}

init();