

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
                posArray.push({ id: d, row: null, col: null, square: null, possi: [1, 2, 3, 4, 5, 6, 7, 8, 9], solved: 0, userInputted: false });
            }
        };
        //assigns columns
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                posArray[i + j * 9].col = i;

            };
        };
        //assigns rows
        for (let v = 0; v < 9; v++) {
            for (let t = 0; t < 9; t++) {
                posArray[v * 9 + t].row = v;
            };
        };
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
            };
        })
        return posArray;
    },
    compArrayCheck(answer, compArray) {
        let solved = false;
        for (let i = 0; i < compArray.length; i++) {
            if (compArray[i].answer === answer) {
                solved = true;
            }
        }
        return solved;
    },
    deepPossiReduce(posArray, type) {
        //type is "row" or "col"
        let posGrid = posArray;

        for (let d = 0; d < 81; d++) {
            let sqArray = gridFunc.compArrayBuilder('square', posGrid[d].square, posGrid);
            for (let i = 1; i < 10; i++) {
                if (this.compArrayCheck(i, sqArray) === false) {
                    let blocked = 0; //tracks if the possiblites in the square blocks certain answers in rows/cols
                    sqArray.forEach(function (sq) {
                        //CHECK if I is present in square already!!!!!!!!!!!!
                        if (sq.possi.indexOf(i) > -1 && posGrid[d][type] !== sq[type]) {
                            blocked = 1;
                        }
                    })
                    if (blocked === 0) {
                        for (let k = 0; k < 81; k++) {
                            if (posGrid[d][type] === posGrid[k][type] && posGrid[d].square !== posGrid[k].square) {
                                if (posGrid[k].possi.indexOf(i) > -1 && posGrid[k].possi.length > 1) {
                                    let index = posGrid[k].possi.indexOf(i);
                                    posGrid[k].possi.splice(index, 1)
                                }
                            }
                        }
                    }
                }
            }
        }
        return posGrid;
    },
    //crosses off possible answers based on known values if blocks share a square/col/or row
    possiReduce(id, grid, answer, startID = 0, order) {
        //goes by the order provided and cross of possibilites of subsequent squares where approiate based on answer
        if (order === undefined) {
            order = [];
            for (let d = 0; d < 81; d++) {
                order.push(d);
            }
        };
        if(startID < 0){
            console.log("start id possi error");
            return grid;
        }
        let newGrid = grid;
        for (let j = startID; j < 81; j++) {
            if (grid[order[j]].col === grid[id].col || grid[order[j]].row === grid[id].row || grid[order[j]].square === grid[id].square) {
                let index = grid[order[j]].possi.indexOf(answer);
                //if the value already exists in this row/col/square it crosses it off the list for this block
                if (index > -1 && order[j] !== id) {
                    newGrid[order[j]].possi.splice(index, 1);
                }
            }
        }
        return newGrid;
    },
    //function to help reduce possibility arrays for the recSolve function. starts from order[startID] and moves down
    recReduce(posGrid, startID, order) {
        let newGrid = posGrid;
        if(startID < 0){
            console.log("start id error");
            return newGrid;
        }
        for (let i = 0; i < 81; i++) {
            if (newGrid[order[i]].answer !== undefined) {
                newGrid = this.possiReduce(order[i], newGrid, newGrid[order[i]].answer, startID + 1, order);
            }

        };
        return newGrid;
    },
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
        //attempts to fill in blocks by looking at arrays of possibilites reduced by rules.
        let posGrid = posState;
        let newGrid = grid;
        let gridSize = Object.keys(grid).length;
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
                posGrid[i].answer = posGrid[i].possi[0];
                posGrid[i].possi.splice(0, posGrid[i].possi.length, [newGrid[i].answer]);
                posGrid[i].userInputted = true;
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
                        if (index > -1 && j !== k) {
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
                            posGrid[j].answer = t;
                            posGrid[j].solved = 1;
                            posGrid[j].possi.splice(0, posGrid[j].possi.length, [newGrid[j].answer]);
                            posGrid[j].userInputted = true;
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
                            posGrid[j].answer = t;
                            posGrid[j].possi.splice(0, posGrid[j].possi.length, [newGrid[j].answer]);
                            posGrid[j].userInputted = true;
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
                            posGrid[j].possi.splice(0, posGrid[j].possi.length, [newGrid[j].answer]);
                            posGrid[j].userInputted = true;
                        }
                    }
                }
            }

        }
        stateHelper(newGrid, posGrid);
        return posGrid;
    },
    possiSum(posGrid) {
        //gives a sum of the length of each possibility array, easy comparison to see if progress is being made
        let sum = 0;
        for (let i = 0; i < 81; i++) {
            sum = sum + posGrid[i].possi.length;
        }
        return sum;
    },
    possiRebuild(posGrid, startID, order) {
        //rebuilds possibility arrays in subsequent blocks after a back step changes things
        let newGrid = posGrid;
        for (let i = startID; i < 81; i++) {
            if (newGrid[order[i]].userInputted === false) {
                newGrid[order[i]].possi.splice(0, newGrid[order[i]].possi.length);
                for (let t = 1; t < 10; t++) {
                    newGrid[order[i]].possi.push(t);
                }
                newGrid[order[i]].answer = undefined;
                newGrid[order[i]].solved = 0;
            }
        }
        return newGrid;
    },
    doomCheck(posGrid, startID, order) {
        //checks if the current grid still has a valid solution
        let doom = false;
        if (order === undefined) {
            order = [];
            for (let d = 0; d < 81; d++) {
                order.push(d);
            }
        };
        if (startID > 81) {
            return doom;
        }
        for (let i = startID; i < 81; i++) {
            if (posGrid[order[i]].possi.length === 0) {
                doom = true;
                return doom;
            }
        }
        return doom;
    },
    leastToMost(posGrid) {
        //returns an array of square id's with least possible answers to most
        let order = [];
        for (let i = 1; i < 10; i++) {
            for (let t = 0; t < 81; t++) {
                if (posGrid[t].possi.length === i) {
                    order.push(posGrid[t].id);
                }
            };
        }
        return order;
    },
    whileSolve(posGrid, startID, order, statusHelper) {
        let id = startID;
        let returnGrid = posGrid;
        let backstep = false;
        console.log(JSON.parse(JSON.stringify(posGrid)));
        console.log("while solve test");
        do {
            if (id < 0) {
                console.log("backstepped too far");
                statusHelper("Invalid Puzzle!");
                break;
            }
            if (id === 80) {
                if (returnGrid[order[id]].possi.length === 1) {
                    returnGrid[order[id]].answer = returnGrid[order[id]].possi[0];
                    returnGrid[order[id]].solved = 1;
                    id = id + 1;
                }
            }
            else if (backstep === true) {
                if (returnGrid[order[id]].userInputted === true) {
                    id = id - 1;
                    backstep = true;
                } else {
                    returnGrid[order[id]].possi.splice(0, 1);
                    if (returnGrid[order[id]].possi.length === 0) {
                        id = id - 1;
                        backstep = true;
                    } else {
                        backstep = false;

                        returnGrid[order[id]].answer = returnGrid[order[id]].possi[0];
                        returnGrid[order[id]].solved = 1;
                        returnGrid = this.possiRebuild(returnGrid, id + 1, order);
                        returnGrid = this.recReduce(returnGrid, id, order);
                        id = id + 1;
                        if (this.doomCheck(returnGrid, id, order) === true) {
                            backstep = true;
                            id = id - 1;
                        }
                    }
                }
            } else if (returnGrid[order[id]].userInputted === true) {

                returnGrid = this.recReduce(returnGrid, id, order);
                id = id + 1;
            } else if (returnGrid[order[id]].possi.length === 0) {
                id = id - 1;
                backstep = true;
            } else if (returnGrid[order[id]].userInputted === false) {
                returnGrid[order[id]].answer = returnGrid[order[id]].possi[0];
                returnGrid[order[id]].solved = 1;
                returnGrid = this.recReduce(returnGrid, id, order);
                id = id + 1;
                if (this.doomCheck(returnGrid, id, order)) {
                    backstep = true;
                    id = id - 1;
                }
            }
        } while (id < 81);

        return returnGrid;
    },
    recSolve(posGrid, startID, order, backstep) {
        //brute forces the grid recursively, following the order of indexs in order
        let returnGrid = posGrid;
        if (startID === 80) {
            //the base case
            if (returnGrid[order[80]].possi.length === 1) {
                returnGrid[order[80]].answer = returnGrid[order[80]].possi[0];
                return returnGrid;
            } else {
                return this.recSolve(returnGrid, startID - 1, order, true);
            }
        } else if (backstep === true) {
            //if we took a step back to get here
            if (posGrid[order[startID]].userInputted === true) {
                return this.recSolve(returnGrid, startID - 1, order, true);
            } else {
                returnGrid[order[startID]].possi.splice(0, 1);
                if (returnGrid[order[startID]].possi.length === 0) {
                    return this.recSolve(returnGrid, startID - 1, order, true);
                } else {
                    returnGrid[order[startID]].answer = returnGrid[order[startID]].possi[0];
                    returnGrid[order[startID]].solved = 1;
                    returnGrid = this.possiRebuild(returnGrid, startID + 1, order);
                    returnGrid = this.recReduce(returnGrid, startID, order);
                    if (this.doomCheck(returnGrid, startID + 1, order) === true) {
                        return this.recSolve(returnGrid, startID, order, true);
                    };
                    return this.recSolve(returnGrid, startID + 1, order);
                }
            }
        } else if (posGrid[order[startID]].userInputted === true) {
            returnGrid = this.recReduce(returnGrid, startID, order);
            return this.recSolve(returnGrid, startID + 1, order);

        } else if (posGrid[order[startID]].possi.length === 0) {
            return this.recSolve(returnGrid, startID - 1, order, true);
        } else if (posGrid[order[startID]].userInputted === false) {
            returnGrid[order[startID]].answer = posGrid[order[startID]].possi[0];
            returnGrid[order[startID]].solved = 1;
            returnGrid = this.recReduce(returnGrid, startID, order);
            if (this.doomCheck(returnGrid, startID + 1, order) === true) {
                return this.recSolve(returnGrid, startID, order, true);
            };
            return this.recSolve(returnGrid, startID + 1, order);
        } else {
            //should never reach here
            console.log("recusrion error");
        }
    }
};

export default gridFunc;