// Flashcard data, Term and Definition. All World war Two
const flashcards = [
    { front: "Axis Powers", 
        back: "The alliance of Germany, Italy, and Japan During world war two" },

    { front: "Allied Powers", 
        back: "The alliance of Great Britain, The Soviet Union, The United States during World War Two." },

    { front: "Blitzkrieg", 
        back: "A fast and forceful military strategy used by Germany during World War Two." },

    { front: "Pearl Harbor", 
        back: "The surprise attack on the U.S. naval base in Hawaii on December 7, 1941" },

    { front: "D-Day", 
        back: "The Allied invasion of Normandy on June 6, 1944" },

    { front: "Operation Overlord", 
        back: "The Allied operation to invade Nazi-occupied Europe" },

    { front: "Battle of Britain", 
        back: "An air campaign fought by the Royal Air Force against the German Luftwaffe to defend Britain." },

    { front: "Battle of Midway", 
        back: "A major American naval victory against Japan in June 1942" },

    { front: "Battle of Stalingrad", 
        back: "A major battle on the Eastern Front of World War Two" },

    { front: "Battle of the Bulge", 
        back: "A major battle in the Ardennes forest during World War Two" },

    { front: "Holocaust", 
        back: "The systematic persecution and murder of six million Jewish people and millions of other victims by Nazi Germany." },

    { front: "Nazi Germany", 
        back: "Germany under the dictatorship of Adolf Hitler from 1933 to 1945." },

    { front: "Fascism", 
        back: "An authoritarian political system based on dictatorship, extreme nationalism, and suppression of opposition." },

    { front: "Appeasement", 
        back: "The policy of making concessions to an aggressive power in order to avoid conflict" },

    { front: "Manhattan Project", 
        back: "The secret U.S. government program to develop the atomic bomb during World War Two" },

    { front: "Rosie the Riveter", 
        back: "A cultural icon representing women who worked in factories during World War Two" },

    { front: "Home Front", 
        back: "The civilian population's role in supporting the war effort" },

    { front: "V-E Day", 
        back: "Victory in Europe Day." },

    { front: "V-J Day", 
        back: "Victory over Japan Day." },

    { front: "United Nations", 
        back: "An international organization founded in 1945 to promote peace and cooperation" },

];

// Memory Match data, creates one mathcing pair and pairs it with the same pairID
const memoryPairs = [
    {
        pairId: "dday",
        front: "D-Day",
        back: "The Allied invasion of Normandy on June 6, 1944"
    },
    {
        pairId: "pearl-harbor",
        front: "Pearl Harbor",
        back: "The surprise attack on the U.S. naval base in Hawaii on December 7, 1941"
    },
    {
        pairId: "midway",
        front: "Battle of Midway",
        back: "A major American naval victory against Japan in June 1942"
    },
    {
        pairId: "stalingrad",
        front: "Battle of Stalingrad",
        back: "A major battle on the Eastern Front of World War Two"
    },
    {
        pairId: "manhattan-project",
        front: "Manhattan Project",
        back: "The secret U.S. government program to develop the atomic bomb during World War Two"
    },
    {
        pairId: "ve-day",
        front: "V-E Day",
        back: "Victory in Europe Day"
    }
];

// Selects the buttons used to change game modes. 
const flashcardsModeButton = document.querySelector("#flashcardsModeButton");
const memoryModeButton = document.querySelector("#memoryModeButton");
const flashcardsSection = document.querySelector("#flashcardsSection");
const memorySection = document.querySelector("#memorySection");

//Selects the flashcard and its text
const flashcard = document.querySelector("#flashcard");
const flashcardLabel = document.querySelector("#flashcardLabel");
const flashcardText = document.querySelector("#flashcardText");

//Selects Flash card progress counters
const flashcardProgress = document.querySelector("#flashcardProgress");
const gotItCount = document.querySelector("#gotItCount");

// Selects Flashcard control buttons
const flipButton = document.querySelector("#flipButton");
const againButton = document.querySelector("#againButton");
const gotItButton = document.querySelector("#gotItButton");

// Selects the flascard compeltion area
const flashcardComplete = document.querySelector("#flashcardComplete");
const flashcardScoreMessage = document.querySelector("#flashcardScoreMessage");
const restartFlashcardsButton = document.querySelector("#restartFlashcardsButton");

//Selects memory grid and counters
const memoryGrid = document.querySelector("#memoryGrid");
const moveCount = document.querySelector("#moveCount");
const matchCount = document.querySelector("#matchCount");

