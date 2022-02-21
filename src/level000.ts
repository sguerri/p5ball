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
        name: "Niveau 0",
        description: "Observer, et c'est tout...",
        ballCount: 100
    },
    items:
    [
        {
            name: "choix_et_fin",
            user: true,
            userFinal: true,
            posX: 200,
            posY: 200,
            emitterType: "TOP",
            receiverFn: (ball: Ball) => { return true; }
        }
    ]
}
);
