// Flashcard data is stored directly in this JavaScript file.
const flashcards = [
    { front: "HTML", back: "HyperText Markup Language" },
    { front: "CSS", back: "Cascading Style Sheets" },
    { front: "JavaScript", back: "A programming language used to add interactivity to web pages" },
    { front: "DOM", back: "Document Object Model" },
    { front: "Element", back: "A complete HTML item, such as a paragraph or heading" },
    { front: "Attribute", back: "Extra information placed inside an HTML opening tag" },
    { front: "Selector", back: "A CSS pattern used to choose which elements will be styled" },
    { front: "Property", back: "The CSS feature being changed, such as color or margin" },
    { front: "Function", back: "A reusable block of JavaScript code" },
    { front: "Array", back: "A list-like structure that stores multiple values" },
    { front: "Object", back: "A collection of related properties and values" },
    { front: "Variable", back: "A named container used to store a value" },
    { front: "Conditional", back: "Code that makes a decision using conditions" },
    { front: "Loop", back: "Code that repeats while a condition is true or for each item" },
    { front: "Event", back: "An action such as a click, key press, or form submission" },
    { front: "Event Listener", back: "Code that waits for an event and runs a function" },
    { front: "Flexbox", back: "A one-dimensional CSS layout system" },
    { front: "Grid", back: "A two-dimensional CSS layout system using rows and columns" },
    { front: "Responsive Design", back: "Design that adapts to different screen sizes" },
    { front: "Semantic HTML", back: "HTML elements that describe the meaning of their content" }
];

// Each pair has the same pairId so the game can test for matches.
const memoryPairs = [
    { pairId: "html", front: "HTML", back: "Structures page content" },
    { pairId: "css", front: "CSS", back: "Controls page appearance" },
    { pairId: "javascript", front: "JavaScript", back: "Adds page interactivity" },
    { pairId: "dom", front: "DOM", back: "Represents the page as objects" },
    { pairId: "flexbox", front: "Flexbox", back: "One-dimensional layout" },
    { pairId: "grid", front: "CSS Grid", back: "Two-dimensional layout" }
];

// ---------- DOM selections ----------
const flashcardsModeButton = document.querySelector("#flashcardsModeButton");
const memoryModeButton = document.querySelector("#memoryModeButton");
const flashcardsSection = document.querySelector("#flashcardsSection");
const memorySection = document.querySelector("#memorySection");

const flashcard = document.querySelector("#flashcard");
const flashcardLabel = document.querySelector("#flashcardLabel");
const flashcardText = document.querySelector("#flashcardText");
const flashcardProgress = document.querySelector("#flashcardProgress");
const gotItCount = document.querySelector("#gotItCount");
const flipButton = document.querySelector("#flipButton");
const againButton = document.querySelector("#againButton");
const gotItButton = document.querySelector("#gotItButton");
const flashcardComplete = document.querySelector("#flashcardComplete");
const flashcardScoreMessage = document.querySelector("#flashcardScoreMessage");
const restartFlashcardsButton = document.querySelector("#restartFlashcardsButton");

const memoryGrid = document.querySelector("#memoryGrid");
const moveCount = document.querySelector("#moveCount");
const matchCount = document.querySelector("#matchCount");
const memoryStatus = document.querySelector("#memoryStatus");
const restartMemoryButton = document.querySelector("#restartMemoryButton");
const memoryWin = document.querySelector("#memoryWin");
const memoryWinMessage = document.querySelector("#memoryWinMessage");
const playAgainButton = document.querySelector("#playAgainButton");

// ---------- Flashcard state ----------
let currentFlashcardIndex = 0;
let flashcardIsFlipped = false;
let gotItTotal = 0;

// ---------- Memory state ----------
let memoryDeck = [];
let firstSelectedCard = null;
let secondSelectedCard = null;
let memoryLocked = false;
let moves = 0;
let matches = 0;

// Switches modes without reloading the page.
function switchMode(mode) {
    const showFlashcards = mode === "flashcards";

    flashcardsSection.classList.toggle("hidden", !showFlashcards);
    memorySection.classList.toggle("hidden", showFlashcards);

    flashcardsModeButton.classList.toggle("active", showFlashcards);
    memoryModeButton.classList.toggle("active", !showFlashcards);

    flashcardsModeButton.setAttribute("aria-pressed", String(showFlashcards));
    memoryModeButton.setAttribute("aria-pressed", String(!showFlashcards));

    if (showFlashcards) {
        flashcard.focus();
    } else {
        const firstMemoryCard = memoryGrid.querySelector(".memory-card");
        if (firstMemoryCard) {
            firstMemoryCard.focus();
        }
    }
}

