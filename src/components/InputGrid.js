import React from 'react';

class InputGrid extends React.Component {
  //const gridSize = 9;
  //const grid = [];

  gridBuilder(){
    const gridSize = 9;
    let grid = [];
    for(let i = 0; i < gridSize; i++) {
      //above builds columns

      for(let i = 0; i < gridSize; i++){
        //above builds rows
        grid.push('X ');
      }

      grid.push(<br/>);
    }
    return grid;
  };

  arrayBuilder(){
    var posArray = [];
    //builds the structure of the possiblity array
    //81 squares in a sudoku grid, 9x9
    for(var k = 0; k < 81; k++){
      posArray.push({row: null,col: null,square: null, possi: [1,2,3,4,5,6,7,8,9]})
    }
    //assigns columns
    for(var i = 0; i < 9; i++){
      for(var j = 0; j< 9; j++){
        posArray[i + j*9].col = i;
      }
    }
    //assigns rows
    for(var v = 0; v < 9; v++){
      for(var t = 0; t< 9; t++){
        posArray[v * 9 + t].row = v;
      }
    }
    //assigins each object in the array what big square its in on the sudoku grid
    posArray.forEach(function(square){

      switch(true){
        case square.row <= 2 && square.col <= 2:
          square.square = 0;
          break;
        case (square.col >= 2 && square.col <=5) && (square.row <=2):
          square.square = 1;
          break;
        case (square.col >= 6 && square.col <=8) && (square.row <=2):
          square.square = 2;
          break;
        case square.col<= 2 && (square.row >= 3 && square.row <=5):
          square.square = 3;
          break;
        case (square.col >= 3 && square.col <= 5) && (square.row >= 3 && square.row <= 5):
          square.square = 4;
          break;
        case square.col >= 6 && (square.row >= 3 && square.row <=5):
          square.square = 5;
          break;
        case square.col <= 2 && square.row >= 6:
          square.square = 6;
          break;
        case (square.col >= 3 && square.col <=5) && square.row >= 6:
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
  };

  render(){
    var posArray = this.arrayBuilder(); //debug to test logic
    console.log(posArray);
    const grid = this.gridBuilder();
    return <div>{grid}</div>;
  }

};

export default InputGrid;
