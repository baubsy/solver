import React from 'react';
import gridFunc from './gridFunc.js';
console.log(gridFunc);

class InputGrid extends React.Component {
  state = {inputGrid : gridFunc.arrayBuilder('answer'), posArray : gridFunc.arrayBuilder(), previousGrid : gridFunc.arrayBuilder('answer'), previousArray : gridFunc.arrayBuilder()};
  
  //function to solve grid as much as possible
  fullSolve = () => {
    let posGrid = this.state.posArray;
    let escapeCounter = 0;
    let solved = 0;
    do {
      //check if solved with function
      solved = gridFunc.solveCheck(posGrid);
      escapeCounter++;

      this.setState({inputGrid : this.gridSolve(this.state.inputGrid, this.state.posArray)})

    } while(escapeCounter < 20 && solved === 0);

  };
  gridSolve(grid, posState){
    let posGrid = posState;
    let newGrid = grid;

    let gridSize = Object.keys(grid).length;

    console.log('posGrid pre solve');
    console.log(posGrid);
    //do this untill solved or deemed unsolvable

    //filling in known values, replaces the possibility array with an array with just the filled in value
    for(let i= 0; i < gridSize; i++){
      if(newGrid[i].answer !== ''){
        posGrid[i].solved = 1;
        posGrid[i].possi.splice(0, posGrid[i].possi.length, [newGrid[i].answer])
      }

      //If a spot has only one possible answer left sets that as the answer
      if(posGrid[i].possi.length === 1 && posGrid[i].solved === 0){
        newGrid[i].answer = posGrid[i].possi[0];
        posGrid[i].solved = 1;
      }

    }
    //comparing each grid element to each other

    for(let j= 0; j< gridSize; j++){
      if(newGrid[j].answer !== ''){
        for(let k = 0; k< gridSize; k++){
          //reduces possibility array elements, comparing blocks in the same row/col/square
          if(newGrid[j].col === newGrid[k].col || newGrid[j].row === newGrid[k].row || newGrid[j].square === newGrid[k].square){
            let index = posGrid[k].possi.indexOf(newGrid[j].answer);
            //if the value already exists in this row/col/square it crosses it off the list for this block
            if(index > -1){
              posGrid[k].possi.splice(index, 1);
              }
          }

        }
      }
        //checks to so see if its the only valid location of a number
        //If the number cant go anywhere else it will set it to that number
        let compArray = gridFunc.compArrayBuilder('col',newGrid[j].col,posGrid);
        //checking numbers 1-9

        if(newGrid[j].answer === ''){
          for (let t = 1; t < 10; t++){
          let counter = 0;
          if(gridFunc.numberSolved(j, newGrid, t) === 0){
          compArray.forEach(function(possiArray) {
            if(possiArray.id !== newGrid[j].id && possiArray.possi.indexOf(t) === -1){
              //Avoiding looking at current block for comparisons/makes sure the answer(t) isn't in a differnt spot in the column

              counter++;
          }
          })

            if(counter === 8 && newGrid[j].answer === ''){
              newGrid[j].answer = t;
              posGrid[j].solved = 1;
            }
          }}}
          compArray = gridFunc.compArrayBuilder('row',newGrid[j].row,posGrid);
          //checking numbers 1-9

          if(newGrid[j].answer === ''){
            for (let t = 1; t < 10; t++){
            let counter = 0;
            if(gridFunc.numberSolved(j, newGrid, t) === 0){
            compArray.forEach(function(possiArray) {
              if(possiArray.id !== newGrid[j].id && possiArray.possi.indexOf(t) === -1){
                //Avoiding looking at current block for comparisons/makes sure the answer(t) isn't in a differnt spot in the column

                counter++;
            }
            })

              if(counter === 8 && newGrid[j].answer === ''){
                newGrid[j].answer = t;
                posGrid[j].solved = 1;
              }
            }}}
            compArray = gridFunc.compArrayBuilder('square',newGrid[j].square,posGrid);
            //checking numbers 1-9

            if(newGrid[j].answer === ''){
              for (let t = 1; t < 10; t++){
              let counter = 0;
              if(gridFunc.numberSolved(j, newGrid, t) === 0){
              compArray.forEach(function(possiArray) {
                if(possiArray.id !== newGrid[j].id && possiArray.possi.indexOf(t) === -1){
                  //Avoiding looking at current block for comparisons/makes sure the answer(t) isn't in a differnt spot in the column

                  counter++;
              }
              })

                if(counter === 8 && newGrid[j].answer === ''){
                  newGrid[j].answer = t;
                  posGrid[j].solved = 1;
                }
              }}}
      }

    //posGrid = this.deepPossiReduce(posGrid);
    this.setState({posArray: posGrid});
    return newGrid;
  };
  onClick = (event) => {
    this.setState({inputGrid : this.gridSolve(this.state.inputGrid, this.state.posArray)})
  };
  debugClick = (event) => {
    console.log(this.state.previousArray);
    gridFunc.test();
  };
  handleUndo = () => {
    //Do a undo history that it steps back through, will fix problem
    //simple 1 step undo, disable undo button until another change is made
    console.log("undo");
    this.setState({inputGrid: this.state.previousGrid, posArray: this.state.previousArray});
    console.log(this.state.inputGrid);
    //this.setState({posArray: this.state.previousArray});
    console.log(this.state.posArray);

  };
  handleChange = (event, id) =>{
    event.persist();
    console.log("udate test");
    let newGrid = this.state.inputGrid;
    let posGrid = this.state.posArray;

    //saving previous state for undo
    //this.setState({previousGrid: newGrid, previousArray: posGrid});
    let answer = parseInt(event.target.value, 10);

    posGrid[id].solved = 1;
    newGrid[id].answer = answer;
    console.log(answer);
    posGrid[id].possi.splice(0, posGrid[id].possi.length, [newGrid[id].answer]);
    console.log(posGrid);

    this.setState({previousGrid: this.state.inputGrid, previousArray: this.state.posArray});
    this.setState({posArray: gridFunc.possiReduce(id, posGrid, answer), inputGrid : newGrid});
  }
  rowBuilder =(startId) =>{
    let row = [];
    for(let i = 0; i< 9; i++){
      row.push(<td><input id={startId + i} maxLength="1" onChange = {(e) => {this.handleChange(e, startId + i)}} value ={this.state.inputGrid[startId + i].answer}/></td>)
    };
    return row;
  }
  renderHelper =() =>{
    //let id = 0;
    let hmtlTable = [];
    //for each row
    for(let i = 0; i < 9; i++){
      let startId = i * 9;
      hmtlTable.push(<tr>{this.rowBuilder(startId)}</tr>)
    };

    return hmtlTable;
  }
  render(){
    console.log("render test");
    return (
      <div>
      <form autoComplete="off">
        <table id="inputTable" cellspacing ="0" cellpadding="0">
          <tbody>
          {this.renderHelper()}
          </tbody>
        </table>
        <div>
          <div  id="btns">
          <button type="button" onClick={this.onClick}>Solve!</button>
          <button type="button" onClick={this.debugClick}>debug</button>
          <button type="button" onClick={this.fullSolve}>Full Solve</button>
          <button type="button" onClick={this.handleUndo}>Undo</button>
          </div>
        </div>
      </form>
      </div>
    );

  }

};

export default InputGrid;