// Selects memory game Status message
const memoryStatus = document.querySelector("#memoryStatus");

// Selects the meonry game buttons and winning message
const restartMemoryButton = document.querySelector("#restartMemoryButton");
const memoryWin = document.querySelector("#memoryWin");
const memoryWinMessage = document.querySelector("#memoryWinMessage");
const playAgainButton = document.querySelector("#playAgainButton");

// Tracks which card is currently being shown
let currentFlashcardIndex = 0;

// Tracks Whether the current card is showing its back
let flashcardIsFlipped = false;

// Counts how many cards the player has marked got it
let gotItTotal = 0;

//Stores the shuffled memory decks 
let memoryDeck = [];

// Stores the first and second cards selected
let firstSelectedCard = null;
let secondSelectedCard = null;

//Prevents cards from being slected during a mismatch
let memoryLocked = false;

// Tracks moves  and complere matches
let moves = 0;
let matches = 0;

//  Switches between flashcards and memory match without reloading page
function switchMode(mode) {
    const showFlashcards = mode === "flashcards";

    // Shows one section and hides the other
    flashcardsSection.classList.toggle("hidden", !showFlashcards);
    memorySection.classList.toggle("hidden", showFlashcards);

    // updates the active appearence of the mode buttons
    flashcardsModeButton.classList.toggle("active", showFlashcards);
    memoryModeButton.classList.toggle("active", !showFlashcards);

    // Upades accessibilty information
    flashcardsModeButton.setAttribute("aria-pressed", String(showFlashcards));
    memoryModeButton.setAttribute("aria-pressed", String(!showFlashcards));

    // Moves focus into select mode 
    if (showFlashcards) {
        flashcard.focus();
    } else {
        const firstMemoryCard = memoryGrid.querySelector(".memory-card");
        if (firstMemoryCard) {
            firstMemoryCard.focus();
        }
    }
}

// Displays the current flashcards
function renderFlashcard() {
    const currentCard = flashcards[currentFlashcardIndex];

    //Resets the card to its front side
    flashcardIsFlipped = false;
    flashcard.classList.remove("flipped");
    flashcardLabel.textContent = "Front";
    flashcardText.textContent = currentCard.front;

    // updates progress and got it counters
    flashcardProgress.textContent = `${currentFlashcardIndex + 1} / ${flashcards.length}`;
    gotItCount.textContent = `Got It: ${gotItTotal}`;

    // makes the player must flip the card before answering 
    againButton.disabled = true;
    gotItButton.disabled = true;

    // Updates the description for the screen reader
    flashcard.setAttribute(
        "aria-label",
        `Flashcard front: ${currentCard.front}. Press Enter or Space to flip.`
    );
}

// Flips the current flashcard between front and back 
function flipCurrentFlashcard() {
    const currentCard = flashcards[currentFlashcardIndex];

    flashcardIsFlipped = !flashcardIsFlipped;
    flashcard.classList.toggle("flipped", flashcardIsFlipped);

    // Shows the back of the card 
    if (flashcardIsFlipped) {
        flashcardLabel.textContent = "Back";
        flashcardText.textContent = currentCard.back;

        //enables answer buttons after the card has been fliped
        againButton.disabled = false;
        gotItButton.disabled = false;
        flashcard.setAttribute(
            "aria-label",
            `Flashcard back: ${currentCard.back}. Choose Got It or Again.`
        );
    } else {

        //shows the front of the card again 
        flashcardLabel.textContent = "Front";
        flashcardText.textContent = currentCard.front;
        flashcard.setAttribute(
            "aria-label",
            `Flashcard front: ${currentCard.front}. Press Enter or Space to flip.`
        );
    }
}

// Records the players answer and moves on to the next card 
function answerFlashcard(knewAnswer) {

    // Prevents answer before the card is flipped
    if (!flashcardIsFlipped) {
        return;
    }

    // adds one to the score when got it is selected
    if (knewAnswer) {
        gotItTotal += 1;
    }

    // Moves to the next flashcard
    currentFlashcardIndex += 1;

    //Ends the game ager the last card
    if (currentFlashcardIndex >= flashcards.length) {
        showFlashcardResults();
    } else {
        renderFlashcard();
        flashcard.focus();
    }
}

