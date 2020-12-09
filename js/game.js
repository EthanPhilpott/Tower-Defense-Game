"use strict"

// ░█████╗░░█████╗░███╗░░██╗░██████╗████████╗░██████╗
// ██╔══██╗██╔══██╗████╗░██║██╔════╝╚══██╔══╝██╔════╝
// ██║░░╚═╝██║░░██║██╔██╗██║╚█████╗░░░░██║░░░╚█████╗░
// ██║░░██╗██║░░██║██║╚████║░╚═══██╗░░░██║░░░░╚═══██╗
// ╚█████╔╝╚█████╔╝██║░╚███║██████╔╝░░░██║░░░██████╔╝
// ░╚════╝░░╚════╝░╚═╝░░╚══╝╚═════╝░░░░╚═╝░░░╚═════╝░

let root = getComputedStyle(document.documentElement)

// Borders

const roundAmt          = root.getPropertyValue('--cell-round-amount');
const sheenShadowBorder = root.getPropertyValue('--cell-border'      );

// Cells

const cellSize              = root.getPropertyValue('--cell-size');
const cellSizeWithoutPixels = root.getPropertyValue('--cell-size').replace('px', '');

// Colors

const towerSheen  = root.getPropertyValue('--tower-sheen' );
const towerShadow = root.getPropertyValue('--tower-shadow');
const pathSheen   = root.getPropertyValue('--path-sheen'  );
const pathShadow  = root.getPropertyValue('--path-shadow' );

// Enemys

const enemySettings = {
    basic : {
        html    : MakeHtml('enemy', 'circle', 'blue', cellSizeWithoutPixels / 5),
        health  : 10   ,
        speed   : 1    ,
        airborn : false,
    },
    fast : {
        html    : MakeHtml('enemy', 'triangle', 'blue', cellSizeWithoutPixels / 5),
        health  : 5    ,
        speed   : 2    ,
        airborn : false,
    },
    strong : {
        html    : MakeHtml('enemy', 'square', 'blue', cellSizeWithoutPixels / 5),
        health  : 20   ,
        speed   : .5   ,
        airborn : false,
    },
    flying : {
        html    : MakeHtml('enemy', 'cross', 'blue', cellSizeWithoutPixels / 5),
        health  : 10  ,
        speed   : 1   ,
        airborn : true,
    },
    boss : {
        html    : MakeHtml('enemy', 'cross', 'blue', cellSizeWithoutPixels / 2.5),
        health  : 100  ,
        speed   : .25  ,
        airborn : false,
    }
}

// Other

const cameraSpeed       =  10
const zoomMin           = .25
const zoomMax           =   2

// ██████╗░░█████╗░░█████╗░██████╗░██████╗░
// ██╔══██╗██╔══██╗██╔══██╗██╔══██╗██╔══██╗
// ██████╦╝██║░░██║███████║██████╔╝██║░░██║
// ██╔══██╗██║░░██║██╔══██║██╔══██╗██║░░██║
// ██████╦╝╚█████╔╝██║░░██║██║░░██║██████╔╝
// ╚═════╝░░╚════╝░╚═╝░░╚═╝╚═╝░░╚═╝╚═════╝░

let boardHTML = document.getElementById('board');

// The following is a very basic board and is named acordingly.
let classicSmall = {
    map : [
        [ 0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ],
        [ 0 ,  0 ,  0 ,  1 ,  1 ,  1 ,  0 ,  0 ,  0 ], // 0 Stands for nothing, or a blank space that nothing can be placed on.
        [ 0 ,  0 , 's', 'p', 'p', 'p', 'p',  0 ,  0 ], // 1 stands for a spot that towers can be placed on.
        [ 0 ,  0 ,  0 ,  1 ,  1 ,  1 , 'p',  1 ,  0 ], // s stands for the enemy spawing spot
        [ 0 ,  0 , 'p', 'p', 'p', 'p', 'p',  1 ,  0 ], // b stands for your base, if an enemy reaches here you lose life.
        [ 0 ,  0 , 'p',  1 ,  1,   1 ,  0 ,  0 ,  0 ], 
        [ 0 ,  1 , 'p', 'p', 'p', 'p', 'b',  0 ,  0 ],
        [ 0 ,  1 ,  1 ,  0 ,  1 ,  1 ,  0 ,  0 ,  0 ],
        [ 0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ],
    ],

    waves : [
        [
            ["basic", 1, 1]
        ],
        [
            ["basic", 3, 1]
        ],
    ]
}

