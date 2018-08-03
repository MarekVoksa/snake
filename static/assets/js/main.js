
/* Author: Marek Voksa */

const
  $game = document.querySelector('.game'),
  $overlay = document.querySelector('.overlay'),
  $score = document.querySelector('.score'),
  $tick = document.querySelector('.tick'),
  $wrapIcon = document.getElementById('wrap-icon'),

  cells = document.getElementsByClassName('cell'),
  controls = {
    $up: document.querySelector('.controls-up'),
    $down: document.querySelector('.controls-down'),
    $left: document.querySelector('.controls-left'),
    $right: document.querySelector('.controls-right')
  };

let food;

/* Cell prototype */

function Cell(x, y, type) {

  this.x = x;
  this.y = y;

  this.type = type;

}

/* Food prototype */

function Food() {

  let
    x,
    y;

  do {

    x = game.randomXY();
    y = game.randomXY();

  } while ( snake.containsCell(x, y) )

  return(new Cell(x, y, 'food'));

}

function listenForInput() {

  window.onkeydown = function () {

    game.resetAndStartGame();

  };

  $overlay.onclick = function () {

    game.resetAndStartGame();

  };

}

function handleGameWrapInput() {

  if ( ! game.wrapActive ) {

    $wrapIcon.className = "fa fa-minus-square";

    game.wrapActive = true;

  } else {

    $wrapIcon.className = "fa fa-plus-square";

    game.wrapActive = false;

  }

}

/* Game object */

const game = {

  mainLoop: null,
  score: 0,
  started: false,
  tick: 100,
  width: 20,
  wrapActive: false,

  changeGameTick: (add) => {

    game.tick += add;
    UI.renderStats();

    if ( game.started ) {

      clearInterval(game.mainLoop);

      game.mainLoop = setInterval(game.mainFunction, game.tick);

    }

  },

  generateBoard: () => {

    for ( y = 0; y < (game.width + 1); y++ ) {

      for ( x = 0; x < (game.width + 1); x++ ) {

        let $div = document.createElement('div');

        $div.setAttribute('class', 'cell');
        $div.setAttribute('data-x', x);
        $div.setAttribute('data-y', y);

        $game.appendChild($div);

      }

    }

  },

  mainFunction: () => {

    snake.moveSnake();
    snake.changedDirection = false;

    if ( snake.checkForCollision() ) { game.stopGame(); }

    game.renderGame();

  },

  randomXY: () => {

    return(Math.floor(Math.random() * ( game.width + 1 )));

  },

  renderGame: () => {

    for ( cell of snake.cells ) {

      game.updateCell(cell.x, cell.y, 'cell cell-snake');

    }

    if ( snake.toRemove ) {

      game.updateCell(snake.toRemove.x, snake.toRemove.y, 'cell');

    }

    game.updateCell(food.x, food.y, 'cell cell-food');

    /* Display to UI */

    UI.renderStats();

  },

  resizeBoard: () => {

    let
      dw = window.innerWidth,
      dh = window.innerHeight,
      gw = ( ( dw * 0.65 ) < dh ? ( dw * 0.65 ) : dh );

    gw = ( Math.floor(gw) - 20 );

    $game.style.maxWidth = gw + "px";
    $game.style.maxHeight = gw + "px";

    let cw = gw / ( game.width + 1 );

    for ( $cell of cells ) {

      $cell.style.width = cw + "px";
      $cell.style.height = cw + "px";

    }

  },

  resetAndStartGame: () => {

    window.onkeydown = function (e) {

      switch ( e.key ) {

        case "ArrowUp":
        case "w":

          UI.lightUpButton('up');

          snake.changeDirection('up');

          break;

        case "ArrowDown":
        case "s":

          UI.lightUpButton('down');

          snake.changeDirection('down');

          break;

        case "ArrowLeft":
        case "a":

          UI.lightUpButton('left');

          snake.changeDirection('left');

          break;

        case "ArrowRight":
        case "d":

          UI.lightUpButton('right');

          snake.changeDirection('right');

          break;

        case "PageUp":

          game.changeGameTick(10);

          break;

        case "PageDown":

          game.changeGameTick(-10);

          break;

      }

    };

    window.onkeyup = function (e) {

      switch (e.key) {

        case "ArrowUp":
        case "w":

          UI.resetButton('up');

          break;

        case "ArrowDown":
        case "s":

          UI.resetButton('down');

          break;

        case "ArrowLeft":
        case "a":

          UI.resetButton('left');

          break;

        case "ArrowRight":
        case "d":

          UI.resetButton('right');

          break;

      }

    };

    for ( $cell of document.querySelectorAll('.cell') ) {

      $cell.className = 'cell';

    }

    $overlay.onclick = null;
    $overlay.style.display = "none";
    $overlay.innerHTML = "Press any button or click here to start game.";

    game.started = true;
    game.score = 0;

    snake.direction = 'up';
    snake.x = game.width / 2;
    snake.y = game.width / 2;
    snake.generateSnake(4);

    game.mainLoop = setInterval(game.mainFunction, game.tick);

  },

  stopGame: () => {

    game.started = false;

    clearInterval(game.mainLoop);

    $overlay.innerHTML = "<h2>GAME OVER</h2><p>Press any button or click here to try again.</p>";
    $overlay.style.display = "flex";

    setTimeout(listenForInput, 300);

  },

  updateCell: (x, y, className) => {

    let $cell = document.querySelector('.cell[data-x="' + x + '"][data-y="' + y + '"]');

    if ( $cell ) {

      $cell.className = className;

    }

  }

};

