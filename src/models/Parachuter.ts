import { Position, Velocity } from "./types";

interface ParachuterProps {
  position: Position;
  velocity: Velocity;
}

export class Parachuter {
  position: Position;
  velocity: Velocity;
  image?: HTMLImageElement;
  width: number = 0;
  height: number = 0;

  constructor({ position, velocity }: ParachuterProps) {
    this.position = position;
    this.velocity = velocity;

    const image = new Image();
    image.src = "./assets/img/parachutist.png";

    image.onload = () => {
      this.image = image;
      this.width = image.width;
      this.height = image.height;
    };
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}
