let main = (function(){
const $board = $('#board');
let ROWS = 0,
    COLS = 0,
    MAX_BOMBS = 0;

function getRows(){
    return ROWS;
}

function setRows(rows){
    ROWS = rows;
}

function getCols(){
    return COLS;
}

function getMaxBombs(){
    return MAX_BOMBS;
}

function createBoard(rows, cols, max_bombs) {
    $board.empty();
    ROWS = rows;
    COLS = cols;
    let count = 0,
        isToLittleBombs = true;
    MAX_BOMBS = +max_bombs;


    for (let i = 0; i < rows; i++) {
        const $row = $('<div>').addClass('row');
        for (let j = 0; j < cols; j++) {
            const $col = $('<div>')
                .addClass('col hidden')
                .attr('data-row', i)
                .attr('data-col', j);
            if (isToLittleBombs) {
                if (Math.random() < 0.2) {
                    $col.addClass('bomb');
                    count++;
                }
                if (validateIfBigger(count, max_bombs)) {
                    isToLittleBombs = false;
                }
            }
            $row.append($col);

        }
        $board.append($row);
    }

}     //createBoard(10, 10);

function validateIfBigger(value1, value2) {
    return (value1 > value2);
}

function restart() {
    createBoard(ROWS, COLS, MAX_BOMBS);
}

function gameOver(isWin) {
    let message = null,
        icon = null;
    if (isWin) {
        message = 'Congratulations! You won! :)';
        icon = 'fa fa-flag';
    } else {
        message = 'I am sorry! You lost! :(';
        icon = 'fa fa-bomb';
    }
    $('.col.bomb').append(
        $('<i>').addClass(icon)
    );
    $('.col:not(.bomb)')
        .html(function () {
            const $cell = $(this),
                count = getBombCount(
                $cell.data('row'),
                $cell.data('col'),
            );
            return count === 0 ? '' : count;
        })
    $('.col.hidden').removeClass('hidden');
    setTimeout(function () {
        alert(message);
        restart();
    }, 1000);
}

function reveal(oi, oj) {
    const seen = {};

    function helper(i, j) {
        if (i >= ROWS || j >= COLS || i < 0 || j < 0) return;
        const key = `${i} ${j}`
        if (seen[key]) return;
        const $cell =
            $(`.col.hidden[data-row=${i}][data-col=${j}]`);
        const bombCount = getBombCount(i, j);
        if (
            !$cell.hasClass('hidden') ||
            $cell.hasClass('bomb') ||
            $cell.hasClass('flag')
        ) {
            return;
        }

        $cell.removeClass('hidden');
        if (bombCount) {
            $cell.text(bombCount);
            return;
        }


        for (let di = -1; di <= 1; di++) {
            for (let dj = -1; dj <= 1; dj++) {
                helper(i + di, j + dj);
            }
        }
    }

    helper(oi, oj);
}

function getBombCount(i, j) {
    let count = 0;
    for (let di = -1; di <= 1; di++) {
        for (let dj = -1; dj <= 1; dj++) {
            const ni = i + di,
                nj = j + dj;
            if (ni >= ROWS || nj >= COLS || ni < 0 || nj < 0) continue;
            const $cell =
                $(`.col.hidden[data-row=${ni}][data-col=${nj}]`);
            if ($cell.hasClass('bomb')) count++;
        }
    }
    return count;
}

$board.on('click', '.col.hidden', function () {
    const $cell = $(this),
        row = $cell.data('row'),
        col = $cell.data('col');  // console.log(row, col);
    if ($cell.hasClass('flag')) {
        return false;
    } else if ($cell.hasClass('bomb')) {
        gameOver(false);
    } else {
        reveal(row, col);
        const isGameOver = $('.col.hidden').length === $('.col.bomb').length
        if (isGameOver) gameOver(true);
    }
}
)

$board.on('contextmenu', '.col.hidden', function () {
    const $cell = $(this),
         row = $cell.data('row'),
         col = $cell.data('col');

    $cell.icon = 'fa fa-flag';
    if (!$cell.hasClass('flag')) {
        // gameOver(false);
        $cell.addClass('flag');

    } else if ($cell.hasClass('flag')) {
        $cell.removeClass('flag');
    }
}
)

restart();

return{
    createBoard: createBoard,
    validateIfBigger: validateIfBigger,
    getCols: getCols,
    getRows: getRows,
    getMaxBombs: getMaxBombs,
    setRows: setRows,
    restart: restart,
    gameOver: gameOver
}
})();

