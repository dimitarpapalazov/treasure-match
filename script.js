let levelOne = new Phaser.State();
levelOne.preload = preload;
levelOne.create = create;

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
  game.stage.disableVisibilityChange = true;

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
  destroy();
}

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

  let check = destroy(true);

  if (!check) setTimeout(swapGems, 1000, gemOne, gemTwo);

  setTimeout(destroy, 500);

  // TODO: ако е невалидно, не се прај destroy
}

function isSwapValid(gemOne, gemTwo) {
  if (gemOne.i - 1 === gemTwo.i && gemOne.j === gemTwo.j) return true;
  else if (gemOne.i + 1 === gemTwo.i && gemOne.j === gemTwo.j) return true;
  else if (gemOne.j - 1 === gemTwo.j && gemOne.i === gemTwo.i) return true;
  else if (gemOne.j + 1 === gemTwo.j && gemOne.i === gemTwo.i) return true;
  else return false;
}

function updateMoves() {
  if (moves === 0) console.log("end"); // end game here
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
      250,
      "Linear",
      true
    )
    .start();
}

function destroy(check = false) {
  let destroyed = false;
  const gemsForDestroying = [];

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      let gem = getGem(i, j);
      if (gem != null) {
        let right = similarToRight(gem);
        let down = similarToDown(gem);

        let destroyGem = false;

        if (right.length > 2) {
          destroyGem = true;
          for (let g of right) {
            gemsForDestroying.push(g);
          }
        }

        if (down.length > 2) {
          destroyGem = true;
          for (let g of down) {
            gemsForDestroying.push(g);
          }
        }

        if (destroyGem) {
          gemsForDestroying.push(gem);
          destroyed = destroyGem;
        }
      }
    }
  }

  if (check) {
    if (gemsForDestroying.length === 0) return false;
    else return true;
  }

  for (let g of gemsForDestroying) {
    kill(g);
  }

  if (destroyed) {
    setTimeout(align, 500);
    setTimeout(destroy, 1500);
  }

  return destroyed;
}

function similarToRight(gem) {
  const gemsToDestroyToRight = [];
  let j = gem.j;
  while (j < columns) {
    let g = getGem(gem.i, j);
    if (g !== null && g.key === gem.key) {
      gemsToDestroyToRight.push(g);
    } else {
      break;
    }
    j++;
  }
  return gemsToDestroyToRight;
}

function similarToDown(gem) {
  const gemsToDestroyToDown = [];
  let i = gem.i;
  while (i < rows) {
    let g = getGem(i, gem.j);
    if (g !== null && g.key === gem.key) {
      gemsToDestroyToDown.push(g);
    } else {
      break;
    }
    i++;
  }
  return gemsToDestroyToDown;
}

function kill(gem) {
  if (started && !gem.killed) {
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
  if (goal < 0) {
    goal = 0;
    goalText.text = goal;
    // end level
  }
  goalText.text = goal;
}

function align() {
  for (let j = 0; j < columns; j++) {
    const column = [];
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
        setTimeout(createNewGem, 500, i, j);
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