// ---------- Flashcard functions ----------
function renderFlashcard() {
    const currentCard = flashcards[currentFlashcardIndex];

    flashcardIsFlipped = false;
    flashcard.classList.remove("flipped");
    flashcardLabel.textContent = "Front";
    flashcardText.textContent = currentCard.front;
    flashcardProgress.textContent = `${currentFlashcardIndex + 1} / ${flashcards.length}`;
    gotItCount.textContent = `Got It: ${gotItTotal}`;

    againButton.disabled = true;
    gotItButton.disabled = true;
    flashcard.setAttribute(
        "aria-label",
        `Flashcard front: ${currentCard.front}. Press Enter or Space to flip.`
    );
}

function flipCurrentFlashcard() {
    const currentCard = flashcards[currentFlashcardIndex];

    flashcardIsFlipped = !flashcardIsFlipped;
    flashcard.classList.toggle("flipped", flashcardIsFlipped);

    if (flashcardIsFlipped) {
        flashcardLabel.textContent = "Back";
        flashcardText.textContent = currentCard.back;
        againButton.disabled = false;
        gotItButton.disabled = false;
        flashcard.setAttribute(
            "aria-label",
            `Flashcard back: ${currentCard.back}. Choose Got It or Again.`
        );
    } else {
        flashcardLabel.textContent = "Front";
        flashcardText.textContent = currentCard.front;
        flashcard.setAttribute(
            "aria-label",
            `Flashcard front: ${currentCard.front}. Press Enter or Space to flip.`
        );
    }
}

function answerFlashcard(knewAnswer) {
    // Guardrail: the player must flip the current card before answering.
    if (!flashcardIsFlipped) {
        return;
    }

    if (knewAnswer) {
        gotItTotal += 1;
    }

    currentFlashcardIndex += 1;

    if (currentFlashcardIndex >= flashcards.length) {
        showFlashcardResults();
    } else {
        renderFlashcard();
        flashcard.focus();
    }
}

function showFlashcardResults() {
    flashcard.classList.add("hidden");
    document.querySelector(".flashcard-controls").classList.add("hidden");
    flashcardComplete.classList.remove("hidden");
    flashcardProgress.textContent = `${flashcards.length} / ${flashcards.length}`;
    gotItCount.textContent = `Got It: ${gotItTotal}`;
    flashcardScoreMessage.textContent =
        `You knew ${gotItTotal} out of ${flashcards.length} cards.`;
    restartFlashcardsButton.focus();
}

function restartFlashcards() {
    currentFlashcardIndex = 0;
    gotItTotal = 0;
    flashcardIsFlipped = false;

    flashcard.classList.remove("hidden");
    document.querySelector(".flashcard-controls").classList.remove("hidden");
    flashcardComplete.classList.add("hidden");

    renderFlashcard();
    flashcard.focus();
}

// ---------- Memory functions ----------
function createMemoryDeck() {
    const deck = [];

    memoryPairs.forEach((pair) => {
        deck.push({
            pairId: pair.pairId,
            text: pair.front,
            type: "term"
        });

        deck.push({
            pairId: pair.pairId,
            text: pair.back,
            type: "definition"
        });
    });

    return shuffleDeck(deck);
}

// Fisher-Yates shuffle returns a shuffled copy of the deck.
function shuffleDeck(deck) {
    const shuffled = [...deck];

    for (let index = shuffled.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        const temporaryValue = shuffled[index];
        shuffled[index] = shuffled[randomIndex];
        shuffled[randomIndex] = temporaryValue;
    }

    return shuffled;
}

function renderMemoryGrid() {
    memoryGrid.textContent = "";

    memoryDeck.forEach((cardData, index) => {
        const cardButton = document.createElement("button");
        const cardText = document.createElement("span");

        cardButton.type = "button";
        cardButton.classList.add("memory-card");
        cardButton.dataset.index = String(index);
        cardButton.setAttribute("role", "gridcell");
        cardButton.setAttribute("aria-label", `Face-down card ${index + 1}`);

        cardText.classList.add("memory-card-text");
        cardText.textContent = cardData.text;

        cardButton.append(cardText);
        memoryGrid.append(cardButton);
    });
}

