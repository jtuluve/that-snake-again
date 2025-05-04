//preload...
new Image().src = "https://jtuluve.github.io/files-host/snake-head3.png";
new Image().src = "https://jtuluve.github.io/files-host/snake-fruit2.png";

let cont = document.querySelector(".container");
let xlen = parseInt(cont.offsetWidth / 30),
    ylen = parseInt(cont.offsetHeight / 30);
let score = 0;
let boxes = [];
let places = [];
let scoreAt = [parseInt(Math.random() * xlen), parseInt(Math.random() * ylen)];
let dir = "r";
let movedOnce = false;
let gameOver = false;
let keyMap = {
    ArrowUp: "u",
    w: "u",
    W: "u",
    ArrowDown: "d",
    s: "d",
    S: "d",
    ArrowLeft: "l",
    a: "l",
    A: "l",
    ArrowRight: "r",
    d: "r",
    D: "r",
};

for (let i = 0; i < ylen; i++) {
    places[i] = [];
    for (let j = 0; j < xlen; j++) {
        let el = document.createElement("div");
        places[i].push(el);
        el.classList.add("box");
        cont.appendChild(el);
    }
}

class Box {
    constructor(x, y, color = "red") {
        this.x = x;
        this.y = y;
        this.color = color;
        places[y][x].style.backgroundColor = color;
    }

    move(dir, shouldClean = false) {
        places[this.y][this.x].style.rotate = "0deg";
        if (shouldClean) this.clean();
        if (dir == "l") {
            this.x = this.x > 0 ? this.x - 1 : xlen - 1;
        } else if (dir == "r") {
            this.x = this.x + 1 <= xlen - 1 ? this.x + 1 : 0;
        } else if (dir == "u") {
            this.y = this.y > 0 ? this.y - 1 : ylen - 1;
        } else if (dir == "d") {
            this.y = this.y < ylen - 1 ? this.y + 1 : 0;
        }
        places[this.y][this.x].style.background = this.color;
    }

    moveTo(x, y, shouldClean = false) {
        if (shouldClean) this.clean();
        this.x = x;
        this.y = y;
        places[y][x].style.background = this.color;
    }

    clean() {
        places[this.y][this.x].style.background = "white";
    }
}

let scoreBox = new Box(
    ...scoreAt,
    "url('https://jtuluve.github.io/files-host/snake-fruit2.png')"
);

function move(dir) {
    if (boxes.length > 1)
        boxes[boxes.length - 1].moveTo(
            boxes[boxes.length - 2].x,
            boxes[boxes.length - 2].y,
            true
        );
    for (let i = boxes.length - 2; i > 0; i--)
        boxes[i].moveTo(boxes[i - 1].x, boxes[i - 1].y);
    boxes[0].move(dir);
}

function keydown(e) {
    let newDir = keyMap[e.key];
    if (!newDir || !movedOnce) return;
    e.preventDefault();
    if (
        (newDir == "u" && dir == "d") ||
        (newDir == "d" && dir == "u") ||
        (newDir == "l" && dir == "r") ||
        (newDir == "r" && dir == "l")
    )
        return;
    dir = newDir;
    movedOnce = false;
    setTimeout(() => {
        movedOnce = true;
    }, 100);
}

function collisionCheck() {
    for (let i = 1; i < boxes.length; i++) {
        if (boxes[0].x === boxes[i].x && boxes[0].y === boxes[i].y) {
            gameOver = true;
            document.querySelector(".gameOver").style.display = "grid";
        }
    }
}

function add(x, y, color = "red") {
    boxes.push(new Box(x, y, color));
}

function start(e) {
    let ndir = keyMap[e.key];
    if (!ndir) return;
    dir = ndir;
    e.preventDefault();
    let i = 0;
    add(0, 0, "url('https://jtuluve.github.io/files-host/snake-head3.png')");
    let int = setInterval(() => {
        add(0, 0, "#5b7af9");
        move(dir);
        i++;
        if (i >= 1) {
            clearInterval(int);
            animate();
        }
    }, 100);
    window.removeEventListener("keydown", start);
    window.addEventListener("keydown", keydown);
}

function animate() {
    if (gameOver) return;
    move(dir);
    collisionCheck();
    checkPoint();
    places[boxes[0].y][boxes[0].x].style.rotate =
        dir == "d"
            ? "0deg"
            : dir == "u"
            ? "180deg"
            : dir == "r"
            ? "-90deg"
            : "90deg";
    setTimeout(animate, 100);
}

function checkPoint() {
    if (boxes[0].x === scoreBox.x && boxes[0].y === scoreBox.y) {
        score++;
        document.querySelector(".score").innerText = score;
        let point = [
                parseInt(Math.random() * xlen),
                parseInt(Math.random() * ylen),
            ],
            tries = 7;
        while (
            tries > 0 &&
            places[point[1]][point[0]]?.style.background !== "white"
        ) {
            tries--;
            point = [
                parseInt(Math.random() * xlen),
                parseInt(Math.random() * ylen),
            ];
        }
        scoreAt = point;
        scoreBox.moveTo(...point);
        let lastBox = boxes[boxes.length - 1];
        boxes.push(new Box(lastBox.x, lastBox.y, "#5b7af9"));
    }
}
function restart() {
    gameOver = false;
    score = 0;
    boxes.forEach((b) => b.clean());
    boxes = [];
    scoreAt = [parseInt(Math.random() * xlen), parseInt(Math.random() * ylen)];
    scoreBox.moveTo(scoreAt[0], scoreAt[1], true);
    document.querySelector(".gameOver").style.display = "none";
    document.querySelector(".score").innerText = 0;
    movedOnce = true;
    window.removeEventListener("keydown", keydown);
    window.addEventListener("keydown", start);
}

restart();
