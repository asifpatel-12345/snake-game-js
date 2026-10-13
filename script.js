const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("high-score");
const restartBtn = document.getElementById("restartBtn");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let food = { x: 5, y: 5 };
let dx = 0;
let dy = 0;
let score = 0;
let highScore = localStorage.getItem("snakeHighScore") || 0;
let gameInterval;
let isGameOver = false;

highScoreEl.textContent = highScore;

// Listen for keyboard inputs
document.addEventListener("keydown", changeDirection);
restartBtn.addEventListener("click", resetGame);

function startGame() {
    gameInterval = setInterval(main, 100);
    spawnFood();
}

function main() {
    if (isGameOver) return;
    clearCanvas();
    drawFood();
    moveSnake();
    drawSnake();
    checkGameOver();
}

function clearCanvas() {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    snake.forEach((part, index) => {
        ctx.fillStyle = index === 0 ? "#4CAF50" : "#81C784";
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
    });
}

function moveSnake() {
    if (dx === 0 && dy === 0) return;
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreEl.textContent = score;
        if (score > highScore) {
            highScore = score;
            highScoreEl.textContent = highScore;
            localStorage.setItem("snakeHighScore", highScore);
        }
        spawnFood();
    } else {
        snake.pop();
    }
}

function spawnFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
    
    // Ensure food doesn't spawn on snake body
    snake.forEach(part => {
        if (part.x === food.x && part.y === food.y) {
            spawnFood();
        }
    });
}

function drawFood() {
    ctx.fillStyle = "#FF5252";
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

function changeDirection(event) {
    const keyPressed = event.keyCode;
    const LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40;
    const W = 87, A = 65, S = 83, D = 68;

    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;

    if ((keyPressed === LEFT || keyPressed === A) && !goingRight) { dx = -1; dy = 0; }
    if ((keyPressed === UP || keyPressed === W) && !goingDown) { dx = 0; dy = -1; }
    if ((keyPressed === RIGHT || keyPressed === D) && !goingLeft) { dx = 1; dy = 0; }
    if ((keyPressed === DOWN || keyPressed === S) && !goingUp) { dx = 0; dy = 1; }
}

function checkGameOver() {
    const head = snake[0];
    const hitLeftWall = head.x < 0;
    const hitRightWall = head.x >= tileCount;
    const hitToptWall = head.y < 0;
    const hitBottomWall = head.y >= tileCount;

    if (hitLeftWall || hitRightWall || hitToptWall || hitBottomWall) {
        endGame();
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            endGame();
        }
    }
}

function endGame() {
    isGameOver = true;
    clearInterval(gameInterval);
    restartBtn.style.display = "block";
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    dx = 0;
    dy = 0;
    score = 0;
    scoreEl.textContent = score;
    isGameOver = false;
    restartBtn.style.display = "none";
    spawnFood();
    gameInterval = setInterval(main, 100);
}

startGame();