const gameBoard = (function(){
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }
    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues);
    };
    const getBoard = () => board;
    const getCell = (row, col) => board[row, col];
    const fillCell = (row, col, marker) => board[row][col].fill(marker);

    return {printBoard, getBoard, getCell, fillCell};
})();

const gameController = (function(){
    let roundNum = 1;
    let gameOver = false;
    const playerOne = createPlayer("Player One", "X");
    const playerTwo = createPlayer("Player Two", "Y"); 

    let currentPlayer = playerOne;

    const switchPlayerTurn = () => {
        currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
    }
    const getCurrentPlayer = () => currentPlayer;

    const printPlayerTurn = () => {
        //print message stating the user's turn
        console.log(`${currentPlayer.getName()}'s turn`);
    }

    const getGameOver = () => gameOver;
    // const toggleGameOver = () => gameOver = gameOver === true? false : true; 
    
    const isGameOver = () => { 
        const marker = currentPlayer.getMarker();
        const board = gameBoard.getBoard();
        const rows = board.length;
        const columns = board[1].length;
        let rowFilled = columnFilled = diagonalFilled = true;
        // check for horizontal wins
        for (let i = 0; i < rows; i++){
            for (let j = 0; j < columns; j++){
                const currCell = board[i][j];
                if (currCell.getValue() !== marker)
                    columnFilled = false;
            }
        }
        //check for vertical wins
        for (let i = 0; i < columns; i++){
            for (let j = 0; j < rows; j++){
                const currCell = board[j][i];
                if (currCell.getValue() !== marker)
                    rowFilled = false;
            }
        }
        //check for diagonal wins
        for (let i = 0; i < rows; i++){
            const currCell = board[i][i];
            if (currCell.getValue() !== marker)
                diagonalFilled = false;
        }
        for (let i = rows - 1; i >= 0; i--){
            const currCell = board[i][i];
            if (currCell.getValue() !== marker)
                diagonalFilled = false;
        }

        return (rowFilled || columnFilled || diagonalFilled);
            
    }
    const isBoardFull = () => { 
        gameBoard.getBoard().every(row => row.every(cell => cell !== ""));
    }

    const playRound = (row, col) => {
        const board = gameBoard.getBoard();
        //who's turn it is 
        //fill the cell given the current players choice of row and column, then fill with their marker
        console.log(`${getCurrentPlayer().getName()} places an ${getCurrentPlayer().getMarker()} in (${col + 1},${row + 1})`);
        gameBoard.fillCell(row, col, currentPlayer.getMarker());
        gameBoard.printBoard();
        //then switch turns and prepare next round
        switchPlayerTurn();
        // console.log(IsGameOver(getCurrentPlayer().getMarker()));
        if (isGameOver(getCurrentPlayer().getMarker()))
        {
            gameBoard.printBoard();
            gameOver = true;
            alert('player wins!');
        }
        if (isBoardFull())
        {
            gameBoard.printBoard();
            gameOver = true;
            alert('tie');
        }
        //check if game over, if not set next round
        //if gameOver()
        printPlayerTurn();  
    }

    return {switchPlayerTurn, getCurrentPlayer, printPlayerTurn, playRound, getGameOver};
})();

function Cell(){
    let value = "";

    const fill = (marker) => {
        value = marker;
    }

    const getValue = () => value;

    return {fill, getValue};
}

function createPlayer(name, marker) {
    const getName = () => name;
    const getMarker = () => marker;
    return {getName, getMarker};
}

gameController.printPlayerTurn();

// gameController.playRound(0, 0);
// gameController.playRound(1, 1);
// // gameController.playRound(1, 2);
// // gameController.playRound(1, 2);
// gameController.playRound(2, 2);



while (!gameController.getGameOver()){
    gameController.playRound(getRndInteger(0, 3), getRndInteger(0, 3));
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}
// gameBoard.printBoard();
// playerOne = createPlayer("William", "X");
// playerOne.name = "bigggg willy";
// console.log(playerOne);
// gameBoard.fillCell(gameController.getActivePlayer().marker);

