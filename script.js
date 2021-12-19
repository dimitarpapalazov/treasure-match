let levelOne = generateLevel("red", 15, 15, 1, false, "levelTwo");
let levelTwo = generateLevel("green", 15, 15, 2, false, "levelThree");
let levelThree = generateLevel("orange", 15, 15, 3, true);
let mainMenu = new Phaser.State();
mainMenu.preload = preloadMainMenu;
mainMenu.create = createMainMenu;

var game = new Phaser.Game(500, 500, Phaser.AUTO);
game.state.add("mainMenu", mainMenu);
game.state.add("levelOne", levelOne);
game.state.add("levelTwo", levelTwo);
game.state.add("levelThree", levelThree);
game.state.start("mainMenu");

function preloadMainMenu() {
  game.load.image("background", "./assets/background.png");
  game.load.image("wood", "./assets/wood.png");
  game.load.image("instructions", "./assets/instructions_button.png");
  game.load.image("levelOne", "./assets/level_one_button.png");
  game.load.image("levelTwo", "./assets/level_two_button.png");
  game.load.image("levelThree", "./assets/level_three_button.png");
}

function createMainMenu() {
  game.add.tileSprite(0, 0, 500, 500, "background");

  game.add.tileSprite(100, 50, 300, 400, "wood");

  game.add.text(140, 60, `Treasure Match`, {
    fontSize: "30px",
    fill: "white",
    align: "center",
  });

  game.add.button(200, 125, "instructions", null);
  game.add.button(200, 200, "levelOne", () => {
    game.state.start("levelOne");
  });
  game.add.button(200, 275, "levelTwo", () => {
    game.state.start("levelTwo");
  });
  game.add.button(200, 350, "levelThree", () => {
    game.state.start("levelThree");
  });
}

function preloadLevel() {
  game.load.image("red", "./assets/red_gem.png");
  game.load.image("green", "./assets/green_gem.png");
  game.load.image("blue", "./assets/blue_gem.png");
  game.load.image("yellow", "./assets/yellow_gem.png");
  game.load.image("orange", "./assets/orange_gem.png");
  game.load.image("purple", "./assets/purple_gem.png");
  game.load.image("white", "./assets/white_gem.png");
  game.load.image("background", "./assets/background.png");
  game.load.image("redo", "./assets/redo.png");
  game.load.image("wood", "./assets/wood.png");
  game.load.image("startButton", "./assets/start_button.png");
  game.load.image("nextLevel", "./assets/next_level_button.png");
}

const redPercentage = 0.29; // 29%
const greenPercentage = 0.53; // 24%
const bluePercentage = 0.72; // 19%
const yellowPercentage = 0.86; // 14%
const orangePercentage = 0.96; // 10%
const purplePercentage = 1; // 4%
const startingPositionX = 105;
const startingPositionY = 5;
const rows = 10;
const columns = 10;
const gemSideSize = 39;

let gems;
let selectedGem;
let score = 0;
let movesText;
let goalText;
let scoreText;
let started = false;
let goalScore;
let menuBackground;
let startButton;
let menuText;
let moves;
let goal;
let goalColor;
let specialObject;
let level;
let goalGemSprite;
let nextLevel;

function createLevel() {
  game.stage.disableVisibilityChange = true;

  game.add.tileSprite(0, 0, 500, 500, "background");

  menuBackground = game.add.tileSprite(100, 50, 300, 400, "wood");

  startButton = game.add.button(250, 400, "startButton", initLevel);
  startButton.anchor.set(0.5);

  moves = game.state.getCurrentState().moves;
  goal = game.state.getCurrentState().goal;
  goalColor = game.state.getCurrentState().goalColor;
  level = game.state.getCurrentState().level;
  goalScore = getGoalScore();
  nextLevel = game.state.getCurrentState().nextLevel;

  menuText = game.add.text(
    250,
    200,
    `Level ${level}\n\n\nYour goal is:\n\n${goal}     \n\nYou have:\n ${moves} moves\n\nYour goal score is:\n${goalScore}\n\nGood luck!`,
    {
      fontSize: "18px",
      fill: "white",
      align: "center",
    }
  );
  menuText.anchor.set(0.5);

  goalGemSprite = game.add.sprite(250, 150, goalColor);
}

function initLevel() {
  startButton.visible = false;
  menuBackground.visible = false;
  menuText.visible = false;

  game.add.text(5, 70, "Moves:", {
    fontSize: "28px",
    fill: "black",
  });
  movesText = game.add.text(35, 100, moves, {
    fontSize: "28px",
    fill: "black",
  });

  game.add.text(5, 205, "Goal:", {
    fontSize: "28px",
    fill: "black",
  });
  goalText = game.add.text(50, 240, goal, {
    fontSize: "28px",
    fill: "black",
  });

  goalGemSprite.x = 5;
  goalGemSprite.y = 240;

  game.add.text(5, 410, "Score:", {
    fontSize: "28px",
    fill: "black",
  });
  scoreText = game.add.text(35, 445, score, {
    fontSize: "28px",
    fill: "black",
  });

  game.add.button(
    game.world.width - 45,
    game.world.height - 45,
    "redo",
    redoLevel
  );

  generateGems();
  destroy();
}

