const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const context = canvas.getContext("2d") as CanvasRenderingContext2D;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

interface Velocity {
  x: number;
  y: number;
}

interface Position {
  x: number;
  y: number;
}

class Player {
  position: Position;
  velocity: Velocity;
  image?: HTMLImageElement;
  width: number = 0;
  height: number = 0;

  constructor() {
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

  draw() {
    if (this.image) {
      context.drawImage(
        this.image,
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
    }
  }

  update() {
    if (this.image) {
      this.draw();
      this.position.x += this.velocity.x;
    }
  }
}

class Plane {
  position: Position;
  velocity: Velocity;
  image?: HTMLImageElement;
  width: number = 0;
  height: number = 0;

  constructor() {
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

  draw() {
    if (this.image) {
      context.drawImage(
        this.image,
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
    }
  }

  update() {
    if (this.image) {
      this.draw();
      if (this.position.x === 0 - this.width) {
        this.position.x = canvas.width;
      } else {
        this.position.x += this.velocity.x;
      }
    }
  }
}

interface ParachuterProps {
  position: Position;
  velocity: Velocity;
}

class Parachuter {
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

  draw() {
    if (this.image) {
      context.drawImage(
        this.image,
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
    }
  }

  update() {
    this.draw();
    if (this.position.x <= 0 || this.position.x >= canvas.width - 80) {
      this.velocity.x = -this.velocity.x;
    }
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

class Stats {
  score: number;
  lives: number;

  constructor() {
    this.score = 0;
    this.lives = 3;
  }

  draw() {
    context.font = "20px Verdana";
    context.strokeText("Score: " + this.score, 10, 50);
    context.strokeText("Lifes: " + this.lives, 10, 100);
    context.strokeText("To start again press Enter", 10, canvas.height - 50);
  }

  update() {
    if (this.lives <= 0) {
      stopParashuters();
      is_running = false;
    }
    this.draw();
  }
}

const keys = {
  a: { pressed: false },
  d: { pressed: false },
  arrowLeft: { pressed: false },
  arrowRight: { pressed: false },
};

let is_running = true;

const ship_player = new Player();
const plane = new Plane();
let parachuters: Parachuter[] = [];
const stats = new Stats();

ship_player.draw();
plane.draw();
stats.draw();

function animate() {
  window.requestAnimationFrame(animate);

  const bgImage = new Image();
  bgImage.src = "./assets/img/background.png";
  context.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
  const seaImage = new Image();
  seaImage.src = "./assets/img/sea.png";

  context.drawImage(
    seaImage,
    0,
    canvas.height - seaImage.height,
    canvas.width,
    canvas.height
  );

  ship_player.update();
  plane.update();
  stats.update();

  const lendedParachuters: number[] = [];
  const drownedParachuters: number[] = [];

  if (is_running) {
    parachuters.forEach((parachuter, index) => {
      if (
        parachuter.position.y >= canvas.height - ship_player.height * 2 &&
        parachuter.position.x >= ship_player.position.x &&
        parachuter.position.x + parachuter.width <=
          ship_player.position.x + ship_player.width
      ) {
        lendedParachuters.push(index);
      } else if (parachuter.position.y >= canvas.height - 200) {
        drownedParachuters.push(index);
      } else {
        parachuter.update();
      }
    });

    lendedParachuters.forEach((i) => {
      parachuters.splice(i, 1);
      console.log("lended! " + i);
      stats.score += 10;
    });

    drownedParachuters.forEach((i) => {
      parachuters.splice(i, 1);
      console.log("drowned! " + i);
      stats.lives--;
    });
  }

  if (
    (keys.a.pressed || keys.arrowLeft.pressed) &&
    ship_player.position.x >= 0
  ) {
    ship_player.velocity.x = -5;
  } else if (
    (keys.d.pressed || keys.arrowRight.pressed) &&
    ship_player.position.x + ship_player.width <= canvas.width
  ) {
    ship_player.velocity.x = 5;
  } else {
    ship_player.velocity.x = 0;
  }
}

animate();

const dropParashuters = () => {
  return setInterval(() => {
    let x: number = define_x_within_canvas();
    parachuters.push(
      new Parachuter({
        position: { x: x, y: 0 },
        velocity: {
          x: Math.random() > 0.5 ? Math.random() / 2 : -Math.random() / 2,
          y: 0.2,
        },
      })
    );

    function define_x_within_canvas() {
      if (plane.position.x < 0) {
        return plane.position.x + plane.width;
      } else if (plane.position.x > canvas.width - plane.width) {
        return plane.position.x - plane.width;
      } else {
        return plane.position.x;
      }
    }
  }, Math.random() * 2000 + 500);
};

let intervalId = dropParashuters();

const stopParashuters = () => {
  clearInterval(intervalId);
};

const startAgain = () => {
  stats.score = 0;
  stats.lives = 3;
  parachuters = [];
  is_running = true;
  intervalId = dropParashuters();
};

addEventListener("keydown", ({ key }) => {
  console.log(key);
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
      if (!is_running) {
        startAgain();
      }
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
