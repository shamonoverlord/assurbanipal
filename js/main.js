const DEFAULT_SPEECH = "ようこそ、旅人様。<br>本日はどの魔導書をご覧になりますか？";
const SEALED_SPEECH = "この魔導書はまだ封印されています。<br>公開まで今しばらくお待ちください。";
const ENTRY_STORAGE_KEY = "assurbanipal-entry-confirmed";

const games = [
  {
    id: "overlord-clicker",
    number: "001",
    title: "Overlord Clicker",
    description: "タップで敵を倒し、仲間を増やして強くなるシンプルなクリッカーRPGです。限界まで強くなり、最上階層を目指せ！",
    shortDescription: "タップで敵を倒し、仲間を増やして強くなるシンプルなクリッカーRPGです。",
    receptionComment: "こちらは、敵を倒し仲間を増やしていく魔導書です。成長の果てにどこまで到達できるか、お試しください。",
    url: "games/overlord-clicker/",
    status: "published",
    color: "red"
  },
  {
    id: "sealed-002",
    number: "002",
    title: "Coming Soon",
    description: "この魔導書はまだ封印されています。",
    receptionComment: SEALED_SPEECH,
    url: "",
    status: "coming-soon",
    color: "blue"
  },
  {
    id: "sealed-003",
    number: "003",
    title: "Coming Soon",
    description: "この魔導書はまだ封印されています。",
    receptionComment: SEALED_SPEECH,
    url: "",
    status: "coming-soon",
    color: "green"
  },
  {
    id: "sealed-004",
    number: "004",
    title: "Coming Soon",
    description: "この魔導書はまだ封印されています。",
    receptionComment: SEALED_SPEECH,
    url: "",
    status: "coming-soon",
    color: "purple"
  }
];

const shelf = document.querySelector("#gameShelf");
const speech = document.querySelector("#receptionSpeech");
const modal = document.querySelector("#gameModal");
const modalClose = document.querySelector("#modalClose");
const modalBook = document.querySelector("#modalBook");
const modalNumber = document.querySelector("#modalNumber");
const modalTitle = document.querySelector("#modalTitle");
const modalThumb = document.querySelector("#modalThumb");
const modalDescription = document.querySelector("#modalDescription");
const modalPlayLink = document.querySelector("#modalPlayLink");
const entryGate = document.querySelector("#entryGate");
const enterLibraryButton = document.querySelector("#enterLibraryButton");
const howToPlayButton = document.querySelector("#howToPlayButton");

function setSpeech(message) {
  speech.innerHTML = message;
}

function createBook(game) {
  const button = document.createElement("button");
  button.className = `magic-book ${game.color}`;
  button.type = "button";
  button.dataset.gameId = game.id;
  button.setAttribute("aria-label", `魔導書 No.${game.number} ${game.title}`);
  button.innerHTML = `
    <span class="book-gem"></span>
    <span class="book-emblem">◆</span>
    <span class="book-number">${game.number}</span>
  `;

  button.addEventListener("mouseenter", () => setSpeech(game.receptionComment));
  button.addEventListener("mouseleave", () => setSpeech(DEFAULT_SPEECH));
  button.addEventListener("focus", () => setSpeech(game.receptionComment));
  button.addEventListener("blur", () => {
    if (modal.hidden) {
      setSpeech(DEFAULT_SPEECH);
    }
  });
  button.addEventListener("click", () => {
    setSpeech(game.receptionComment);
    if (game.status === "published") {
      openGameModal(game);
      return;
    }
    openSealedModal(game);
  });

  return button;
}

function renderShelf() {
  shelf.replaceChildren(...games.map(createBook));
}

function openGameModal(game) {
  modalBook.className = `modal-book ${game.color}`;
  modalNumber.textContent = `魔導書 No.${game.number}`;
  modalTitle.textContent = game.title;
  modalDescription.textContent = game.description;
  modalThumb.textContent = "GAME";
  modalPlayLink.textContent = "遊ぶ";
  modalPlayLink.href = game.url;
  modalPlayLink.removeAttribute("aria-disabled");
  modal.hidden = false;
  modalClose.focus();
}

function openSealedModal(game) {
  modalBook.className = `modal-book ${game.color} sealed`;
  modalNumber.textContent = `魔導書 No.${game.number}`;
  modalTitle.textContent = game.title;
  modalDescription.textContent = game.description;
  modalThumb.textContent = "?";
  modalPlayLink.textContent = "封印中";
  modalPlayLink.href = "#";
  modalPlayLink.setAttribute("aria-disabled", "true");
  modal.hidden = false;
  modalClose.focus();
}

function closeModal() {
  modal.hidden = true;
}

function setupEntryGate() {
  if (localStorage.getItem(ENTRY_STORAGE_KEY) === "true") {
    return;
  }
  entryGate.hidden = false;
  enterLibraryButton.focus();
}

function enterLibrary() {
  localStorage.setItem(ENTRY_STORAGE_KEY, "true");
  entryGate.hidden = true;
}

function showHowToPlay() {
  setSpeech("魔導書を選ぶと詳しい紹介が開きます。<br>「遊ぶ」を押すと、そのゲームのページへ進めます。");
}

renderShelf();
setupEntryGate();

enterLibraryButton.addEventListener("click", enterLibrary);
modalClose.addEventListener("click", closeModal);
howToPlayButton.addEventListener("click", showHowToPlay);

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.hidden) {
    closeModal();
  }
});