class Board {
    constructor (boardHTML, boardArray) {
        this.board = boardHTML;
        this.array = boardArray;

        this.HTML()
    }

    HTML () {
        for (let y = 0; y < this.array.length; y++) {
            for (let x = 0; x < this.array[y].length; x++) {
                // creates a temp div element to add things to them.
                let tempdiv = document.createElement('div')
                
                // Add a grid element to the temp div element
                tempdiv.style.gridRow    = `${y + 1} / ${y + 2}`
                tempdiv.style.gridColumn = `${x + 1} / ${x + 2}`
                
                // Based on what the value is inside of the given array, teh switch statement will add diffrent things to it.
                switch (this.array[y][x]) { // the value of the array
                    case 0: // 0 = empty
                        tempdiv.classList.add('empty-cell')
                        break;
                    case 1: // 1 = a place a tower can be placed
                        tempdiv.classList.add('tower-cell')
                        this.CheckConners(x, y, tempdiv);
                        this.AddSheenShadow(x, y, tempdiv, 1, towerSheen, towerShadow);
                        break;
                    case 's': // 's' = the enemy spawn location
                        tempdiv.classList.add('enemy-spawn-cell')
                        break;
                    case 'p': // 'p' = the path the enemies can take
                        tempdiv.classList.add('path-cell')
                        this.CheckConners(x, y, tempdiv);
                        this.AddSheenShadow(x, y, tempdiv, 'p', pathSheen, pathShadow);
                        break;
                    case 'b': // 'b' = the players base
                        tempdiv.classList.add('player-base-cell')
                        break;
                    default: // if the tile is not contained in the switch statement, warn.
                        console.warn('No found tile for given board')
                }
                
                // For every tempdiv, append it to the board container.
                this.board.appendChild(tempdiv)
            }
        }
    }

    CheckConners (x, y, elem) { // the x,y of the element and the elements html
        let round = [ // round checks surrounding squares. -1 means one row or col backwards, 0 means no rows or cols backward, 1 means one row or col forwards
            [
                [ [-1,  0], [-1, -1], [ 0, -1] ],
                [ [ 0, -1], [ 1, -1], [ 1,  0] ],
                [ [ 1,  0], [ 1,  1], [ 0,  1] ],
                [ [ 0,  1], [-1,  1], [-1,  0] ] 
            ]
        ]

        let isEmpty; // isEmpty is true unless a non-emppty space is found around the [x, y] of the permatiters
        for (let type of round) { // For both sets in rounds
            for (let set of type) { // for each of the diffrent sets in the round type
                isEmpty = true; // resets empty to true for each set
                for (let cords of set) { // each of the indivual cordinates in set
                    if (this.array[y + cords[1]][x + cords[0]] !== 0) { // based on where the x,y is then find it plus the cords and if that position on the board is not a zero
                        isEmpty = false; // sets isEmpty to false
                        break; // And breaks so it doesn't run anymore
                    }
                }
                if (isEmpty) { // if all the spots are empty meaning we can round the conners
                    for (let cords of set) { // for each of the ccrdinates in set
                        if (!cords.includes(0)) { // if it includes a 0, meaning it ins't a conner
                            if (cords[0] === -1) { // if cords starts with a -1
                                if (cords[1] === 1) { // if cords ends with a 1
                                    elem.style.borderBottomLeftRadius = roundAmt;
                                } else { // if cords ends with a -1
                                    elem.style.borderTopLeftRadius = roundAmt;
                                }
                            } else { // if cords starts with a 1
                                if (cords[1] === 1) { // if cords ends with a 1
                                    elem.style.borderBottomRightRadius = roundAmt;
                                } else { // if cords ends with a -1
                                    elem.style.borderTopRightRadius = roundAmt;
                                } // look
                            } // at
                        } // all
                    } // these
                } // curly
            } // brakets
        } // thats
    } // crazy

    AddSheenShadow (x, y, elem, lookFor, sheen, shadow) {
        if (this.array[y][x - 1] !== lookFor) elem.style.borderLeft   = sheenShadowBorder + sheen; 
        if (this.array[y - 1][x] !== lookFor) elem.style.borderTop    = sheenShadowBorder + sheen; 
        if (this.array[y + 1][x] !== lookFor) elem.style.borderBottom = sheenShadowBorder + shadow;
        if (this.array[y][x + 1] !== lookFor) elem.style.borderRight  = sheenShadowBorder + shadow;
    }
}

let board = new Board (boardHTML, classicSmall.map)

