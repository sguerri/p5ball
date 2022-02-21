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

Levels.add(
{
    game:
    {
        name: "Niveau 5",
        description: "Mettre les balles noires et vertes à gauche, les balles blanches et rouges à droite",
        defaultSolution: "ball.goTo('')",
        ballCount: 100
    },
    items:
    [
        {
            name: "choix",
            user: true,
            posX: 200,
            posY: 100,
            emitterType: "TOP",
            emitterFn: (ball: BallWithColor) =>
            {
                let rnd = Math.random();
                if (rnd < 0.25) {
                    ball.color = color(0);
                    ball.data.color = 'noir';
                } else if (rnd < 0.50) {
                    ball.color = color(0, 130, 0);
                    ball.data.color = 'vert';
                } else if (rnd < 0.75) {
                    ball.color = color(130, 0, 0);
                    ball.data.color = 'rouge';
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
            receiverFn: (ball: BallWithColor) =>
            {
                return ball.data.color === 'noir' || ball.data.color === 'vert';
            }
        },
        {
            name: "droite",
            posX: 300,
            posY: 300,
            receiverFn: (ball: BallWithColor) =>
            {
                return ball.data.color === 'blanc' || ball.data.color === 'rouge';
            }        
        }
    ]
}
);
