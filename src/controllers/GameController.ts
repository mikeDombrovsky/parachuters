import { Player } from "../models/Player.js";
import { Plane } from "../models/Plane.js";
import { Parachuter } from "../models/Parachuter.js";
import { Stats } from "../models/Stats.js";
import { CanvasView } from "../views/CanvasView.js";
import { Background } from "../models/Background.js";

export class GameController {
  private isRunning: boolean = true;
  private parachuters: Parachuter[] = [];
  private intervalId: number | null = null;

  constructor(
    private player: Player,
    private plane: Plane,
    private stats: Stats,
    private background: Background,
    private view: CanvasView,
    private canvas: HTMLCanvasElement
  ) {
    this.player = player;
    this.plane = plane;
    this.stats = stats;
    this.background = background;
    this.view = view;
    this.canvas = canvas;
  }

  startGame() {
    this.intervalId = this.dropParachuters(this.canvas.width, this.plane);
    this.animate();
  }

  stopGame() {
    this.stopParachuters();
    this.isRunning = false;
  }

  private animate() {
    // if (!this.isRunning) return;
    if (this.stats.lives === 0) this.stopGame();

    requestAnimationFrame(() => this.animate());

    this.view.clear();
    this.view.drawBackground(this.background);
    this.player.update();
    this.plane.update();

    this.view.drawPlayer(this.player);
    this.view.drawPlane(this.plane);
    this.view.drawStats(this.stats);

    const lendedParachuters: number[] = [];
    const drownedParachuters: number[] = [];

    if (this.isRunning) {
      this.parachuters.forEach((parachuter, index) => {
        parachuter.update();
        this.view.drawParachuter(parachuter);

        if (
          parachuter.position.y >=
            this.canvas.height - this.player.height * 2 &&
          parachuter.position.x >= this.player.position.x &&
          parachuter.position.x + parachuter.width <=
            this.player.position.x + this.player.width
        ) {
          lendedParachuters.push(index);
        } else if (parachuter.position.y >= this.canvas.height - 200) {
          drownedParachuters.push(index);
        }
      });

      lendedParachuters.forEach((i) => {
        this.parachuters.splice(i, 1);
        this.stats.score += 10;
      });

      drownedParachuters.forEach((i) => {
        this.parachuters.splice(i, 1);
        this.stats.lives--;
      });
    }
  }

  private dropParachuters(width: number, plane: Plane): number {
    return setInterval(() => {
      const x = defind_x_within_canvas();

      this.parachuters.push(
        new Parachuter({
          position: { x: x, y: 0 },
          velocity: {
            x: Math.random() > 0.5 ? Math.random() / 2 : -Math.random() / 2,
            y: 0.2,
          },
        })
      );

      function defind_x_within_canvas() {
        return plane.position.x < 0
          ? plane.position.x + plane.width
          : plane.position.x > width - plane.width
          ? plane.position.x - plane.width
          : plane.position.x;
      }
    }, Math.random() * 2000 + 500);
  }

  private stopParachuters() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  startAgain() {
    if (this.isRunning) {
      this.stats.score = 0;
      this.stats.lives = 3;
      this.parachuters = [];
      this.isRunning = true;
      this.intervalId = this.dropParachuters(this.canvas.width, this.plane);
    }
  }
}
