
/* Initial variables */

let g = {
  w: 20,
  tick: 100,
  score: 0,
  started: false
};
let mainLoop;
let food;

const $game = document.querySelector('.game'),
  $score = document.querySelector('.score'),
  $tick = document.querySelector('.tick'),
  $overlay = document.querySelector('.overlay'),
  controls = {
    $up: document.querySelector('.controls-up'),
    $down: document.querySelector('.controls-down'),
    $left: document.querySelector('.controls-left'),
    $right: document.querySelector('.controls-right')
  };

/* Generate game board */

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
  x: g.w / 2,
  y: g.w / 2,
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
  window.onkeydown = function (e) {
    switch (e.key) {
      case "ArrowUp":
      case "w":
        lightUpButton('up');
        snake.direction = (snake.direction === 'down' ? 'down' : 'up');
        break;
      case "ArrowDown":
      case "s":
        lightUpButton('down');
        snake.direction = (snake.direction === 'up' ? 'up' : 'down');
        break;
      case "ArrowLeft":
      case "a":
        lightUpButton('left');
        snake.direction = (snake.direction === 'right' ? 'right' : 'left');
        break;
      case "ArrowRight":
      case "d":
        lightUpButton('right');
        snake.direction = (snake.direction === 'left' ? 'left' : 'right');
        break;
      case "PageUp":
        changeGameTick(10);
        break;
      case "PageDown":
        changeGameTick(-10);
        break;
    }
  };
  window.onkeyup = function (e) {
    switch (e.key) {
      case "ArrowUp":
      case "w":
        resetButton('up');
        break;
      case "ArrowDown":
      case "s":
        resetButton('down');
        break;
      case "ArrowLeft":
      case "a":
        resetButton('left');
        break;
      case "ArrowRight":
      case "d":
        resetButton('right');
        break;
    }
  };

  for ($cell of document.querySelectorAll('.cell')) {
    $cell.className = 'cell';
  }

  $overlay.onclick = null;
  $overlay.style.display = "none";
  $overlay.innerHTML = "Press any button or click here to start game.";

  g.started = true;
  g.score = 0;

  snake.direction = 'up';
  snake.x = g.w / 2;
  snake.y = g.w / 2;
  snake.generate(4);
  mainLoop = setInterval(mainFunction, g.tick);
}

/* Stop game */

function stopGame() {
  clearInterval(mainLoop);
  $overlay.innerHTML = "<h2>GAME OVER</h2><div class='button-reset' onclick='resetAndStartGame()'>Try Again</div>";
  $overlay.style.display = "flex";
}

/* Init */

render();

if (!g.started) {
  window.onkeydown = function () {
    resetAndStartGame();
  };

  $overlay.onclick = function () {
    resetAndStartGame();
  };
}

/* UI Direction buttons */

function lightUpButton(direction) {
  let $button = document.querySelector('.controls-' + direction);
  $button.style.background = "#71e067";
}

function resetButton(direction) {
  let $button = document.querySelector('.controls-' + direction);
  $button.style.background = "white";
}

function pressButton($button) {
  $button.style.background = "#71e067";
  setTimeout(function () {$button.style.background = "white";}, 100);
  switch ($button.className) {
    case "controls-button controls-up":
      snake.direction = (snake.direction === 'down' ? 'down' : 'up');
      break;
    case "controls-button controls-down":
      snake.direction = (snake.direction === 'up' ? 'up' : 'down');
      break;
    case "controls-button controls-left":
      snake.direction = (snake.direction === 'right' ? 'right' : 'left');
      break;
    case "controls-button controls-right":
      snake.direction = (snake.direction === 'left' ? 'left' : 'right');
      break;
  }
}

function changeGameTick(add) {
  g.tick += add;

  clearInterval(mainLoop);

  mainLoop = setInterval(mainFunction, g.tick);
}
