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

function isValidCol(b, col) {
    return b[0][col] === 0;
}

function getOpenRow(b, col) {
    for (let r = ROWS - 1; r >= 0; r--) {
        if (b[r][col] === 0) return r;
    }
    return -1;
}

function placePiece(b, row, col, piece) {
    b[row][col] = piece;
}

function checkWinner(b, piece) {
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS - 3; c++) {
            if (b[r][c] === piece && b[r][c+1] === piece && b[r][c+2] === piece && b[r][c+3] === piece) {
                return [[r,c],[r,c+1],[r,c+2],[r,c+3]];
            }
        }
    }

    for (let r = 0; r < ROWS - 3; r++) {
        for (let c = 0; c < COLS; c++) {
            if (b[r][c] === piece && b[r+1][c] === piece && b[r+2][c] === piece && b[r+3][c] === piece) {
                return [[r,c],[r+1,c],[r+2,c],[r+3,c]];
            }
        }
    }

    for (let r = 0; r < ROWS - 3; r++) {
        for (let c = 0; c < COLS - 3; c++) {
            if (b[r][c] === piece && b[r+1][c+1] === piece && b[r+2][c+2] === piece && b[r+3][c+3] === piece) {
                return [[r,c],[r+1,c+1],[r+2,c+2],[r+3,c+3]];
            }
        }
    }

    for (let r = 3; r < ROWS; r++) {
        for (let c = 0; c < COLS - 3; c++) {
            if (b[r][c] === piece && b[r-1][c+1] === piece && b[r-2][c+2] === piece && b[r-3][c+3] === piece) {
                return [[r,c],[r-1,c+1],[r-2,c+2],[r-3,c+3]];
            }
        }
    }
    return null;
}

function getValidColumns(b) {
    let valid = [];
    for (let c = 0; c < COLS; c++) {
        if (isValidCol(b, c)) valid.push(c);
    }
    return valid;
}

function scoreWindow(window, piece) {
    let score = 0;
    let opp = piece === AI ? PLAYER : AI;

    let pieceCount = window.filter(x => x === piece).length;
    let emptyCount = window.filter(x => x === 0).length;
    let oppCount = window.filter(x => x === opp).length;

    if (pieceCount === 4) {
        score += 100;
    } else if (pieceCount === 3 && emptyCount === 1) {
        score += 5;
    } else if (pieceCount === 2 && emptyCount === 2) {
        score += 2;
    }

    if (oppCount === 3 && emptyCount === 1) {
        score -= 4;
    }

    return score;
}

function scoreBoard(b) {
    let score = 0;

    let centerCol = [];
    for (let r = 0; r < ROWS; r++) {
        centerCol.push(b[r][3]);
    }
    let centerCount = centerCol.filter(x => x === AI).length;
    score += centerCount * 3;

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS - 3; c++) {
            let window = [b[r][c], b[r][c+1], b[r][c+2], b[r][c+3]];
            score += scoreWindow(window, AI);
        }
    }

    for (let c = 0; c < COLS; c++) {
        for (let r = 0; r < ROWS - 3; r++) {
            let window = [b[r][c], b[r+1][c], b[r+2][c], b[r+3][c]];
            score += scoreWindow(window, AI);
        }
    }

    for (let r = 0; r < ROWS - 3; r++) {
        for (let c = 0; c < COLS - 3; c++) {
            let window = [b[r][c], b[r+1][c+1], b[r+2][c+2], b[r+3][c+3]];
            score += scoreWindow(window, AI);
        }
    }

    for (let r = 3; r < ROWS; r++) {
        for (let c = 0; c < COLS - 3; c++) {
            let window = [b[r][c], b[r-1][c+1], b[r-2][c+2], b[r-3][c+3]];
            score += scoreWindow(window, AI);
        }
    }

    return score;
}

function isTerminalNode(b) {
    return checkWinner(b, PLAYER) !== null || checkWinner(b, AI) !== null || getValidColumns(b).length === 0;
}

function minimax(b, depth, maximizing) {
    let validCols = getValidColumns(b);

    if (isTerminalNode(b)) {
        if (checkWinner(b, AI)) return { score: 1000000 };
        if (checkWinner(b, PLAYER)) return { score: -1000000 };
        return { score: 0 }; 
    }

    if (depth === 0) {
        return { score: scoreBoard(b) };
    }

    if (maximizing) {
        let bestScore = -Infinity;
        let bestCol = validCols[0];

    for (let i = 0; i < validCols.length; i++) {
        let col = validCols[i];
        let row = getOpenRow(b, col);

        let boardCopy = b.map(r => [...r]);
        placePiece(boardCopy, row, col, AI);

        let result = minimax(boardCopy, depth - 1, false);

        if (result.score > bestScore) {
            bestScore = result.score;
            bestCol = col;
        }
    }
    return { col: bestCol, score: bestScore };

    } else {
        let bestScore = Infinity;
        let bestCol = validCols[0];

    for (let i = 0; i < validCols.length; i++) {
        let col = validCols[i];
        let row = getOpenRow(b, col);

        let boardCopy = b.map(r => [...r]);
        placePiece(boardCopy, row, col, PLAYER);

        let result = minimax(boardCopy, depth - 1, true);

        if (result.score < bestScore) {
            bestScore = result.score;
            bestCol = col;
        }
    }
        return { col: bestCol, score: bestScore };
    }
}

function handleClick(col) {
    if (!isValidCol(board, col)) return;

    let row = getOpenRow(board, col);
    placePiece(board, row, col, PLAYER);
    renderBoard();

    let win = checkWinner(board, PLAYER);
    if (win) {
        renderBoard(win);
        alert('You win!');
    }
}

document.getElementById('board').addEventListener('click', function(e) {
    let cell = e.target.closest('.cell');
    if (!cell) return;
    handleClick(parseInt(cell.dataset.col));
});

board = createBoard();
renderBoard();