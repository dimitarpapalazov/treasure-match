let levelOne = generateLevel("red", 15, 10, 1, false, "levelTwo");
let levelTwo = generateLevel("green", 20, 10, 2, false, "levelThree");
let levelThree = generateLevel("orange", 20, 10, 3, true);

let mainMenu = new Phaser.State();
mainMenu.preload = preloadMainMenu;
mainMenu.create = createMainMenu;

let instructions = new Phaser.State();
instructions.preload = preloadInstruction;
instructions.create = createInstruction;

var game = new Phaser.Game(500, 500, Phaser.AUTO);
game.state.add("mainMenu", mainMenu);
game.state.add("instructions", instructions);
game.state.add("levelOne", levelOne);
game.state.add("levelTwo", levelTwo);
game.state.add("levelThree", levelThree);
game.state.start("mainMenu");
