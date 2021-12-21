function preloadMainMenu() {
  game.load.image("background", "./assets/background.png");
  game.load.image("wood", "./assets/wood.png");
  game.load.image("instructions", "./assets/instructions_button.png");
  game.load.image("levelOne", "./assets/level_one_button.png");
  game.load.image("levelTwo", "./assets/level_two_button.png");
  game.load.image("levelThree", "./assets/level_three_button.png");
}

function createMainMenu() {
  game.stage.disableVisibilityChange = true;

  game.add.tileSprite(0, 0, 500, 500, "background");

  game.add.tileSprite(100, 50, 300, 400, "wood");

  game.add.text(140, 60, `Treasure Match`, {
    fontSize: "30px",
    fill: "white",
    align: "center",
  });

  game.add.button(200, 125, "instructions", () => {
    game.state.start("instructions");
  });
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