function redoLevel() {
  game.state.restart();
}

function getGoalScore() {
  switch (goalColor) {
    case "red":
      return 10 * goal * 2;
    case "green":
      return 20 * goal * 2;
    case "blue":
      return 30 * goal * 2;
    case "yellow":
      return 40 * goal * 2;
    case "orange":
      return 50 * goal * 2;
    case "purple":
      return 60 * goal * 2;
    default:
      return null;
  }
}

function generateGems() {
  gems = game.add.group();

  let positionX = startingPositionX;
  let positionY = startingPositionY;
  let hasSpecialObject = game.state.getCurrentState().specialObject;
  let iSpecial;
  let jSpecial;

  if (hasSpecialObject) {
    iSpecial = Math.floor(Math.random() * 10);
    jSpecial = Math.floor(Math.random() * 10);
  }

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      let gem;

      if (hasSpecialObject && iSpecial === i && jSpecial === j) {
        gem = generateSpecialGem(positionX, positionY);
      } else {
        gem = generateColoredGem(positionX, positionY);
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

function generateSpecialGem(positionX, positionY) {
  let gem = gems.create(positionX, positionY, "white");
  gem.score = 100;
  gem.special = true;
  return gem;
}

function generateColoredGem(x, y) {
  let gem;
  let random = Math.random();
  if (random < redPercentage) {
    gem = gems.create(x, y, "red");
    gem.score = 10;
  } else if (random >= redPercentage && random < greenPercentage) {
    gem = gems.create(x, y, "green");
    gem.score = 20;
  } else if (random >= greenPercentage && random < bluePercentage) {
    gem = gems.create(x, y, "blue");
    gem.score = 30;
  } else if (random >= bluePercentage && random < yellowPercentage) {
    gem = gems.create(x, y, "yellow");
    gem.score = 40;
  } else if (random >= yellowPercentage && random < orangePercentage) {
    gem = gems.create(x, y, "orange");
    gem.score = 50;
  } else {
    gem = gems.create(x, y, "purple");
    gem.score = 60;
  }
  return gem;
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

  if (gemOne.special) {
    setTimeout(specialDestroy, 500, gemOne);
  }

  let check = destroy(true);

  if (!check) setTimeout(swapGems, 1000, gemOne, gemTwo);

  setTimeout(destroy, 500);
}

function checkLevelEnd() {
  if (moves === 0 && goal !== 0) {
    showEndMenu("lose");
  }
  if (goal === 0) {
    showEndMenu("win");
  }
}

function showEndMenu(outcome) {
  if (outcome === "win") {
    menuBackground.visible = true;
    menuBackground.bringToTop();
    menuText.visible = true;
    menuText.text = `Congratulations!\n\n You won with score:\n${score}`;
    menuText.bringToTop();
    if (level !== 3) game.add.button(200, 350, "nextLevel", startNextLevel);
    else menuText.text + "\nYou won the game!";
  } else if (outcome === "lose") {
    menuBackground.visible = true;
    menuBackground.bringToTop();
    menuText.visible = true;
    menuText.text = `You lost!\n\n
    Your score was:\n
    ${score}\n
    Your remaining moves:\n
    ${moves}\n
    Your remaining gems for goal:\n
    ${goal}`;
    menuText.bringToTop();
    startButton.visible = true;
    startButton.bringToTop();
  }
}

function startNextLevel() {
  game.state.start(nextLevel);
}

function specialDestroy(gemOne) {
  let i = gemOne.i;
  let j = gemOne.j;

  const gemsToDestroy = [];

  for (let z = 0; z < rows; z++) {
    gemsToDestroy.push(getGem(i, z));
    gemsToDestroy.push(getGem(z, j));
  }

  for (let gem of gemsToDestroy) kill(gem);

  setTimeout(align, 500);
  setTimeout(destroy, 1500);
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
  let i1 = gemOne.i;
  let j1 = gemOne.j;
  let i2 = gemTwo.i;
  let j2 = gemTwo.j;

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
  moveGem(gem, 11, -2);

  checkLevelEnd();
}

function updateScore() {
  scoreText.text = score;
}

function updateGoal() {
  if (goal < 0) {
    goal = 0;
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
  let y = startingPositionY - gemSideSize;
  let gem = generateColoredGem(x, y);

  gem.i = i;
  gem.j = j;

  gem.inputEnabled = true;
  gem.events.onInputDown.add(selectGem, this);
  gem.events.onInputUp.add(releaseGem);

  gem.killed = false;
  moveGem(gem, gem.i, gem.j);
}

function generateLevel(
  goalColor,
  goal,
  moves,
  level,
  specialObject = false,
  nextLevel
) {
  const object = new Phaser.State();

  object.goalColor = goalColor;
  object.goal = goal;
  object.moves = moves;
  object.level = level;
  object.specialObject = specialObject;
  object.nextLevel = nextLevel;

  object.preload = preloadLevel;
  object.create = createLevel;

  return object;
}
