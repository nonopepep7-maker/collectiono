<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Mini Games • Premium Collection</title>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Orbitron:wght@500;700&family=Roboto+Mono:wght@400;500&display=swap" rel="stylesheet">

  <style>
    /* ────────────────────────────────────────────────
       The CSS you already have from previous message
       (I'm not repeating the entire ~1200 lines here to save space)
       Just imagine it's placed here exactly as provided earlier
    ──────────────────────────────────────────────── */

    /* Additional small CSS improvements useful for JS interaction */
    .hidden { display: none !important; }
    .shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
    @keyframes shake {
      10%, 90% { transform: translate3d(-2px, 0, 0); }
      20%, 80% { transform: translate3d( 4px, 0, 0); }
      30%, 50%, 70% { transform: translate3d(-6px, 0, 0); }
      40%, 60% { transform: translate3d( 6px, 0, 0); }
    }

    .success-message { color: #34d399; font-weight: 600; }
    .error-message   { color: #f87171; font-weight: 600; }
    .info-message    { color: #60a5fa; font-weight: 500; }

    #snake-canvas:focus { outline: 3px solid #a78bfa; outline-offset: 4px; }
  </style>
</head>
<body>

  <div class="app-container">

    <header>
      <h1>Mini Games</h1>
      <div class="subtitle">Five premium micro-experiences • One clean interface</div>
    </header>

    <nav class="game-tabs">
      <button class="tab-btn active" data-game="rps">Rock Paper Scissors</button>
      <button class="tab-btn"        data-game="ttt">Tic Tac Toe</button>
      <button class="tab-btn"        data-game="guess">Guess Number</button>
      <button class="tab-btn"        data-game="memory">Memory Match</button>
      <button class="tab-btn"        data-game="snake">Snake</button>
    </nav>

    <!-- ────────────────────────────────────────────────
         GAME SECTIONS (HTML structure same as before)
    ──────────────────────────────────────────────── -->

    <section id="rps" class="game-section active">
      <h2 class="game-title">Rock • Paper • Scissors</h2>
      <div class="choices">
        <div class="rps-option" data-choice="rock">✊</div>
        <div class="rps-option" data-choice="paper">✋</div>
        <div class="rps-option" data-choice="scissors">✌️</div>
      </div>
      <div id="rps-result" class="info-message">Make your move…</div>
      <div class="game-controls">
        <button class="btn-primary" id="rps-reset">Play Again</button>
      </div>
    </section>

    <section id="ttt" class="game-section">
      <h2 class="game-title">Tic Tac Toe</h2>
      <div id="ttt-board"></div>
      <div id="ttt-status" class="info-message">Player X's turn</div>
      <div class="game-controls">
        <button class="btn-primary" id="ttt-reset">New Game</button>
      </div>
    </section>

    <section id="guess" class="game-section">
      <h2 class="game-title">Guess the Number</h2>
      <p style="margin-bottom:1.5rem; font-size:1.15rem; opacity:0.9;">
        I'm thinking of a number between 1 and 100
      </p>
      <div class="input-group">
        <input type="number" id="guess-input" placeholder="Your guess" min="1" max="100"/>
        <button class="btn-primary" id="guess-submit">Submit Guess</button>
      </div>
      <div id="guess-progress"><div id="guess-bar"></div></div>
      <div id="guess-message"></div>
      <div class="game-controls">
        <button class="btn-secondary" id="guess-new">New Number</button>
      </div>
    </section>

    <section id="memory" class="game-section">
      <h2 class="game-title">Memory Match</h2>
      <div id="memory-grid"></div>
      <div style="margin-top:2rem; font-size:1.3rem;">
        Matches: <span id="memory-matches">0</span> / 8
      </div>
      <div class="game-controls">
        <button class="btn-primary" id="memory-reset">Restart</button>
      </div>
    </section>

    <section id="snake" class="game-section">
      <h2 class="game-title">Snake</h2>
      <canvas id="snake-canvas" width="480" height="480" tabindex="0"></canvas>
      <div style="margin:2rem 0; font-size:1.5rem;">
        Score: <span id="snake-score">0</span>
      </div>
      <div class="game-controls">
        <button class="btn-primary" id="snake-start">Start Game</button>
        <button class="btn-secondary hidden" id="snake-pause">Pause</button>
      </div>
    </section>

  </div>

  <script>
    // ────────────────────────────────────────────────
    //  SHARED / GLOBAL LOGIC
    // ────────────────────────────────────────────────

    const sections = document.querySelectorAll('.game-section');
    const tabs     = document.querySelectorAll('.tab-btn');

    function switchGame(gameId) {
      sections.forEach(s => s.classList.remove('active'));
      tabs.forEach(t => t.classList.remove('active'));

      document.getElementById(gameId).classList.add('active');
      document.querySelector(`[data-game="${gameId}"]`).classList.add('active');

      // Small visual feedback
      document.body.style.backgroundPosition = `${Math.random()*100}% ${Math.random()*100}%`;
    }

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        switchGame(tab.dataset.game);
      });
    });

    // ────────────────────────────────────────────────
    //  1. ROCK PAPER SCISSORS
    // ────────────────────────────────────────────────

    const rpsChoices = document.querySelectorAll('.rps-option');
    const rpsResult  = document.getElementById('rps-result');
    const rpsReset   = document.getElementById('rps-reset');

    const rpsOptions = ['rock', 'paper', 'scissors'];

    function getComputerChoice() {
      return rpsOptions[Math.floor(Math.random() * 3)];
    }

    function determineWinner(player, computer) {
      if (player === computer) return "tie";
      if (
        (player === "rock"     && computer === "scissors") ||
        (player === "paper"    && computer === "rock")     ||
        (player === "scissors" && computer === "paper")
      ) return "player";
      return "computer";
    }

    rpsChoices.forEach(choice => {
      choice.addEventListener('click', () => {
        const playerChoice = choice.dataset.choice;
        const computerChoice = getComputerChoice();

        const result = determineWinner(playerChoice, computerChoice);

        let message = `You: ${playerChoice.toUpperCase()} • Computer: ${computerChoice.toUpperCase()}<br>`;
        let className = 'info-message';

        if (result === "player") {
          message += "You win!";
          className = 'success-message';
        } else if (result === "computer") {
          message += "Computer wins!";
          className = 'error-message';
        } else {
          message += "It's a tie!";
        }

        rpsResult.innerHTML = message;
        rpsResult.className = className;

        // Visual feedback
        choice.style.transform = 'scale(1.15)';
        setTimeout(() => choice.style.transform = '', 200);
      });
    });

    rpsReset.addEventListener('click', () => {
      rpsResult.innerHTML = "Make your move…";
      rpsResult.className = 'info-message';
    });

    // ────────────────────────────────────────────────
    //  2. TIC TAC TOE
    // ────────────────────────────────────────────────

    const tttBoardEl  = document.getElementById('ttt-board');
    const tttStatus   = document.getElementById('ttt-status');
    const tttReset    = document.getElementById('ttt-reset');

    let tttCurrentPlayer = 'X';
    let tttGameBoard = Array(9).fill(null);
    let tttGameActive = true;

    function createTTTBoard() {
      tttBoardEl.innerHTML = '';
      tttGameBoard.forEach((_, index) => {
        const cell = document.createElement('div');
        cell.classList.add('ttt-cell');
        cell.dataset.index = index;
        cell.addEventListener('click', handleTTClick);
        tttBoardEl.appendChild(cell);
      });
    }

    function handleTTClick(e) {
      const index = e.target.dataset.index;
      if (tttGameBoard[index] || !tttGameActive) return;

      tttGameBoard[index] = tttCurrentPlayer;
      e.target.textContent = tttCurrentPlayer;
      e.target.classList.add(tttCurrentPlayer.toLowerCase());

      if (checkWin(tttGameBoard, tttCurrentPlayer)) {
        tttStatus.textContent = `Player ${tttCurrentPlayer} wins!`;
        tttStatus.className = 'success-message';
        tttGameActive = false;
        return;
      }

      if (tttGameBoard.every(cell => cell)) {
        tttStatus.textContent = "It's a draw!";
        tttStatus.className = 'info-message';
        tttGameActive = false;
        return;
      }

      tttCurrentPlayer = tttCurrentPlayer === 'X' ? 'O' : 'X';
      tttStatus.textContent = `Player ${tttCurrentPlayer}'s turn`;
    }

    function checkWin(board, player) {
      const wins = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
      ];
      return wins.some(combo => combo.every(i => board[i] === player));
    }

    function resetTTT() {
      tttCurrentPlayer = 'X';
      tttGameBoard = Array(9).fill(null);
      tttGameActive = true;
      tttStatus.textContent = "Player X's turn";
      tttStatus.className = 'info-message';
      createTTTBoard();
    }

    tttReset.addEventListener('click', resetTTT);
    createTTTBoard();

    // ────────────────────────────────────────────────
    //  3. GUESS THE NUMBER
    // ────────────────────────────────────────────────

    let secretNumber = Math.floor(Math.random() * 100) + 1;
    const guessInput   = document.getElementById('guess-input');
    const guessSubmit  = document.getElementById('guess-submit');
    const guessMessage = document.getElementById('guess-message');
    const guessBar     = document.getElementById('guess-bar');
    const guessNew     = document.getElementById('guess-new');

    function handleGuess() {
      const guess = parseInt(guessInput.value);
      if (isNaN(guess) || guess < 1 || guess > 100) {
        guessMessage.textContent = "Please enter a number between 1 and 100";
        guessMessage.className = 'error-message';
        return;
      }

      const diff = Math.abs(guess - secretNumber);
      let percent = Math.max(0, 100 - diff * 2); // rough hot/cold

      guessBar.style.width = percent + '%';

      if (guess === secretNumber) {
        guessMessage.textContent = `Correct! The number was ${secretNumber}`;
        guessMessage.className = 'success-message';
        guessBar.style.background = 'linear-gradient(90deg, #34d399, #10b981)';
      } else if (guess < secretNumber) {
        guessMessage.textContent = "Too low!";
        guessMessage.className = 'error-message';
      } else {
        guessMessage.textContent = "Too high!";
        guessMessage.className = 'error-message';
      }

      guessInput.value = '';
    }

    guessSubmit.addEventListener('click', handleGuess);
    guessInput.addEventListener('keypress', e => {
      if (e.key === 'Enter') handleGuess();
    });

    guessNew.addEventListener('click', () => {
      secretNumber = Math.floor(Math.random() * 100) + 1;
      guessMessage.textContent = '';
      guessBar.style.width = '0%';
      guessMessage.className = '';
      guessInput.value = '';
    });

    // ────────────────────────────────────────────────
    //  4. MEMORY MATCH
    // ────────────────────────────────────────────────

    const memoryGrid   = document.getElementById('memory-grid');
    const memoryMatchesEl = document.getElementById('memory-matches');
    const memoryReset  = document.getElementById('memory-reset');

    const emojis = ['🍎','🍌','🍇','🍉','🍓','🍒','🥝','🍍'];
    let memoryCardsArray = [...emojis, ...emojis];
    let flippedCards = [];
    let matchedPairs = 0;

    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    function createMemoryBoard() {
      memoryGrid.innerHTML = '';
      shuffle(memoryCardsArray).forEach((emoji, index) => {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.dataset.value = emoji;
        card.dataset.index = index;

        card.innerHTML = `
          <div class="front">?</div>
          <div class="back">${emoji}</div>
        `;

        card.addEventListener('click', flipMemoryCard);
        memoryGrid.appendChild(card);
      });

      matchedPairs = 0;
      memoryMatchesEl.textContent = '0';
      flippedCards = [];
    }

    function flipMemoryCard(e) {
      const card = e.currentTarget;
      if (card.classList.contains('flipped') || card.classList.contains('matched') || flippedCards.length === 2) {
        return;
      }

      card.classList.add('flipped');
      flippedCards.push(card);

      if (flippedCards.length === 2) {
        checkMemoryMatch();
      }
    }

    function checkMemoryMatch() {
      const [card1, card2] = flippedCards;

      if (card1.dataset.value === card2.dataset.value) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;
        memoryMatchesEl.textContent = matchedPairs;

        if (matchedPairs === emojis.length) {
          setTimeout(() => {
            alert("Congratulations! You matched all pairs!");
          }, 600);
        }
      } else {
        setTimeout(() => {
          card1.classList.remove('flipped');
          card2.classList.remove('flipped');
        }, 1000);
      }

      flippedCards = [];
    }

    memoryReset.addEventListener('click', createMemoryBoard);
    createMemoryBoard();

    // ────────────────────────────────────────────────
    //  5. SNAKE
    // ────────────────────────────────────────────────

    const canvas       = document.getElementById('snake-canvas');
    const ctx          = canvas.getContext('2d');
    const snakeScoreEl = document.getElementById('snake-score');
    const snakeStart   = document.getElementById('snake-start');
    const snakePause   = document.getElementById('snake-pause');

    const gridSize = 20;
    const tileCount = canvas.width / gridSize;

    let snake = [{ x: 10, y: 10 }];
    let food = { x: 15, y: 15 };
    let dx = 1;
    let dy = 0;
    let score = 0;
    let gameLoop;
    let paused = false;

    function placeFood() {
      food.x = Math.floor(Math.random() * tileCount);
      food.y = Math.floor(Math.random() * tileCount);

      // avoid snake body
      if (snake.some(s => s.x === food.x && s.y === food.y)) {
        placeFood();
      }
    }

    function draw() {
      ctx.fillStyle = '#0f0c29';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // snake
      ctx.fillStyle = '#34d399';
      snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize-2, gridSize-2);
      });

      // food
      ctx.fillStyle = '#f472b6';
      ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize-2, gridSize-2);
    }

    function update() {
      if (paused) return;

      const head = { x: snake[0].x + dx, y: snake[0].y + dy };

      // wall collision
      if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
        return;
      }

      // self collision
      if (snake.some(s => s.x === head.x && s.y === head.y)) {
        gameOver();
        return;
      }

      snake.unshift(head);

      // eat food
      if (head.x === food.x && head.y === food.y) {
        score += 10;
        snakeScoreEl.textContent = score;
        placeFood();
      } else {
        snake.pop();
      }

      draw();
    }

    function changeDirection(e) {
      if (paused) return;

      if (e.key === 'ArrowUp'    && dy === 0) { dx = 0; dy = -1; }
      if (e.key === 'ArrowDown'  && dy === 0) { dx = 0; dy =  1; }
      if (e.key === 'ArrowLeft'  && dx === 0) { dx = -1; dy = 0; }
      if (e.key === 'ArrowRight' && dx === 0) { dx =  1; dy = 0; }
    }

    function gameOver() {
      clearInterval(gameLoop);
      alert(`Game Over! Your score: ${score}`);
      resetSnake();
    }

    function resetSnake() {
      snake = [{ x: 10, y: 10 }];
      dx = 1; dy = 0;
      score = 0;
      snakeScoreEl.textContent = '0';
      placeFood();
      paused = false;
      snakePause.classList.add('hidden');
      snakeStart.classList.remove('hidden');
      draw();
    }

    function startSnakeGame() {
      if (gameLoop) clearInterval(gameLoop);
      resetSnake();
      gameLoop = setInterval(update, 120);
      canvas.focus();
      snakeStart.classList.add('hidden');
      snakePause.classList.remove('hidden');
    }

    snakeStart.addEventListener('click', startSnakeGame);
    snakePause.addEventListener('click', () => {
      paused = !paused;
      snakePause.textContent = paused ? 'Resume' : 'Pause';
    });

    document.addEventListener('keydown', changeDirection);

    // Initial draw
    draw();

  </script>
</body>
</html>