let levelOne = new Phaser.State();
levelOne.preload = preload;
levelOne.create = create;
levelOne.update = update;

var game = new Phaser.Game(500, 500, Phaser.AUTO, "", levelOne);

function preload() {
  game.load.image("red", "./assets/red_gem.png");
  game.load.image("green", "./assets/green_gem.png");
  game.load.image("blue", "./assets/blue_gem.png");
  game.load.image("yellow", "./assets/yellow_gem.png");
  game.load.image("orange", "./assets/orange_gem.png");
  game.load.image("purple", "./assets/purple_gem.png");
  game.load.image("background", "./assets/background.png");
}

const redPercentage = 0.29;
const greenPercentage = 0.53;
const bluePercentage = 0.72;
const yellowPercentage = 0.86;
const orangePercentage = 0.96;
const purplePercentage = 1;
const startingPositionX = 105;
const startingPositionY = 5;
const rows = 10;
const columns = 10;
const gemSideSize = 39;
const goalColor = "red";

let gems;
let selectedGem;
let moves = 20;
let goal = 20;
let score = 0;
let movesText;
let goalText;
let scoreText;
let started = false;

function create() {
  game.add.tileSprite(0, 0, 500, 500, "background");

  game.add.text(5, 70, "Moves:", {
    fontSize: "30px",
    fill: "black",
  });
  movesText = game.add.text(35, 100, moves, {
    fontSize: "30px",
    fill: "black",
  });

  game.add.text(5, 205, "Goal:", {
    fontSize: "30px",
    fill: "black",
  });
  goalText = game.add.text(35, 235, goal, {
    fontSize: "30px",
    fill: "black",
  });

  game.add.text(5, 405, "Score:", {
    fontSize: "30px",
    fill: "black",
  });
  scoreText = game.add.text(35, 435, score, {
    fontSize: "30px",
    fill: "black",
  });
  generateGems();
  destroyThrees();
}

function update() {}

function generateGems() {
  gems = game.add.group();

  let positionX = startingPositionX;
  let positionY = startingPositionY;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      let random = Math.random();
      let gem;

      if (random < redPercentage) {
        gem = gems.create(positionX, positionY, "red");
        gem.score = 10;
      } else if (random >= redPercentage && random < greenPercentage) {
        gem = gems.create(positionX, positionY, "green");
        gem.score = 20;
      } else if (random >= greenPercentage && random < bluePercentage) {
        gem = gems.create(positionX, positionY, "blue");
        gem.score = 30;
      } else if (random >= bluePercentage && random < yellowPercentage) {
        gem = gems.create(positionX, positionY, "yellow");
        gem.score = 40;
      } else if (random >= yellowPercentage && random < orangePercentage) {
        gem = gems.create(positionX, positionY, "orange");
        gem.score = 50;
      } else {
        gem = gems.create(positionX, positionY, "purple");
        gem.score = 60;
      }

      gem.i = i;
      gem.j = j;

      gem.inputEnabled = true;
      gem.events.onInputDown.add(selectGem, this);
      gem.events.onInputUp.add(releaseGem);

      gem.killed = false;

      positionX += gemSideSize;

      if (j === 9) {
        positionY += gemSideSize;
        positionX = startingPositionX;
      }
    }
  }
}

function selectGem(gem) {
  selectedGem = gem;
}

function releaseGem() {
  let i = Math.floor(
    (game.input.mousePointer.position.y - startingPositionY) / gemSideSize
  );
  let j = Math.floor(
    (game.input.mousePointer.position.x - startingPositionX) / gemSideSize
  );
  playerSwap(selectedGem, getGem(i, j));
}

function getGem(i, j) {
  let g = null;
  gems.forEach((gem) => {
    if (gem.i == i && gem.j == j) g = gem;
  });
  return g;
}

function playerSwap(gemOne, gemTwo) {
  started = true;
  if (!isSwapValid(gemOne, gemTwo)) return;
  moves--;
  updateMoves();

  swapGems(gemOne, gemTwo);

  destroyThrees();
}

function isSwapValid(gemOne, gemTwo) {
  if (gemOne.i - 1 === gemTwo.i && gemOne.j === gemTwo.j) return true;
  else if (gemOne.i + 1 === gemTwo.i && gemOne.j === gemTwo.j) return true;
  else if (gemOne.j - 1 === gemTwo.j && gemOne.i === gemTwo.i) return true;
  else if (gemOne.j + 1 === gemTwo.j && gemOne.i === gemTwo.i) return true;
  else return false;
}

