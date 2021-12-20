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
