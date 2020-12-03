"use strict"

// All global HTML Elements
let boardHTML = document.getElementById('board');

// The following is a very basic board and is named acordingly.
let classicSmall = {
    map : [
        [ 0 ,  0 ,  1 ,  1 ,  0 ], // 0 Stands for nothing, or a blank space that nothing can be placed on.
        ['s', 'p', 'p', 'p',  0 ], // 1 stands for a spot that towers can be placed on.
        [ 0 ,  1 ,  1 , 'p',  1 ], // s stands for the enemy spawing spot
        [ 0 , 'p', 'p', 'p',  1 ], // b stands for your base, if an enemy reaches here you lose life.
        [ 1 , 'p',  1 ,  1 ,  1 ], // p stands for the path the enemy takes, this can be placed anywhere and the enemy will pathfind the best path towards the nearest base.
        [ 1 , 'p', 'p', 'p', 'b'], 
        [ 0 ,  0 ,  1 ,  1 ,  0 ], 
    ],

    waves : [
        [
            ["basic", 1, 1]
        ]
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
                        break;
                    case 's': // 's' = the enemy spawn location
                        tempdiv.classList.add('enemy-spawn-cell')
                        break;
                    case 'p': // 'p' = the path the enemies can take
                        tempdiv.classList.add('path-cell')
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
}

function PathFinding (board) {
    spawns = [];
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            if (board[row][col] === 's') {
                spawns.push([row, col])
            }
        }
    }
}

let board = new Board (boardHTML, classicSmall.map)