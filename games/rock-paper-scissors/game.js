const choiceButtons      = document.querySelectorAll(".choice");
const playerChoiceEl     = document.getElementById("player-choice");
const playerChoiceNameEl = document.getElementById("player-choice-name");
const computerChoiceEl   = document.getElementById("computer-choice");
const computerChoiceNameEl = document.getElementById("computer-choice-name");
const resultMessageEl    = document.getElementById("result-message");
const playerScoreEl      = document.getElementById("player-score");
const computerScoreEl    = document.getElementById("computer-score");
const resetBtn           = document.getElementById("reset-game");

const emojiMap = { rock: "✊", paper: "🖐️", scissors: "✌️" };

let playerScore   = 0;
let computerScore = 0;

const getRoundResult = (player, computer) => {
    if (player === computer) return "draw";
    if (
        (player === "rock"     && computer === "scissors") ||
        (player === "paper"    && computer === "rock")     ||
        (player === "scissors" && computer === "paper")
    ) return "win";
    return "loss";
};

const setResultStyle = (result) => {
    const panel = resultMessageEl.closest(".result-panel");
    panel.classList.remove("is-win", "is-loss");
    if (result === "win")  panel.classList.add("is-win");
    if (result === "loss") panel.classList.add("is-loss");
};

const getUserMove = (userChoice) => {
    const computerMove = getComputerMove();

    playerChoiceEl.textContent       = emojiMap[userChoice];
    playerChoiceNameEl.textContent   = userChoice.charAt(0).toUpperCase() + userChoice.slice(1);
    computerChoiceEl.textContent     = emojiMap[computerMove];
    computerChoiceNameEl.textContent = computerMove.charAt(0).toUpperCase() + computerMove.slice(1);

    choiceButtons.forEach(btn => {
        btn.setAttribute("aria-pressed", btn.dataset.choice === userChoice ? "true" : "false");
    });

    const result = getRoundResult(userChoice, computerMove);

    if (result === "win") {
        playerScore++;
        playerScoreEl.textContent = playerScore;
        resultMessageEl.textContent = `You win! ${emojiMap[userChoice]} beats ${emojiMap[computerMove]}`;
    } else if (result === "loss") {
        computerScore++;
        computerScoreEl.textContent = computerScore;
        resultMessageEl.textContent = `You lose. ${emojiMap[computerMove]} beats ${emojiMap[userChoice]}`;
    } else {
        resultMessageEl.textContent = `It's a draw — both chose ${emojiMap[userChoice]}`;
    }

    setResultStyle(result);
};

const getComputerMove = () => {
    let computerMove = "";

    const randomNumber = Math.random();
    if (randomNumber <= 0.4) {
        computerMove = "rock";
    } else if (randomNumber > 0.4 && randomNumber <= 0.8) {
        computerMove = "paper";
    } else {
        computerMove = "scissors";
    }

    return computerMove;
};

choiceButtons.forEach(btn => {
    btn.addEventListener("click", () => getUserMove(btn.dataset.choice));
});

resetBtn.addEventListener("click", () => {
    playerScore   = 0;
    computerScore = 0;
    playerScoreEl.textContent   = 0;
    computerScoreEl.textContent = 0;

    playerChoiceEl.textContent       = "?";
    playerChoiceNameEl.textContent   = "Waiting";
    computerChoiceEl.textContent     = "?";
    computerChoiceNameEl.textContent = "Waiting";
    resultMessageEl.textContent      = "Choose rock, paper, or scissors to begin.";

    const panel = resultMessageEl.closest(".result-panel");
    panel.classList.remove("is-win", "is-loss");

    choiceButtons.forEach(btn => btn.setAttribute("aria-pressed", "false"));
});
