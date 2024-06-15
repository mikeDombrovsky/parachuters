import { Player } from "../models/Player.js";
import { Plane } from "../models/Plane.js";
import { Parachuter } from "../models/Parachuter.js";
import { Stats } from "../models/Stats.js";

export class CanvasView {
  private context: CanvasRenderingContext2D;

  constructor(private canvas: HTMLCanvasElement) {
    this.context = canvas.getContext("2d") as CanvasRenderingContext2D;
  }

  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawPlayer(player: Player) {
    if (player.image) {
      this.context.drawImage(
        player.image,
        player.position.x,
        player.position.y,
        player.width,
        player.height
      );
    }
  }

  drawPlane(plane: Plane) {
    if (plane.image) {
      this.context.drawImage(
        plane.image,
        plane.position.x,
        plane.position.y,
        plane.width,
        plane.height
      );
    }
  }

  drawParachuter(parachuter: Parachuter) {
    if (parachuter.image) {
      this.context.drawImage(
        parachuter.image,
        parachuter.position.x,
        parachuter.position.y,
        parachuter.width,
        parachuter.height
      );
    }
  }

  drawStats(stats: Stats) {
    this.context.font = "20px Verdana";
    this.context.strokeText("Score: " + stats.score, 10, 50);
    this.context.strokeText("Lifes: " + stats.lives, 10, 100);
    this.context.strokeText(
      "To start again press Enter",
      10,
      this.canvas.height - 50
    );
  }

  drawBackground() {
    const bgImage = new Image();
    bgImage.src = "../assets/img/background.png";
    this.context.drawImage(
      bgImage,
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
    const seaImage = new Image();
    seaImage.src = "../assets/img/sea.png";
    this.context.drawImage(
      seaImage,
      0,
      this.canvas.height - seaImage.height,
      this.canvas.width,
      seaImage.height
    );
  }
}
