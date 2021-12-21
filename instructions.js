function preloadInstruction() {
  game.load.image("background", "./assets/background.png");
  game.load.image("red", "./assets/red_gem.png");
  game.load.image("green", "./assets/green_gem.png");
  game.load.image("blue", "./assets/blue_gem.png");
  game.load.image("yellow", "./assets/yellow_gem.png");
  game.load.image("white", "./assets/white_gem.png");
  game.load.image("exitButton", "./assets/exit_button.png");
}

let selectedGemInstructions;
let startingX = 40;
let startingY = 300;
let gemsInstructions;

function createInstruction() {
  game.stage.disableVisibilityChange = true;

  game.add.tileSprite(0, 0, 500, 500, "background");

  game.add.text(
    15,
    25,
    `Match 3 or more\n
    pieces of the same\n
    type by swapping\n
    adjacent ones.`,
    {
      fontSize: "16px",
      fill: "black",
      align: "center",
    }
  );

  game.add.text(
    275,
    25,
    `We have special object.\n
    Try to move it in\n
    any direction you want.\n
    It will destroy\n
    every gem horizontally\n
    and vertically`,
    {
      fontSize: "16px",
      fill: "black",
      align: "center",
    }
  );

  gemsInstructions = game.add.group();

  generateLeftGems(gemsInstructions);
  generateRightGems(gemsInstructions);

  game.add
    .button(250, 500, "exitButton", () => {
      game.state.start("mainMenu");
    })
    .anchor.set(0.5, 1);
}

function generateLeftGems(gems) {
  let gem = gems.create(40, 340, "red");
  gem.i = 1;
  gem.j = 0;
  gem.inputEnabled = true;
  gem.events.onInputDown.add(selectGemInstructions, this);
  gem.events.onInputUp.add(releaseGemInstructions);

  gem = gems.create(80, 340, "green");
  gem.i = 1;
  gem.j = 1;
  gem.inputEnabled = true;
  gem.events.onInputDown.add(selectGemInstructions, this);
  gem.events.onInputUp.add(releaseGemInstructions);

  gem = gems.create(120, 340, "red");
  gem.i = 1;
  gem.j = 2;
  gem.inputEnabled = true;
  gem.events.onInputDown.add(selectGemInstructions, this);
  gem.events.onInputUp.add(releaseGemInstructions);

  gem = gems.create(80, 300, "red");
  gem.i = 0;
  gem.j = 1;
  gem.inputEnabled = true;
  gem.events.onInputDown.add(selectGemInstructions, this);
  gem.events.onInputUp.add(releaseGemInstructions);
}

function generateRightGems(gems) {
  let gem = gems.create(320, 340, "red");
  gem.i = 1;
  gem.j = 7;
  gem.inputEnabled = true;
  gem.events.onInputDown.add(selectGemInstructions, this);
  gem.events.onInputUp.add(releaseGemInstructions);

  gem = gems.create(360, 340, "green");
  gem.i = 1;
  gem.j = 8;
  gem.inputEnabled = true;
  gem.events.onInputDown.add(selectGemInstructions, this);
  gem.events.onInputUp.add(releaseGemInstructions);

  gem = gems.create(400, 340, "blue");
  gem.i = 1;
  gem.j = 9;
  gem.inputEnabled = true;
  gem.events.onInputDown.add(selectGemInstructions, this);
  gem.events.onInputUp.add(releaseGemInstructions);

  gem = gems.create(360, 300, "yellow");
  gem.i = 0;
  gem.j = 8;
  gem.inputEnabled = true;
  gem.events.onInputDown.add(selectGemInstructions, this);
  gem.events.onInputUp.add(releaseGemInstructions);

  gem = gems.create(360, 380, "white");
  gem.i = 2;
  gem.j = 8;
  gem.inputEnabled = true;
  gem.events.onInputDown.add(selectGemInstructions, this);
  gem.events.onInputUp.add(releaseGemInstructions);
  gem.special = true;
}

function selectGemInstructions(gem) {
  selectedGemInstructions = gem;
}

function releaseGemInstructions() {
  let i = Math.floor((game.input.mousePointer.position.y - startingY) / 40);
  let j = Math.floor((game.input.mousePointer.position.x - startingX) / 40);
  playerSwapInstructions(selectedGemInstructions, getGemInstructions(i, j));
}

function playerSwapInstructions(gemOne, gemTwo) {
  if (gemTwo === null) return;

  if (!isSwapValidInstructions(gemOne, gemTwo)) return;

  swapGemsInstructions(gemOne, gemTwo);

  if (gemOne.special) {
    setTimeout(specialDestroyInstructions, 500, gemOne);
  } else if (gemTwo.special) {
    setTimeout(specialDestroyInstructions, 500, gemTwo);
  }

  setTimeout(destroyInstructions, 500);
}

function isSwapValidInstructions(gemOne, gemTwo) {
  if (gemOne.i - 1 === gemTwo.i && gemOne.j === gemTwo.j) return true;
  else if (gemOne.i + 1 === gemTwo.i && gemOne.j === gemTwo.j) return true;
  else if (gemOne.j - 1 === gemTwo.j && gemOne.i === gemTwo.i) return true;
  else if (gemOne.j + 1 === gemTwo.j && gemOne.i === gemTwo.i) return true;
  else return false;
}

function swapGemsInstructions(gemOne, gemTwo) {
  let i1 = gemOne.i;
  let j1 = gemOne.j;
  let i2 = gemTwo.i;
  let j2 = gemTwo.j;

  gemOne.i = i2;
  gemOne.j = j2;
  moveGemInstructions(gemOne, i2, j2);

  gemTwo.i = i1;
  gemTwo.j = j1;
  moveGemInstructions(gemTwo, i1, j1);
}

function moveGemInstructions(gem, i, j) {
  let x = j * 40 + startingX;
  let y = i * 40 + startingY;
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

function getGemInstructions(i, j) {
  let g = null;
  gemsInstructions.forEach((gem) => {
    if (gem.i == i && gem.j == j) g = gem;
  });
  return g;
}

function destroyInstructions() {
  const gemsForDestroying = [];

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      let gem = getGemInstructions(i, j);
      if (gem != null) {
        let right = similarToRightInstructions(gem);
        let down = similarToDownInstructions(gem);

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
        }
      }
    }
  }

  for (let g of gemsForDestroying) {
    killInstructions(g);
  }
}

function killInstructions(gem) {
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
}

function similarToRightInstructions(gem) {
  const gemsToDestroyToRight = [];
  let j = gem.j;
  while (j < 3) {
    let g = getGemInstructions(gem.i, j);
    if (g !== null && g.key === gem.key) {
      gemsToDestroyToRight.push(g);
    } else {
      break;
    }
    j++;
  }
  return gemsToDestroyToRight;
}

function similarToDownInstructions(gem) {
  const gemsToDestroyToDown = [];
  let i = gem.i;
  while (i < 3) {
    let g = getGemInstructions(i, gem.j);
    if (g !== null && g.key === gem.key) {
      gemsToDestroyToDown.push(g);
    } else {
      break;
    }
    i++;
  }
  return gemsToDestroyToDown;
}

function specialDestroyInstructions(gemOne) {
  let i = gemOne.i;
  let j = gemOne.j;

  const gemsToDestroy = [];

  for (let m = 0; m < 3; m++) {
    for (let n = 7; n < 10; n++) {
      gemsToDestroy.push(getGemInstructions(m, n));
    }
  }

  for (let gem of gemsToDestroy) killInstructions(gem);
}