/* UI object */

const UI = {

  lightUpButton: (direction) => {

    let $button = document.querySelector('.controls-' + direction);

    $button.style.background = "#71e067";

  },

  pressButton: ($button) => {

    $button.style.background = "#71e067";

    setTimeout(() => { $button.style.background = "white"; }, 100);

    switch ( $button.className ) {

      case "controls-button controls-up":

        snake.direction = ( snake.direction === 'down' ? 'down' : 'up' );

        break;

      case "controls-button controls-down":

        snake.direction = ( snake.direction === 'up' ? 'up' : 'down' );

        break;

      case "controls-button controls-left":

        snake.direction = ( snake.direction === 'right' ? 'right' : 'left' );

        break;

      case "controls-button controls-right":

        snake.direction = ( snake.direction === 'left' ? 'left' : 'right' );

        break;

    }

  },

  renderStats: () => {

    $score.innerHTML = game.score;

    $tick.innerHTML = game.tick + " ms";

  },

  resetButton: (direction) => {

    let $button = document.querySelector('.controls-' + direction);

    $button.style.background = "white";

  },

}

/* Snake object */

const snake = {

  x: game.width / 2,
  y: game.width / 2,
  ate: false,
  cells: null,
  changedDirection: false,
  direction: 'up',
  directionOpposites: { 'up': 'down', 'down': 'up', 'left': 'right', 'right': 'left' },
  length: null,
  toRemove: null,

  changeDirection: (newDirection) => {

    if ( ! snake.changedDirection ) {

      if ( ! ( newDirection == snake.directionOpposites[snake.direction] ) ) {

        snake.direction = newDirection;
        snake.changedDirection = true;

      }

    }

  },

  checkForCollision: function () {

    if ( snake.x < 0 || snake.x > game.width || snake.y < 0 || snake.y > game.width ) { return true; }

    for ( i = 1; i < snake.cells.length; i++ ) {

      if ( snake.x === snake.cells[i].x && snake.y === snake.cells[i].y ) { return true; }

    }

    return false;

  },

  containsCell: function (x, y) {

    for ( cell of snake.cells ) {

      if ( x === cell.x && y === cell.y ) { return true; }

    }

    return false;

  },

  generateSnake: function (length) {

    snake.length = length;
    snake.cells = [ ];

    for ( i = 0; i < snake.length; i++ ) {

      let cell = new Cell(snake.x, snake.y + i, 'snake');

      snake.cells.push(cell);

    }

  },

  moveSnake: function () {

    switch ( snake.direction ) {

      case 'up': { snake.y--; break; }
      case 'down': { snake.y++; break; }
      case 'left': { snake.x--; break; }
      case 'right': { snake.x++; break; }

    }

    if ( game.wrapActive ) {

      if ( snake.x < 0 ) { snake.x = game.width }
      if ( snake.x > game.width ) { snake.x = 0 }
      if ( snake.y < 0 ) { snake.y = game.width }
      if ( snake.y > game.width ) { snake.y = 0 }

    }

    snake.cells.unshift(new Cell(snake.x, snake.y, 'snake'));
    snake.ate = ( snake.x === food.x && snake.y === food.y ? true : false );

    if ( ! snake.ate ) {

      snake.toRemove = snake.cells.pop();

    } else {

      food = new Food;

      snake.length++;

      game.score++;

    }

  }

};

/* Init */

snake.generateSnake(4);

food = new Food();

game.generateBoard();
game.resizeBoard();

window.addEventListener("resize", game.resizeBoard);

game.renderGame();

if ( ! game.started ) {

  listenForInput();

}
