
/* Initial variables */

let v = {
  w: 20,
  tick: 100,
  score: 0
};

/* Generate game board */

const $game = document.querySelector('.game');

for (y = 0; y < (v.w + 1); y++) {
  for (x = 0; x < (v.w + 1); x++) {
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

  let cw = gw / (v.w + 1);

  for ($cell of cells) {
    $cell.style.width = cw + "px";
    $cell.style.height = cw + "px";
  }
}

/* Cell prototype, snake object */

const snake = {
  x: 10,
  y: 10,
  ate: false,
  length: 4,
  direction: "up",
  cells: [],
  containsCell: function (x, y) {
    for (cell of snake.cells) {
      if (x === cell.x && y === cell.y) {return true;}
    }
    return false;
  }
};

function Cell(x, y, type) {
  this.x = x;
  this.y = y;
  this.type = type;
}

/* Generate snake cells */

for (i = 0; i < snake.length; i++) {
  let cell = new Cell(snake.x, snake.y + i, 'snake')
  snake.cells.push(cell)
}

/* Random coordinate fucntion */

function randomXY() {
  return(Math.floor(Math.random() * (v.w + 1)));
}

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

let food = new Food();

/* Move function */


/* onKeyDown function */


/* onFoodPickup function */



/* Render function */

function render() {
  for (cell of snake.cells) {
    document.querySelector('.cell[data-x="' + cell.x + '"][data-y="' + cell.y + '"]').className = "cell cell-snake";
  }

  document.querySelector('.cell[data-x="' + food.x + '"][data-y="' + food.y + '"]').className = "cell cell-food";
}

render();

/* Main loop */
