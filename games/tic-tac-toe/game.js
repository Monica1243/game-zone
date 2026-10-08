const cells = document.querySelectorAll(".cell");
const turnMessageEl = document.getElementById("turn-message");
const currentPlayerEl = document.getElementById("current-player");
const resultMessageEl = document.getElementById("result-message");
const scoreXEl = document.getElementById("score-x");
const scoreOEl = document.getElementById("score-o");
const resetRoundBtn = document.getElementById("reset-round");
const resetMatchBtn = document.getElementById("reset-match");

const winCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

let board = Array(9).fill(null);
let currentPlayer = "X";
let gameOver = false;
let scoreX = 0;
let scoreO = 0;

const checkWin = (player) => {
    return winCombos.find(([a, b, c]) =>
        board[a] === player && board[b] === player && board[c] === player
    );
};

const checkDraw = () => board.every(cell => cell !== null);

const disableAllCells = () => {
    cells.forEach(cell => cell.disabled = true);
};

const setResultPanel = (type) => {
    const panel = resultMessageEl.closest(".result-panel");
    panel.classList.remove("is-win", "is-draw");
    if (type === "win") panel.classList.add("is-win");
    if (type === "draw") panel.classList.add("is-draw");
};

const handleClick = (index) => {
    if (gameOver || board[index]) return;

    board[index] = currentPlayer;
    cells[index].dataset.mark = currentPlayer;
    cells[index].textContent = currentPlayer;
    cells[index].disabled = true;
    cells[index].setAttribute("aria-pressed", "true");

    const winningCombo = checkWin(currentPlayer);

    if (winningCombo) {
        gameOver = true;
        winningCombo.forEach(i => cells[i].classList.add("is-winner"));
        disableAllCells();

        if (currentPlayer === "X") {
            scoreX++;
            scoreXEl.textContent = scoreX;
        } else {
            scoreO++;
            scoreOEl.textContent = scoreO;
        }

        resultMessageEl.textContent = `Player ${currentPlayer} wins!`;
        setResultPanel("win");
        return;
    }

    if (checkDraw()) {
        gameOver = true;
        resultMessageEl.textContent = "It's a draw!";
        setResultPanel("draw");
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    currentPlayerEl.textContent = currentPlayer;
    resultMessageEl.textContent = `Player ${currentPlayer}'s turn`;
};

const resetRound = () => {
    board = Array(9).fill(null);
    currentPlayer = "X";
    gameOver = false;

    cells.forEach(cell => {
        cell.textContent = "";
        cell.disabled = false;
        cell.removeAttribute("data-mark");
        cell.classList.remove("is-winner");
        cell.setAttribute("aria-pressed", "false");
    });

    currentPlayerEl.textContent = "X";
    resultMessageEl.textContent = "Click any square to begin.";

    const panel = resultMessageEl.closest(".result-panel");
    panel.classList.remove("is-win", "is-draw");
};

const resetMatch = () => {
    scoreX = 0;
    scoreO = 0;
    scoreXEl.textContent = 0;
    scoreOEl.textContent = 0;
    resetRound();
};

cells.forEach((cell, index) => {
    cell.addEventListener("click", () => handleClick(index));
});

resetRoundBtn.addEventListener("click", resetRound);
resetMatchBtn.addEventListener("click", resetMatch);