// Displays the final fashcard score
function showFlashcardResults() {

    // Hides the card and its contols 
    flashcard.classList.add("hidden");
    document.querySelector(".flashcard-controls").classList.add("hidden");

    // Displays the complete message
    flashcardComplete.classList.remove("hidden");
    flashcardProgress.textContent = `${flashcards.length} / ${flashcards.length}`;
    gotItCount.textContent = `Got It: ${gotItTotal}`;
    flashcardScoreMessage.textContent =
        `You knew ${gotItTotal} out of ${flashcards.length} cards.`;
    restartFlashcardsButton.focus();
}

// Restarts flashcard mode from the start
function restartFlashcards() {

    // Resets all flashcard values
    currentFlashcardIndex = 0;
    gotItTotal = 0;
    flashcardIsFlipped = false;

    // Shows the flashcard and buttons again 
    flashcard.classList.remove("hidden");
    document.querySelector(".flashcard-controls").classList.remove("hidden");

    // Hides the completion message 
    flashcardComplete.classList.add("hidden");

    renderFlashcard();
    flashcard.focus();
}

// Creates two memory cards for every matching pair
function createMemoryDeck() {
    const deck = [];

    memoryPairs.forEach((pair) => {

        //Creates the term card 
        deck.push({
            pairId: pair.pairId,
            text: pair.front,
            type: "term"
        });

        // Creates the matching definition card
        deck.push({
            pairId: pair.pairId,
            text: pair.back,
            type: "definition"
        });
    });

    // Returns the shuffled deck in a random order
    return shuffleDeck(deck);
}

// Shuffles the deck
function shuffleDeck(deck) {

    // Creates a copy so the original array is not changed
    const shuffled = [...deck];

    // moves backwards through the array 
    for (let index = shuffled.length - 1; index > 0; index -= 1) {

        // Chooses a random location 
        const randomIndex = Math.floor(Math.random() * (index + 1));

        // Swaps the two cards 
        const temporaryValue = shuffled[index];
        shuffled[index] = shuffled[randomIndex];
        shuffled[randomIndex] = temporaryValue;
    }

    return shuffled;
}

// Creates the memory card buttons and adds them to the grid
function renderMemoryGrid() {

    // removes cards from the previous game
    memoryGrid.textContent = "";

    memoryDeck.forEach((cardData, index) => {

        // Creates the card button and text span
        const cardButton = document.createElement("button");
        const cardText = document.createElement("span");

        // Sets up the card button 
        cardButton.type = "button";
        cardButton.classList.add("memory-card");
        cardButton.dataset.index = String(index);
        cardButton.setAttribute("role", "gridcell");
        cardButton.setAttribute("aria-label", `Face-down card ${index + 1}`);

        //Adds the term or definition to the card 
        cardText.classList.add("memory-card-text");
        cardText.textContent = cardData.text;

        // Adds the text to the button 
        cardButton.append(cardText);

        // Adds the button to the memory grid
        memoryGrid.append(cardButton);
    });
}

// Starts the memory match game 
function startMemoryGame() {

    // Creates and shuffles a new deck 
    memoryDeck = createMemoryDeck();

    // Clears previously selected cards
    firstSelectedCard = null;
    secondSelectedCard = null;

    // unlocks the board and resets the counters
    memoryLocked = false;
    moves = 0;
    matches = 0;

    // upadtes the screen 
    moveCount.textContent = "Moves: 0";
    matchCount.textContent = `Matches: 0 / ${memoryPairs.length}`;
    memoryStatus.textContent = "Select two cards to look for a match.";
    memoryWin.classList.add("hidden");

    // Cretes the new set of cards
    renderMemoryGrid();
}

// Flips one seleccted memory card
function flipMemoryCard(cardElement) {

    // ingnores clicks while the board is locked or when a card is already matched
    if (memoryLocked || cardElement.classList.contains("matched")) {
        return;
    }

    // Prevents the same card from being selected twice
    if (cardElement === firstSelectedCard || cardElement.classList.contains("flipped")) {
        return;
    }

    // gets slected cards data
    const cardIndex = Number(cardElement.dataset.index);
    const cardData = memoryDeck[cardIndex];

    // Shows the selected card
    cardElement.classList.add("flipped");
    cardElement.setAttribute("aria-label", `Face-up card: ${cardData.text}`);

    // Stores the first selected card
    if (!firstSelectedCard) {
        firstSelectedCard = cardElement;
        memoryStatus.textContent = "Choose one more card.";
        return;
    }

    // Stores the second selected card 
    secondSelectedCard = cardElement;

    // One move is counted after two cards are selected 
    moves += 1;
    moveCount.textContent = `Moves: ${moves}`;

    checkForMatch();
}

