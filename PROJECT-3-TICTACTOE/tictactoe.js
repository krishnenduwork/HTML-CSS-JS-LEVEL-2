  const board = document.getElementById('board');
  const statusText = document.getElementById('status');
  const resetBtn = document.getElementById('reset');
  const difficultySelect = document.getElementById('difficulty');

  const score = { wins: 0, losses: 0, draws: 0 };

  let cells = Array(9).fill(null);
  let gameActive = true;
  const player = 'X';
  const computer = 'O';

  const winningCombos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  function updateScore() {
    document.getElementById('wins').textContent = score.wins;
    document.getElementById('losses').textContent = score.losses;
    document.getElementById('draws').textContent = score.draws;
  }

  function createBoard() {
    board.innerHTML = '';
    cells = Array(9).fill(null);
    gameActive = true;
    statusText.textContent = "Your turn!";
    for (let i = 0; i < 9; i++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.index = i;
      cell.addEventListener('click', playerMove);
      board.appendChild(cell);
    }
  }

  function playerMove(e) {
    const index = e.target.dataset.index;
    if (!gameActive || cells[index]) return;

    makeMove(index, player);
    if (!checkGameOver(player)) {
      setTimeout(computerMove, 400);
    }
  }

  function makeMove(index, symbol) {
    cells[index] = symbol;
    const cell = board.querySelector(`[data-index='${index}']`);
    cell.textContent = symbol;
  }

  function computerMove() {
    let index;
    const level = difficultySelect.value;
    if (level === 'easy') {
      index = randomMove();
    } else if (level === 'medium') {
      index = Math.random() < 0.5 ? randomMove() : minimax(cells, computer).index;
    } else {
      index = minimax(cells, computer).index;
    }

    if (index != null) {
      makeMove(index, computer);
      checkGameOver(computer);
    }
  }

  function randomMove() {
    const available = cells.map((v, i) => v === null ? i : null).filter(v => v !== null);
    return available.length ? available[Math.floor(Math.random() * available.length)] : null;
  }

  function checkGameOver(currentPlayer) {
    if (checkWinner(currentPlayer)) {
      gameActive = false;
      if (currentPlayer === player) {
        statusText.textContent = "🎉 You win!";
        score.wins++;
      } else {
        statusText.textContent = "🤖 AI wins!";
        score.losses++;
      }
      updateScore();
      return true;
    }

    if (cells.every(cell => cell !== null)) {
      statusText.textContent = "It's a draw!";
      gameActive = false;
      score.draws++;
      updateScore();
      return true;
    }

    statusText.textContent = currentPlayer === player ? "Computer's turn..." : "Your turn!";
    return false;
  }

  function checkWinner(symbol) {
    return winningCombos.some(([a,b,c]) => cells[a] === symbol && cells[b] === symbol && cells[c] === symbol);
  }

  function minimax(newBoard, currentPlayer) {
    const available = newBoard.map((v, i) => v === null ? i : null).filter(v => v !== null);
    if (checkWinner(player)) return { score: -10 };
    if (checkWinner(computer)) return { score: 10 };
    if (available.length === 0) return { score: 0 };

    const moves = [];

    for (let i = 0; i < available.length; i++) {
      const index = available[i];
      newBoard[index] = currentPlayer;

      const result = minimax(newBoard, currentPlayer === computer ? player : computer);
      moves.push({ index, score: result.score });

      newBoard[index] = null;
    }

    let bestMove;
    if (currentPlayer === computer) {
      bestMove = moves.reduce((a, b) => a.score > b.score ? a : b);
    } else {
      bestMove = moves.reduce((a, b) => a.score < b.score ? a : b);
    }
    return bestMove;
  }

  resetBtn.addEventListener('click', createBoard);
  difficultySelect.addEventListener('change', createBoard);

  createBoard();
  updateScore();
