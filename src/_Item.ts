/*
    Copyright (C) 2022 Sebastien Guerri

    This file is part of p5ball.

    p5ball is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    any later version.

    p5ball is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

/// <reference path="./_Ball.ts" />
/// <reference path="./_Game.ts" />

interface IItem
{
    name: string;
    posX: number;
    posY: number;
    size?: number;
    color?: string;
    emitterType?: string;
    emitterFn?: (ball: Ball) => void;
    receiverFn?: (ball: Ball) => boolean;
    receiverErrorFn?: (ball: Ball) => string;
    senderFn?: (ball: Ball) => string;
    user?: boolean;
    userFinal?: boolean;
    //userValidation?: string[];
}

class IItemData
{
    name: string;
    user: boolean;
    //userValidation: string[];
    log: () => void;
}

class Item
{
    name: string;
    posX: number;
    posY: number;
    size: number;
    color: p5.Color;
    emitterType: string;
    balls: Ball[];
    success:  number;
    error: number;
    user: boolean;
    userFinal: boolean;
    userValidation: string[];

    data: IItemData;

    receiverFn: (ball: Ball) => boolean;
    receiverErrorFn: (ball: Ball) => string;
    senderFn: (ball: Ball) => string;
    emitterFn: (ball: Ball) => void;

    constructor(item: IItem)
    {
        this.name = item.name;
        this.posX = item.posX;
        this.posY = item.posY;
        
        this.size = item.size === undefined ? 60 : item.size;

        this.emitterType = item.emitterType === undefined ? '' : item.emitterType;
        this.emitterFn = item.emitterFn === undefined ? (ball: Ball) => {} : item.emitterFn;
        this.receiverFn = item.receiverFn === undefined ? (ball: Ball) => { return false; } : item.receiverFn;
        this.senderFn = item.senderFn === undefined ? (ball: Ball) => { return ''; } : item.senderFn;
        this.receiverErrorFn = item.receiverErrorFn === undefined ? (ball: Ball) => { return ''; } : item.receiverErrorFn;
        
        this.user = item.user === undefined ? false : item.user;
        this.userFinal = item.userFinal=== undefined ? false : item.userFinal;
        //this.userValidation = item.userValidation === undefined ? [] : item.userValidation;

        let c = item.color === undefined ? (this.user ? "#154360" : "#000000") : item.color;
        this.color = color(c);

        this.balls = [];
        this.success = 0;
        this.error = 0;

        this.data = {
            name: this.name,
            user: this.user,
            //userValidation: this.userValidation,
            log: (item?: string) =>
            {
                let tmp: any = { ... this.data };
                delete(tmp.log);
                //delete(tmp.userValidation);
                if (item === undefined) {
                    console.log(tmp);
                } else {
                    console.log(tmp[item]);
                } 
            }
        };
    }

    drawBalls(gameData: IGameData): void
    {
        if (this.emitterType !== 'none' && gameData.ballsProduced < gameData.ballCount) {
            if (gameData.tick % 25 === 0) {
                let ball = null;
                if (this.emitterType === 'TOP') {
                    ball = new Ball(this.posX, 0, 0, 1);
                } else if (this.emitterType === 'LEFT') {
                    ball = new Ball(0, this.posY, 1, 0);
                } else if (this.emitterType === 'RIGHT') {
                    ball = new Ball(400, this.posY, -1, 0);
                } else if (this.emitterType === 'BOTTOM') {
                    ball = new Ball(this.posX, 400, 0, -1);
                }
                if (ball !== null) {
                    gameData.ballsProduced++;
                    this.emitterFn(ball);
                    this.balls.push(ball);
                }
            }
        }

        if (this.balls.length === 0) return;

        if (this.balls.length > 0 && this.balls[0].isIn(this)) {
            let ball = this.balls[0];
            this.balls = this.balls.slice(1);

            ball.redirected = false;
            if (this.user) {
                gameData.ballsHandled++;
                try {
                    Game.current.userSolution(ball.data, gameData, this.data);
                    editor.setOption("theme", "default");
                } catch {
                    editor.setOption("theme", "error");
                }
                if (ball.redirected || this.userFinal) {
                    this.success++;
                } else {
                    this.error++;
                }

            } else {
                let redir = '';
                if (this.receiverFn(ball)) {
                    this.success++;
                    redir = this.senderFn(ball);
                } else {
                    this.error++;
                    redir = this.receiverErrorFn(ball);
                }
                if (redir !== '') {
                    gameData.items.forEach(item => {
                        if (item.name === redir) {
                            item.addBall(ball);
                        }
                    })
                }
            }
            /*
            let isReceived = false;
            let userResponse = '';
            if (this.user) {
                try {
                    userResponse = Game.current.userSolution(ball.data, gameData, this.data)[this.name];
                } catch {
                    userResponse = '';
                }
            }
            if (this.user) {
                isReceived = this.userValidation.indexOf(userResponse) !== -1;
            } else {
                isReceived = this.receiverFn(ball);
            }
            if (isReceived) {
                this.success++;
                redir = this.user ? userResponse : this.senderFn(ball);
            } else {
                this.error++;
                redir = this.receiverErrorFn(ball);
            }
            if (redir !== '') {
                gameData.items.forEach(item => {
                    if (item.name === redir) {
                        item.addBall(ball);
                    }
                })
            }
            */
        }

        this.balls.forEach(ball => ball.draw());
    }

    drawBox(): void
    {
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

    addBall(ball: Ball)
    {
        this.balls.push(ball);
        ball.goTo(this);
        ball.redirected = true;
    }
}
