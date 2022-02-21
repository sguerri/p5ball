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
/// <reference path="./_Item.ts" />

interface IGame
{
    name: string;
    description: string;
    defaultBall?: (ball: Ball) => Ball;
    defaultSolution?: string;
    ballCount?: number;
}

interface IGameData
{
    tick: number;
    items: Item[];
    ballsProduced: number;
    ballsHandled: number;
    ballCount: number;
    log: () => void;
}

class Game
{
    name: string;
    description: string;
    defaultBall: (ball: Ball) => Ball;
    defaultSolution: string;

    data: IGameData;
    //data: any;
    userSolution: Function;

    static current: Game = null;

    constructor(g: IGame)
    {
        this.name = g.name;
        this.description = g.description;
        this.defaultBall = g.defaultBall === undefined ? (ball: Ball) => { return ball; } : g.defaultBall;
        this.defaultSolution = g.defaultSolution === undefined ? '' : g.defaultSolution;

        this.data = {
            tick: 0,
            items: [],
            ballsProduced: 0,
            ballsHandled: 0,
            ballCount: g.ballCount === undefined ? 100 : g.ballCount,
            log: (item?: string) =>
            {
                let tmp: any = { ... this.data };
                delete(tmp.log);
                delete(tmp.items);
                delete(tmp.tick);
                if (item == undefined) {
                    console.log(tmp);
                } else {
                    console.log(tmp[item]);
                }
            }
        };
        this.userSolution = (ball: Ball) => { return {}; }

    }

    setup()
    {
        createCanvas(400, 500);
        noStroke();
        frameRate(60);
    }

    add(item: Item)
    {
        this.data.items.push(item);
    }

    draw()
    {
        let running = 0;
        this.data.items.forEach(item => {
            running += item.balls.length;
        });

        if (this.data.ballsProduced > 0 && running === 0) {
            noLoop();

            let errorCount = 0;
            this.data.items.forEach(item => {
                errorCount += item.error;
            })

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

