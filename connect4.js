const ROWS = 6;
const COLS = 7;
const PLAYER = 1;
const AI = 2;

let board = [];

function createBoard() {
    let b = [];
    for (let r = 0; r < ROWS; r++) {
        b.push([]);
        for (let c = 0; c < COLS; c++) {
            b[r].push(0);
        }
    }
    return b;
}

function renderBoard(winCells) {
    let boardEl = document.getElementById('board');
    boardEl.innerHTML = '';

    let winSet = new Set();
    if (winCells) {
        winCells.forEach(([r, c]) => winSet.add(r + ',' + c));
    }

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
        let cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.col = c;

        if (board[r][c] === PLAYER) cell.classList.add('player');
        if (board[r][c] === AI) cell.classList.add('ai');
        if (winSet.has(r + ',' + c)) cell.classList.add('win-piece');

        boardEl.appendChild(cell);
        }
    }
}

board = createBoard();
renderBoard();