document.addEventListener("DOMContentLoaded", () => {
  const rollDiceButton = document.getElementById("rollDiceButton");
  const restartButton = document.getElementById("restartButton");
  const diceValueElement = document.getElementById("dice");
  const turnInfoElement = document.getElementById("turnInfo");
  const player1PositionElement = document.getElementById("player1Position");
  const player2PositionElement = document.getElementById("player2Position");

  const board = document.getElementById("board");
  const laddersList = document.getElementById("laddersList");
  const snakesList = document.getElementById("snakesList");
  const boardSize = 10;
  const cells = [];

  const snakes = {
    16: 6,
    47: 26,
    49: 11,
    56: 53,
    62: 19,
    64: 60,
    87: 24,
    93: 73,
    95: 75,
    98: 78,
  };

  const ladders = {
    2: 38,
    4: 14,
    9: 31,
    21: 42,
    28: 84,
    36: 44,
    51: 67,
    71: 91,
    80: 100,
  };

  // Populate ladders and snakes lists
  for (const [start, end] of Object.entries(ladders)) {
    const listItem = document.createElement("li");
    listItem.textContent = `${start} ➜ ${end}`;
    laddersList.appendChild(listItem);
  }

  for (const [start, end] of Object.entries(snakes)) {
    const listItem = document.createElement("li");
    listItem.textContent = `${start} ➜ ${end}`;
    snakesList.appendChild(listItem);
  }

  // Create the board in a serpentine pattern from 1 to 100
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      let number;
      if (row % 2 === 0) {
        number = boardSize * (boardSize - row - 1) + col + 1;
      } else {
        number = boardSize * (boardSize - row) - col;
      }
      cell.textContent = number;
      cell.dataset.number = number; // Store the cell number in a data attribute
      cells[number] = cell; // Store the cell in the cells array
      board.appendChild(cell);

      if (snakes[number]) {
        const snake = document.createElement("div");
        snake.className = "snake";
        cell.appendChild(snake);
      }

      if (ladders[number]) {
        const ladder = document.createElement("div");
        ladder.className = "ladder";
        cell.appendChild(ladder);
      }
    }
  }

  // Initial player positions
  let playerPositions = [1, 1];
  const playerElements = [
    document.createElement("div"),
    document.createElement("div"),
  ];
  playerElements[0].className = "player player1";
  playerElements[1].className = "player player2";

  // Function to update player positions on the board
  function updatePlayerPosition(playerIndex, newPosition) {
    const oldPosition = playerPositions[playerIndex];
    if (
      oldPosition > 0 &&
      cells[oldPosition].contains(playerElements[playerIndex])
    ) {
      cells[oldPosition].removeChild(playerElements[playerIndex]);
    }
    if (newPosition <= 100) {
      cells[newPosition].appendChild(playerElements[playerIndex]);
    }
    playerPositions[playerIndex] = newPosition;
  }

  // Initial placement of players
  updatePlayerPosition(0, playerPositions[0]);
  updatePlayerPosition(1, playerPositions[1]);

  async function rollDice() {
    const response = await fetch("http://127.0.0.1:5000/roll_dice", {
      method: "POST",
    });
    const data = await response.json();

    updateDiceGraphic(data.dice_value);
    updatePlayerPosition(0, data.player_positions[0]);
    updatePlayerPosition(1, data.player_positions[1]);
    player1PositionElement.textContent = data.player_positions[0];
    player2PositionElement.textContent = data.player_positions[1];
    turnInfoElement.textContent = `Player ${data.current_turn + 1}'s turn`;

    checkForWinner();
  }

  function updateDiceGraphic(value) {
    const diceGraphics = ["🎲", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
    diceValueElement.textContent = diceGraphics[value];
  }

  function checkForWinner() {
    if (playerPositions[0] === 100) {
      alert("Player 1 wins!");
      endGame();
    } else if (playerPositions[1] === 100) {
      alert("Player 2 wins!");
      endGame();
    }
  }

  function endGame() {
    rollDiceButton.style.display = "none";
    restartButton.style.display = "block";
  }

  async function restartGame() {
    await fetch("http://127.0.0.1:5000/restart_game", { method: "POST" });
    window.location.reload(); // Reload the page
  }

  rollDiceButton.addEventListener("click", rollDice);
  restartButton.addEventListener("click", restartGame);

  async function fetchGameState() {
    const response = await fetch("http://127.0.0.1:5000/game_state");
    const data = await response.json();

    updatePlayerPosition(0, data.player_positions[0]);
    updatePlayerPosition(1, data.player_positions[1]);
    player1PositionElement.textContent = data.player_positions[0];
    player2PositionElement.textContent = data.player_positions[1];
    turnInfoElement.textContent = `Player ${data.current_turn + 1}'s turn`;
  }

  // Fetch initial game state
  fetchGameState();
});
