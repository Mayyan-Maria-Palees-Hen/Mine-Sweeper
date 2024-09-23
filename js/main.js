var MINE = '💣'
const FLAG = '🚩'
var gBoard

// This is an object in which you can keep and update the current game state:
//isOn: Boolean, when true we let the user play
var gGame = {
    isOn: false,
    shownCount: 0, // How many cells are shown
    markedCount: 0, //How many cells are marked (with a flag)
    secsPassed: 0 // How many seconds passed 
}

//This is an object by which the board size is set
// (in this case: 4x4 board and how many mines to place)
var gLevel = { SIZE: 4, MINES: 2, }

// This is called when page loads
function onInit() {
    clearInterval(gTimerInterval)
    var elTimer = document.querySelector('.timer')
    elTimer.innerText = INITIAL_TIMER_TEXT
    
    gBoard = buildBoard(gLevel.SIZE)
    renderMines(gBoard, gLevel.MINES)
    // console.table(gBoard)
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)
}

// Builds the board ✔
// Set the mines ✔
// Call setMinesNegsCount()
// Return the created board

function buildBoard(size) {
    var board = []
    for (var i = 0; i < size; i++) {
        board[i] = []

        for (var j = 0; j < size; j++) {

            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,

            }
            // if (i === 1 && j === 1 || i === 2 && j === 2) {
            //     board[i][j].isMine = true

            // }
        }
    }
    return board
}

function renderBoard(board) {
    // console.table(board)
    // var board = Math.sqrt(gLevel.SIZE)
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '\n<tr>'
        for (var j = 0; j < board[i].length; j++) {
            const classCell = board[i][j]
            var className = ''
            if (classCell.isMarked) {
                className = FLAG
            }
            
            if (classCell.isShown) {

                if (classCell.isMine) {
                    className = MINE
                } else if (classCell.minesAroundCount > 0) {
                    className = classCell.minesAroundCount
                    {
                    }
                }
            }
            strHTML +=
                `\n\t<td onclick="onCellClicked(${i},${j})"
                 oncontextmenu="onCellMarked(event, ${i},${j})">${className}</td>`
        }
        strHTML += '\n</tr>'
    }
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if (!board[i][j].isMine) {
                board[i][j].minesAroundCount = countNeighbors(board, i, j)
            }
        }
    }
    // console.log(board)
}

function countNeighbors(board, row, col) {

    var neighborCount = 0

    for (var i = row - 1; i <= row + 1; i++) {
        if (i < 0 || i >= board.length) continue

        for (var j = col - 1; j <= col + 1; j++) {
            if (i === row && j === col) continue
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            if (currCell.isMine) neighborCount++
        }
    }
    return neighborCount
}

function onCellClicked(i, j) {
    var cell = gBoard[i][j]

    if (cell.isShown) return // if the cell is shown-->hide
    cell.isShown = true //if not shown-->show
    gGame.shownCount++
    // after the board is chanched need to rerender
    if (cell.isMine) gameOver()
    renderBoard(gBoard)
}

function onCellMarked(event, i, j) {
    event.preventDefault()//prevent the default behavior of rigth click
    var elCell = gBoard[i][j]
    if (elCell.isShown) return
    elCell.isMarked = !elCell.isMarked//if you flag turn to not flag
    if (elCell.isMarked) {
        gGame.markedCount++
    } else {
        gGame.markedCount--
    }
    renderBoard(gBoard)
}


function renderMines(board, numOfMines) {
    var countOfMines = 0
    while (countOfMines < numOfMines) {

        var i = getRandomInt(0, board.length)
        var j = getRandomInt(0, board[0].length)
        if (board[i][j].isMine) continue //if there is mine continue
        board[i][j].isMine = true
        countOfMines++
    }


}
function gameOver() {
    console.log('game over!')
}


function onChangeDifficulty(size, mines) {
    gLevel.SIZE = size
    gLevel.MINES = mines
    onInit()
  }
