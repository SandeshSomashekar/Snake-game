/**
 * All init fields
 */
const TIME_INTERVAL = 500
const HEIGHT= 280;
const WIDTH = 480;

const canvas = document.getElementById("canvas");
canvas.height = HEIGHT;
canvas.width = WIDTH;
const ctx = canvas.getContext("2d");
ctx.fillStyle = 'navy';
const grid = Array(HEIGHT/20).fill().map(()=>(Array(WIDTH/20).fill(0)));

const maxRow = grid.length-1;
const maxCol = grid[0].length-1;

//Init from same position always with size 2.
grid[1][3] = 1;
grid[1][4] = 2;
let head = [1,4];
let max = 2;
let currentDirection = 'r';
generateRandomFood();


/**
 * Handle up/down/left/right keypresses.
 */
document.onkeydown = function(e) {
    switch (e.keyCode) {
        case 37:
            currentDirection = 'l'
            break;
        case 38:
            currentDirection = 'u'
            break;
        case 39:
            currentDirection = 'r'
            break;
        case 40:
            currentDirection = 'd'
            break;
    }
};

/**
 * Clear - redraw at every interval.
 * Move method will update the grid object
 * accordingly and drawGrid() will paint the canvas.
 */
setInterval(() => {
    ctx.clearRect(0,0, WIDTH, HEIGHT);
    move(...head);
    drawGrid();
  }, TIME_INTERVAL);

function drawGrid() {
    grid.forEach((row,r) => {
        row.forEach((cell,c) => {
            if(cell){
                ctx.beginPath();
                ctx.fillRect(c*20,r*20, 20,20);
                ctx.stroke(); 
            };
        });
    });
}

/**
 * Generates a new food block away from
 * the current snake's position.
 */
function generateRandomFood() {
    let x,y;
    while(true){
        x = Math.floor(Math.random() * maxRow);
        y = Math.floor(Math.random() * maxCol);
        if(!grid[x][y]) break;
    }
    grid[x][y] = max+1;
}

/**
 * Move the whole snake by one step, recursively.
 */
function move(x,y) {
    if(grid[x][y] === 0) {
        return;
    }

    if(head[0] === x && head[1] === y) {
        //head
        const cur = grid[x][y];
        const [xn, yn] = findNextHead(x,y);
        head = [xn, yn];
        if(grid[xn][yn] > max) {
            max = grid[xn][yn];
            move(xn, yn);
            generateRandomFood();
        } else {
            grid[xn][yn] = cur;
            move(x,y);
        }
    } else {
        //body
        const [xn, yn] = findNextSmall(x,y);
        grid[x][y] = grid[xn][yn];
        move(xn, yn);
    }
}

/**
 * When snake is moving find the next position
 * to which the snake head must move into.
 */
function findNextHead(r,c) {
    switch(currentDirection) {
        case 'd':
            return getBot(r,c);
        case 'r':
            return getRight(r,c)
        case 'l':
            return getLeft(r,c)
        case 'u':
            return getTop(r,c);
    }
}

/**
 * Find the smallest value among the next 4 neighbouring cells.
 */
function findNextSmall(r,c) {
    const val = grid[r][c];
    const fours = [getTop(r,c),getRight(r,c),getBot(r,c),getLeft(r,c)];
    return fours.find((b)=>{
        return grid[b[0]][b[1]] === val-1;
    });
}


function getTop(r,c){
    return [((r-1) < 0) ? maxRow : r-1, c];
}

function getRight(r,c){
    return [r, ((c+1) > maxCol) ? 0 : c+1]
}

function getBot(r,c){
    return [((r+1) > maxRow) ? 0 : r+1, c];
}

function getLeft(r,c){
    return [r, ((c-1) < 0) ? maxCol : c-1];
}