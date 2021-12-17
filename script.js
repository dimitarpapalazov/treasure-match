let levelOne = new Phaser.State();
levelOne.preload = preload;
levelOne.create = create;
levelOne.update = update;

var game = new Phaser.Game(390, 390, Phaser.AUTO, "", levelOne);

function preload() {
  game.load.image("red", "./assets/red_gem.png");
  game.load.image("green", "./assets/green_gem.png");
  game.load.image("blue", "./assets/blue_gem.png");
  game.load.image("yellow", "./assets/yellow_gem.png");
  game.load.image("orange", "./assets/orange_gem.png");
  game.load.image("purple", "./assets/purple_gem.png");
}

const redPercentage = 0.29;
const greenPercentage = 0.53;
const bluePercentage = 0.72;
const yellowPercentage = 0.86;
const orangePercentage = 0.96;
const purplePercentage = 1;

let gems;
let selectedGem;
let positionX = 0;
let positionY = 0;

function create() {
  generateGems();
  destroyThrees();
}

function update() {}

function generateGems() {
  gems = game.add.group();
  for (let i = 1; i <= 100; i++) {
    let random = Math.random();
    let gem;

    if (random < redPercentage) {
      gem = gems.create(positionX, positionY, "red");
    } else if (random >= redPercentage && random < greenPercentage) {
      gem = gems.create(positionX, positionY, "green");
    } else if (random >= greenPercentage && random < bluePercentage) {
      gem = gems.create(positionX, positionY, "blue");
    } else if (random >= bluePercentage && random < yellowPercentage) {
      gem = gems.create(positionX, positionY, "yellow");
    } else if (random >= yellowPercentage && random < orangePercentage) {
      gem = gems.create(positionX, positionY, "orange");
    } else {
      gem = gems.create(positionX, positionY, "purple");
    }

    gem.inputEnabled = true;
    gem.events.onInputDown.add(selectGem, this);
    gem.events.onInputUp.add(releaseGem);

    positionX += 39;

    if (i % 10 === 0) {
      positionY += 39;
      positionX = 0;
    }
  }
}

function destroyThrees() {
  let destroyed = false;

  for (let i = 0; i < 100; i++) {
    if (gems.getAt(i).alive) {
      destroyed = destroyToRight(i) || destroyToDown(i) || destroyed;
    }
  }

  if (destroyed) {
    destroyThrees();
  }

  return destroyed;
}

function destroyToDown(i) {
  if (
    i % 100 < 80 &&
    gems.getAt(i).key === gems.getAt(i + 10).key &&
    gems.getAt(i).key === gems.getAt(i + 20).key
  ) {
    gems.getAt(i).kill();
    gems.getAt(i + 10).kill();
    gems.getAt(i + 20).kill();
    return true;
  }
  return false;
}

function destroyToRight(i) {
  if (
    i % 10 < 8 &&
    gems.getAt(i).key === gems.getAt(i + 1).key &&
    gems.getAt(i).key === gems.getAt(i + 2).key
  ) {
    gems.getAt(i).kill();
    gems.getAt(i + 1).kill();
    gems.getAt(i + 2).kill();

    return true;
  }
  return false;
}

function selectGem(gem) {
  selectedGem = gem;
}

function releaseGem() {
  let y = Math.floor(game.input.mousePointer.position.y / 39);
  let x = Math.floor(game.input.mousePointer.position.x / 39);

  playerSwap(selectedGem, gems.getAt(y * 10 + x));
}

function playerSwap(gemOne, gemTwo) {
  if (!isSwapValid(gems.getChildIndex(gemOne), gems.getChildIndex(gemTwo)))
    return;
  swapGems(gemOne, gemTwo);

  if (!destroyThrees()) {
    swapGems(gemOne, gemTwo);
  }
}

function swapGems(gemOne, gemTwo) {
  gems.swap(gemOne, gemTwo);
  swapAnimation(
    gemOne,
    gemTwo,
    gemOne.position.x,
    gemOne.position.y,
    gemTwo.position.x,
    gemTwo.position.y
  );
}

function swapAnimation(gemOne, gemTwo, x1, y1, x2, y2) {
  game.add.tween(gemOne).to({ x: x2, y: y2 }, 1000, null, false).start();
  game.add.tween(gemTwo).to({ x: x1, y: y1 }, 1000, null, false).start();
}

function isSwapValid(indexOne, indexTwo) {
  return (
    indexOne - 1 === indexTwo ||
    indexOne + 1 === indexTwo ||
    indexOne - 10 === indexTwo ||
    indexOne + 10 === indexTwo
  );
}
