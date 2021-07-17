import React from 'react';
import gridFunc from './gridFunc.js';

class InputGrid extends React.Component {
  state = { inputGrid: gridFunc.arrayBuilder('answer'), posArray: gridFunc.arrayBuilder() };

  //function to solve grid as much as possible
  stateHelper = (inGrid, pGrid) => {
    this.setState({ inputGrid: inGrid, posArray: pGrid });
    //console.log("state helper");
    //console.log(this.state.posArray);
  };

  onClick = (event) => {
    console.log("onclick debug");
    console.log(this.state.posArray);
    gridFunc.gridSolve(this.state.inputGrid, this.state.posArray, this.stateHelper);
  };
  debugClick = (event) => {
    let debugGrid = JSON.parse(JSON.stringify(this.state.posArray));
    console.log(debugGrid);
  };
  handleClear = () => {
    this.setState({ inputGrid: gridFunc.arrayBuilder('answer'), posArray: gridFunc.arrayBuilder() });
  };
  handleChange = (event, id) => {
    event.persist();
    let newGrid = this.state.inputGrid;
    let posGrid = this.state.posArray;

    //saving previous state for undo
    //this.setState({previousGrid: newGrid, previousArray: posGrid});
    let answer = parseInt(event.target.value, 10);

    posGrid[id].solved = 1;
    posGrid[id].userInputted = true;
    posGrid[id].answer = answer;
    newGrid[id].answer = answer;
    posGrid[id].possi.splice(0, posGrid[id].possi.length, [newGrid[id].answer]);
    this.setState({ posArray: posGrid, inputGrid: newGrid });

  }
  rowBuilder = (startId) => {
    let row = [];
    for (let i = 0; i < 9; i++) {
      row.push(<td><input id={startId + i} maxLength="1" onChange={(e) => { this.handleChange(e, startId + i) }} value={this.state.inputGrid[startId + i].answer} /></td>)
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
  newSolve = () => {
    let reducedGrid = JSON.parse(JSON.stringify(this.state.posArray));

    let sum = gridFunc.possiSum(reducedGrid);
    let newSum = -1;

    do {
      sum = newSum;
      reducedGrid = gridFunc.gridSolve(this.state.inputGrid, reducedGrid, this.stateHelper);
      for (let i = 0; i < this.state.posArray.length; i++) {
        if (this.state.posArray[i].answer !== undefined) {
          reducedGrid = JSON.parse(JSON.stringify(gridFunc.possiReduce(i, reducedGrid, this.state.posArray[i].answer)));
        };
      };
      //reducedGrid = gridFunc.deepPossiReduce(reducedGrid, "col");
      //reducedGrid = gridFunc.deepPossiReduce(reducedGrid, "row");
      newSum = gridFunc.possiSum(reducedGrid);
    } while (sum !== newSum)

    let order = gridFunc.leastToMost(reducedGrid);
    console.log("order");
    console.log(order);
    this.setState({ posArray: reducedGrid, inputGrid: gridFunc.recSolve(reducedGrid, 0, order) });
    //console.log(this.state.inputGrid);
  };
  gridPrint = () =>{
    let reducedGrid = this.state.posArray;
    for (let i = 0; i < this.state.posArray.length; i++) {
      if (this.state.posArray[i].answer !== undefined) {
        reducedGrid = JSON.parse(JSON.stringify(gridFunc.possiReduce(i, reducedGrid, this.state.posArray[i].answer)));
      };
    };
    this.setState({posArray: reducedGrid});
    console.log(reducedGrid);
  }
  render() {
    console.log("render test");
    return (
      <div>
        <form autoComplete="off">
          <table id="inputTable" cellSpacing="0" cellPadding="0">
            <tbody>
              {this.renderHelper()}
            </tbody>
          </table>
          <div>
            <div id="btns">
              <button type="button" onClick={this.onClick}>Solve!</button>
              <button type="button" onClick={this.debugClick}>debug</button>
              <button type="button" onClick={this.handleClear}>Clear</button>
              <button type="button" onClick={this.newSolve}>Rec Solve</button>
              <button type="button" onClick={this.gridPrint}>Grid Print</button>
            </div>
          </div>
        </form>
      </div>
    );

  }

};

export default InputGrid;
