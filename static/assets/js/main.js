
/* Initial variables */

let g = {
  w: 20,
  tick: 100,
  score: 0,
  started: false
};
let mainLoop;
let food;

/* Generate game board */

const $game = document.querySelector('.game'),
  $score = document.querySelector('.score'),
  $tick = document.querySelector('.tick'),
  $overlay = document.querySelector('.overlay');

for (y = 0; y < (g.w + 1); y++) {
  for (x = 0; x < (g.w + 1); x++) {
    let $div = document.createElement('div');
    $div.setAttribute('class', 'cell');
    $div.setAttribute('data-x', x);
    $div.setAttribute('data-y', y);
    $game.appendChild($div);
  }
}

const cells = document.getElementsByClassName('cell');

/* Gameboard dimensions */

resizeBoard();

window.addEventListener("resize", resizeBoard);

function resizeBoard() {
  let dw = window.innerWidth,
      dh = window.innerHeight,
      gw = ((dw * 0.65) < dh ? (dw * 0.65) : dh);

  gw = (Math.floor(gw) - 20);

  $game.style.maxWidth = gw + "px";
  $game.style.maxHeight = gw + "px";

  let cw = gw / (g.w + 1);

  for ($cell of cells) {
    $cell.style.width = cw + "px";
    $cell.style.height = cw + "px";
  }
}

/* Cell prototype */

function Cell(x, y, type) {
  this.x = x;
  this.y = y;
  this.type = type;
}

/* Snake object */

const snake = {
  x: 10,
  y: 10,
  ate: false,
  length: null,
  direction: 'up',
  cells: null,
  toRemove: null,
  generate: function (length) {
    this.length = length;
    this.cells = [];
    for (i = 0; i < this.length; i++) {
      let cell = new Cell(this.x, this.y + i, 'snake')
      this.cells.push(cell)
    }
  },
  containsCell: function (x, y) {
    for (cell of this.cells) {
      if (x === cell.x && y === cell.y) {return true;}
    }
    return false;
  },
  move: function () {
    switch (this.direction) {
      case 'up': {this.y--; break;}
      case 'down': {this.y++; break;}
      case 'left': {this.x--; break;}
      case 'right': {this.x++; break;}
    }

    this.cells.unshift(new Cell(this.x, this.y, 'snake'));

    this.ate = (this.x === food.x && this.y === food.y ? true : false);

    if (!this.ate) {
      this.toRemove = this.cells.pop();
    } else {
      food = new Food;
      this.length++;
      g.score += 10;
    }
  },
  checkForCollision: function () {
    if (this.x < 0 || this.x > g.w) {return true;}

    if (this.y < 0 || this.y > g.w) {return true;}

    for (i = 1; i < this.cells.length; i++) {
      if (this.x === this.cells[i].x && this.y === this.cells[i].y) {return true;}
    }

    return false;
  }
};

snake.generate(4);

/* Food prototype */

function Food() {
  let x;
  let y;

  do {
    x = randomXY();
    y = randomXY();
  } while (snake.containsCell(x, y))

  return(new Cell(x, y, 'food'))
}

food = new Food();

/* Random coordinate fucntion */

function randomXY() {
  return(Math.floor(Math.random() * (g.w + 1)));
}

/* Find and update cell class */

function updateCell(x, y, className) {
  document.querySelector('.cell[data-x="' + x + '"][data-y="' + y + '"]').className = className;
}

/* Render function */

function render() {
  for (cell of snake.cells) {
    updateCell(cell.x, cell.y, 'cell cell-snake');
  }

  if (snake.toRemove) {
    updateCell(snake.toRemove.x, snake.toRemove.y, 'cell');
  }

  updateCell(food.x, food.y, 'cell cell-food');

  /* Display to UI */

  $score.innerHTML = g.score;
  $tick.innerHTML = g.tick + " ms";
}

/* Main loop */

function mainFunction() {

  snake.move();
  if (snake.checkForCollision()) {stopGame();}

  render();

};

/* Start game */

function resetAndStartGame() {
  g.started = true;
  g.score = 0;
  snake.generate(4);
  mainLoop = setInterval(mainFunction, g.tick);
}

/* Stop game */

function stopGame() {
  clearInterval(mainLoop);
  g.started = false;
  $overlay.innerHTML = "GAME OVER";
  $overlay.style.display = "block";
}

/* Init */

render();

if (!g.started) {
  window.onkeydown = function () {
    window.onkeydown = function (e) {
      switch (e.key) {
        case "ArrowUp":
        case "w":
          snake.direction = 'up';
          break;
        case "ArrowDown":
        case "s":
          snake.direction = 'down';
          break;
        case "ArrowLeft":
        case "a":
          snake.direction = 'left';
          break;
        case "ArrowRight":
        case "d":
          snake.direction = 'right';
          break;
      }
    };

    $overlay.style.display = "none";

    resetAndStartGame();
  }
}
