const gameBoard = (function(){
    const dimensions = 3;
    const board = [];

    for (let i = 0; i < dimensions; i++) {
        board[i] = [];
        for (let j = 0; j < dimensions; j++) {
            board[i].push(Cell());
        }
    }
    
    const clear = () => {
        board.forEach(row => (row.forEach(cell=> cell.fill(""))));
    };

    const toString = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues);
    };

    const isFull = () => {
        return board.every(row => row.every(cell => !(cell.isEmpty())));
    }
    const getBoard = () => board;
    const getDimensions = () => dimensions;
    return {toString, clear, isFull, getBoard, getDimensions};
})();

// const pubSub = (function(){
//     const publish = (eventName, ...details) => {
//         details.forEach(detail => {
            
//         })
//         const newEvent = newCustomEvent(eventName, details)
//     }
// })();

const gameController = (function(){
    let roundNum = 1;
    let gameOver = false;
    const playerOne = createPlayer("Player 1", "X");
    const playerTwo = createPlayer("Player 2", "O"); 

    let currentPlayer = playerOne;

    const switchPlayerTurn = () => {
        currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
    }
    const getCurrentPlayer = () => currentPlayer;

    const printPlayerTurn = () => {
        console.log(`${currentPlayer.getName()}'s turn`);
    }
    const isGameOver = () => gameOver;

    const toggleGameOver = () => gameOver = !gameOver;
    
    const checkForWinner = () => { 
        const marker = currentPlayer.getMarker();
        const board = gameBoard.getBoard();
        const dimensions = gameBoard.getDimensions();
        // check for horizontal wins
        // debugger;
        for (let i = 0; i < dimensions; i++){
            let rowMarked = true;
            for (let j = 0; j < dimensions; j++){
                if (board[i][j].getValue() !== marker)
                    rowMarked = false;
            }
            if (rowMarked) 
                return true;
        }
        //check for vertical wins
        for (let i = 0; i < dimensions; i++){
            let columnMarked = true;
            for (let j = 0; j < dimensions; j++){
                if (board[j][i].getValue() !== marker)
                    columnMarked = false;
            }
            if (columnMarked)
                return true;
        }

        //diagonal wins
        let diagonalMarked = true;
        for (let i = 0; i < dimensions; i++){
            if (board[i][i].getValue() !== marker)
                diagonalMarked = false;
        }

        if (diagonalMarked)
            return true;

        diagonalMarked = true;
        for (let i = dimensions - 1; i >= 0; i--){
            if (board[i][dimensions-i-1].getValue() !== marker)
                diagonalMarked = false;
        }

        if (diagonalMarked)
            return true;

        return false;
    }

    const resetGame = () => {
        gameBoard.clear();
        currentPlayer = playerOne;
        gameOver = false;
    }

    const placeMarker = (row, col) => {
        
        const board = gameBoard.getBoard();
        const cell = board[row][col];
        const playerMarker = currentPlayer.getMarker();
        const playerName = currentPlayer.getName(); 

        printPlayerTurn(); 

        if (!cell.isEmpty())
        {
            console.log(`cell (${col},${row}) is already occupied!`);
            return;
        }

        console.log(`${playerName} places an ${playerMarker} in (${col},${row})`);
        cell.fill(playerMarker);
        
        if (checkForWinner() || gameBoard.isFull())
            gameOver = true;

        else
            switchPlayerTurn();
        
        gameBoard.toString();
    }

    return {switchPlayerTurn, getCurrentPlayer, printPlayerTurn, placeMarker, isGameOver, toggleGameOver, resetGame};
})();

const displayController = (function(){
    const boardDiv = document.querySelector("#board");
    const reset = document.querySelector("#reset");
    const playerDisplay = document.querySelector("#playerDisplay");

    reset.addEventListener("click", clickHandlerReset);
    boardDiv.addEventListener("click", clickHandlerBoard);

    const board = gameBoard.getBoard();
    const dimensions = gameBoard.getDimensions();

    // playerDisplay.textContent = `${gameController.getCurrentPlayer().getName()}'s turn (${gameController.getCurrentPlayer().getMarker()})`;

    const updateBoard = () => {
        clearBoard();
        renderBoard();
    }

    const renderBoard = () => {
        for (let i = 0; i < dimensions; i++){
            for (let j = 0; j < dimensions; j++){
                const button = document.createElement('button'); 
                const playerMarker = board[i][j].getValue();

                button.textContent = playerMarker;

                button.dataset.row = i;
                button.dataset.col = j;
                button.dataset.marker = playerMarker;

                boardDiv.append(button);
            }
        }
    }
    const clearBoard = () => {
        boardDiv.innerHTML = '';
    }

    const updatePlayerDisplay = () => {
        const currentPlayer = gameController.getCurrentPlayer();
        if (gameController.isGameOver())
        {
            playerDisplay.textContent = gameBoard.isFull() ? "Draw" : `${currentPlayer.getName()} (${currentPlayer.getMarker()}) wins!`;
        }
        else
           playerDisplay.textContent = `${currentPlayer.getName()}'s turn (${currentPlayer.getMarker()})`;

    }

    function clickHandlerBoard(e){
        if(gameController.isGameOver())
            return;

        const button = e.target.closest("button");
        if (!button)
            return;

        gameController.placeMarker(button.dataset.row, button.dataset.col);
        updateBoard();
        updatePlayerDisplay();
     }

     function clickHandlerReset(e){
        gameController.resetGame();    
        updateBoard();
        updatePlayerDisplay();
        // playerDisplay.textContent = `${gameController.getCurrentPlayer().getName()}'s turn (${gameController.getCurrentPlayer().getMarker()})`;
     }

     updatePlayerDisplay();

    return {renderBoard};   
})();


function Cell(){
    let value = "";

    const fill = (marker) => {
        value = marker;
    }

    const isEmpty = () => {
        return value === "";
    }

    const getValue = () => value;

    return {fill, isEmpty, getValue};
}

function createPlayer(name, marker) {
    const getName = () => name;
    const getMarker = () => marker;
    return {getName, getMarker};
}

displayController.renderBoard();