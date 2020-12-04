"use strict"

let boardHTML = document.getElementById('board');

class Board {
    constructor (boardHTML, width, height) {
        this.board  = boardHTML;
        this.width  = width;
        this.height = height;
        this.grid   = [[]];

        this.MakeGrid();
        this.HTML();
    }

    MakeGrid () {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.grid[y].push(0)
            }
            this.grid.push([])
        }
        this.grid.pop();
    }

    HTML () {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                // creates a temp div element to add things to them.
                let tempbutton = document.createElement('button')
                
                // Add a grid element to the temp div element
                tempbutton.style.gridRow    = `${y + 1} / ${y + 2}`
                tempbutton.style.gridColumn = `${x + 1} / ${x + 2}`
                tempbutton.value            = `${x}${y}`

                tempbutton.addEventListener("click", (e) => {
                    e = e.path[0]
                    e.style.backgroundColor = "red"
                    this.grid[e.value[1]][e.value[0]] = 1;
                })

                // For every tempdiv, append it to the board container.
                this.board.appendChild(tempbutton)
            }
        }
    }
    
    ReturnGrid () {
        return this.grid;
    }
}



let board = new Board (boardHTML, Number(prompt('x')), Number(prompt('y')))

let getBoard = document.getElementById('get-board');
getBoard.addEventListener('click', () => {
    console.log(board.ReturnGrid())
})

