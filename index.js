var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var Player = /** @class */ (function () {
    function Player() {
        var _this = this;
        this.width = 0;
        this.height = 0;
        this.velocity = { x: 0, y: 0 };
        var image = new Image();
        image.src = "./assets/img/boat.png";
        image.onload = function () {
            _this.image = image;
            _this.width = image.width;
            _this.height = image.height;
            _this.position = {
                x: canvas.width / 2 - _this.width / 2,
                y: canvas.height - _this.height - 80,
            };
        };
    }
    Player.prototype.draw = function () {
        if (this.image) {
            context.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        }
    };
    Player.prototype.update = function () {
        if (this.image) {
            this.draw();
            this.position.x += this.velocity.x;
        }
    };
    return Player;
}());
var Plane = /** @class */ (function () {
    function Plane() {
        var _this = this;
        this.width = 0;
        this.height = 0;
        this.velocity = { x: -1, y: 0 };
        var image = new Image();
        image.src = "./assets/img/plane.png";
        image.onload = function () {
            _this.image = image;
            _this.width = image.width;
            _this.height = image.height;
            _this.position = {
                x: canvas.width,
                y: 0,
            };
        };
    }
    Plane.prototype.draw = function () {
        if (this.image) {
            context.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        }
    };
    Plane.prototype.update = function () {
        if (this.image) {
            this.draw();
            if (this.position.x === 0 - this.width) {
                this.position.x = canvas.width;
            }
            else {
                this.position.x += this.velocity.x;
            }
        }
    };
    return Plane;
}());
var Parachuter = /** @class */ (function () {
    function Parachuter(_a) {
        var position = _a.position, velocity = _a.velocity;
        var _this = this;
        this.width = 0;
        this.height = 0;
        this.position = position;
        this.velocity = velocity;
        var image = new Image();
        image.src = "./assets/img/parachutist.png";
        image.onload = function () {
            _this.image = image;
            _this.width = image.width;
            _this.height = image.height;
        };
    }
    Parachuter.prototype.draw = function () {
        if (this.image) {
            context.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        }
    };
    Parachuter.prototype.update = function () {
        this.draw();
        if (this.position.x <= 0 || this.position.x >= canvas.width - 80) {
            this.velocity.x = -this.velocity.x;
        }
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    };
    return Parachuter;
}());
var Stats = /** @class */ (function () {
    function Stats() {
        this.score = 0;
        this.lives = 3;
    }
    Stats.prototype.draw = function () {
        context.font = "20px Verdana";
        context.strokeText("Score: " + this.score, 10, 50);
        context.strokeText("Lifes: " + this.lives, 10, 100);
        context.strokeText("To start again press Enter", 10, canvas.height - 50);
    };
    Stats.prototype.update = function () {
        if (this.lives <= 0) {
            stopParashuters();
            is_running = false;
        }
        this.draw();
    };
    return Stats;
}());
var keys = {
    a: { pressed: false },
    d: { pressed: false },
    arrowLeft: { pressed: false },
    arrowRight: { pressed: false },
};
var is_running = true;
var ship_player = new Player();
var plane = new Plane();
var parachuters = [];
var stats = new Stats();
ship_player.draw();
plane.draw();
stats.draw();
function animate() {
    window.requestAnimationFrame(animate);
    var bgImage = new Image();
    bgImage.src = "./assets/img/background.png";
    context.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
    var seaImage = new Image();
    seaImage.src = "./assets/img/sea.png";
    context.drawImage(seaImage, 0, canvas.height - seaImage.height, canvas.width, canvas.height);
    ship_player.update();
    plane.update();
    stats.update();
    var lendedParachuters = [];
    var drownedParachuters = [];
    if (is_running) {
        parachuters.forEach(function (parachuter, index) {
            if (parachuter.position.y >= canvas.height - ship_player.height * 2 &&
                parachuter.position.x >= ship_player.position.x &&
                parachuter.position.x + parachuter.width <=
                    ship_player.position.x + ship_player.width) {
                lendedParachuters.push(index);
            }
            else if (parachuter.position.y >= canvas.height - 200) {
                drownedParachuters.push(index);
            }
            else {
                parachuter.update();
            }
        });
        lendedParachuters.forEach(function (i) {
            parachuters.splice(i, 1);
            console.log("lended! " + i);
            stats.score += 10;
        });
        drownedParachuters.forEach(function (i) {
            parachuters.splice(i, 1);
            console.log("drowned! " + i);
            stats.lives--;
        });
    }
    if ((keys.a.pressed || keys.arrowLeft.pressed) &&
        ship_player.position.x >= 0) {
        ship_player.velocity.x = -5;
    }
    else if ((keys.d.pressed || keys.arrowRight.pressed) &&
        ship_player.position.x + ship_player.width <= canvas.width) {
        ship_player.velocity.x = 5;
    }
    else {
        ship_player.velocity.x = 0;
    }
}
animate();
var dropParashuters = function () {
    return setInterval(function () {
        var x = define_x_within_canvas();
        parachuters.push(new Parachuter({
            position: { x: x, y: 0 },
            velocity: {
                x: Math.random() > 0.5 ? Math.random() / 2 : -Math.random() / 2,
                y: 0.2,
            },
        }));
        function define_x_within_canvas() {
            if (plane.position.x < 0) {
                return plane.position.x + plane.width;
            }
            else if (plane.position.x > canvas.width - plane.width) {
                return plane.position.x - plane.width;
            }
            else {
                return plane.position.x;
            }
        }
    }, Math.random() * 2000 + 500);
};
var intervalId = dropParashuters();
var stopParashuters = function () {
    clearInterval(intervalId);
};
var startAgain = function () {
    stats.score = 0;
    stats.lives = 3;
    parachuters = [];
    is_running = true;
    intervalId = dropParashuters();
};
addEventListener("keydown", function (_a) {
    var key = _a.key;
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
addEventListener("keyup", function (_a) {
    var key = _a.key;
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
