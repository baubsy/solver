import React from 'react';
import gridFunc from './gridFunc.js';

class InputGrid extends React.Component {
  state = { inputGrid: gridFunc.arrayBuilder('answer'), posArray: gridFunc.arrayBuilder(), previousGrid: gridFunc.arrayBuilder('answer'), previousArray: gridFunc.arrayBuilder() };

  //function to solve grid as much as possible
  fullSolve = () => {
    let posGrid = JSON.parse(JSON.stringify(this.state.posArray));
    let escapeCounter = 0;
    let solved = 0;
    do {
      //check if solved with function
      solved = gridFunc.solveCheck(posGrid);
      escapeCounter++;

      this.setState({ inputGrid: gridFunc.gridSolve(this.state.inputGrid, this.state.posArray, this.stateHelper) })

    } while (escapeCounter < 20 && solved === 0);
    if(escapeCounter >= 20){
      console.log("full solve impossible")
    }
  };
  stateHelper = (inGrid) => {
    this.setState({ inputGrid: inGrid });
    console.log("state helper");
    console.log(this.state.posArray);
  };

  onClick = (event) => {
    console.log("onclick debug");
    console.log(this.state.posArray);
    this.setState({ inputGrid: gridFunc.gridSolve(this.state.inputGrid, this.state.posArray, this.stateHelper) })
  };
  debugClick = (event) => {
    /*
    this.setState({posArray: gridFunc.recReduce(this.state.posArray, 8)})
    console.log(this.state.posArray);
    */
    let reducedGrid = JSON.parse(JSON.stringify(this.state.posArray));
    //console.log("newsolve reduced grid");
    //console.log(reducedGrid);
    for(let i = 0; i < this.state.posArray.length; i++){
      if(this.state.posArray[i].answer != undefined){
        reducedGrid = JSON.parse(JSON.stringify(gridFunc.possiReduce(i, reducedGrid, this.state.posArray[i].answer)));
      }
    };
    let order = gridFunc.leastToMost(reducedGrid);
    console.log("reduced Grid");
    console.log(reducedGrid);
    console.log("order");
    console.log(order);
  };
  handleUndo = () => {
    //Do a undo history that it steps back through, will fix problem
    //simple 1 step undo, disable undo button until another change is made
    console.log("undo");
    this.setState({ inputGrid: this.state.previousGrid, posArray: this.state.previousArray });
    console.log(this.state.inputGrid);
    //this.setState({posArray: this.state.previousArray});
    console.log(this.state.posArray);

  };
  handleChange = (event, id) => {
    event.persist();
    console.log("udate test");
    let newGrid = this.state.inputGrid;
    let posGrid = this.state.posArray;

    //saving previous state for undo
    //this.setState({previousGrid: newGrid, previousArray: posGrid});
    let answer = parseInt(event.target.value, 10);

    posGrid[id].solved = 1;
    posGrid[id].userInputted = true;
    posGrid[id].answer = answer;
    newGrid[id].answer = answer;
    console.log(answer);
    posGrid[id].possi.splice(0, posGrid[id].possi.length, [newGrid[id].answer]);
    console.log(posGrid);

    //this.setState({ previousGrid: this.state.inputGrid, previousArray: this.state.posArray });
    //TODO breaking old save by commenting out possiReduce here to make recSolve work.
    this.setState({ 
      previousGrid: this.state.inputGrid,
      previousArray: this.state.posArray,
      //posArray: gridFunc.possiReduce(id, posGrid, answer),
      posArray: posGrid,
      inputGrid: newGrid });
    //this.setState({ posArray: gridFunc.possiReduce(id, posGrid, answer), inputGrid: newGrid });
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
    //console.log("newsolve reduced grid");
    //console.log(reducedGrid);
    for(let i = 0; i < this.state.posArray.length; i++){
      if(this.state.posArray[i].answer != undefined){
        reducedGrid = JSON.parse(JSON.stringify(gridFunc.possiReduce(i, reducedGrid, this.state.posArray[i].answer)));
      }
    }
    console.log("new solve reduced grid");
    //TODO change gridsolve to return pos grid, embrace hybrid approach?

    /*
    reducedGrid = gridFunc.gridSolve(this.state.inputGrid, reducedGrid, this.stateHelper);
    //reducedGrid = gridFunc.recReduce(reducedGrid, 0);
    for(let i = 0; i < this.state.posArray.length; i++){
      if(this.state.posArray[i].answer != undefined){
        reducedGrid = JSON.parse(JSON.stringify(gridFunc.possiReduce(i, reducedGrid, reducedGrid[i].answer)));
      }
    }
    */
    console.log(JSON.parse(JSON.stringify(reducedGrid)));
    //this.setState({posArray: reducedGrid});
    this.setState({posArray: reducedGrid, inputGrid: gridFunc.recSolve(reducedGrid, 0)});
    //console.log(this.state.inputGrid);
  };
  render() {
    console.log("render test");
    return (
      <div>
        <form autoComplete="off">
          <table id="inputTable" cellspacing="0" cellpadding="0">
            <tbody>
              {this.renderHelper()}
            </tbody>
          </table>
          <div>
            <div id="btns">
              <button type="button" onClick={this.onClick}>Solve!</button>
              <button type="button" onClick={this.debugClick}>debug</button>
              <button type="button" onClick={this.fullSolve}>Full Solve</button>
              <button type="button" onClick={this.handleUndo}>Undo</button>
              <button type="button" onClick={this.newSolve}>Rec Solve</button>
            </div>
          </div>
        </form>
      </div>
    );

  }

};

export default InputGrid;
