class Game {
    constructor(g) {
        this.name = g.name;
        this.description = g.description;
        this.defaultSolution = g.defaultSolution === undefined ? '' : g.defaultSolution;
        this.data = {
            tick: 0,
            items: [],
            ballsProduced: 0,
            ballsHandled: 0,
            ballCount: g.ballCount === undefined ? 100 : g.ballCount,
            log: (item) => {
                let tmp = Object.assign({}, this.data);
                delete (tmp.log);
                delete (tmp.items);
                delete (tmp.tick);
                if (item == undefined) {
                    console.log(tmp);
                }
                else {
                    console.log(tmp[item]);
                }
            }
        };
        this.userSolution = (ball) => { return {}; };
    }
    setup() {
        createCanvas(400, 500);
        noStroke();
        frameRate(60);
    }
    add(item) {
        this.data.items.push(item);
    }
    draw() {
        let running = 0;
        this.data.items.forEach(item => {
            running += item.balls.length;
        });
        if (this.data.ballsProduced > 0 && running === 0) {
            noLoop();
            let errorCount = 0;
            this.data.items.forEach(item => {
                errorCount += item.error;
            });
            fill(errorCount === 0 ? color(0, 130, 0, 100) : color(130, 0, 0, 100));
            rect(0, 0, 400, 400);
            return;
        }
        background(150);
        this.data.tick++;
        this.data.items.forEach(item => {
            item.drawBalls(this.data);
        });
        this.data.items.forEach(item => {
            item.drawBox();
        });
        stroke(0);
        strokeWeight(5);
        noFill();
        rect(0, 0, 400, 400);
        noStroke();
        fill(0);
        rect(0, 400, 400, 30);
        fill(255);
        textSize(20);
        textAlign(CENTER, CENTER);
        text(this.name, 200, 415);
        fill(255);
        rect(0, 430, 400, 70);
        fill(0);
        textSize(14);
        textAlign(CENTER, BASELINE);
        text(this.description, 0, 440, 400, 500);
    }
}
Game.current = null;
class IItemData {
}
class Item {
    constructor(item) {
        this.name = item.name;
        this.posX = item.posX;
        this.posY = item.posY;
        this.size = item.size === undefined ? 60 : item.size;
        this.emitterType = item.emitterType === undefined ? '' : item.emitterType;
        this.emitterFn = item.emitterFn === undefined ? (ball) => { } : item.emitterFn;
        this.receiverFn = item.receiverFn === undefined ? (ball) => { return false; } : item.receiverFn;
        this.senderFn = item.senderFn === undefined ? (ball) => { return ''; } : item.senderFn;
        this.receiverErrorFn = item.receiverErrorFn === undefined ? (ball) => { return ''; } : item.receiverErrorFn;
        this.user = item.user === undefined ? false : item.user;
        this.userFinal = item.userFinal === undefined ? false : item.userFinal;
        let c = item.color === undefined ? (this.user ? "#154360" : "#000000") : item.color;
        this.color = color(c);
        this.balls = [];
        this.success = 0;
        this.error = 0;
        this.data = {
            name: this.name,
            user: this.user,
            log: (item) => {
                let tmp = Object.assign({}, this.data);
                delete (tmp.log);
                if (item === undefined) {
                    console.log(tmp);
                }
                else {
                    console.log(tmp[item]);
                }
            }
        };
    }
    drawBalls(gameData) {
        if (this.emitterType !== 'none' && gameData.ballsProduced < gameData.ballCount) {
            if (gameData.tick % 25 === 0) {
                let ball = null;
                if (this.emitterType === 'TOP') {
                    ball = new Ball(this.posX, 0, 0, 1);
                }
                else if (this.emitterType === 'LEFT') {
                    ball = new Ball(0, this.posY, 1, 0);
                }
                else if (this.emitterType === 'RIGHT') {
                    ball = new Ball(400, this.posY, -1, 0);
                }
                else if (this.emitterType === 'BOTTOM') {
                    ball = new Ball(this.posX, 400, 0, -1);
                }
                if (ball !== null) {
                    gameData.ballsProduced++;
                    this.emitterFn(ball);
                    this.balls.push(ball);
                }
            }
        }
        if (this.balls.length === 0)
            return;
        if (this.balls.length > 0 && this.balls[0].isIn(this)) {
            let ball = this.balls[0];
            this.balls = this.balls.slice(1);
            ball.redirected = false;
            if (this.user) {
                gameData.ballsHandled++;
                try {
                    Game.current.userSolution(ball.data, gameData, this.data);
                    editor.setOption("theme", "default");
                }
                catch (_a) {
                    editor.setOption("theme", "error");
                }
                if (ball.redirected || this.userFinal) {
                    this.success++;
                }
                else {
                    this.error++;
                }
            }
            else {
                let redir = '';
                if (this.receiverFn(ball)) {
                    this.success++;
                    redir = this.senderFn(ball);
                }
                else {
                    this.error++;
                    redir = this.receiverErrorFn(ball);
                }
                if (redir !== '') {
                    gameData.items.forEach(item => {
                        if (item.name === redir) {
                            item.addBall(ball);
                        }
                    });
                }
            }
        }
        this.balls.forEach(ball => ball.draw());
    }
    drawBox() {
        fill(this.color);
        rect(this.posX - this.size / 2, this.posY - this.size / 2, this.size, this.size);
        textSize(14);
        textStyle(BOLD);
        textAlign(CENTER);
        text(this.name, this.posX, this.posY + this.size / 2 + 20);
        textSize(20);
        textStyle(BOLD);
        textAlign(CENTER, CENTER);
        fill(0, 130, 0);
        text(`${this.success}`, this.posX, this.posY - this.size / 2 + 15);
        fill(255, 0, 0);
        text(`${this.error}`, this.posX, this.posY + this.size / 2 - 15);
    }
    addBall(ball) {
        this.balls.push(ball);
        ball.goTo(this);
        ball.redirected = true;
    }
}
class Ball {
    constructor(posX, posY, speedX = 0, speedY = 1) {
        this.posX = posX;
        this.posY = posY;
        this.size = 40;
        this.color = color(0);
        this.speedX = speedX;
        this.speedY = speedY;
        this.done = false;
        this.data = {
            log: (item) => {
                let tmp = Object.assign({}, this.data);
                delete (tmp.log);
                delete (tmp.goTo);
                if (item === undefined) {
                    console.log(tmp);
                }
                else {
                    console.log(tmp[item]);
                }
            },
            goTo: (destination) => {
                Game.current.data.items.forEach(item => {
                    if (item.name === destination) {
                        item.addBall(this);
                    }
                });
            }
        };
    }
    draw() {
        this.posX += this.speedX;
        this.posY += this.speedY;
        fill(this.color);
        circle(this.posX, this.posY, this.size / 2);
    }
    isIn(item) {
        return this.posX >= item.posX - item.size / 2 && this.posX <= item.posX + item.size / 2 && this.posY >= item.posY - item.size / 2 && this.posY <= item.posY + item.size / 2;
    }
    goTo(item) {
        this.speedX = (item.posX - this.posX) / (item.posY - this.posY);
    }
}
Ball.setup = (ball) => { };
class BallWithColor extends Ball {
}
class Levels {
    static add(level) {
        Levels.levels.push(level);
        let li = document.createElement('li');
        let a = document.createElement('a');
        a.className = 'dropdown-item';
        a.style.borderRadius = '0';
        a.href = '#';
        a.text = level.game.name;
        a.onclick = () => {
            for (let i = 0; i < cbLevels.children.length; i++) {
                cbLevels.children[i].children[0].classList.remove('active');
            }
            a.classList.add('active');
            Levels.setCurrentLevel(level.game.name);
            Levels.initCurrentLevel();
            Game.current.setup();
            loop();
        };
        li.appendChild(a);
        cbLevels.appendChild(li);
    }
    static setCurrentLevel(levelName) {
        Levels.currentLevelName = levelName;
        Levels.currentLevel = Levels.levels.find(l => l.game.name === Levels.currentLevelName);
    }
    static initCurrentLevel(withContent = true) {
        if (Levels.currentLevel === null)
            return false;
        Game.current = new Game(Levels.currentLevel.game);
        Levels.currentLevel.items.forEach(item => {
            Game.current.add(new Item(item));
        });
        if (withContent)
            editor.setValue(Game.current.defaultSolution);
        return true;
    }
}
Levels.levels = [];
Levels.currentLevelName = '';
Levels.currentLevel = null;
function setup() {
    if (Levels.initCurrentLevel()) {
        Game.current.setup();
    }
}
function draw() {
    if (Game.current !== null)
        Game.current.draw();
}
function pause() {
    document.getElementById('btnPause').style.display = 'none';
    document.getElementById('btnResume').style.display = 'block';
    noLoop();
}
function resume() {
    document.getElementById('btnPause').style.display = 'block';
    document.getElementById('btnResume').style.display = 'none';
    loop();
}
function restart() {
    Levels.initCurrentLevel(false);
    resume();
}
function validate(value) {
    if (value !== '') {
        try {
            let solution = new Function("ball", "game", "node", value);
            Game.current.userSolution = solution;
        }
        catch (_a) {
            Game.current.userSolution = null;
            editor.setOption("theme", "error");
        }
    }
    else {
    }
}
Levels.add({
    game: {
        name: "Niveau 0",
        description: "Observer, et c'est tout...",
        ballCount: 100
    },
    items: [
        {
            name: "choix_et_fin",
            user: true,
            userFinal: true,
            posX: 200,
            posY: 200,
            emitterType: "TOP",
            receiverFn: (ball) => { return true; }
        }
    ]
});
Levels.add({
    game: {
        name: "Niveau 1",
        description: "Envoyer les balles vers la boîte 'fin'",
        defaultSolution: "ball.goTo('')",
        ballCount: 100
    },
    items: [
        {
            name: "choix",
            user: true,
            posX: 200,
            posY: 100,
            emitterType: "TOP",
            receiverFn: (ball) => { return true; }
        },
        {
            name: "fin",
            posX: 200,
            posY: 300,
            receiverFn: (ball) => { return true; }
        }
    ]
});
Levels.add({
    game: {
        name: "Niveau 2",
        description: "Mettre les balles noires à gauche et les balles blanches à droite",
        defaultSolution: "ball.goTo('')",
        ballCount: 100
    },
    items: [
        {
            name: "choix",
            user: true,
            posX: 200,
            posY: 100,
            emitterType: "TOP",
            emitterFn: (ball) => {
                let rnd = Math.random();
                if (rnd < 0.5) {
                    ball.color = color(0);
                    ball.data.color = 'noir';
                }
                else {
                    ball.color = color(255);
                    ball.data.color = 'blanc';
                }
            }
        },
        {
            name: "gauche",
            posX: 100,
            posY: 300,
            receiverFn: (ball) => {
                return ball.data.color === 'noir';
            }
        },
        {
            name: "droite",
            posX: 300,
            posY: 300,
            receiverFn: (ball) => {
                return ball.data.color === 'blanc';
            }
        }
    ]
});
Levels.add({
    game: {
        name: "Niveau 3",
        description: "Mettre les balles noires à gauche, les balles blanches à droite et les balles vertes au centre",
        defaultSolution: "ball.goTo('')",
        ballCount: 100
    },
    items: [
        {
            name: "choix",
            user: true,
            posX: 200,
            posY: 100,
            emitterType: "TOP",
            emitterFn: (ball) => {
                let rnd = Math.random();
                if (rnd < 0.33) {
                    ball.color = color(0);
                    ball.data.color = 'noir';
                }
                else if (rnd < 0.66) {
                    ball.color = color(0, 130, 0);
                    ball.data.color = 'vert';
                }
                else {
                    ball.color = color(255);
                    ball.data.color = 'blanc';
                }
            }
        },
        {
            name: "gauche",
            posX: 100,
            posY: 300,
            receiverFn: (ball) => {
                return ball.data.color === 'noir';
            }
        },
        {
            name: "centre",
            posX: 200,
            posY: 300,
            receiverFn: (ball) => {
                return ball.data.color === 'vert';
            }
        },
        {
            name: "droite",
            posX: 300,
            posY: 300,
            receiverFn: (ball) => {
                return ball.data.color === 'blanc';
            }
        }
    ]
});
Levels.add({
    game: {
        name: "Niveau 4",
        description: "Mettre les balles noires et vertes à gauche, les balles blanches à droite",
        defaultSolution: "ball.goTo('')",
        ballCount: 100
    },
    items: [
        {
            name: "choix",
            user: true,
            posX: 200,
            posY: 100,
            emitterType: "TOP",
            emitterFn: (ball) => {
                let rnd = Math.random();
                if (rnd < 0.33) {
                    ball.color = color(0);
                    ball.data.color = 'noir';
                }
                else if (rnd < 0.66) {
                    ball.color = color(0, 130, 0);
                    ball.data.color = 'vert';
                }
                else {
                    ball.color = color(255);
                    ball.data.color = 'blanc';
                }
            }
        },
        {
            name: "gauche",
            posX: 100,
            posY: 300,
            receiverFn: (ball) => {
                return ball.data.color === 'noir' || ball.data.color === 'vert';
            }
        },
        {
            name: "droite",
            posX: 300,
            posY: 300,
            receiverFn: (ball) => {
                return ball.data.color === 'blanc';
            }
        }
    ]
});
Levels.add({
    game: {
        name: "Niveau 5",
        description: "Mettre les balles noires et vertes à gauche, les balles blanches et rouges à droite",
        defaultSolution: "ball.goTo('')",
        ballCount: 100
    },
    items: [
        {
            name: "choix",
            user: true,
            posX: 200,
            posY: 100,
            emitterType: "TOP",
            emitterFn: (ball) => {
                let rnd = Math.random();
                if (rnd < 0.25) {
                    ball.color = color(0);
                    ball.data.color = 'noir';
                }
                else if (rnd < 0.50) {
                    ball.color = color(0, 130, 0);
                    ball.data.color = 'vert';
                }
                else if (rnd < 0.75) {
                    ball.color = color(130, 0, 0);
                    ball.data.color = 'rouge';
                }
                else {
                    ball.color = color(255);
                    ball.data.color = 'blanc';
                }
            }
        },
        {
            name: "gauche",
            posX: 100,
            posY: 300,
            receiverFn: (ball) => {
                return ball.data.color === 'noir' || ball.data.color === 'vert';
            }
        },
        {
            name: "droite",
            posX: 300,
            posY: 300,
            receiverFn: (ball) => {
                return ball.data.color === 'blanc' || ball.data.color === 'rouge';
            }
        }
    ]
});
Levels.add({
    game: {
        name: "Niveau 6",
        description: "Mettre toutes les balles au centre",
        defaultSolution: "ball.goTo('')",
        ballCount: 100
    },
    items: [
        {
            name: "choix_gauche",
            user: true,
            posX: 100,
            posY: 100,
            emitterType: "TOP",
            emitterFn: (ball) => {
                let rnd = Math.random();
                if (rnd < 0.5) {
                    ball.color = color(0);
                    ball.data.color = 'noir';
                }
                else {
                    ball.color = color(255);
                    ball.data.color = 'blanc';
                }
            }
        },
        {
            name: "choix_droite",
            user: true,
            posX: 300,
            posY: 100,
            emitterType: "TOP",
            emitterFn: (ball) => {
                let rnd = Math.random();
                if (rnd < 0.5) {
                    ball.color = color(0);
                    ball.data.color = 'noir';
                }
                else {
                    ball.color = color(255);
                    ball.data.color = 'blanc';
                }
            }
        },
        {
            name: "centre",
            posX: 200,
            posY: 300,
            receiverFn: (ball) => {
                return true;
            }
        }
    ]
});
Levels.add({
    game: {
        name: "Niveau 7",
        description: "Mettre les balles noires à gauche et les balles blanches à droite",
        defaultSolution: "ball.goTo('')",
        ballCount: 100
    },
    items: [
        {
            name: "choix_gauche",
            user: true,
            posX: 100,
            posY: 100,
            emitterType: "TOP",
            emitterFn: (ball) => {
                let rnd = Math.random();
                if (rnd < 0.5) {
                    ball.color = color(0);
                    ball.data.color = 'noir';
                }
                else {
                    ball.color = color(255);
                    ball.data.color = 'blanc';
                }
            }
        },
        {
            name: "choix_droite",
            user: true,
            posX: 300,
            posY: 100,
            emitterType: "TOP",
            emitterFn: (ball) => {
                let rnd = Math.random();
                if (rnd < 0.5) {
                    ball.color = color(0);
                    ball.data.color = 'noir';
                }
                else {
                    ball.color = color(255);
                    ball.data.color = 'blanc';
                }
            }
        },
        {
            name: "gauche",
            posX: 100,
            posY: 300,
            receiverFn: (ball) => {
                return ball.data.color === 'noir';
            }
        },
        {
            name: "droite",
            posX: 300,
            posY: 300,
            receiverFn: (ball) => {
                return ball.data.color === 'blanc';
            }
        }
    ]
});
Levels.add({
    game: {
        name: "Niveau 8",
        description: "Mettre les balles noires à gauche et les balles blanches à droite",
        defaultSolution: "ball.goTo('')",
        ballCount: 100
    },
    items: [
        {
            name: "choix_gauche",
            user: true,
            posX: 100,
            posY: 100,
            emitterType: "TOP",
            emitterFn: (ball) => {
                ball.color = color(0);
                ball.data.color = 'noir';
            }
        },
        {
            name: "choix_droite",
            user: true,
            posX: 300,
            posY: 100,
            emitterType: "TOP",
            emitterFn: (ball) => {
                ball.color = color(255);
                ball.data.color = 'blanc';
            }
        },
        {
            name: "gauche",
            posX: 100,
            posY: 300,
            receiverFn: (ball) => {
                return ball.data.color === 'noir';
            }
        },
        {
            name: "droite",
            posX: 300,
            posY: 300,
            receiverFn: (ball) => {
                return ball.data.color === 'blanc';
            }
        }
    ]
});
