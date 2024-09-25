var MINE = '💣'
const FLAG = '🚩'
const LIFE = '❤'
const HINT = '💡'
const NORMAL = '😀'
const WIN = '🤩'
const LOSE = '😥'
var gBoard

// This is an object in which you can keep and update the current game state:
//isOn: Boolean, when true we let the user play
var gGame = {
    isOn: true,
    isFirstClick: true,
    shownCount: 0, // How many cells are shown
    markedCount: 0, //How many cells are marked (with a flag)
    minesLeft: 0,
    secsPassed: 0, // How many seconds passed 
    lifeCount: 3,
}

//This is an object by which the board size is set
// (in this case: 4x4 board and how many mines to place)
var gLevel = { SIZE: 4, MINES: 2, }

// This is called when page loads
function onInit() {
    var elTimer = document.querySelector('.timer')
    elTimer.innerText = INITIAL_TIMER_TEXT
    gGame.isOn = true
    gGame.isFirstClick = true
    gGame.lifeCount = 3
    gBoard = buildBoard(gLevel.SIZE)
    gGame.minesLeft = gLevel.MINES
    // console.table(gBoard)
    renderMinesLeft()
    renderSmily(NORMAL)
    renderBoard(gBoard)
    renderLife()
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
            var isClicked = classCell.isShown ? 'revealed' : ''
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
                `\n\t<td class="${isClicked}" onclick="onCellClicked(${i},${j})"
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
    if (!gGame.isOn) return

    var cell = gBoard[i][j]

    if (cell.isShown) return // if the cell is shown-->hide
    if (gGame.isFirstClick) {//if first click put mines and count naibors
        startTimer()
        renderMines(gBoard, gLevel.MINES, i, j)
        setMinesNegsCount(gBoard)
        gGame.isFirstClick = false
    }
    cell.isShown = true //if not shown-->show
    gGame.shownCount++
    // after the board is chanched need to rerender
    if (cell.isMine) {
        gGame.lifeCount--
        renderLife()
        if (gGame.lifeCount === 0) {
            revealedMines()
            gameOver(false)//lose
        }
    } else if (gBoard[i][j].minesAroundCount === 0) {
        expandShown(gBoard, i, j)

    }
    renderBoard(gBoard)
    checkGameOver()

}

function onCellMarked(event, i, j) {

    event.preventDefault()//prevent the default behavior of rigth click
    if (!gGame.isOn ) return
    var elCell = gBoard[i][j]
    if (elCell.isShown) return
    elCell.isMarked = !elCell.isMarked//if you flag turn to not flag
    if (elCell.isMarked) {
        gGame.markedCount++
        gGame.minesLeft--//decrising the mineds when flag marked
    } else{
        gGame.markedCount--
        gGame.minesLeft++//if not flag rasing the mines count
    }
    renderMinesLeft()
    renderBoard(gBoard)
    checkGameOver()
}

function expandShown(board, row, col) {
    //if the cells are empty show all cells around
    for (var i = row - 1; i <= row + 1; i++) {
        if (i < 0 || i >= board.length) continue

        for (var j = col - 1; j <= col + 1; j++) {
            if (i === row && j === col) continue
            if (j < 0 || j >= board[0].length) continue

            var currCell = board[i][j]
            if (!currCell.isShown && !currCell.isMarked) {
                currCell.isShown = true
                gGame.shownCount++ //rasing the count of showen cells
                if (currCell.minesAroundCount === 0) {//no cells around me
                    expandShown(gBoard, i, j)
                }
            }
        }
    }
}


function renderMines(board, numOfMines, row, col) {
    var countOfMines = 0
    while (countOfMines < numOfMines) {

        var i = getRandomInt(0, board.length)
        var j = getRandomInt(0, board[0].length)
        if (board[i][j].isMine || (row === i && col === j)) continue //if there is mine  or first clickd cell so dont put a mine
        board[i][j].isMine = true
        countOfMines++
    }
}

function revealedMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].isMine && !gBoard[i][j].isMarked) {
                gBoard[i][j].isShown = true
            }
        }
    }
    renderBoard(gBoard)
}

function renderMinesLeft() {
    const MinesLeft = document.querySelector('.mines-left')
    MinesLeft.innerHTML = `Mines Left: ${gGame.minesLeft}`
}

function checkGameOver() {
    var totalCells = gLevel.SIZE * gLevel.SIZE
    //if all cells are shiwen and life>0 win
    if (gGame.lifeCount > 0 && totalCells === gGame.shownCount) {
        gameOver(true)
    }
    var notMindCells = totalCells - gLevel.MINES
    if (gGame.shownCount === notMindCells
        && gGame.markedCount === gLevel.MINES) {
        gameOver(true)
    }
}


function gameOver(isWin) {
    gGame.isOn = false

    if (!isWin) {
        // revealedMines()
        renderSmily(LOSE)

        console.log('game over!')
    } else {
        renderSmily(WIN)
      
        console.log('you win!')
    }
    clearInterval(gTimerInterval)
}


function onChangeDifficulty(size, mines) {
    gLevel.SIZE = size
    gLevel.MINES = mines
    gGame.minesLeft = mines
    onInit()
    // document.querySelector(".mines-left").innerText = `${gLevel.MINES}`
    document.querySelector(".mines-left").innerText = `${gLevel.MINES}`
    clearInterval(gTimerInterval)
}

function renderLife() {
    const elLife = document.querySelector('.life-left')
    var hearts = "❤".repeat(gGame.lifeCount)
    elLife.innerHTML = `Lives:${hearts}`
}

function renderSmily(smily) {
    const elSmily = document.querySelector('.smily')
    elSmily.innerHTML = smily
}

