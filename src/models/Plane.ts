import { Position, Velocity } from "./types";

export class Plane {
  position: Position;
  velocity: Velocity;
  image?: HTMLImageElement;
  width: number = 0;
  height: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.velocity = { x: -1, y: 0 };

    const image = new Image();
    image.src = "./assets/img/plane.png";

    image.onload = () => {
      this.image = image;
      this.width = image.width;
      this.height = image.height;
      this.position = {
        x: canvas.width,
        y: 0,
      };
    };
  }

  update() {
    if (this.position.x === 0 - this.width) {
      this.position.x = canvas.width;
    } else {
      this.position.x += this.velocity.x;
    }
  }
}
