import { Player } from "./models/Player.js";
import { Plane } from "./models/Plane.js";
import { Stats } from "./models/Stats.js";
import { CanvasView } from "./views/CanvasView.js";
import { GameController } from "./controllers/GameController.js";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const player = new Player(canvas);
const plane = new Plane(canvas);
const stats = new Stats();
const view = new CanvasView(canvas);
const gameController = new GameController(player, plane, stats, view, canvas);



const keys = {
  a: { pressed: false },
  d: { pressed: false },
  arrowLeft: { pressed: false },
  arrowRight: { pressed: false },
};

addEventListener("keydown", ({ key }) => {
  switch (key) {
    case "a":
      keys.a.pressed = true;
      break;
    case "ArrowLeft":
      keys.arrowLeft.pressed = true;
      break;
    case "d":
      keys.d.pressed = true;
      break;
    case "ArrowRight":
      keys.arrowRight.pressed = true;
      break;
    case "Enter":
      gameController.startAgain();
  }
});

addEventListener("keyup", ({ key }) => {
  switch (key) {
    case "a":
      keys.a.pressed = false;
      break;
    case "ArrowLeft":
      keys.arrowLeft.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
    case "ArrowRight":
      keys.arrowRight.pressed = false;
      break;
  }
});

gameController.startGame();
