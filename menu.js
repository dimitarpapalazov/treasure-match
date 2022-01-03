export default class Menu extends Phaser.State {
  constructor(game) {
    super();
    this.game = game;
  }

  create() {
    this.game.stage.disableVisibilityChange = true;

    this.game.add.tileSprite(0, 0, 500, 500, "background");

    this.game.add.tileSprite(100, 50, 300, 400, "wood");

    this.game.add.text(140, 60, `Treasure Match`, {
      fontSize: "30px",
      fill: "white",
      align: "center",
    });

    this.game.add.button(200, 125, "instructions", () => {
      this.game.state.start("instructions");
    });

    this.game.add.button(200, 200, "levelOne", () => {
      this.game.state.start("levelOne");
    });
    this.game.add.button(200, 275, "levelTwo", () => {
      this.game.state.start("levelTwo");
    });
    this.game.add.button(200, 350, "levelThree", () => {
      this.game.state.start("levelThree");
    });
  }

  preload() {
    this.game.load.image("background", "./assets/background.png");
    this.game.load.image("wood", "./assets/wood.png");
    this.game.load.image("instructions", "./assets/instructions_button.png");
    this.game.load.image("levelOne", "./assets/level_one_button.png");
    this.game.load.image("levelTwo", "./assets/level_two_button.png");
    this.game.load.image("levelThree", "./assets/level_three_button.png");
  }
}