function updateMoves() {
  movesText.text = moves;
}

function swapGems(gemOne, gemTwo) {
  swapAnimation(gemOne, gemTwo, gemOne.i, gemOne.j, gemTwo.i, gemTwo.j);
}

function swapAnimation(gemOne, gemTwo, i1, j1, i2, j2) {
  gemOne.i = i2;
  gemOne.j = j2;
  moveGem(gemOne, i2, j2);

  gemTwo.i = i1;
  gemTwo.j = j1;
  moveGem(gemTwo, i1, j1);
}

function moveGem(gem, i, j) {
  let x = j * gemSideSize + startingPositionX;
  let y = i * gemSideSize + startingPositionY;
  game.add
    .tween(gem)
    .to(
      {
        x: x,
        y: y,
      },
      500,
      "Linear",
      true
    )
    .start();
}

function destroyThrees() {
  destroyed = false;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      let gem = getGem(i, j);
      if (gem != null) {
        destroyed = destroyToRight(gem) || destroyToDown(gem) || destroyed;
      }
    }
  }

  if (destroyed) {
    align();
    destroyThrees();
  }

  return destroyed;
}

function destroyToDown(gem) {
  let g1 = getGem(gem.i + 1, gem.j);
  let g2 = getGem(gem.i + 2, gem.j);
  if (g1 != null && g2 != null) {
    if (gem.key === g1.key && gem.key === g2.key) {
      kill(gem);
      kill(g1);
      kill(g2);
      return true;
    }
    return false;
  }
  return false;
}

function destroyToRight(gem) {
  let g1 = getGem(gem.i, gem.j + 1);
  let g2 = getGem(gem.i, gem.j + 2);
  if (g1 != null && g2 != null) {
    if (gem.key === g1.key && gem.key === g2.key) {
      kill(gem);
      kill(g1);
      kill(g2);
      return true;
    }
    return false;
  }
  return false;
}

function kill(gem) {
  if (started) {
    score += gem.score;
    goal -= gem.key === goalColor ? 1 : 0;

    updateScore();
    updateGoal();
  }

  game.add
    .tween(gem)
    .to(
      {
        alpha: 0,
      },
      1000,
      "Linear",
      true
    )
    .start();

  gem.i = -1;
  gem.j = -1;
  gem.killed = true;
  moveGem(gem, 11, 1);
}

function updateScore() {
  scoreText.text = score;
}

function updateGoal() {
  goalText.text = goal;
}

function align() {
  for (let j = 0; j < columns; j++) {
    let column = [];
    for (let gem of gems.getAll("j", j)) {
      column.push(gem);
    }
    column.sort((a, b) => a.i - b.i);
    column.reverse();

    let i = 9;
    for (let gem of column) {
      gem.i = i;
      moveGem(gem, i, j);
      i--;
    }
  }
  createNewGems();
}

function createNewGems() {
  for (let i = rows - 1; i >= 0; i--) {
    for (let j = columns - 1; j >= 0; j--) {
      if (!getGem(i, j)) {
        createNewGem(i, j);
      }
    }
  }
}

function createNewGem(i, j) {
  let x = j * gemSideSize + startingPositionX;
  let random = Math.random();
  let gem;

  if (random < redPercentage) {
    gem = gems.create(x, startingPositionY - gemSideSize, "red");
    gem.score = 10;
  } else if (random >= redPercentage && random < greenPercentage) {
    gem = gems.create(x, startingPositionY - gemSideSize, "green");
    gem.score = 20;
  } else if (random >= greenPercentage && random < bluePercentage) {
    gem = gems.create(x, startingPositionY - gemSideSize, "blue");
    gem.score = 30;
  } else if (random >= bluePercentage && random < yellowPercentage) {
    gem = gems.create(x, startingPositionY - gemSideSize, "yellow");
    gem.score = 40;
  } else if (random >= yellowPercentage && random < orangePercentage) {
    gem = gems.create(x, startingPositionY - gemSideSize, "orange");
    gem.score = 50;
  } else {
    gem = gems.create(x, startingPositionY - gemSideSize, "purple");
    gem.score = 60;
  }

  gem.i = i;
  gem.j = j;

  gem.inputEnabled = true;
  gem.events.onInputDown.add(selectGem, this);
  gem.events.onInputUp.add(releaseGem);

  gem.killed = false;
  moveGem(gem, gem.i, gem.j);
}
