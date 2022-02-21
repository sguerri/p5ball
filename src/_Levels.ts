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

declare var editor: CodeMirror.Editor;
declare var cbLevels: HTMLElement;

interface ILevel
{
    game: IGame;
    items: IItem[];
}

class Levels
{
    static levels: ILevel[] = [];
    static currentLevelName: string = '';
    static currentLevel: ILevel = null;

    static add(level: ILevel)
    {
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

    static setCurrentLevel(levelName: string)
    {
        Levels.currentLevelName = levelName;
        Levels.currentLevel = Levels.levels.find(l => l.game.name === Levels.currentLevelName);
    }

    static initCurrentLevel(withContent: boolean = true): boolean
    {
        if (Levels.currentLevel === null) return false;
        
        Game.current = new Game(Levels.currentLevel.game);
    
        Levels.currentLevel.items.forEach(item => {
            Game.current.add(new Item(item));
        });

        if (withContent) editor.setValue(Game.current.defaultSolution);

        return true;
    }
    
}


