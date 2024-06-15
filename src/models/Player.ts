import { Position, Velocity } from "./types";

export class Player {
  position: Position;
  velocity: Velocity;
  image?: HTMLImageElement;
  width: number = 0;
  height: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.velocity = { x: 0, y: 0 };
    
    const image = new Image();
    image.src = "./assets/img/boat.png";

    image.onload = () => {
      this.image = image;
      this.width = image.width;
      this.height = image.height;
      this.position = {
        x: canvas.width / 2 - this.width / 2,
        y: canvas.height - this.height - 80,
      };
    };
  }

  update() {
    this.position.x += this.velocity.x;
  }
}
