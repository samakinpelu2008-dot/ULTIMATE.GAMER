let points = 0;
function updatePoints(change) {
  points += change;
  document.getElementById("points").textContent = "Points: " + points;
}

function showGame(game) {
  document.querySelectorAll(".game-container").forEach(c => c.style.display = "none");
  document.getElementById(game).style.display = "block";
}

/* ---------- Tic-Tac-Toe ---------- */
function initTicTacToe() {
  const container = document.getElementById("tictactoe");
  container.innerHTML = `
    <h2>Tic-Tac-Toe</h2>
    <div class="ttt-board" id="tttBoard"></div>
    <button onclick="initTicTacToe()">Restart</button>
  `;
  const board = document.getElementById("tttBoard");
  let current = "X";
  let cells = Array(9).fill("");
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.addEventListener("click", () => {
      if (!cells[i]) {
        cells[i] = current;
        cell.textContent = current;
        cell.classList.add("taken");
        if (checkWin(cells, current)) {
          alert(current + " wins!");
          updatePoints(10);
          initTicTacToe();
        } else if (cells.every(c => c)) {
          alert("Draw!");
          initTicTacToe();
        } else {
          current = current === "X" ? "O" : "X";
        }
      }
    });
    board.appendChild(cell);
  }
}
function checkWin(board, player) {
  const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  return wins.some(line => line.every(i => board[i] === player));
}

/* ---------- Snake ---------- */
function initSnake() {
  const container = document.getElementById("snake");
  container.innerHTML = `
    <h2>Snake</h2>
    <canvas id="snakeCanvas" width="400" height="400"></canvas>
  `;
  const canvas = document.getElementById("snakeCanvas");
  const ctx = canvas.getContext("2d");
  let snake = [{x: 200, y: 200}];
  let food = {x: 100, y: 100};
  let dx = 20, dy = 0;
  let gameOver = false;

  function draw() {
    if (gameOver) return;
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,400,400);
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, 20, 20);
    ctx.fillStyle = "lime";
    snake.forEach(s => ctx.fillRect(s.x, s.y, 20, 20));
  }
  function move() {
    if (gameOver) return;
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    if (head.x<0||head.y<0||head.x>=400||head.y>=400||snake.some(s=>s.x===head.x&&s.y===head.y)) {
      alert("Game Over!");
      updatePoints(-5);
      gameOver = true;
      return;
    }
    snake.unshift(head);
    if (head.x===food.x && head.y===food.y) {
      food = {x: Math.floor(Math.random()*20)*20, y: Math.floor(Math.random()*20)*20};
    } else snake.pop();
  }
  document.addEventListener("keydown", e => {
    if (e.key==="ArrowUp"&&dy===0){dx=0;dy=-20;}
    else if (e.key==="ArrowDown"&&dy===0){dx=0;dy=20;}
    else if (e.key==="ArrowLeft"&&dx===0){dx=-20;dy=0;}
    else if (e.key==="ArrowRight"&&dx===0){dx=20;dy=0;}
  });
  setInterval(()=>{move();draw();},200);
}

/* ---------- Snakes & Ladders ---------- */
function initSnakesAndLadders() {
  const container = document.getElementById("snakesladders");
  container.innerHTML = `
    <h2>Snakes & Ladders</h2>
    <button id="rollBtn">Roll Dice</button>
    <p id="status">Player at 0</p>
  `;
  let pos = 0;
  const snakes = {16:6,48:30,62:19,88:24,95:56,97:78};
  const ladders = {1:38,4:14,9:31,28:84,21:42,36:44,51:67,71:91,80:100};
  document.getElementById("rollBtn").onclick = () => {
    const roll = Math.floor(Math.random()*6)+1;
    pos += roll;
    if (pos in snakes) pos = snakes[pos];
    else if (pos in ladders) pos = ladders[pos];
    if (pos >= 100) {
      document.getElementById("status").textContent = "You won!";
      updatePoints(10);
      pos = 0;
    } else {
      document.getElementById("status").textContent = "Player at " + pos;
    }
  };
}

/* ---------- Connect 4 ---------- */
function initConnect4() {
  const container = document.getElementById("connect4");
  container.innerHTML = `
    <h2>Connect 4</h2>
    <div id="connect4Board"></div>
    <button onclick="initConnect4()">Restart</button>
  `;
  const rows = 6, cols = 7;
  const board = Array(rows).fill(null).map(()=>Array(cols).fill(null));
  const divBoard = document.getElementById("connect4Board");
  let current = "red";

  function render() {
    divBoard.innerHTML = "";
    for (let r=0;r<rows;r++){
      for (let c=0;c<cols;c++){
        const cell = document.createElement("div");
        cell.classList.add("connect-cell");
        if (board[r][c]) cell.classList.add(board[r][c]);
        cell.addEventListener("click", ()=>drop(c));
        divBoard.appendChild(cell);
      }
    }
  }
  function drop(c) {
    for (let r=rows-1;r>=0;r--){
      if (!board[r][c]) {
        board[r][c] = current;
        if (checkWinner(r,c)) {
          alert(current + " wins!");
          updatePoints(10);
          initConnect4();
          return;
        }
        current = current==="red"?"yellow":"red";
        render();
        return;
      }
    }
  }
  function checkWinner(r,c) {
    const dirs = [[1,0],[0,1],[1,1],[1,-1]];
    for (let [dr,dc] of dirs) {
      let count=1;
      for (let d of [-1,1]) {
        let nr=r+dr*d,nc=c+dc*d;
        while(nr>=0&&nr<rows&&nc>=0&&nc<cols&&board[nr][nc]===current){
          count++;nr+=dr*d;nc+=dc*d;
        }
      }
      if (count>=4) return true;
    }
    return false;
  }
  render();
}

/* ---------- Init all ---------- */
document.addEventListener("DOMContentLoaded", ()=>{
  initTicTacToe();
  initSnake();
  initSnakesAndLadders();
  initConnect4();
});
