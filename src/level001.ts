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
        name: "Niveau 1",
        description: "Envoyer les balles vers la boîte 'fin'",
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
            receiverFn: (ball: Ball) => { return true; }
        },
        {
            name: "fin",
            posX: 200,
            posY: 300,
            receiverFn: (ball: Ball) => { return true; }
        }
    ]
}
);
