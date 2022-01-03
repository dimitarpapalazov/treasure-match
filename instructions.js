export default class Instructions extends Phaser.State {

  constructor(game) {
    super();
    this.game = game;
    this.selectedGem = null;
    this.startingX = 40;
    this.startingY = 300;
    this.gems = null;
    this.self = this
  }

  preload() {
    this.game.load.image("background", "./assets/background.png");
    this.game.load.image("red", "./assets/red_gem.png");
    this.game.load.image("green", "./assets/green_gem.png");
    this.game.load.image("blue", "./assets/blue_gem.png");
    this.game.load.image("yellow", "./assets/yellow_gem.png");
    this.game.load.image("white", "./assets/white_gem.png");
    this.game.load.image("exitButton", "./assets/exit_button.png");
  }


  create() {
    this.game.stage.disableVisibilityChange = true;

    this.game.add.tileSprite(0, 0, 500, 500, "background");

    this.game.add.text(
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

    this.game.add.text(
      275,
      25,
      `We have WHITE\n
      special object.\n
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

    this.gems = this.game.add.group();

    this.generateLeftGems();
    this.generateRightGems(this.gems);

    this.game.add
      .button(250, 500, "exitButton", () => {
        this.game.state.start("mainMenu");
      })
      .anchor.set(0.5, 1);
  }

  generateLeftGems() {
    let gem = this.gems.create(40, 340, "red");
    gem.i = 1;
    gem.j = 0;
    gem.inputEnabled = true;
    gem.events.onInputDown.add(this.selectGem, this);
    gem.events.onInputUp.add(this.releaseGem, this);

    gem = this.gems.create(80, 340, "green");
    gem.i = 1;
    gem.j = 1;
    gem.inputEnabled = true;
    gem.events.onInputDown.add(this.selectGem, this);
    gem.events.onInputUp.add(this.releaseGem, this);

    gem = this.gems.create(120, 340, "red");
    gem.i = 1;
    gem.j = 2;
    gem.inputEnabled = true;
    gem.events.onInputDown.add(this.selectGem, this);
    gem.events.onInputUp.add(this.releaseGem, this);

    gem = this.gems.create(80, 300, "red");
    gem.i = 0;
    gem.j = 1;
    gem.inputEnabled = true;
    gem.events.onInputDown.add(this.selectGem, this);
    gem.events.onInputUp.add(this.releaseGem, this);
  }

  generateRightGems() {
    let gem = this.gems.create(320, 340, "red");
    gem.i = 1;
    gem.j = 7;
    gem.inputEnabled = true;
    gem.events.onInputDown.add(this.selectGem, this);
    gem.events.onInputUp.add(this.releaseGem, this);

    gem = this.gems.create(360, 340, "green");
    gem.i = 1;
    gem.j = 8;
    gem.inputEnabled = true;
    gem.events.onInputDown.add(this.selectGem, this);
    gem.events.onInputUp.add(this.releaseGem, this);

    gem = this.gems.create(400, 340, "blue");
    gem.i = 1;
    gem.j = 9;
    gem.inputEnabled = true;
    gem.events.onInputDown.add(this.selectGem, this);
    gem.events.onInputUp.add(this.releaseGem, this);

    gem = this.gems.create(360, 300, "yellow");
    gem.i = 0;
    gem.j = 8;
    gem.inputEnabled = true;
    gem.events.onInputDown.add(this.selectGem, this);
    gem.events.onInputUp.add(this.releaseGem, this);

    gem = this.gems.create(360, 380, "white");
    gem.i = 2;
    gem.j = 8;
    gem.inputEnabled = true;
    gem.events.onInputDown.add(this.selectGem, this);
    gem.events.onInputUp.add(this.releaseGem, this);
    gem.special = true;
  }

  selectGem(gem) {
    this.selectedGem = gem;
  }

  releaseGem() {
    let i = Math.floor((this.game.input.mousePointer.position.y - this.startingY) / 40);
    let j = Math.floor((this.game.input.mousePointer.position.x - this.startingX) / 40);
    let iDiff = this.selectedGem.i - i;
    let jDiff = this.selectedGem.j - j;
    if (iDiff >= 1) {
      this.playerSwap(
        this.selectedGem,
        this.getGem(
          this.selectedGem.i - 1,
          this.selectedGem.j
        )
      );
    } else if (iDiff <= -1) {
      this.playerSwap(
        this.selectedGem,
        this.getGem(
          this.selectedGem.i + 1,
          this.selectedGem.j
        )
      );
    } else if (jDiff >= 1) {
      this.playerSwap(
        this.selectedGem,
        this.getGem(
          this.selectedGem.i,
          this.selectedGem.j - 1
        )
      );
    } else if (jDiff <= -1) {
      this.playerSwap(
        this.selectedGem,
        this.getGem(
          this.selectedGem.i,
          this.selectedGem.j + 1
        )
      );
    }
  }

  playerSwap(gemOne, gemTwo) {
    if (gemTwo === null) return;

    if (!this.isSwapValid(gemOne, gemTwo)) return;

    this.swapGems(gemOne, gemTwo);

    if (gemOne.special) {
      setTimeout(this.specialDestroy.bind(this), 500, gemOne);
    } else if (gemTwo.special) {
      setTimeout(this.specialDestroy.bind(this), 500, gemTwo);
    }

    setTimeout(this.destroy.bind(this), 500);
  }

  isSwapValid(gemOne, gemTwo) {
    if (gemOne.i - 1 === gemTwo.i && gemOne.j === gemTwo.j) return true;
    else if (gemOne.i + 1 === gemTwo.i && gemOne.j === gemTwo.j) return true;
    else if (gemOne.j - 1 === gemTwo.j && gemOne.i === gemTwo.i) return true;
    else if (gemOne.j + 1 === gemTwo.j && gemOne.i === gemTwo.i) return true;
    else return false;
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
    let x = j * 40 + this.startingX;
    let y = i * 40 + this.startingY;
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
  }

  getGem(i, j) {
    let g = null;
    this.gems.forEach((gem) => {
      if (gem.i == i && gem.j == j) g = gem;
    });
    return g;
  }

  destroy() {
    const gemsForDestroying = [];

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
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
          }
        }
      }
    }

    for (let g of gemsForDestroying) {
      this.kill(g);
    }
  }

  kill(gem) {
    this.game.add
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

  similarToRight(gem) {
    const gemsToDestroyToRight = [];
    let j = gem.j;
    while (j < 3) {
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
    while (i < 3) {
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

  specialDestroy(gemOne) {
    let i = gemOne.i;
    let j = gemOne.j;

    const gemsToDestroy = [];

    for (let m = 0; m < 3; m++) {
      for (let n = 7; n < 10; n++) {
        gemsToDestroy.push(this.getGem(m, n));
      }
    }

    for (let gem of gemsToDestroy) this.kill(gem);
  }
}