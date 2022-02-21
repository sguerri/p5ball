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

/// <reference path="./_Levels.ts" />
/// <reference path="./_Ball.ts" />

interface IBallDataL001 extends IBallData
{
    color: string;
}

class BallL001 extends Ball
{
    data: IBallDataL001;
}

Levels.add(
{
    game:
    {
        name: "Niveau 1",
        description: "Mettre les balles noires à gauche et les balles blanches à droite",
        defaultBall: (ball: BallL001) =>
        {
            ball.data.color = '';
            return ball;
        },
        defaultSolution: "ball.goTo('')",
        ballCount: 20
    },
    items:
    [
        {
            name: "main",
            user: true,
            posX: 200,
            posY: 100,
            emitterType: "TOP",
            emitterFn: (ball: BallL001) =>
            {
                let rnd = Math.random();
                if (rnd < 0.5) {
                    ball.color = color(0);
                    ball.data.color = 'noir';
                } else {
                    ball.color = color(255);
                    ball.data.color = 'blanc';
                }
            }
        },
        {
            name: "gauche",
            posX: 100,
            posY: 300,
            receiverFn: (ball: BallL001) =>
            {
                return ball.data.color === 'noir';
            }
        },
        {
            name: "droite",
            posX: 300,
            posY: 300,
            receiverFn: (ball: BallL001) =>
            {
                return ball.data.color === 'blanc';
            }        
        }
    ]
}
);

//Levels.setCurrentLevel("Niveau 1");
