import React from 'react';
import gridFunc from './gridFunc.js';

class InputGrid extends React.Component {
  state = { inputGrid: gridFunc.arrayBuilder('answer'), posArray: gridFunc.arrayBuilder(), status: "Sudoku Solver!" };

  //function to solve grid as much as possible
  stateHelper = (inGrid, pGrid) => {
    this.setState({ inputGrid: inGrid, posArray: pGrid });
  };
  statusHelper = (status) => {
    this.setState({ status: status });
  };
  debugClick = (event) => {
    let debugGrid = JSON.parse(JSON.stringify(this.state.posArray));
    console.log(debugGrid);
  };
  handleClear = () => {
    this.setState({ inputGrid: gridFunc.arrayBuilder('answer'), posArray: gridFunc.arrayBuilder(), status: "Cleared!" });
  };
  handleChange = (event, id) => {
    event.persist();
    //console.log(event);
    let newGrid = this.state.inputGrid;
    let posGrid = this.state.posArray;

    let answer = parseInt(event.target.value, 10);

    if (answer > 0 && answer < 10) {
      posGrid[id].solved = 1;
      posGrid[id].userInputted = true;
      posGrid[id].answer = answer;
      newGrid[id].answer = answer;
      posGrid[id].possi.splice(0, posGrid[id].possi.length, [newGrid[id].answer]);
      this.setState({ posArray: posGrid, inputGrid: newGrid });
    };

  }
  onKeyDown = (event, id) => {
    //console.log(event.keyCode);
    let posGrid = this.state.posArray;
    let newGrid = this.state.inputGrid;
    if (event.keyCode === 8 || event.keyCode === 46) {
      posGrid[id].solved = 0;
      posGrid[id].userInputted = false;
      posGrid[id].answer = "";
      newGrid[id].answer = "";
      posGrid[id].possi.splice(0, posGrid[id].possi.length);
      for (let i = 1; i < 10; i++) {
        posGrid[id].possi.push(i);
      };
      this.setState({ posArray: posGrid, inputGrid: newGrid });
      //console.log(this.state.posArray);
    }

  }
  rowBuilder = (startId) => {
    let row = [];
    for (let i = 0; i < 9; i++) {
      row.push(<td><input id={startId + i} maxLength="1" onKeyDown={(e) => this.onKeyDown(e, startId + i)} onChange={(e) => { this.handleChange(e, startId + i) }} value={this.state.inputGrid[startId + i].answer} /></td>)
    };
    return row;
  }
  renderHelper = () => {
    //let id = 0;
    let hmtlTable = [];
    //for each row
    for (let i = 0; i < 9; i++) {
      let startId = i * 9;
      hmtlTable.push(<tr>{this.rowBuilder(startId)}</tr>)
    };

    return hmtlTable;
  }
  gridPrint = () => {
    let reducedGrid = this.state.posArray;
    for (let i = 0; i < 81; i++) {
      if (this.state.posArray[i].answer !== undefined) {
        reducedGrid = JSON.parse(JSON.stringify(gridFunc.possiReduce(i, reducedGrid, this.state.posArray[i].answer)));
      };
    };
    this.setState({ posArray: reducedGrid });
    console.log(reducedGrid);
  }
  recSolve2 = () => {
    this.setState({ status: "Working on it..." });
    this.setState({preSolve: JSON.parse(JSON.stringify(this.state.posArray))});
    this.setState({preSolveInput: JSON.parse(JSON.stringify(this.state.inputGrid))});
    let reducedGrid = this.state.posArray;
    let inGrid = this.state.inputGrid;

    let sum = gridFunc.possiSum(reducedGrid);
    let newSum = -1;

    do {
      sum = newSum;
      reducedGrid = gridFunc.gridSolve(inGrid, reducedGrid, this.stateHelper);
      for (let i = 0; i < 81; i++) {
        if (this.state.posArray[i].answer !== undefined) {
          reducedGrid = JSON.parse(JSON.stringify(gridFunc.possiReduce(i, reducedGrid, reducedGrid[i].answer)));
        };
      };
      reducedGrid = gridFunc.deepPossiReduce(reducedGrid, "col");
      reducedGrid = gridFunc.deepPossiReduce(reducedGrid, "row");
      newSum = gridFunc.possiSum(reducedGrid);
    } while (sum !== newSum)

    let order = gridFunc.leastToMost(reducedGrid);
    /*
    if(gridFunc.doomCheck(reducedGrid, 0, order)){
      this.setState({status: "Invalid Puzzle"});
    } else{
      reducedGrid = gridFunc.whileSolve(reducedGrid, 0, order, this.statusHelper);
      this.setState({ posArray: reducedGrid, inputGrid: reducedGrid, status: "Solved!" });
    }
    */
   try {
      reducedGrid = gridFunc.whileSolve(reducedGrid, 0, order, this.statusHelper);
      this.setState({ posArray: reducedGrid, inputGrid: reducedGrid, status: "Solved!" });
   } catch(err){
     console.log("catch");
     console.log(this.state.preSolve);
     console.log(this.state.preSolveInput)
     this.setState({status: "Invalid Puzzle"});
     this.setState({posArray: this.state.preSolve, inputGrid: this.state.preSolveInput});
   }

  }
  render() {
    return (
      <div>
        <div id="status">
          <h1>{this.state.status}</h1>
        </div>
        <form autoComplete="off">
          <table id="inputTable" cellSpacing="0" cellPadding="0">
            <tbody>
              {this.renderHelper()}
            </tbody>
          </table>
          <div>
            <div id="btns">
              <button type="button" onClick={this.recSolve2}>Solve!</button>
              <button type="button" onClick={this.handleClear}>Clear</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
};

export default InputGrid;
