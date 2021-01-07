var pageLoaded = function() {
  var table = document.getElementById('table');
  var n = 3;
  var board;
  var step = 0
  var chars = ['X', 'O'];
  var allIDs = [];
  var gameActive = true;

  var turn = function() {
    var id = this.id;

    if (!isValid(id) || !gameActive) {
      return undefined;
    }
    //Place an X or O on the table in the html
    setCell(id, chars[step % 2]);

    //Update the data model of the board
    var row = id[0];
    var column = id[1];
    board[row][column] = chars[step % 2];

    step++;

    //Check to see if the game is over. If it isn't, display the next player's turn
    if(!gameOver()) {
      setCell('status', 'Player ' + chars[step % 2] + '\'s turn');
    }
  }

  var isValid = function(id) {
    return document.getElementById(id).innerHTML === ' ';
  }

  var makeBoard = function() {
    var board = [];
    board.winningStates = [];

    //Create a cell for an NxN board.
    for (var i = 0; i < n; i++) {
      var row = [];
      for (var j = 0; j < n; j++) {
        row.push(' ');
      }
      board.push(row);
    }

    //Find all winning states for that board
    var diagonalOneState = [];
    var diagonalTwoState = [];

    for (var i = 0; i < n; i++) {
      var horizontalState = [];
      var verticalState = [];
      diagonalOneState.push('' + i + i);
      diagonalTwoState.push('' + i + (n - i - 1));

      for (var j = 0; j < n; j++) {
        horizontalState.push('' + i + j);
        verticalState.push('' + j + i);
      }
      board.winningStates.push(horizontalState);
      board.winningStates.push(verticalState);
    }
    board.winningStates.push(diagonalOneState);
    board.winningStates.push(diagonalTwoState);

    return board;
  }

  var makeTableHTML = function() {
    for (var i = 0; i < n; i++) {
      //create a new row
      var newRow = document.createElement("tr");

      //Fill rows with cells at position [i][j]
      for (var j = 0; j < n; j++) {
        var cell = document.createElement("th");

        // Create a "id" attribute
        var id = document.createAttribute("id");
        id.value = '' + i + j; // Set the id equal to the location of the cell
        cell.setAttributeNode(id);

        // Set the an onClick function
        cell.onclick = turn.bind(cell);

        cell.innerHTML = " ";
        newRow.appendChild(cell);

        //Also keep track of all id's in the game, to reset these elements to ' ' on table reset.
        allIDs.push('' + i + j);
      }

      //Add row to table
      table.appendChild(newRow)

      //Add the reset button functionality
      document.getElementById('reset').onclick = resetBoard;
    }
  }

  var setCell = function(id, text) {
    var cell = document.getElementById(id);
    cell.innerHTML = text;
  }

  var getCell = function(id) {
    return document.getElementById(id).innerHTML;
  }

  var gameOver = function() {
    //Check each possible combination for a winner
    for (var i = 0; i < board.winningStates.length; i++) {

      var state = board.winningStates[i];
      var xWinner = true;
      var oWinner = true;

      //If any cell in state is not an 'O' or 'X', they aren't the winner
      for (var j = 0; j < state.length; j++) {
        var cellText = getCell(state[j]);

        if (cellText !== chars[0]) {
          xWinner = false;
        }

        if (cellText !== chars[1]) {
          oWinner = false;
        }
      }

      if (xWinner || oWinner) {
        //Declare the winner
        var winner = xWinner ? chars[0] : chars[1];
        setCell('status', 'Player ' + winner + ' wins!');
        gameActive = false;

        //Display the reset game button
        var reset = document.getElementById('reset');
        reset.style.display = 'block';

        return true;
      }
    }

    return false;
  }

  var resetBoard = function() {
    //Hide the reset game button
    var reset = document.getElementById('reset');
    reset.style.display = 'none';

    //Reset the game
    for (var i = 0; i < allIDs.length; i++) {
      setCell(allIDs[i], ' ');
    }
    setCell('status', 'Player X\'s turn');
    gameActive = true;
    step = 0;
  }

  //Initialize the table and board.
  board = makeBoard();
  makeTableHTML(table, n);
}

pageLoaded();