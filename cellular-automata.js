(function(cellPattern) {
    let board = [];
    let interval;

    const cloneBoard = () => board.map(arr => arr.slice());
    const gridElement = () => document.getElementById("grid");
    const adjacentIndices = index => [index - 1, index, index + 1];
    const rowIndexPair = (row, col) => ({ row, col });

    const rectPattern = (name, height, width, coordinates) => ({ name, height, width, coordinates });
    const squarePattern = (name, size, coordinates) => rectPattern(name, size, size, coordinates);

    const fillCell = function(cell) {
        board[cell[0]][cell[1]] = true;
        gridElement().childNodes[cell[0]].childNodes[cell[1]].classList.add('filled');
    };

    const emptyCell = function(cell) {
        board[cell[0]][cell[1]] = false;
        gridElement().childNodes[cell[0]].childNodes[cell[1]].classList.remove('filled');
    };

    const step = function() {
        // use the previous board state to prevent conflicts in state changes
        const prevBoard = cloneBoard();
        const grid = gridElement();

        board.forEach(function(rowValues, rowIndex) {
            let domRow = grid.childNodes[rowIndex];

            rowValues.forEach(function(colValue, colIndex) {
                let numLiveNeighbors = getLiveNeighbors(rowIndex, colIndex, prevBoard);
                let cell = [rowIndex, colIndex];

                if (numLiveNeighbors < 2 || numLiveNeighbors > 3) {
                    emptyCell(cell);
                } else if (numLiveNeighbors === 3) {
                    fillCell(cell);
                }
            });
        });
    };

    // generate all combinations of adjacent index pairs (row, col)
    const zipIndexPairs = function(row, col) {
        let pairs = [];

        adjacentIndices(row).forEach(function(rowIndex) {
            adjacentIndices(col).forEach(function(colIndex) {
                pairs.push(rowIndexPair(rowIndex, colIndex));
            });
        });

        return pairs;
    };

    // return a list of coordinate pairs
    const getNeighborIndices = function(row, col) {
        return zipIndexPairs(row, col).filter(function(pair) {
            // remove the cell itself as well as any coordinates that are off the board
            return pair.row >= 0 && pair.col >= 0 && pair.row < board.length && pair.col < board[0].length && (pair.row !== row || pair.col !== col);
        });
    };

    const getLiveNeighbors = function(row, col, boardState) {
        return getNeighborIndices(row, col).reduce(function(total, indexPair) {
            return total + (boardState[indexPair.row][indexPair.col] === true);
        }, 0);
    };

    const clearBoard = function() {
        let grid = gridElement();

        while (grid.hasChildNodes()) {
            grid.removeChild(grid.lastChild);
        }

        board = [];
    };

    const initBoard = function(pattern) {
        clearBoard();

        let boardSize = [...Array(pattern.size).keys()];
        let grid = gridElement();

        for (let rowIndex = 0; rowIndex < pattern.height; rowIndex++) {
            board[rowIndex] = [];
            let row = grid.appendChild(document.createElement("tr"));

            for (let colIndex = 0; colIndex < pattern.width; colIndex++) {
                board[rowIndex][colIndex] = false;
                let cell = row.appendChild(document.createElement("td"));
            }
        }

        pattern.coordinates.forEach(fillCell);
    };

    cellPattern.start = function(pattern, stepTime) {
        if (interval) {
            cellPattern.stop();
        }
            
        initBoard(patterns[pattern]);
        interval = setInterval(step, stepTime);
    };

    cellPattern.stop = function() {
        clearInterval(interval);
        interval = null;
    };

    const blinkerCells = [ [1,2], [2,2], [3,2] ];

    const pulsarCells = [ 
        [2,4], [2,5], [2,6], [2,10], [2,11], [2,12],
        [4,2], [4,7], [4,9], [4,14],
        [5,2], [5,7], [5,9], [5,14],
        [6,2], [6,7], [6,9], [6,14],
        [7,4], [7,5], [7,6], [7,10], [7,11], [7,12],
        [9,4], [9,5], [9,6], [9,10], [9,11], [9,12],
        [10,2], [10,7], [10,9], [10,14],
        [11,2], [11,7], [11,9], [11,14],
        [12,2], [12,7], [12,9], [12,14],
        [14,4], [14,5], [14,6], [14,10], [14,11], [14,12]
    ];

    const gliderGunCells = [
        [5,1],[6,1],[5,2],[6,2],[5,11],[6,11],[7,11],[4,12],[8,12],[3,13],[9,13],
        [3,14],[9,14],[6,15],[4,16],[8,16],[5,17],[6,17],[7,17],[6,18],[3,21],[4,21],
        [5,21],[3,22],[4,22],[5,22],[2,23],[6,23],[1,25],[2,25],[6,25],[7,25],[3,35],
        [4,35],[3,36],[4,36],[22,35],[23,35],[25,35],[22,36],[23,36],[25,36],[26,36],
        [27,36],[28,37],[22,38],[23,38],[25,38],[26,38],[27,38],[23,39],[25,39],[23,40],[25,40],[24,41]
    ];

    const patterns = {
        blinker: squarePattern('Blinker', 5, blinkerCells),
        pulsar: squarePattern('Pulsar', 17, pulsarCells),
        gliderGun: rectPattern('Gosper\'s Glider Gun', 32, 45, gliderGunCells)
    };

    document.addEventListener('DOMContentLoaded', function() {
        const patternSelector = document.getElementById('pattern');

        for (let pattern in patterns) {
            let option = document.createElement('option');
            option.setAttribute('value', pattern);
            option.textContent = patterns[pattern].name;

            patternSelector.appendChild(option);
        }
    });
})( window.cells = window.cells || {} );
