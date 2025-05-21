class TicTacToe {
  constructor() {
    this.board = Array(9).fill("");
    this.currentPlayer = "X";
    this.gameActive = true;
    this.winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Columns
      [0, 4, 8],
      [2, 4, 6], // Diagonals
    ];
    this.scores = {
      X: 0,
      O: 0,
    };

    // DOM Elements
    this.cells = document.querySelectorAll("[data-cell]");
    this.statusDisplay = document.getElementById("status");
    this.resetButton = document.getElementById("resetBtn");
    this.scoreXDisplay = document.getElementById("scoreX");
    this.scoreODisplay = document.getElementById("scoreO");
    this.currentPlayerDisplay = document.getElementById("currentPlayer");

    this.initializeGame();
  }

  initializeGame() {
    this.cells.forEach((cell) => {
      cell.addEventListener("click", (e) => this.handleCellClick(e), {
        once: true,
      });
    });

    this.resetButton.addEventListener("click", () => this.resetGame());
    this.updateStatus();
  }

  handleCellClick(e) {
    const cell = e.target;
    const index = Array.from(this.cells).indexOf(cell);

    if (this.board[index] !== "" || !this.gameActive) return;

    this.makeMove(cell, index);
    this.checkGameStatus();
  }

  makeMove(cell, index) {
    this.board[index] = this.currentPlayer;
    cell.textContent = this.currentPlayer;
    cell.classList.add(this.currentPlayer.toLowerCase());

    // Add animation class
    cell.style.animation = "none";
    cell.offsetHeight; // Trigger reflow
    cell.style.animation = "popIn 0.3s ease-out";
  }

  checkGameStatus() {
    const roundWon = this.checkWin();
    const roundDraw = this.checkDraw();

    if (roundWon) {
      this.handleWin();
    } else if (roundDraw) {
      this.handleDraw();
    } else {
      this.switchPlayer();
    }
  }

  checkWin() {
    return this.winningCombinations.some((combination) => {
      const [a, b, c] = combination;
      return (
        this.board[a] &&
        this.board[a] === this.board[b] &&
        this.board[a] === this.board[c]
      );
    });
  }

  checkDraw() {
    return this.board.every((cell) => cell !== "");
  }

  handleWin() {
    this.gameActive = false;
    this.scores[this.currentPlayer]++;
    this.updateScores();

    // Update win message with new styling
    this.statusDisplay.innerHTML = `
      <div class="win-message">
        <span>Player</span>
        <span class="winner ${this.currentPlayer.toLowerCase()}">${
      this.currentPlayer
    }</span>
        <span>wins!</span>
      </div>
    `;

    this.highlightWinningCombination();
    this.celebrateWin();
  }

  handleDraw() {
    this.gameActive = false;
    this.statusDisplay.innerHTML = `
      <div class="win-message">
        <span>Game ended in a</span>
        <span class="winner draw">DRAW!</span>
      </div>
    `;
  }

  highlightWinningCombination() {
    const winningCombination = this.winningCombinations.find((combination) => {
      const [a, b, c] = combination;
      return (
        this.board[a] &&
        this.board[a] === this.board[b] &&
        this.board[a] === this.board[c]
      );
    });

    if (winningCombination) {
      // Determine the direction of the winning line
      const [a, b, c] = winningCombination;
      let direction = "horizontal";

      if (a % 3 === b % 3 && b % 3 === c % 3) {
        direction = "vertical";
      } else if (a === 0 && b === 4 && c === 8) {
        direction = "diagonal";
      } else if (a === 2 && b === 4 && c === 6) {
        direction = "diagonal-reverse";
      }

      // Add winning line class and direction
      winningCombination.forEach((index) => {
        const cell = this.cells[index];
        cell.classList.add("winning-line", this.currentPlayer.toLowerCase());
        cell.setAttribute("data-direction", direction);
      });

      // Add bounce animation to the winning player's score
      const scoreElement =
        this.currentPlayer === "X" ? this.scoreXDisplay : this.scoreODisplay;
      scoreElement.classList.add("winner-bounce");
    }
  }

  switchPlayer() {
    this.currentPlayer = this.currentPlayer === "X" ? "O" : "X";
    this.updateStatus();
  }

  updateStatus() {
    this.currentPlayerDisplay.textContent = this.currentPlayer;
    this.currentPlayerDisplay.className = `current-player ${this.currentPlayer.toLowerCase()}`;
  }

  updateScores() {
    this.scoreXDisplay.textContent = this.scores.X;
    this.scoreODisplay.textContent = this.scores.O;
  }

  resetGame() {
    this.board = Array(9).fill("");
    this.currentPlayer = "X";
    this.gameActive = true;

    this.cells.forEach((cell) => {
      cell.textContent = "";
      cell.classList.remove("x", "o", "winning-line");
      cell.style.animation = "";
    });

    // Reset status display to turn indicator
    this.statusDisplay.innerHTML = `
      <div class="status">
        <span>Player</span>
        <span class="current-player x" id="currentPlayer">X</span>
        <span>'s turn</span>
      </div>
    `;
    this.currentPlayerDisplay = document.getElementById("currentPlayer");

    // Remove bounce animation from scores
    this.scoreXDisplay.classList.remove("winner-bounce");
    this.scoreODisplay.classList.remove("winner-bounce");

    // Reattach event listeners
    this.cells.forEach((cell) => {
      const newCell = cell.cloneNode(true);
      cell.parentNode.replaceChild(newCell, cell);
    });

    this.cells = document.querySelectorAll("[data-cell]");
    this.initializeGame();
  }

  celebrateWin() {
    const colors =
      this.currentPlayer === "X" ? ["#0ff", "#00ffff"] : ["#f0f", "#ff00ff"];

    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Confetti from left
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: colors,
      });

      // Confetti from right
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: colors,
      });
    }, 250);

    // Final burst
    setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: 100,
        origin: { x: 0.5, y: 0.5 },
        colors: colors,
        spread: 360,
        startVelocity: 45,
      });
    }, 250);
  }
}

