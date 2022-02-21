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

/// <reference path="./_Game.ts" />
/// <reference path="./_Levels.ts" />
/// <reference path="./_Ball.ts" />

function setup()
{
    if (Levels.initCurrentLevel()) {
        Game.current.setup();
    }
}

function draw()
{
    if (Game.current !== null) Game.current.draw();
}

function pause()
{
    document.getElementById('btnPause').style.display = 'none';
    document.getElementById('btnResume').style.display = 'block';
    noLoop();
}

function resume()
{
    document.getElementById('btnPause').style.display = 'block';
    document.getElementById('btnResume').style.display = 'none';
    loop();
}

function restart()
{
    Levels.initCurrentLevel(false);
    resume();
}

function validate(value: any)
{
    if (value !== '') {
        try {
            let solution = new Function("ball", "game", "node", value);

            /*
            let ball = new Ball(0, 0);
            ball = Game.current.defaultBall(ball);
            Levels.currentLevel.items.forEach(item => {
                if (item.user) {
                    solution(ball.data, { log: () => {} }, { log: () => {} })[item.name];
                }
            });
            */

            Game.current.userSolution = solution;

            //editor.setOption("theme", "default");

        } catch {
            //Game.current.userSolution = (ball: Ball) => { return {}; }
            Game.current.userSolution = null;
            editor.setOption("theme", "error");

        }
    } else {
        //editor.setOption("theme", "error");
    }
}