function startMemoryGame() {
    memoryDeck = createMemoryDeck();
    firstSelectedCard = null;
    secondSelectedCard = null;
    memoryLocked = false;
    moves = 0;
    matches = 0;

    moveCount.textContent = "Moves: 0";
    matchCount.textContent = `Matches: 0 / ${memoryPairs.length}`;
    memoryStatus.textContent = "Select two cards to look for a match.";
    memoryWin.classList.add("hidden");

    renderMemoryGrid();
}

function flipMemoryCard(cardElement) {
    if (memoryLocked || cardElement.classList.contains("matched")) {
        return;
    }

    if (cardElement === firstSelectedCard || cardElement.classList.contains("flipped")) {
        return;
    }

    const cardIndex = Number(cardElement.dataset.index);
    const cardData = memoryDeck[cardIndex];

    cardElement.classList.add("flipped");
    cardElement.setAttribute("aria-label", `Face-up card: ${cardData.text}`);

    if (!firstSelectedCard) {
        firstSelectedCard = cardElement;
        memoryStatus.textContent = "Choose one more card.";
        return;
    }

    secondSelectedCard = cardElement;
    moves += 1;
    moveCount.textContent = `Moves: ${moves}`;

    checkForMatch();
}

function checkForMatch() {
    const firstIndex = Number(firstSelectedCard.dataset.index);
    const secondIndex = Number(secondSelectedCard.dataset.index);

    const firstCardData = memoryDeck[firstIndex];
    const secondCardData = memoryDeck[secondIndex];

    if (firstCardData.pairId === secondCardData.pairId) {
        handleMatch(firstCardData);
    } else {
        handleMismatch();
    }
}

function handleMatch(matchedCardData) {
    firstSelectedCard.classList.add("matched");
    secondSelectedCard.classList.add("matched");

    firstSelectedCard.disabled = true;
    secondSelectedCard.disabled = true;

    firstSelectedCard.setAttribute("aria-label", `Matched card: ${matchedCardData.pairId}`);
    secondSelectedCard.setAttribute("aria-label", `Matched card: ${matchedCardData.pairId}`);

    matches += 1;
    matchCount.textContent = `Matches: ${matches} / ${memoryPairs.length}`;
    memoryStatus.textContent = "Match found!";

    clearMemorySelection();

    if (matches === memoryPairs.length) {
        showMemoryWin();
    }
}

function handleMismatch() {
    memoryLocked = true;
    memoryStatus.textContent = "No match. The cards will turn back over.";

    window.setTimeout(() => {
        firstSelectedCard.classList.remove("flipped");
        secondSelectedCard.classList.remove("flipped");

        firstSelectedCard.setAttribute("aria-label", "Face-down card");
        secondSelectedCard.setAttribute("aria-label", "Face-down card");

        clearMemorySelection();
        memoryLocked = false;
        memoryStatus.textContent = "Try another pair.";
    }, 900);
}

function clearMemorySelection() {
    firstSelectedCard = null;
    secondSelectedCard = null;
}

function showMemoryWin() {
    memoryStatus.textContent = `You won in ${moves} moves!`;
    memoryWinMessage.textContent = `You matched all ${memoryPairs.length} pairs in ${moves} moves.`;
    memoryWin.classList.remove("hidden");
    playAgainButton.focus();
}

// ---------- Event listeners ----------
flashcardsModeButton.addEventListener("click", () => {
    switchMode("flashcards");
});

memoryModeButton.addEventListener("click", () => {
    switchMode("memory");
});

flashcard.addEventListener("click", flipCurrentFlashcard);
flipButton.addEventListener("click", flipCurrentFlashcard);

flashcard.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        flipCurrentFlashcard();
    }
});

gotItButton.addEventListener("click", () => {
    answerFlashcard(true);
});

againButton.addEventListener("click", () => {
    answerFlashcard(false);
});

restartFlashcardsButton.addEventListener("click", restartFlashcards);
restartMemoryButton.addEventListener("click", startMemoryGame);
playAgainButton.addEventListener("click", startMemoryGame);

// Event delegation handles every current and future memory card.
memoryGrid.addEventListener("click", (event) => {
    const selectedCard = event.target.closest(".memory-card");

    if (!selectedCard || !memoryGrid.contains(selectedCard)) {
        return;
    }

    flipMemoryCard(selectedCard);
});

// Keyboard event delegation lets focused memory cards flip with Enter or Space.
memoryGrid.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") {
        return;
    }

    const selectedCard = event.target.closest(".memory-card");

    if (!selectedCard) {
        return;
    }

    event.preventDefault();
    flipMemoryCard(selectedCard);
});

// ---------- Initial setup ----------
renderFlashcard();
startMemoryGame();

