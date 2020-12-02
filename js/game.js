"use strict"

let classicSmall = [
    [ 0 , 's',  1 ,  0 , 0],
    [ 0 , 'p', 'p', 'p', 0],
    [ 0 ,  1 ,  1 , 'p', 1],
    ['b', 'p', 'p', 'p', 1],
    [ 0 ,  1 ,  1 ,  1 , 0],
]

let boardHTML = document.getElementById('board');

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
                tempdiv.style.gridRow    = `${x + 1} / ${x + 2}`
                tempdiv.style.gridColumn = `${y + 1} / ${y + 2}`
                
                // Based on what the value is inside of the given array, teh switch statement will add diffrent things to it.
                switch (this.array[y][x]) {
                    case 0:
                        tempdiv.classList.add('empty-cell')
                        break;
                    case 1:
                        tempdiv.classList.add('tower-cell')
                        break;
                    case 's': 
                        tempdiv.classList.add('enemy-start-cell')
                        break;
                    case 'p': 
                        tempdiv.classList.add('path-cell')
                        break;
                    case 'b': 
                        tempdiv.classList.add('player-base-cell')
                        break;
                }

                this.board.appendChild(tempdiv)
            }
        }
    }
}

let board = new Board (boardHTML, classicSmall)