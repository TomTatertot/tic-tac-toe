const gameBoard = (function(){
    const dimensions = 3;
    const board = [];

    for (let i = 0; i < dimensions; i++) {
        board[i] = [];
        for (let j = 0; j < dimensions; j++) {
            board[i].push(Cell());
        }
    }
    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues);
    };
    const getBoard = () => board;
    const getDimensions = () => dimensions;
    return {printBoard, getBoard, getDimensions};
})();

const gameController = (function(){
    let roundNum = 1;
    let gameOver = false;
    const playerOne = createPlayer("Player One", "X");
    const playerTwo = createPlayer("Player Two", "O"); 

    let currentPlayer = playerOne;

    const switchPlayerTurn = () => {
        currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
    }
    const getCurrentPlayer = () => currentPlayer;

    const printPlayerTurn = () => {
        console.log(`${currentPlayer.getName()}'s turn`);
    }

    const getGameOver = () => gameOver;
    
    const isGameOver = () => { 
        const marker = currentPlayer.getMarker();
        const board = gameBoard.getBoard();
        const dimensions = board.length;
        let rowFilled = columnFilled = diagonalFilled = true;
        // check for horizontal wins
        for (let i = 0; i < dimensions; i++){
            for (let j = 0; j < dimensions; j++){
                const currCell = board[i][j];
                if (currCell.getValue() !== marker)
                    columnFilled = false;
            }
        }
        //check for vertical wins
        for (let i = 0; i < dimensions; i++){
            for (let j = 0; j < dimensions; j++){
                const currCell = board[j][i];
                if (currCell.getValue() !== marker)
                    rowFilled = false;
            }
        }

        for (let i = 0; i < dimensions; i++){
            const currCell = board[i][i];
            if (currCell.getValue() !== marker)
                diagonalFilled = false;
        }

        for (let i = dimensions - 1; i >= 0; i--){
            const currCell = board[i][i];
            if (currCell.getValue() !== marker)
                diagonalFilled = false;
        }   

        return (rowFilled || columnFilled || diagonalFilled);       
    }

    const isBoardFull = () => { 
        const board = gameBoard.getBoard();
        return board.every(row => row.every(cell => !(cell.isEmpty())));
    }

    const playRound = (row, col) => {
        const board = gameBoard.getBoard();
        const cell = board[row][col];
        const playerMarker = currentPlayer.getMarker();
        const playerName = currentPlayer.getName(); 

        printPlayerTurn(); 

        if (cell.isEmpty())
        {
            console.log(`${playerName} places an ${playerMarker} in (${col + 1},${row + 1})`);
            cell.fill(playerMarker);
        }
        else{
            console.log(`cell (${col + 1},${row + 1}) is already occupied!`);
            return;
        }
        cell.fill(playerMarker);
        switchPlayerTurn();
        if (isGameOver(playerMarker))
        {
            gameOver = true;
            console.log(`${playerName} wins!`);
        }
        if (isBoardFull())
        {
            gameOver = true;
            console.log('tie');
        }

        gameBoard.printBoard();
    }

    return {switchPlayerTurn, getCurrentPlayer, printPlayerTurn, playRound, getGameOver};
})();

function Cell(){
    let value = "";

    const fill = (marker) => {
        value = marker;
    }

    const isEmpty = () => {
        if (value === "")
            return true;
        };

    const getValue = () => value;

    return {fill, isEmpty, getValue};
}

function createPlayer(name, marker) {
    const getName = () => name;
    const getMarker = () => marker;
    return {getName, getMarker};
}

const displayController = (function(){
    //render content of array to the webpage
    const board = gameBoard.getBoard();
    const dimensions = gameBoard.getDimensions();
    const boardContainer = document.querySelector("#board");
    const render = () => {
        board.forEach(row => row.forEach(cell => {
            console.log(cell);
            const button = document.createElement('div'); 
            button.textContent = cell.getValue();
            boardContainer.append(button);
            // console.log(div);
            // console.log(boardContainer);
            // // boardContainer.append(div);
        }))
    }
    return {render};
})();


// while (!gameController.getGameOver()){
//     gameController.playRound(getRndInteger(0, 3), getRndInteger(0, 3));
// }
gameController.playRound(1, 0);
gameController.playRound(1, 1);
gameController.playRound(1, 2);
displayController.render();


function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}
// gameBoard.printBoard();
// playerOne = createPlayer("William", "X");
// playerOne.name = "bigggg willy";
// console.log(playerOne);
// gameBoard.fillCell(gameController.getActivePlayer().marker);