// Checks for match 
function checkForMatch() {

    // Gets the deck position of both cards
    const firstIndex = Number(firstSelectedCard.dataset.index);
    const secondIndex = Number(secondSelectedCard.dataset.index);

    // Gets Data for both cards
    const firstCardData = memoryDeck[firstIndex];
    const secondCardData = memoryDeck[secondIndex];

    // Cards match when their PairID values are the same 
    if (firstCardData.pairId === secondCardData.pairId) {
        handleMatch(firstCardData);
    } else {
        handleMismatch();
    }
}

// Handles two correcly matched cards 
function handleMatch(matchedCardData) {

    // Gives both ccards the matched style
    firstSelectedCard.classList.add("matched");
    secondSelectedCard.classList.add("matched");

    // Prevents match cards from being selected again 
    firstSelectedCard.disabled = true;
    secondSelectedCard.disabled = true;

    // Upadres accsesable lablels 
    firstSelectedCard.setAttribute("aria-label", `Matched card: ${matchedCardData.pairId}`);
    secondSelectedCard.setAttribute("aria-label", `Matched card: ${matchedCardData.pairId}`);

    //updates the match counter
    matches += 1;
    matchCount.textContent = `Matches: ${matches} / ${memoryPairs.length}`;
    memoryStatus.textContent = "Match found!";

    //Clears selected cards
    clearMemorySelection();

    // Shows the win message when all pairs are matched
    if (matches === memoryPairs.length) {
        showMemoryWin();
    }
}

// Handles two cards that do not match
function handleMismatch() {

    //Locks the board during the delay
    memoryLocked = true;
    memoryStatus.textContent = "No match. The cards will turn back over.";

    //waits before turing the cards facedown
    window.setTimeout(() => {
        firstSelectedCard.classList.remove("flipped");
        secondSelectedCard.classList.remove("flipped");

        firstSelectedCard.setAttribute("aria-label", "Face-down card");
        secondSelectedCard.setAttribute("aria-label", "Face-down card");

        //Clears the selected cards and unlocks the board 
        clearMemorySelection();
        memoryLocked = false;
        memoryStatus.textContent = "Try another pair.";
    }, 900);
}

// Clears the two selected memory card variables 
function clearMemorySelection() {
    firstSelectedCard = null;
    secondSelectedCard = null;
}

// Displays the winning message
function showMemoryWin() {
    memoryStatus.textContent = `You won in ${moves} moves!`;
    memoryWinMessage.textContent = `You matched all ${memoryPairs.length} pairs in ${moves} moves.`;
    memoryWin.classList.remove("hidden");
    playAgainButton.focus();
}

//Switches to flashcard mode
flashcardsModeButton.addEventListener("click", () => {
    switchMode("flashcards");
});

//Switches to memory match mode
memoryModeButton.addEventListener("click", () => {
    switchMode("memory");
});

// Flips the card when the flashcard is clicked
flashcard.addEventListener("click", flipCurrentFlashcard);

// Flips the card when flip button is clicked
flipButton.addEventListener("click", flipCurrentFlashcard);

// Allows enter or space to flip flashcards 
flashcard.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        flipCurrentFlashcard();
    }
});

// Records a correct answer
gotItButton.addEventListener("click", () => {
    answerFlashcard(true);
});

//Records a missed answer
againButton.addEventListener("click", () => {
    answerFlashcard(false);
});

//Resarts the flash card
restartFlashcardsButton.addEventListener("click", restartFlashcards);

// restarts and reshuffles the memory game
restartMemoryButton.addEventListener("click", startMemoryGame);
playAgainButton.addEventListener("click", startMemoryGame);

// Starts another game after winning
memoryGrid.addEventListener("click", (event) => {
    const selectedCard = event.target.closest(".memory-card");

    if (!selectedCard || !memoryGrid.contains(selectedCard)) {
        return;
    }

    flipMemoryCard(selectedCard);
});

// Uses ebvent delegation to handle clicks on all cards in the grid
memoryGrid.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") {
        return;
    }

    const selectedCard = event.target.closest(".memory-card");

    // Ignores clicks that were not on memory card
    if (!selectedCard) {
        return;
    }

    event.preventDefault();
    flipMemoryCard(selectedCard);
});

// Displays the first flashcard when the page loads
renderFlashcard();

// Creates the first shuffled memory deck
startMemoryGame();