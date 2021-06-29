import React from 'react';

class InputGrid extends React.Component {
  state = {inputGrid : this.arrayBuilder('answer'), posArray : this.arrayBuilder(), previousGrid : this.arrayBuilder('answer'), previousArray : this.arrayBuilder()};
  gridBuilder(){
    const gridSize = 9;
    let grid = [];
    var key = 0;

    for(let i = 0; i < gridSize; i++) {
      //above builds columns
      for(let i = 0; i < gridSize; i++){
        //above builds rows
        grid.push(<input key = {key} size = {1} maxLength = {1} defaultValue = {this.state.inputGrid[i].answer}></input>);
        key++;
      }

    }

    return grid;
  };

  compArrayBuilder(type, id, grid){
    //id being the row/col/square ID, 0-8
    //using 81 for grid size for now
    var compArray = [];

    if (type === 'col'){
      for(var i = 0; i < 81; i++){
        if(grid[i].col === id){
          compArray.push(grid[i]);
        }
      }
    }
    if (type === 'row'){
      for(var i = 0; i < 81; i++){
        if(grid[i].row === id){
          compArray.push(grid[i]);
        }
      }
    }
    if (type === 'square'){
      for(var i = 0; i < 81; i++){
        if(grid[i].square === id){
          compArray.push(grid[i]);
        }
      }
    }

    return compArray;
  }
  arrayBuilder(type){
    var posArray = [];
    //builds the structure of the array
    //81 squares in a sudoku grid, 9x9, indexed from top left to bottom right starting from zero
    if(type === 'answer'){
      for(var k = 0; k < 81; k++){
        posArray.push({id: k, row: null,col: null,square: null, answer: ''});
      };
    } else {
      for(var d = 0; d < 81; d++){
        posArray.push({id: d, row: null,col: null,square: null, possi: [1,2,3,4,5,6,7,8,9], solved: 0}) //DEBUG value remove!
      }
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
  numberSolved(id, grid, answer){
    var solved = 0;

    for(var j= 0; j< 81; j++){
      if(grid[j].col == grid[id].col || grid[j].row == grid[id].row || grid[j].square == grid[id].square){
        if(grid[j].answer === answer){
          solved = 1;
        }
      }
    }


    return solved;
  };
  deepPossiReduce(posArray){
    var posGrid = posArray;


    for(var d= 0; d<81; d++){


      var sqArray = this.compArrayBuilder('square', d, posGrid);
      for(var i = 1; i < 10; i++){
        var blocked = 0; //tracks if the possiblites in the square blocks certain answers in rows/cols
        sqArray.forEach(function(sq){
          if(i === 7 && sq.square === 0){
            console.log(sq);
          }
          if(sq.possi.indexOf(i) > -1 && posGrid[d].col !== sq.col && sq.id !== posGrid[d].id){
            blocked = 1;
            console.log("blok test");
          }
        })
        console.log("block test" + d + blocked);
        if(blocked === 0){
          console.log("block 2");
          for(var k = 0; k < 81; k++){
            if(posGrid[d].col === posGrid[k].col && posGrid[d].square !== posGrid[k].square){
              if(posGrid[k].possi.indexOf(i) > -1 && posGrid[k].possi.length > 1){
                //FIX butchering posGrid somehow
                var index = posGrid[k].possi.indexOf(i);
                posGrid[k].possi.splice(index, 1)
              }
            }
          }
        }
      }
    }
    return posGrid;
  };
  //crosses off possible answers based on known values if blocks share a square/col/or row
  possiReduce(id, grid, answer){
    var newGrid = grid;
    for(var j= 0; j< 81; j++){
      if(grid[j].col == grid[id].col || grid[j].row == grid[id].row || grid[j].square == grid[id].square){
        var index = grid[j].possi.indexOf(answer);
        //if the value already exists in this row/col/square it crosses it off the list for this block
        if(index > -1){
          newGrid[j].possi.splice(index, 1);
          }
      }
    }
    return newGrid;
  };
  //function to check if grid is SOLVED FIX/Start Here
  solveCheck = (posGrid) => {
    var grid = posGrid;
    var solved = 1;
    for(var i = 0; i < 81; i++){
      if(grid[i].solved == 0){
        solved = 0;
        break;
      }
    }
    return solved;
  };
  //function to solve grid as much as possible
  fullSolve = () => {
    var posGrid = this.state.posArray;
    var escapeCounter = 0;
    var solved = 0;
    do {
      //check if solved with function
      solved = this.solveCheck(posGrid);
      escapeCounter++;

      this.setState({inputGrid : this.gridSolve(this.state.inputGrid, this.state.posArray)})

    } while(escapeCounter < 20 && solved == 0);

  };
  gridSolve(grid, posState){
    var posGrid = posState;
    var newGrid = grid;

    var gridSize = Object.keys(grid).length;

    console.log('posGrid pre solve');
    console.log(posGrid);
    //do this untill solved or deemed unsolvable

    //filling in known values, replaces the possibility array with an array with just the filled in value
    for(var i= 0; i < gridSize; i++){
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

    for(var j= 0; j< gridSize; j++){
      if(newGrid[j].answer !== ''){
        for(var k = 0; k< gridSize; k++){
          //reduces possibility array elements, comparing blocks in the same row/col/square
          if(newGrid[j].col == newGrid[k].col || newGrid[j].row == newGrid[k].row || newGrid[j].square == newGrid[k].square){
            var index = posGrid[k].possi.indexOf(newGrid[j].answer);
            //if the value already exists in this row/col/square it crosses it off the list for this block
            if(index > -1){
              posGrid[k].possi.splice(index, 1);
              }
          }

        }
      }
        //checks to so see if its the only valid location of a number
        //If the number cant go anywhere else it will set it to that number
        var compArray = this.compArrayBuilder('col',newGrid[j].col,posGrid);
        //checking numbers 1-9

        if(newGrid[j].answer === ''){
          for (var t = 1; t < 10; t++){
          var counter = 0;
          if(this.numberSolved(j, newGrid, t) === 0){
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
          compArray = this.compArrayBuilder('row',newGrid[j].row,posGrid);
          //checking numbers 1-9

          if(newGrid[j].answer === ''){
            for (var t = 1; t < 10; t++){
            var counter = 0;
            if(this.numberSolved(j, newGrid, t) === 0){
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
            compArray = this.compArrayBuilder('square',newGrid[j].square,posGrid);
            //checking numbers 1-9

            if(newGrid[j].answer === ''){
              for (var t = 1; t < 10; t++){
              var counter = 0;
              if(this.numberSolved(j, newGrid, t) === 0){
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
    var newGrid = this.state.inputGrid;
    var posGrid = this.state.posArray;

    //saving previous state for undo
    //this.setState({previousGrid: newGrid, previousArray: posGrid});
    var answer = parseInt(event.target.value, 10);

    posGrid[id].solved = 1;
    newGrid[id].answer = answer;
    console.log(answer);
    posGrid[id].possi.splice(0, posGrid[id].possi.length, [newGrid[id].answer]);
    console.log(posGrid);

    this.setState({previousGrid: this.state.inputGrid, previousArray: this.state.posArray});
    this.setState({posArray: this.possiReduce(id, posGrid, answer), inputGrid : newGrid});
  }
  render(){
    console.log("render test");
    return (
      <div>
      <form autoComplete="off">
        <table id="inputTable" cellspacing ="0" cellpadding="0">
          <tbody>
          <tr>
            <td><input id="0" maxLength="1" onChange = {(e) => {this.handleChange(e, 0)}} value ={this.state.inputGrid[0].answer}/></td>
            <td><input id="1" maxLength="1" onChange = {(e) => {this.handleChange(e, 1)}} value ={this.state.inputGrid[1].answer}/></td>
            <td><input id="2" maxLength="1" onChange = {(e) => {this.handleChange(e, 2)}} value ={this.state.inputGrid[2].answer}/></td>
            <td><input id="3" maxLength="1" onChange = {(e) => {this.handleChange(e, 3)}} value ={this.state.inputGrid[3].answer}/></td>
            <td><input id="4" maxLength="1" onChange = {(e) => {this.handleChange(e, 4)}} value ={this.state.inputGrid[4].answer}/></td>
            <td><input id="5" maxLength="1" onChange = {(e) => {this.handleChange(e, 5)}} value ={this.state.inputGrid[5].answer}/></td>
            <td><input id="6" maxLength="1" onChange = {(e) => {this.handleChange(e, 6)}} value ={this.state.inputGrid[6].answer}/></td>
            <td><input id="7" maxLength="1" onChange = {(e) => {this.handleChange(e, 7)}} value ={this.state.inputGrid[7].answer}/></td>
            <td><input id="8" maxLength="1" onChange = {(e) => {this.handleChange(e, 8)}} value ={this.state.inputGrid[8].answer}/></td>
          </tr>
          <tr>
            <td><input id="9" maxLength="1" onChange = {(e) => {this.handleChange(e, 9)}} value ={this.state.inputGrid[9].answer}/></td>
            <td><input id="10" maxLength="1" onChange = {(e) => {this.handleChange(e, 10)}} value ={this.state.inputGrid[10].answer}/></td>
            <td><input id="11" maxLength="1" onChange = {(e) => {this.handleChange(e, 11)}} value ={this.state.inputGrid[11].answer}/></td>
            <td><input id="12" maxLength="1" onChange = {(e) => {this.handleChange(e, 12)}} value ={this.state.inputGrid[12].answer}/></td>
            <td><input id="13" maxLength="1" onChange = {(e) => {this.handleChange(e, 13)}} value ={this.state.inputGrid[13].answer}/></td>
            <td><input id="14" maxLength="1" onChange = {(e) => {this.handleChange(e, 14)}} value ={this.state.inputGrid[14].answer}/></td>
            <td><input id="15" maxLength="1" onChange = {(e) => {this.handleChange(e, 15)}} value ={this.state.inputGrid[15].answer}/></td>
            <td><input id="16" maxLength="1" onChange = {(e) => {this.handleChange(e, 16)}} value ={this.state.inputGrid[16].answer}/></td>
            <td><input id="17" maxLength="1" onChange = {(e) => {this.handleChange(e, 17)}} value ={this.state.inputGrid[17].answer}/></td>
          </tr><tr>
            <td><input id="18" maxLength="1" onChange = {(e) => {this.handleChange(e, 18)}} value ={this.state.inputGrid[18].answer}/></td>
            <td><input id="19" maxLength="1" onChange = {(e) => {this.handleChange(e, 19)}} value ={this.state.inputGrid[19].answer}/></td>
            <td><input id="20" maxLength="1" onChange = {(e) => {this.handleChange(e, 20)}} value ={this.state.inputGrid[20].answer}/></td>
            <td><input id="21" maxLength="1" onChange = {(e) => {this.handleChange(e, 21)}} value ={this.state.inputGrid[21].answer}/></td>
            <td><input id="22" maxLength="1" onChange = {(e) => {this.handleChange(e, 22)}} value ={this.state.inputGrid[22].answer}/></td>
            <td><input id="23" maxLength="1" onChange = {(e) => {this.handleChange(e, 23)}} value ={this.state.inputGrid[23].answer}/></td>
            <td><input id="24" maxLength="1" onChange = {(e) => {this.handleChange(e, 24)}} value ={this.state.inputGrid[24].answer}/></td>
            <td><input id="25" maxLength="1" onChange = {(e) => {this.handleChange(e, 25)}} value ={this.state.inputGrid[25].answer}/></td>
            <td><input id="26" maxLength="1" onChange = {(e) => {this.handleChange(e, 26)}} value ={this.state.inputGrid[26].answer}/></td>
          </tr><tr>
            <td><input id="27" maxLength="1" onChange = {(e) => {this.handleChange(e, 27)}} value ={this.state.inputGrid[27].answer}/></td>
            <td><input id="28" maxLength="1" onChange = {(e) => {this.handleChange(e, 28)}} value ={this.state.inputGrid[28].answer}/></td>
            <td><input id="29" maxLength="1" onChange = {(e) => {this.handleChange(e, 29)}} value ={this.state.inputGrid[29].answer}/></td>
            <td><input id="30" maxLength="1" onChange = {(e) => {this.handleChange(e, 30)}} value ={this.state.inputGrid[30].answer}/></td>
            <td><input id="31" maxLength="1" onChange = {(e) => {this.handleChange(e, 31)}} value ={this.state.inputGrid[31].answer}/></td>
            <td><input id="32" maxLength="1" onChange = {(e) => {this.handleChange(e, 32)}} value ={this.state.inputGrid[32].answer}/></td>
            <td><input id="33" maxLength="1" onChange = {(e) => {this.handleChange(e, 33)}} value ={this.state.inputGrid[33].answer}/></td>
            <td><input id="34" maxLength="1" onChange = {(e) => {this.handleChange(e, 34)}} value ={this.state.inputGrid[34].answer}/></td>
            <td><input id="35" maxLength="1" onChange = {(e) => {this.handleChange(e, 35)}} value ={this.state.inputGrid[35].answer}/></td>
          </tr><tr>
            <td><input id="36" maxLength="1" onChange = {(e) => {this.handleChange(e, 36)}} value ={this.state.inputGrid[36].answer}/></td>
            <td><input id="37" maxLength="1" onChange = {(e) => {this.handleChange(e, 37)}} value ={this.state.inputGrid[37].answer}/></td>
            <td><input id="38" maxLength="1" onChange = {(e) => {this.handleChange(e, 38)}} value ={this.state.inputGrid[38].answer}/></td>
            <td><input id="39" maxLength="1" onChange = {(e) => {this.handleChange(e, 39)}} value ={this.state.inputGrid[39].answer}/></td>
            <td><input id="40" maxLength="1" onChange = {(e) => {this.handleChange(e, 40)}} value ={this.state.inputGrid[40].answer}/></td>
            <td><input id="41" maxLength="1" onChange = {(e) => {this.handleChange(e, 41)}} value ={this.state.inputGrid[41].answer}/></td>
            <td><input id="42" maxLength="1" onChange = {(e) => {this.handleChange(e, 42)}} value ={this.state.inputGrid[42].answer}/></td>
            <td><input id="43" maxLength="1" onChange = {(e) => {this.handleChange(e, 43)}} value ={this.state.inputGrid[43].answer}/></td>
            <td><input id="44" maxLength="1" onChange = {(e) => {this.handleChange(e, 44)}} value ={this.state.inputGrid[44].answer}/></td>
          </tr><tr>
            <td><input id="45" maxLength="1" onChange = {(e) => {this.handleChange(e, 45)}} value ={this.state.inputGrid[45].answer}/></td>
            <td><input id="46" maxLength="1" onChange = {(e) => {this.handleChange(e, 46)}} value ={this.state.inputGrid[46].answer}/></td>
            <td><input id="47" maxLength="1" onChange = {(e) => {this.handleChange(e, 47)}} value ={this.state.inputGrid[47].answer}/></td>
            <td><input id="48" maxLength="1" onChange = {(e) => {this.handleChange(e, 48)}} value ={this.state.inputGrid[48].answer}/></td>
            <td><input id="49" maxLength="1" onChange = {(e) => {this.handleChange(e, 49)}} value ={this.state.inputGrid[49].answer}/></td>
            <td><input id="50" maxLength="1" onChange = {(e) => {this.handleChange(e, 50)}} value ={this.state.inputGrid[50].answer}/></td>
            <td><input id="51" maxLength="1" onChange = {(e) => {this.handleChange(e, 51)}} value ={this.state.inputGrid[51].answer}/></td>
            <td><input id="52" maxLength="1" onChange = {(e) => {this.handleChange(e, 52)}} value ={this.state.inputGrid[52].answer}/></td>
            <td><input id="53" maxLength="1" onChange = {(e) => {this.handleChange(e, 53)}} value ={this.state.inputGrid[53].answer}/></td>
          </tr><tr>
            <td><input id="54" maxLength="1" onChange = {(e) => {this.handleChange(e, 54)}} value ={this.state.inputGrid[54].answer}/></td>
            <td><input id="55" maxLength="1" onChange = {(e) => {this.handleChange(e, 55)}} value ={this.state.inputGrid[55].answer}/></td>
            <td><input id="56" maxLength="1" onChange = {(e) => {this.handleChange(e, 56)}} value ={this.state.inputGrid[56].answer}/></td>
            <td><input id="57" maxLength="1" onChange = {(e) => {this.handleChange(e, 57)}} value ={this.state.inputGrid[57].answer}/></td>
            <td><input id="58" maxLength="1" onChange = {(e) => {this.handleChange(e, 58)}} value ={this.state.inputGrid[58].answer}/></td>
            <td><input id="59" maxLength="1" onChange = {(e) => {this.handleChange(e, 59)}} value ={this.state.inputGrid[59].answer}/></td>
            <td><input id="60" maxLength="1" onChange = {(e) => {this.handleChange(e, 60)}} value ={this.state.inputGrid[60].answer}/></td>
            <td><input id="61" maxLength="1" onChange = {(e) => {this.handleChange(e, 61)}} value ={this.state.inputGrid[61].answer}/></td>
            <td><input id="62" maxLength="1" onChange = {(e) => {this.handleChange(e, 62)}} value ={this.state.inputGrid[62].answer}/></td>
          </tr><tr>
            <td><input id="63" maxLength="1" onChange = {(e) => {this.handleChange(e, 63)}} value ={this.state.inputGrid[63].answer}/></td>
            <td><input id="64" maxLength="1" onChange = {(e) => {this.handleChange(e, 64)}} value ={this.state.inputGrid[64].answer}/></td>
            <td><input id="65" maxLength="1" onChange = {(e) => {this.handleChange(e, 65)}} value ={this.state.inputGrid[65].answer}/></td>
            <td><input id="66" maxLength="1" onChange = {(e) => {this.handleChange(e, 66)}} value ={this.state.inputGrid[66].answer}/></td>
            <td><input id="67" maxLength="1" onChange = {(e) => {this.handleChange(e, 67)}} value ={this.state.inputGrid[67].answer}/></td>
            <td><input id="68" maxLength="1" onChange = {(e) => {this.handleChange(e, 68)}} value ={this.state.inputGrid[68].answer}/></td>
            <td><input id="69" maxLength="1" onChange = {(e) => {this.handleChange(e, 69)}} value ={this.state.inputGrid[69].answer}/></td>
            <td><input id="70" maxLength="1" onChange = {(e) => {this.handleChange(e, 70)}} value ={this.state.inputGrid[70].answer}/></td>
            <td><input id="71" maxLength="1" onChange = {(e) => {this.handleChange(e, 71)}} value ={this.state.inputGrid[71].answer}/></td>
          </tr><tr>
            <td><input id="72" maxLength="1" onChange = {(e) => {this.handleChange(e, 72)}} value ={this.state.inputGrid[72].answer}/></td>
            <td><input id="73" maxLength="1" onChange = {(e) => {this.handleChange(e, 73)}} value ={this.state.inputGrid[73].answer}/></td>
            <td><input id="74" maxLength="1" onChange = {(e) => {this.handleChange(e, 74)}} value ={this.state.inputGrid[74].answer}/></td>
            <td><input id="75" maxLength="1" onChange = {(e) => {this.handleChange(e, 75)}} value ={this.state.inputGrid[75].answer}/></td>
            <td><input id="76" maxLength="1" onChange = {(e) => {this.handleChange(e, 76)}} value ={this.state.inputGrid[76].answer}/></td>
            <td><input id="77" maxLength="1" onChange = {(e) => {this.handleChange(e, 77)}} value ={this.state.inputGrid[77].answer}/></td>
            <td><input id="78" maxLength="1" onChange = {(e) => {this.handleChange(e, 78)}} value ={this.state.inputGrid[78].answer}/></td>
            <td><input id="79" maxLength="1" onChange = {(e) => {this.handleChange(e, 79)}} value ={this.state.inputGrid[79].answer}/></td>
            <td><input id="80" maxLength="1" onChange = {(e) => {this.handleChange(e, 80)}} value ={this.state.inputGrid[80].answer}/></td>
          </tr>
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
