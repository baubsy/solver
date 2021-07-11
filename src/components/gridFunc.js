import React from 'react';

let gridFunc = {
    test() {
        console.log("grid func test");
    },
    numberSolved(id, grid, answer) {
        let solved = 0;

        for (let j = 0; j < 81; j++) {
            if (grid[j].col === grid[id].col || grid[j].row === grid[id].row || grid[j].square === grid[id].square) {
                if (grid[j].answer === answer) {
                    solved = 1;
                }
            }
        }


        return solved;
    },

    compArrayBuilder(type, id, grid) {
        //id being the row/col/square ID, 0-8
        //using 81 for grid size for now
        let compArray = [];

        if (type === 'col') {
            for (let i = 0; i < 81; i++) {
                if (grid[i].col === id) {
                    compArray.push(grid[i]);
                }
            }
        }
        if (type === 'row') {
            for (let i = 0; i < 81; i++) {
                if (grid[i].row === id) {
                    compArray.push(grid[i]);
                }
            }
        }
        if (type === 'square') {
            for (let i = 0; i < 81; i++) {
                if (grid[i].square === id) {
                    compArray.push(grid[i]);
                }
            }
        }

        return compArray;
    },

    arrayBuilder(type) {
        let posArray = [];
        //builds the structure of the array
        //81 squares in a sudoku grid, 9x9, indexed from top left to bottom right starting from zero
        if (type === 'answer') {
            for (let k = 0; k < 81; k++) {
                posArray.push({ id: k, row: null, col: null, square: null, answer: '' });
            };
        } else {
            for (let d = 0; d < 81; d++) {
                posArray.push({ id: d, row: null, col: null, square: null, possi: [1, 2, 3, 4, 5, 6, 7, 8, 9], solved: 0 }) //DEBUG value remove!
            }
        }

        //assigns columns
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                posArray[i + j * 9].col = i;

            }
        }
        //assigns rows

        for (let v = 0; v < 9; v++) {
            for (let t = 0; t < 9; t++) {
                posArray[v * 9 + t].row = v;
            }
        }

        //assigins each object in the array what big square its in on the sudoku grid
        posArray.forEach(function (square) {

            switch (true) {
                case square.row <= 2 && square.col <= 2:
                    square.square = 0;
                    break;
                case (square.col >= 2 && square.col <= 5) && (square.row <= 2):
                    square.square = 1;
                    break;
                case (square.col >= 6 && square.col <= 8) && (square.row <= 2):
                    square.square = 2;
                    break;
                case square.col <= 2 && (square.row >= 3 && square.row <= 5):
                    square.square = 3;
                    break;
                case (square.col >= 3 && square.col <= 5) && (square.row >= 3 && square.row <= 5):
                    square.square = 4;
                    break;
                case square.col >= 6 && (square.row >= 3 && square.row <= 5):
                    square.square = 5;
                    break;
                case square.col <= 2 && square.row >= 6:
                    square.square = 6;
                    break;
                case (square.col >= 3 && square.col <= 5) && square.row >= 6:
                    square.square = 7;
                    break;
                case square.col >= 6 && square.row >= 6:
                    square.square = 8;
                    break;
                default:
                    console.log("square error");
                    break;
            }

            //console.log('test2');
        })

        return posArray;
    },

    deepPossiReduce(posArray) {
        let posGrid = posArray;


        for (let d = 0; d < 81; d++) {


            let sqArray = gridFunc.compArrayBuilder('square', d, posGrid);
            for (let i = 1; i < 10; i++) {
                let blocked = 0; //tracks if the possiblites in the square blocks certain answers in rows/cols
                sqArray.forEach(function (sq) {
                    if (i === 7 && sq.square === 0) {
                        console.log(sq);
                    }
                    if (sq.possi.indexOf(i) > -1 && posGrid[d].col !== sq.col && sq.id !== posGrid[d].id) {
                        blocked = 1;
                        console.log("blok test");
                    }
                })
                console.log("block test" + d + blocked);
                if (blocked === 0) {
                    console.log("block 2");
                    for (let k = 0; k < 81; k++) {
                        if (posGrid[d].col === posGrid[k].col && posGrid[d].square !== posGrid[k].square) {
                            if (posGrid[k].possi.indexOf(i) > -1 && posGrid[k].possi.length > 1) {
                                //FIX butchering posGrid somehow
                                let index = posGrid[k].possi.indexOf(i);
                                posGrid[k].possi.splice(index, 1)
                            }
                        }
                    }
                }
            }
        }
        return posGrid;
    },
    //crosses off possible answers based on known values if blocks share a square/col/or row
    possiReduce(id, grid, answer) {
        let newGrid = Object.assign({}, grid);;
        for (let j = 0; j < 81; j++) {
            if (grid[j].col === grid[id].col || grid[j].row === grid[id].row || grid[j].square === grid[id].square) {
                let index = grid[j].possi.indexOf(answer);
                //if the value already exists in this row/col/square it crosses it off the list for this block
                if (index > -1) {
                    newGrid[j].possi.splice(index, 1);
                }
            }
        }
        console.log("possireduce return posgrid");
        console.log(newGrid);
        return newGrid;
    },
    //function to check if grid is SOLVED FIX/Start Here
    solveCheck(posGrid) {
        let grid = posGrid;
        let solved = 1;
        for (let i = 0; i < 81; i++) {
            if (grid[i].solved === 0) {
                solved = 0;
                break;
            }
        }
        return solved;
    },
    gridSolve(grid, posState, stateHelper) {
        //let posGrid = JSON.parse(JSON.stringify(posState));
        //let newGrid = JSON.parse(JSON.stringify(grid));
        let posGrid = Object.assign({}, posState);
        let newGrid = Object.assign({}, grid);
        

        let gridSize = Object.keys(grid).length;

        console.log('posGrid pre solve');
        console.log(posGrid);
        //do this untill solved or deemed unsolvable

        //filling in known values, replaces the possibility array with an array with just the filled in value
        for (let i = 0; i < gridSize; i++) {
            if (newGrid[i].answer !== '') {
                posGrid[i].solved = 1;
                posGrid[i].possi.splice(0, posGrid[i].possi.length, [newGrid[i].answer])
            }

            //If a spot has only one possible answer left sets that as the answer
            if (posGrid[i].possi.length === 1 && posGrid[i].solved === 0) {
                newGrid[i].answer = posGrid[i].possi[0];
                posGrid[i].solved = 1;
            }

        }
        //comparing each grid element to each other

        for (let j = 0; j < gridSize; j++) {
            if (newGrid[j].answer !== '') {
                for (let k = 0; k < gridSize; k++) {
                    //reduces possibility array elements, comparing blocks in the same row/col/square
                    if (newGrid[j].col === newGrid[k].col || newGrid[j].row === newGrid[k].row || newGrid[j].square === newGrid[k].square) {
                        let index = posGrid[k].possi.indexOf(newGrid[j].answer);
                        //if the value already exists in this row/col/square it crosses it off the list for this block
                        if (index > -1) {
                            posGrid[k].possi.splice(index, 1);
                        }
                    }

                }
            }
            //checks to so see if its the only valid location of a number
            //If the number cant go anywhere else it will set it to that number
            let compArray = gridFunc.compArrayBuilder('col', newGrid[j].col, posGrid);
            //checking numbers 1-9

            if (newGrid[j].answer === '') {
                for (let t = 1; t < 10; t++) {
                    let counter = 0;
                    if (gridFunc.numberSolved(j, newGrid, t) === 0) {
                        compArray.forEach(function (possiArray) {
                            if (possiArray.id !== newGrid[j].id && possiArray.possi.indexOf(t) === -1) {
                                //Avoiding looking at current block for comparisons/makes sure the answer(t) isn't in a differnt spot in the column

                                counter++;
                            }
                        })

                        if (counter === 8 && newGrid[j].answer === '') {
                            newGrid[j].answer = t;
                            posGrid[j].solved = 1;
                        }
                    }
                }
            }
            compArray = gridFunc.compArrayBuilder('row', newGrid[j].row, posGrid);
            //checking numbers 1-9

            if (newGrid[j].answer === '') {
                for (let t = 1; t < 10; t++) {
                    let counter = 0;
                    if (gridFunc.numberSolved(j, newGrid, t) === 0) {
                        compArray.forEach(function (possiArray) {
                            if (possiArray.id !== newGrid[j].id && possiArray.possi.indexOf(t) === -1) {
                                //Avoiding looking at current block for comparisons/makes sure the answer(t) isn't in a differnt spot in the column

                                counter++;
                            }
                        })

                        if (counter === 8 && newGrid[j].answer === '') {
                            newGrid[j].answer = t;
                            posGrid[j].solved = 1;
                        }
                    }
                }
            }
            compArray = gridFunc.compArrayBuilder('square', newGrid[j].square, posGrid);
            //checking numbers 1-9

            if (newGrid[j].answer === '') {
                for (let t = 1; t < 10; t++) {
                    let counter = 0;
                    if (gridFunc.numberSolved(j, newGrid, t) === 0) {
                        compArray.forEach(function (possiArray) {
                            if (possiArray.id !== newGrid[j].id && possiArray.possi.indexOf(t) === -1) {
                                //Avoiding looking at current block for comparisons/makes sure the answer(t) isn't in a differnt spot in the column

                                counter++;
                            }
                        })

                        if (counter === 8 && newGrid[j].answer === '') {
                            newGrid[j].answer = t;
                            posGrid[j].solved = 1;
                            posGrid[j].answer = t;
                        }
                    }
                }
            }
        }

        //posGrid = this.deepPossiReduce(posGrid);
        stateHelper(newGrid);
        //this.setState({posArray: posGrid});
        return newGrid;
    },
    recSolve(posGrid, startID, backstep){
        //the last cell, the base case
        let returnGrid = JSON.parse(JSON.stringify(posGrid));
        if(backstep === true){
            returnGrid[startID].possi.splice(0, 1);
        }
        if(startID === 80){
            if(returnGrid[80].possi.length === 1){
                returnGrid[80].answer = returnGrid[80].possi[0];
                return returnGrid;
            } else{
                return this.recSolve(returnGrid, startID - 1, true);
            }
        } else if(returnGrid[startID].answer !== undefined){
            //find first unsolved cell and assume first possibility is right, update possibility arrays
        
            //call recSolve on the remainder of the grid
            return this.recSolve(returnGrid, startID + 1);
        } else if(returnGrid[startID].answer === undefined){
            returnGrid[startID].answer = returnGrid[startID].possi[0];
            return this.recSolve(returnGrid, startID + 1);

        } else{
            console.log("recursion if break");
        }
        

        //pass up if a previous answer is unviable and move forward
    }
};

export default gridFunc;