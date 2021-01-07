var pageLoaded = function() {
  var table = document.getElementById('table');
  table.n = 3;
  table.step = 0
  table.chars = ['X', 'O'];
  table.allIDs = [];
  table.gameActive = true;

  table.isValid = function(id) {
    return document.getElementById(id).innerHTML === ' ';
  }

  table.makeBoard = function() {
    this.board = [];
    this.board.winningStates = [];

    //Create a cell for an NxN board.
    for (var i = 0; i < table.n; i++) {
      var row = [];
      for (var j = 0; j < table.n; j++) {
        row.push(' ');
      }
      this.board.push(row);
    }

    //Find all winning states for that board
    var diagonalOneState = [];
    var diagonalTwoState = [];

    for (var i = 0; i < table.n; i++) {
      var horizontalState = [];
      var verticalState = [];
      diagonalOneState.push('' + i + i);
      diagonalTwoState.push('' + i + (table.n - i - 1));

      for (var j = 0; j < table.n; j++) {
        horizontalState.push('' + i + j);
        verticalState.push('' + j + i);
      }
      this.board.winningStates.push(horizontalState);
      this.board.winningStates.push(verticalState);
    }
    this.board.winningStates.push(diagonalOneState);
    this.board.winningStates.push(diagonalTwoState);

    return this.board;
  }

  table.turn = function() {
    var id = this.id;

    if (!table.isValid(id) || !table.gameActive) {
      return undefined;
    }
    //Place an X or O on the table in the html
    table.setCell(id, table.chars[table.step % 2]);

    //Update the data model of the board
    var row = id[0];
    var column = id[1];
    table.board[row][column] = table.chars[table.step % 2];

    table.step++;

    //Check to see if the game is over. If it isn't, display the next player's turn
    if(!table.gameOver()) {
      table.setCell('status', 'Player ' + table.chars[table.step % 2] + '\'s turn');
    }
  }

  table.makeTableHTML = function() {
    for (var i = 0; i < table.n; i++) {
      //create a new row
      var newRow = document.createElement("tr");

      //Fill rows with cells at position [i][j]
      for (var j = 0; j < table.n; j++) {
        var cell = document.createElement("th");

        // Create a "id" attribute
        var id = document.createAttribute("id");
        id.value = '' + i + j; // Set the id equal to the location of the cell
        cell.setAttributeNode(id);

        // Set the an onClick function
        cell.onclick = table.turn.bind(cell);

        cell.innerHTML = " ";
        newRow.appendChild(cell);

        //Also keep track of all id's in the game, to reset these elements to ' ' on table reset.
        table.allIDs.push('' + i + j);
      }

      //Add row to table
      table.appendChild(newRow)

      //Add the reset button functionality
      document.getElementById('reset').onclick = table.resetBoard;
    }
  }

  table.setCell = function(id, text) {
    var cell = document.getElementById(id);
    cell.innerHTML = text;
  }

  table.getCell = function(id) {
    return document.getElementById(id).innerHTML;
  }

  table.gameOver = function() {
    //Check each possible combination for a winner
    for (var i = 0; i < table.board.winningStates.length; i++) {

      var state = table.board.winningStates[i];
      var xWinner = true;
      var oWinner = true;

      //If any cell in state is not an 'O' or 'X', they aren't the winner
      for (var j = 0; j < state.length; j++) {
        var cellText = table.getCell(state[j]);

        if (cellText !== table.chars[0]) {
          xWinner = false;
        }

        if (cellText !== table.chars[1]) {
          oWinner = false;
        }
      }

      if (xWinner || oWinner) {
        //Declare the winner
        var winner = xWinner ? table.chars[0] : table.chars[1];
        table.setCell('status', 'Player ' + winner + ' wins!');
        table.gameActive = false;

        //Give a point to the winner
        var wins = document.getElementById(table.chars[(table.step + 1) % 2] + 'wins')
        wins.innerHTML++;

        //Display the reset game button
        var reset = document.getElementById('reset');
        reset.style.display = 'block';

        return true;
      }
    }

    return false;
  }

  table.resetBoard = function() {
    //Hide the reset game button
    var reset = document.getElementById('reset');
    reset.style.display = 'none';

    //Reset the game
    for (var i = 0; i < table.allIDs.length; i++) {
      table.setCell(table.allIDs[i], ' ');
    }
    table.gameActive = true;
    table.step = table.step % 2
    table.setCell('status', 'Player ' + table.chars[table.step] + ' goes first');
  }

  //Initialize the table and board.
  board = table.makeBoard();
  table.makeTableHTML(table, table.n);
}

pageLoaded();