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

/// <reference path="./_Item.ts" />

interface IBallData
{
    log: () => void;
    goTo: (destination: string) => void;
}

class Ball
{
    posX: number;
    posY: number;
    size: number;
    color: p5.Color;
    speedX: number;
    speedY: number;
    done: boolean;
    redirected: boolean;

    data: IBallData;

    static setup : (ball: Ball) => void = (ball: Ball) => {};

    constructor(posX: number, posY: number, speedX: number = 0, speedY: number = 1)
    {
        this.posX = posX;
        this.posY = posY;
        this.size = 40;
        this.color = color(0);
        this.speedX = speedX;
        this.speedY = speedY;
        this.done = false;

        this.data = {
            log: (item?: string) =>
            {
                let tmp: any = { ... this.data };
                delete(tmp.log);
                delete(tmp.goTo);
                if (item === undefined) {
                    console.log(tmp);
                } else {
                    console.log(tmp[item]);
                }
            },
            goTo: (destination: string) =>
            {
                Game.current.data.items.forEach(item => {
                    if (item.name === destination) {
                        item.addBall(this);
                    }
                });
            }
        };
    }

    draw()
    {
        this.posX += this.speedX;
        this.posY += this.speedY;

        fill(this.color);
        circle(this.posX, this.posY, this.size / 2);
    }
    
    isIn(item: Item)
    {
        return this.posX >= item.posX - item.size / 2 && this.posX <= item.posX + item.size / 2 && this.posY >= item.posY - item.size / 2 && this.posY <= item.posY + item.size / 2;
    }
    
    goTo(item: Item)
    {
        this.speedX = (item.posX - this.posX) / (item.posY - this.posY);
    }
}

interface IBallWithColor extends IBallData
{
    color: string;
}

class BallWithColor extends Ball
{
    data: IBallWithColor;
}