// ░█████╗░░█████╗░███╗░░░███╗███████╗██████╗░░█████╗░
// ██╔══██╗██╔══██╗████╗░████║██╔════╝██╔══██╗██╔══██╗
// ██║░░╚═╝███████║██╔████╔██║█████╗░░██████╔╝███████║
// ██║░░██╗██╔══██║██║╚██╔╝██║██╔══╝░░██╔══██╗██╔══██║
// ╚█████╔╝██║░░██║██║░╚═╝░██║███████╗██║░░██║██║░░██║
// ░╚════╝░╚═╝░░╚═╝╚═╝░░░░░╚═╝╚══════╝╚═╝░░╚═╝╚═╝░░╚═╝

window.addEventListener('resize', () => {
    boardHTML.style.top  = '0'
    boardHTML.style.left = '0'
})

class Camera {
    constructor (boardHTML, boardArray) {
        this.board  = boardHTML;
        this.array  = boardArray;
        this.width  = boardHTML.offsetWidth;
        this.height = boardHTML.offsetHeight;
        this.scale  = 1;

        this.Keys();
    }

    Keys () {
        let press = []

        window.addEventListener('keydown', (e) => {
            if (!press.includes(e.key)) {
                press.push(e.key);
            }

            if (press.includes('w') && Number(this.board.style.top.replace('px', '')) > 0 - this.height / 2) {
                this.board.style.top  = Number(this.board.style.top.replace('px', '')) - cameraSpeed + 'px' 
            } else if (press.includes('s') && Number(this.board.style.top.replace('px', '')) < window.innerHeight - this.height / 2) {
                this.board.style.top  = Number(this.board.style.top.replace('px', '')) + cameraSpeed + 'px' 
            }    
            if (press.includes('a') && Number(this.board.style.left.replace('px', '')) > 0 - this.width / 2) {
                this.board.style.left = Number(this.board.style.left.replace('px', '')) - cameraSpeed + 'px';
            } else if (press.includes('d') && Number(this.board.style.left.replace('px', '')) < window.innerWidth - this.width / 2) {
                this.board.style.left = Number(this.board.style.left.replace('px', '')) + cameraSpeed + 'px';
            }
            if (press.includes('q') && this.scale < zoomMax) {
                this.board.style.transform = `scale(${this.scale}, ${this.scale})`
                this.scale += 0.1;
            } else if (press.includes('e') && this.scale > zoomMin) {
                this.board.style.transform = `scale(${this.scale}, ${this.scale})`
                this.scale -= 0.1;
            }
        })

        window.addEventListener('keyup', (e) => {
            press.splice(press.indexOf(e.key), 1);
        })
    }
}

let camera = new Camera (boardHTML, classicSmall.map);

// ████████╗░█████╗░░██╗░░░░░░░██╗███████╗██████╗░░██████╗
// ╚══██╔══╝██╔══██╗░██║░░██╗░░██║██╔════╝██╔══██╗██╔════╝
// ░░░██║░░░██║░░██║░╚██╗████╗██╔╝█████╗░░██████╔╝╚█████╗░
// ░░░██║░░░██║░░██║░░████╔═████║░██╔══╝░░██╔══██╗░╚═══██╗
// ░░░██║░░░╚█████╔╝░░╚██╔╝░╚██╔╝░███████╗██║░░██║██████╔╝
// ░░░╚═╝░░░░╚════╝░░░░╚═╝░░░╚═╝░░╚══════╝╚═╝░░╚═╝╚═════╝░

let towers = document.getElementsByClassName('tower-cell');
for (let tow of towers) {
    tow.addEventListener ('onclick', menu) 
}

function menu () {}

class Tower {
    constructor (type) {
        this.type = type;
    }
}

// Enemys

class Enemy {
    constructor (type, health) {
        this.type   = type;
        this.health = health;
        this.speed  = 0;
        this.html   = document.createElement('div')
    }

    SetHtml () {
        switch (this.type) {
            case "basic":
                break;
            case "fast":
                this.health /= 2
                this.speed   = 
                break;
            case
        }
    }

    Delete () {
        this.html.remove();
    }
}

// Projectiles

class Projectile {
    constructor (projHtml, startx, starty, angle, speed) {
        this.type   = type;
        this.x      = startx;
        this.y      = starty;
        this.angle  = angle;
        this.speed  = speed;
        this.html   = projHtml;
    }

    ColideDetect () {
        if (this.x) {

        }
    }

    Delete () {
        this.html.remove();
    }
}