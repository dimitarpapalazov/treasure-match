export default class Level extends Phaser.State {

  constructor(game, goalColor, goal, moves, level, specialObject = false, nextLevel) {
    super();
    this.game = game;
    this.goalColor = goalColor;
    this.goal = goal;
    this.moves = moves;
    this.level = level;
    this.specialObject = specialObject;
    this.nextLevel = nextLevel;
    this.goalCopy = this.goal;
    this.movesCopy = this.moves;

    this.redPercentage = 0.29; // 29%
    this.greenPercentage = 0.53; // 24%
    this.bluePercentage = 0.72; // 19%
    this.yellowPercentage = 0.86; // 14%
    this.orangePercentage = 0.96; // 10%
    this.purplePercentage = 1; // 4%
    this.startingPositionX = 105;
    this.startingPositionY = 5;
    this.rows = 10;
    this.columns = 10;
    this.gemSideSize = 39;

  }

  preload() {
    this.game.load.image("red", "./assets/red_gem.png");
    this.game.load.image("green", "./assets/green_gem.png");
    this.game.load.image("blue", "./assets/blue_gem.png");
    this.game.load.image("yellow", "./assets/yellow_gem.png");
    this.game.load.image("orange", "./assets/orange_gem.png");
    this.game.load.image("purple", "./assets/purple_gem.png");
    this.game.load.image("white", "./assets/white_gem.png");
    this.game.load.image("background", "./assets/background.png");
    this.game.load.image("redo", "./assets/redo.png");
    this.game.load.image("wood", "./assets/wood.png");
    this.game.load.image("startButton", "./assets/start_button.png");
    this.game.load.image("nextLevel", "./assets/next_level_button.png");
    this.game.load.image("star", "./assets/star.png");
    this.game.load.image("starGold", "./assets/star_gold.png");
    this.game.load.image("exitButton", "./assets/exit_button.png");
  }



  create() {
    this.game.stage.disableVisibilityChange = true;

    this.game.add.tileSprite(0, 0, 500, 500, "background");

    this.menuBackground = this.game.add.tileSprite(100, 50, 300, 400, "wood");

    this.startButton = this.game.add.button(250, 400, "startButton", this.initLevel, this);
    this.startButton.anchor.set(0.5);

    this.goal = this.goalCopy;
    this.moves = this.movesCopy;
    this.goalScore = this.getGoalScore();

    this.started = false;
    this.score = 0;

    this.menuText = this.game.add.text(
      250,
      200,
      `Level ${this.level}\n\n\nYour goal is:\n\n${this.goal}     \n\nYou have:\n ${this.moves} moves\n\nYour goal score is:\n${this.goalScore}\n\nGood luck!`,
      {
        fontSize: "18px",
        fill: "white",
        align: "center",
      }
    );
    this.menuText.anchor.set(0.5);

    this.goalGemSprite = this.game.add.sprite(250, 150, this.goalColor);
  }

  initLevel() {
    this.startButton.visible = false;
    this.menuBackground.visible = false;
    this.menuText.visible = false;

    this.game.add.text(5, 70, "Moves:", {
      fontSize: "28px",
      fill: "black",
    });
    this.movesText = this.game.add.text(35, 100, this.moves, {
      fontSize: "28px",
      fill: "black",
    });

    this.game.add.text(5, 220, "Goal:", {
      fontSize: "28px",
      fill: "black",
    });
    this.goalText = this.game.add.text(50, 255, this.goal, {
      fontSize: "28px",
      fill: "black",
    });

    this.goalGemSprite.x = 5;
    this.goalGemSprite.y = 255;

    this.game.add.text(5, 410, "Score:", {
      fontSize: "28px",
      fill: "black",
    });
    this.scoreText = this.game.add.text(35, 445, this.score, {
      fontSize: "28px",
      fill: "black",
    });

    this.game.add.button(
      this.game.world.width - 45,
      this.game.world.height - 75,
      "redo",
      this.redoLevel.bind(this)
    );

    this.stars = this.game.add.group();
    this.stars.create(210, this.game.world.height - 75, "star");
    this.stars.create(250, this.game.world.height - 75, "star");
    this.stars.create(290, this.game.world.height - 75, "star");

    this.game.add.button(0, 0, "exitButton", () => {
      this.game.state.start("mainMenu");
    });

    this.generateGems();
    this.destroy();
  }

  redoLevel() {
    this.game.state.restart();
  }

  getGoalScore() {
    switch (this.goalColor) {
      case "red":
        return 10 * this.goal * 3;
      case "green":
        return 20 * this.goal * 3;
      case "blue":
        return 30 * this.goal * 3;
      case "yellow":
        return 40 * this.goal * 3;
      case "orange":
        return 50 * this.goal * 3;
      case "purple":
        return 60 * this.goal * 3;
      default:
        return null;
    }
  }

  generateGems() {
    this.gems = this.game.add.group();

    let positionX = this.startingPositionX;
    let positionY = this.startingPositionY;

    let iSpecial;
    let jSpecial;

    if (this.specialObject) {
      iSpecial = Math.floor(Math.random() * 10);
      jSpecial = Math.floor(Math.random() * 10);
    }

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        let gem;

        if (this.specialObject && iSpecial === i && jSpecial === j) {
          gem = this.generateSpecialGem(positionX, positionY);
        } else {
          gem = this.generateColoredGem(positionX, positionY);
        }

        gem.i = i;
        gem.j = j;

        gem.inputEnabled = true;
        gem.events.onInputDown.add(this.selectGem, this);
        gem.events.onInputUp.add(this.releaseGem.bind(this));

        gem.killed = false;

        positionX += this.gemSideSize;

        if (j === 9) {
          positionY += this.gemSideSize;
          positionX = this.startingPositionX;
        }
      }
    }
  }

  generateSpecialGem(positionX, positionY) {
    let gem = this.gems.create(positionX, positionY, "white");
    gem.score = 100;
    gem.special = true;
    return gem;
  }

  generateColoredGem(x, y) {
    let gem;
    let random = Math.random();
    if (random < this.redPercentage) {
      gem = this.gems.create(x, y, "red");
      gem.score = 10;
    } else if (random >= this.redPercentage && random < this.greenPercentage) {
      gem = this.gems.create(x, y, "green");
      gem.score = 20;
    } else if (random >= this.greenPercentage && random < this.bluePercentage) {
      gem = this.gems.create(x, y, "blue");
      gem.score = 30;
    } else if (random >= this.bluePercentage && random < this.yellowPercentage) {
      gem = this.gems.create(x, y, "yellow");
      gem.score = 40;
    } else if (random >= this.yellowPercentage && random < this.orangePercentage) {
      gem = this.gems.create(x, y, "orange");
      gem.score = 50;
    } else {
      gem = this.gems.create(x, y, "purple");
      gem.score = 60;
    }
    return gem;
  }

  selectGem(gem) {
    this.selectedGem = gem;
  }

  releaseGem() {
    let i = Math.floor(
      (this.game.input.mousePointer.position.y - this.startingPositionY) / this.gemSideSize
    );
    let j = Math.floor(
      (this.game.input.mousePointer.position.x - this.startingPositionX) / this.gemSideSize
    );
    let iDiff = this.selectedGem.i - i;
    let jDiff = this.selectedGem.j - j;
    if (iDiff >= 1) {
      this.playerSwap(this.selectedGem, this.getGem(this.selectedGem.i - 1, this.selectedGem.j));
    } else if (iDiff <= -1) {
      this.playerSwap(this.selectedGem, this.getGem(this.selectedGem.i + 1, this.selectedGem.j));
    } else if (jDiff >= 1) {
      this.playerSwap(this.selectedGem, this.getGem(this.selectedGem.i, this.selectedGem.j - 1));
    } else if (jDiff <= -1) {
      this.playerSwap(this.selectedGem, this.getGem(this.selectedGem.i, this.selectedGem.j + 1));
    }
  }

  getGem(i, j) {
    let g = null;
    this.gems.forEach((gem) => {
      if (gem.i == i && gem.j == j) g = gem;
    });
    return g;
  }

  playerSwap(gemOne, gemTwo) {
    if (gemTwo === null) return;

    this.started = true;

    if (!this.isSwapValid(gemOne, gemTwo)) return;

    this.moves--;
    this.updateMoves();

    this.swapGems(gemOne, gemTwo);

    if (gemOne.special) {
      setTimeout(this.specialDestroy.bind(this), 500, gemOne);
    } else if (gemTwo.special) {
      setTimeout(this.specialDestroy.bind(this), 500, gemTwo);
    }

    let check = this.destroy(true);

    if (!check) setTimeout(this.swapGems.bind(this), 1000, gemOne, gemTwo);

    setTimeout(this.destroy.bind(this), 500);

    setTimeout(this.checkLevelEnd.bind(this), 1000);
  }

  checkLevelEnd() {
    if (this.moves === 0 && this.goal !== 0) {
      this.showEndMenu("lose");
    }
    if (this.goal === 0) {
      this.showEndMenu("win");
    }
  }

  showEndMenu(outcome) {
    this.menuBackground.visible = true;
    this.menuBackground.bringToTop();
    this.menuText.visible = true;
    if (outcome === "win") {

      this.menuText.text = `Congratulations!\n\n You won with score:\n${this.score}`;

      this.stars.getAt(1).y = 250;
      this.stars.getAt(0).y = 250;
      this.stars.getAt(2).y = 250;
      this.stars.getAt(0).centerX = this.game.world.centerX - 40;
      this.stars.getAt(1).centerX = this.game.world.centerX;
      this.stars.getAt(2).centerX = this.game.world.centerX + 40;
      this.game.world.bringToTop(this.stars);

      if (this.level !== 3) this.game.add.button(200, 350, "nextLevel", this.startNextLevel.bind(this));
      else this.menuText.text + "\nYou won the game!";
    } else if (outcome === "lose") {

      this.menuText.text = `You lost!\n\n
        Your score was:\n
        ${this.score}\n
        Your remaining moves:\n
        ${this.moves}\n
        Your remaining gems for goal:\n
        ${this.goal}`;

      this.game.add
        .button(this.game.world.width / 2, 400, "startButton", this.redoLevel.bind(this))
        .anchor.set(0.5, 0.5);
    }
    this.menuText.bringToTop();
  }

  startNextLevel() {
    this.game.state.start(this.nextLevel);
  }

  specialDestroy(gemOne) {
    let i = gemOne.i;
    let j = gemOne.j;

    const gemsToDestroy = [];

    for (let z = 0; z < this.rows; z++) {
      gemsToDestroy.push(this.getGem(i, z));
      gemsToDestroy.push(this.getGem(z, j));
    }

    for (let gem of gemsToDestroy) this.kill(gem);

    setTimeout(this.align.bind(this), 500);
    setTimeout(this.destroy.bind(this), 1500);
  }

  isSwapValid(gemOne, gemTwo) {
    if (gemOne.i - 1 === gemTwo.i && gemOne.j === gemTwo.j) return true;
    else if (gemOne.i + 1 === gemTwo.i && gemOne.j === gemTwo.j) return true;
    else if (gemOne.j - 1 === gemTwo.j && gemOne.i === gemTwo.i) return true;
    else if (gemOne.j + 1 === gemTwo.j && gemOne.i === gemTwo.i) return true;
    else return false;
  }

  updateMoves() {
    this.movesText.text = this.moves;
  }

  swapGems(gemOne, gemTwo) {
    let i1 = gemOne.i;
    let j1 = gemOne.j;
    let i2 = gemTwo.i;
    let j2 = gemTwo.j;

    gemOne.i = i2;
    gemOne.j = j2;
    this.moveGem(gemOne, i2, j2);

    gemTwo.i = i1;
    gemTwo.j = j1;
    this.moveGem(gemTwo, i1, j1);
  }

  moveGem(gem, i, j) {
    let x = j * this.gemSideSize + this.startingPositionX;
    let y = i * this.gemSideSize + this.startingPositionY;
    if (this.started)
      this.game.add
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
    else
      this.game.add
        .tween(gem)
        .to(
          {
            x: x,
            y: y,
          },
          1,
          "Linear",
          true
        )
        .start();
  }

  destroy(check = false) {
    this.changeInput(false);

    let destroyed = false;
    const gemsForDestroying = [];

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        let gem = this.getGem(i, j);
        if (gem != null) {
          let right = this.similarToRight(gem);
          let down = this.similarToDown(gem);

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
      this.kill(g);
    }

    if (destroyed && this.started) {
      setTimeout(this.align.bind(this), 500);
      setTimeout(this.destroy.bind(this), 1500);
    }
    if (destroyed && !this.started) {
      this.align();
      this.destroy();
    }
    setTimeout(this.changeInput.bind(this), 500, true);
  }

  changeInput(value) {
    this.gems.forEach((g) => (g.inputEnabled = value));
  }

  similarToRight(gem) {
    const gemsToDestroyToRight = [];
    let j = gem.j;
    while (j < this.columns) {
      let g = this.getGem(gem.i, j);
      if (g !== null && g.key === gem.key) {
        gemsToDestroyToRight.push(g);
      } else {
        break;
      }
      j++;
    }
    return gemsToDestroyToRight;
  }

  similarToDown(gem) {
    const gemsToDestroyToDown = [];
    let i = gem.i;
    while (i < this.rows) {
      let g = this.getGem(i, gem.j);
      if (g !== null && g.key === gem.key) {
        gemsToDestroyToDown.push(g);
      } else {
        break;
      }
      i++;
    }
    return gemsToDestroyToDown;
  }

  kill(gem) {
    if (this.started && !gem.killed) {
      this.goal -= gem.key === this.goalColor ? 1 : 0;
      this.updateGoal();

      if (this.goal !== 0) {
        this.score += gem.score;
        this.updateScore();
      }
    }

    gem.i = -1;
    gem.j = -1;
    gem.killed = true;
    this.moveGem(gem, 11, -2);
    this.updateStars();

    let tween;

    if (this.started)
      tween = this.game.add
        .tween(gem)
        .to(
          {
            alpha: 0,
          },
          1000,
          "Linear",
          true
        )
        .start()
    else
      tween = this.game.add
        .tween(gem)
        .to(
          {
            alpha: 0,
          },
          1,
          "Linear",
          true
        )
        .start()

    tween.onComplete.addOnce(() => {
      gem.destroy();
    });




  }

  updateStars() {
    let percentage = Math.floor((this.score / this.goalScore) * 100);
    if (percentage > 33 && percentage < 67)
      this.stars.getAt(0).loadTexture("starGold");
    else if (percentage >= 67 && percentage < 100)
      this.stars.getAt(1).loadTexture("starGold");
    else if (percentage > 100) this.stars.getAt(2).loadTexture("starGold");
  }

  updateScore() {
    this.scoreText.text = this.score;
  }

  updateGoal() {
    if (this.goal < 0) {
      this.goal = 0;
    }
    this.goalText.text = this.goal;
  }

  align() {
    for (let j = 0; j < this.columns; j++) {
      const column = [];
      for (let gem of this.gems.getAll("j", j)) {
        column.push(gem);
      }
      column.sort((a, b) => a.i - b.i);
      column.reverse();

      let i = 9;
      for (let gem of column) {
        gem.i = i;
        this.moveGem(gem, i, j);
        i--;
      }
    }
    this.createNewGems();
  }

  createNewGems() {
    for (let i = this.rows - 1; i >= 0; i--) {
      for (let j = this.columns - 1; j >= 0; j--) {
        if (!this.getGem(i, j)) {
          if (this.started) setTimeout(this.createNewGem.bind(this), 500, i, j);
          else this.createNewGem(i, j);
        }
      }
    }
  }

  createNewGem(i, j) {
    let x = j * this.gemSideSize + this.startingPositionX;
    let y = this.startingPositionY - this.gemSideSize;
    let gem = this.generateColoredGem(x, y);

    gem.i = i;
    gem.j = j;

    gem.inputEnabled = true;
    gem.events.onInputDown.add(this.selectGem, this);
    gem.events.onInputUp.add(this.releaseGem.bind(this));

    gem.killed = false;
    this.moveGem(gem, gem.i, gem.j);
  }

}