
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

function Cell(x, y, type) {
  this.x = x;
  this.y = z;
  this.type = type;
}

const snake = {
  x: 10,
  y: 10,
  ate: false,
  length: 4,
  cells: []
};

/* Generate snake */

/* onKeyDown function */

/* Move function */

/* onFoodPickup function */

/* Init game */

/* Main loop */
