let inputDir = { x: 0, y: 0 };
let speed = 8;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };
// Audio Files
const sounds = {
    music: new Audio('music/music.mp3'),
    food: new Audio('music/food.mp3'),
    gameOver: new Audio('music/gameover.mp3'),
    move: new Audio('music/move.mp3'),
};
// Ensure music loops
sounds.music.loop = true;
sounds.music.volume = 0.5; // Adjust volume
// Debugging audio
sounds.music.addEventListener('canplaythrough', () => {
    console.log('Music is ready to play');
}, false);
sounds.music.addEventListener('error', (e) => {
    console.error('Error loading music:', e);
}, false);
function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) return;
    lastPaintTime = ctime;
    gameEngine();
}
function isCollide(snake) {
    return snake.some((seg, idx) => idx !== 0 && seg.x === snake[0].x && seg.y === snake[0].y) ||
        snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0;
}
function resetGame() {
    sounds.gameOver.play();
    alert("Game Over! Press any key to restart.");
    snakeArr = [{ x: 13, y: 15 }];
    score = 0;
    speed = 5;
    inputDir = { x: 0, y: 0 };
}
function gameEngine() {
    if (isCollide(snakeArr)) return resetGame();

    if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
        sounds.food.play();
        score += 10;
        if (score % 100 === 0) speed += 2;

        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
        food = { x: Math.floor(Math.random() * 16) + 1, y: Math.floor(Math.random() * 16) + 1 };

        // Update high score
        let hiscoreval = localStorage.getItem("hiscore") || 0;
        if (score > hiscoreval) {
            alert("New High Score: " + score);
            localStorage.setItem("hiscore", score);
            hiscoreBox.innerHTML = "HiScore: " + score;
        }
    }
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;
    board.innerHTML = "";
    snakeArr.forEach((e, i) => {
        let snakeElement = document.createElement("div");
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        snakeElement.classList.add(i === 0 ? "head" : "snake");
        board.appendChild(snakeElement);
    });
    let foodElement = document.createElement("div");
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add("food");
    board.appendChild(foodElement);
    // Update score display
    scoreBox.innerHTML = "Score: " + score;
}
// Load High Score
let hiscoreval = localStorage.getItem("hiscore");
// If there is no high score in local storage, set it to 0
if (hiscoreval === null) {
    hiscoreval = 0;
    localStorage.setItem("hiscore", hiscoreval); // Save it to local storage
} else {
    hiscoreval = parseInt(hiscoreval); // Convert to integer if it exists
}
hiscoreBox.innerHTML = "HiScore: " + hiscoreval;
// Start Game
window.requestAnimationFrame(main);
// Play music only after user interaction
window.addEventListener("keydown", () => {
    sounds.music.play();
});
// Keyboard Controls
window.addEventListener("keydown", (e) => {
    sounds.move.play();
    const controls = { ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 }, ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 } };
    if (controls[e.key]) inputDir = controls[e.key];
});
// Mobile Controls
document.querySelectorAll(".control-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        sounds.move.play();
        const directions = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };
        inputDir = directions[btn.dataset.dir];
    });
});