// Add pop-in animation to CSS
const style = document.createElement("style");
style.textContent = `
    @keyframes popIn {
        0% {
            transform: scale(0);
            opacity: 0;
        }
        70% {
            transform: scale(1.2);
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Add floating symbols functionality
class FloatingSymbols {
  constructor() {
    this.container = document.getElementById("floatingContainer");
    this.symbols = ["X", "O"];
    this.interval = null;
    this.startFloatingSymbols();
  }

  createSymbol() {
    const symbol = document.createElement("div");
    symbol.className = `floating-symbol ${Math.random() > 0.5 ? "x" : "o"}`;
    symbol.textContent = Math.random() > 0.5 ? "X" : "O";

    // Random position
    const startPosition = Math.random() * window.innerWidth;
    symbol.style.left = `${startPosition}px`;

    // Random size
    const size = Math.random() * 2 + 1; // Between 1rem and 3rem
    symbol.style.fontSize = `${size}rem`;

    // Random animation duration
    const duration = Math.random() * 10 + 10; // Between 10s and 20s
    symbol.style.animationDuration = `${duration}s`;

    this.container.appendChild(symbol);

    // Remove symbol after animation
    symbol.addEventListener("animationend", () => {
      symbol.remove();
    });
  }

  startFloatingSymbols() {
    // Create initial symbols
    for (let i = 0; i < 10; i++) {
      this.createSymbol();
    }

    // Create new symbols periodically
    this.interval = setInterval(() => {
      if (this.container.children.length < 20) {
        // Limit maximum symbols
        this.createSymbol();
      }
    }, 1000);
  }

  stopFloatingSymbols() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}

// Initialize the game and floating symbols
document.addEventListener("DOMContentLoaded", () => {
  new TicTacToe();
  new FloatingSymbols();
});
