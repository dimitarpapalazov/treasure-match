import Menu from './menu.js';
import Instructions from './instructions.js'
import Level from './level.js';

const levelOne = new Level(game, "red", 15, 10, 1, false, "levelTwo");
const levelTwo = new Level(game, "green", 20, 10, 2, false, "levelThree");
const levelThree = new Level(game, "orange", 20, 10, 3, true);

var game = new Phaser.Game(500, 500, Phaser.AUTO);
game.state.add("mainMenu", new Menu(game))
game.state.add("instructions", new Instructions(game));
game.state.add("levelOne", levelOne);
game.state.add("levelTwo", levelTwo);
game.state.add("levelThree", levelThree);
game.state.start("mainMenu");

