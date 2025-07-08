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
    
    const checkForWinner = () => { 
        const marker = currentPlayer.getMarker();
        const board = gameBoard.getBoard();
        const dimensions = gameBoard.getDimensions();
        let rowFilled = columnFilled = diagonalFilled = true;
        // check for horizontal wins
        // debugger;
        for (let i = 0; i < dimensions; i++){
            for (let j = 0; j < dimensions; j++){
                const currCell = board[i][j];
                if (currCell.getValue() !== marker)
                {
                    // console.log({currCell: currCell, marker: marker});
                    // console.log(`In column check. Cell marker: ${currCell.getValue()} playerMarker: ${marker}`);
                    columnFilled = false;

                }
                    // columnFilled = false;
            }
        }
        //check for vertical wins
        for (let i = 0; i < dimensions; i++){
            for (let j = 0; j < dimensions; j++){
                const currCell = board[j][i];
                console.log(currCell.getValue());

                if (currCell.getValue() !== marker)
                {

                    // console.log(`In row check. Cell marker: ${currCell.getValue()} playerMarker: ${marker}`);
                    rowFilled = false;
                }
            }
        }

        //diagonal wins
        for (let i = 0; i < dimensions; i++){
            const currCell = board[i][i];
            if (currCell.getValue() !== marker){
                // console.log(`In diagonal check. Cell marker: ${currCell.getValue()} playerMarker: ${marker}`);
                diagonalFilled = false;
            }
        }

        for (let i = dimensions - 1; i >= 0; i--){
            const currCell = board[i][i];
            if (currCell.getValue() !== marker)
            {
                // console.log(`In diagonal. Cell marker: ${currCell.getValue()} playerMarker: ${marker}`);
                diagonalFilled = false;

            }
        }   
        console.log(rowFilled, columnFilled, diagonalFilled);
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
        
        if (checkForWinner())
        {
            gameOver = true;
            console.log(`${playerName} wins!`);
        }
        if (isBoardFull())
        {
            gameOver = true;
            console.log('tie');
        }

        // switchPlayerTurn();
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
    const boardHTML = document.querySelector("#board");
    const reset = document.querySelector("#reset");
    reset.addEventListener("click", (event) => {
        clearScreen();
        render();
    })
    const render = () => {
        for (let i = 0; i < dimensions; i++){
            for (let j = 0; j < dimensions; j++){
                const button = document.createElement('button'); 

                button.textContent = board[i][j].getValue();
                button.dataset.row = i;
                button.dataset.col = j;

                button.addEventListener("click", addMarker);

                boardHTML.append(button);
            }
        }
    }
    const clearScreen = () => {
        boardHTML.innerHTML = '';
    }

    const addMarker = (e) => {
        const divCell = e.target;
        console.log(`${divCell.dataset.row},${divCell.dataset.col}`);
        gameController.playRound(divCell.dataset.row, divCell.dataset.col);
        clearScreen();
        render();
    }
    return {render, clearScreen};   
})();


// while (!gameController.getGameOver()){
//     gameController.playRound(getRndInteger(0, 3), getRndInteger(0, 3));
// }
gameController.playRound(0, 0);
gameController.playRound(1, 0);
gameController.playRound(2, 0);

// gameController.playRound(0, 0);
// gameController.playRound(1, 1);
// gameController.playRound(2, 2);

// gameController.playRound(0, 0);
// gameController.playRound(1, 1);
// gameController.playRound(2, 2);

// gameController.playRound(0, 0);
// gameController.playRound(1, 1);
// gameController.playRound(2, 2);

// displayController.render();


function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}
// gameBoard.printBoard();
// playerOne = createPlayer("William", "X");
// playerOne.name = "bigggg willy";
// console.log(playerOne);
// gameBoard.fillCell(gameController.getActivePlayer().marker);

