        const canvas = document.getElementById('gameBoard');
        const ctx = canvas.getContext('2d');
        const scoreElement = document.getElementById('score');
        const gameOverElement = document.getElementById('gameOver');
        const finalScoreElement = document.getElementById('finalScore');

        const CELL_SIZE = 20;
        const BOARD_WIDTH = 29;
        const BOARD_HEIGHT = 31;

        let score = 0;
        let gameRunning = false;
        let powerPelletActive = false;
        let powerPelletTimer = 0;

        // Game board layout (1 = wall, 0 = dot, 2 = empty, 3 = power pellet)
        const board = [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,3,1,1,1,0,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,0,1,1,1,3,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,0,1],
            [1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1],
            [1,1,1,1,1,0,1,1,1,1,1,1,2,1,0,1,2,1,1,1,1,1,1,0,1,1,1,1,1],
            [2,2,2,2,1,0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,0,1,2,2,2,2],
            [1,1,1,1,1,0,1,2,1,1,2,2,2,2,2,2,2,2,2,1,1,2,1,0,1,1,1,1,1],
            [0,0,0,0,0,0,2,2,1,2,2,2,2,2,2,2,2,2,2,2,1,2,2,0,0,0,0,0,0],
            [1,1,1,1,1,0,1,2,1,2,2,2,2,2,2,2,2,2,2,2,1,2,1,0,1,1,1,1,1],
            [2,2,2,2,1,0,1,2,1,1,1,1,1,2,2,2,1,1,1,1,1,2,1,0,1,2,2,2,2],
            [1,1,1,1,1,0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,0,1,1,1,1,1],
            [1,0,0,0,0,0,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,0,0,0,0,0,1],
            [1,0,1,1,1,1,1,2,1,2,2,2,2,2,2,2,2,2,2,2,1,2,1,1,1,1,1,0,1],
            [1,0,0,0,0,0,2,2,1,2,2,2,2,2,2,2,2,2,2,2,1,2,2,0,0,0,0,0,1],
            [1,1,1,1,1,0,1,2,1,2,2,2,2,2,2,2,2,2,2,2,1,2,1,0,1,1,1,1,1],
            [2,2,2,2,1,0,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,0,1,2,2,2,2],
            [1,1,1,1,1,0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,0,1,1,1,1,1],
            [1,0,0,0,0,0,2,2,1,1,1,1,1,0,1,0,1,1,1,1,1,2,2,0,0,0,0,0,1],
            [1,0,1,1,1,0,1,1,1,2,2,2,2,0,1,0,2,2,2,2,1,1,1,0,1,1,1,0,1],
            [1,3,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,3,1],
            [1,1,0,1,0,1,0,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1,0,1,0,1,0,1,1],
            [1,0,0,0,0,1,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,1,0,0,0,0,1],
            [1,0,1,1,1,1,1,1,1,0,1,1,0,1,0,1,0,1,1,0,1,1,1,1,1,1,1,0,1],
            [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
            [1,1,1,0,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,0,1,1,1],
            [1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1],
            [1,0,1,1,1,0,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,0,1,1,1,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ];

        // Game objects
        const pacman = {
            x: 14,
            y: 23,
            direction: 'right',
            nextDirection: 'right'
        };

        const ghosts = [
            { x: 14, y: 11, direction: 'up', color: 'red', homeX: 14, homeY: 11 },
            { x: 13, y: 13, direction: 'left', color: 'pink', homeX: 13, homeY: 13 },
            { x: 14, y: 13, direction: 'up', color: 'cyan', homeX: 14, homeY: 13 },
            { x: 15, y: 13, direction: 'right', color: 'orange', homeX: 15, homeY: 13 }
        ];

        function drawBoard() {
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            for (let y = 0; y < BOARD_HEIGHT; y++) {
                for (let x = 0; x < BOARD_WIDTH; x++) {
                    const cellX = x * CELL_SIZE;
                    const cellY = y * CELL_SIZE;

                    if (board[y][x] === 1) {
                        // Wall
                        ctx.fillStyle = '#00f';
                        ctx.fillRect(cellX, cellY, CELL_SIZE, CELL_SIZE);
                    } else if (board[y][x] === 0) {
                        // Dot
                        ctx.fillStyle = '#ff0';
                        ctx.beginPath();
                        ctx.arc(cellX + CELL_SIZE/2, cellY + CELL_SIZE/2, 2, 0, Math.PI * 2);
                        ctx.fill();
                    } else if (board[y][x] === 3) {
                        // Power pellet
                        ctx.fillStyle = '#ff0';
                        ctx.beginPath();
                        ctx.arc(cellX + CELL_SIZE/2, cellY + CELL_SIZE/2, 6, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            }
        }

        function drawPacman() {
            const x = pacman.x * CELL_SIZE + CELL_SIZE/2;
            const y = pacman.y * CELL_SIZE + CELL_SIZE/2;

            ctx.fillStyle = '#ff0';
            ctx.beginPath();
            
            let startAngle, endAngle;
            switch(pacman.direction) {
                case 'right':
                    startAngle = Math.PI/6;
                    endAngle = -Math.PI/6;
                    break;
                case 'left':
                    startAngle = Math.PI - Math.PI/6;
                    endAngle = Math.PI + Math.PI/6;
                    break;
                case 'up':
                    startAngle = Math.PI - Math.PI/3;
                    endAngle = -Math.PI/3;
                    break;
                case 'down':
                    startAngle = Math.PI/3;
                    endAngle = 2*Math.PI/3;
                    break;
            }

            ctx.arc(x, y, CELL_SIZE/2 - 2, startAngle, endAngle);
            ctx.lineTo(x, y);
            ctx.fill();
        }

        function drawGhosts() {
            ghosts.forEach(ghost => {
                const x = ghost.x * CELL_SIZE;
                const y = ghost.y * CELL_SIZE;

                if (powerPelletActive) {
                    ctx.fillStyle = '#00008b';
                } else {
                    switch(ghost.color) {
                        case 'red': ctx.fillStyle = '#f00'; break;
                        case 'pink': ctx.fillStyle = '#ffc0cb'; break;
                        case 'cyan': ctx.fillStyle = '#0ff'; break;
                        case 'orange': ctx.fillStyle = '#ffa500'; break;
                    }
                }

                // Body
                ctx.fillRect(x + 2, y + 4, CELL_SIZE - 4, CELL_SIZE - 8);
                
                // Round top
                ctx.beginPath();
                ctx.arc(x + CELL_SIZE/2, y + 8, (CELL_SIZE - 4)/2, 0, Math.PI, true);
                ctx.fill();

                // Bottom triangles
                ctx.beginPath();
                ctx.moveTo(x + 2, y + CELL_SIZE - 4);
                for (let i = 0; i < 3; i++) {
                    ctx.lineTo(x + 2 + (i + 0.5) * (CELL_SIZE - 4) / 3, y + CELL_SIZE - 1);
                    ctx.lineTo(x + 2 + (i + 1) * (CELL_SIZE - 4) / 3, y + CELL_SIZE - 4);
                }
                ctx.fill();

                // Eyes
                ctx.fillStyle = '#fff';
                ctx.fillRect(x + 5, y + 6, 3, 4);
                ctx.fillRect(x + 12, y + 6, 3, 4);
                
                ctx.fillStyle = '#000';
                ctx.fillRect(x + 6, y + 7, 1, 2);
                ctx.fillRect(x + 13, y + 7, 1, 2);
            });
        }

        function isValidMove(x, y) {
            if (x < 0 || x >= BOARD_WIDTH || y < 0 || y >= BOARD_HEIGHT) {
                // Tunnel effect for left/right edges
                if (y === 13 && (x === -1 || x === BOARD_WIDTH)) {
                    return true;
                }
                return false;
            }
            return board[y][x] !== 1;
        }

        function movePacman() {
            let newX = pacman.x;
            let newY = pacman.y;

            // Try to change direction if a new direction is queued
            if (pacman.nextDirection !== pacman.direction) {
                let testX = pacman.x;
                let testY = pacman.y;
                
                switch(pacman.nextDirection) {
                    case 'up': testY--; break;
                    case 'down': testY++; break;
                    case 'left': testX--; break;
                    case 'right': testX++; break;
                }

                if (isValidMove(testX, testY)) {
                    pacman.direction = pacman.nextDirection;
                }
            }

            // Move in current direction
            switch(pacman.direction) {
                case 'up': newY--; break;
                case 'down': newY++; break;
                case 'left': newX--; break;
                case 'right': newX++; break;
            }

            // Handle tunnel
            if (newX === -1 && newY === 13) {
                newX = BOARD_WIDTH - 1;
            } else if (newX === BOARD_WIDTH && newY === 13) {
                newX = 0;
            }

            if (isValidMove(newX, newY)) {
                pacman.x = newX;
                pacman.y = newY;

                // Eat dot
                if (board[newY][newX] === 0) {
                    board[newY][newX] = 2;
                    score += 10;
                    scoreElement.textContent = 'Score: ' + score;
                }

                // Eat power pellet
                if (board[newY][newX] === 3) {
                    board[newY][newX] = 2;
                    score += 50;
                    scoreElement.textContent = 'Score: ' + score;
                    powerPelletActive = true;
                    powerPelletTimer = 200; // 10 seconds at 20fps
                }
            }
        }

        function moveGhosts() {
            ghosts.forEach(ghost => {
                const directions = ['up', 'down', 'left', 'right'];
                let validMoves = [];

                directions.forEach(dir => {
                    let testX = ghost.x;
                    let testY = ghost.y;

                    switch(dir) {
                        case 'up': testY--; break;
                        case 'down': testY++; break;
                        case 'left': testX--; break;
                        case 'right': testX++; break;
                    }

                    // Handle tunnel
                    if (testX === -1 && testY === 13) testX = BOARD_WIDTH - 1;
                    else if (testX === BOARD_WIDTH && testY === 13) testX = 0;

                    if (isValidMove(testX, testY)) {
                        validMoves.push({direction: dir, x: testX, y: testY});
                    }
                });

                // Simple AI: choose direction based on distance to Pacman
                if (validMoves.length > 0) {
                    let bestMove = validMoves[0];
                    let bestDistance = powerPelletActive ? -1 : Infinity;

                    validMoves.forEach(move => {
                        const distance = Math.abs(move.x - pacman.x) + Math.abs(move.y - pacman.y);
                        
                        if (powerPelletActive) {
                            // Run away from Pacman
                            if (distance > bestDistance) {
                                bestDistance = distance;
                                bestMove = move;
                            }
                        } else {
                            // Chase Pacman (with some randomness)
                            if (Math.random() < 0.8 && distance < bestDistance) {
                                bestDistance = distance;
                                bestMove = move;
                            }
                        }
                    });

                    ghost.direction = bestMove.direction;
                    ghost.x = bestMove.x;
                    ghost.y = bestMove.y;
                }
            });
        }

        function checkCollisions() {
            ghosts.forEach((ghost, index) => {
                if (ghost.x === pacman.x && ghost.y === pacman.y) {
                    if (powerPelletActive) {
                        // Eat ghost
                        score += 200;
                        scoreElement.textContent = 'Score: ' + score;
                        ghost.x = ghost.homeX;
                        ghost.y = ghost.homeY;
                    } else {
                        // Game over
                        gameOver();
                    }
                }
            });
        }

        function checkWin() {
            for (let y = 0; y < BOARD_HEIGHT; y++) {
                for (let x = 0; x < BOARD_WIDTH; x++) {
                    if (board[y][x] === 0 || board[y][x] === 3) {
                        return false;
                    }
                }
            }
            return true;
        }

        function gameOver() {
            gameRunning = false;
            finalScoreElement.textContent = score;
            gameOverElement.style.display = 'block';
        }

        function gameLoop() {
            if (!gameRunning) return;

            // Update power pellet timer
            if (powerPelletActive) {
                powerPelletTimer--;
                if (powerPelletTimer <= 0) {
                    powerPelletActive = false;
                }
            }

            movePacman();
            moveGhosts();
            checkCollisions();

            if (checkWin()) {
                score += 1000;
                scoreElement.textContent = 'Score: ' + score;
                gameOver();
                return;
            }

            drawBoard();
            drawPacman();
            drawGhosts();

            setTimeout(gameLoop, 150);
        }

        function startGame() {
            gameRunning = true;
            score = 0;
            powerPelletActive = false;
            powerPelletTimer = 0;
            
            // Reset Pacman
            pacman.x = 14;
            pacman.y = 23;
            pacman.direction = 'right';
            pacman.nextDirection = 'right';

            // Reset ghosts
            ghosts.forEach((ghost, index) => {
                ghost.x = ghost.homeX;
                ghost.y = ghost.homeY;
            });

            // Reset board
            for (let y = 0; y < BOARD_HEIGHT; y++) {
                for (let x = 0; x < BOARD_WIDTH; x++) {
                    if (board[y][x] === 2) {
                        board[y][x] = 0; // Restore dots
                    }
                }
            }
            
            // Restore power pellets
            board[2][1] = 3;
            board[2][27] = 3;
            board[21][1] = 3;
            board[21][27] = 3;

            scoreElement.textContent = 'Score: 0';
            gameOverElement.style.display = 'none';
            
            gameLoop();
        }

        // Controls
        document.addEventListener('keydown', (e) => {
            if (!gameRunning) return;

            switch(e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    pacman.nextDirection = 'up';
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    pacman.nextDirection = 'down';
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    pacman.nextDirection = 'left';
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    pacman.nextDirection = 'right';
                    break;
            }
            e.preventDefault();
        });

        // Initial draw
        drawBoard();
        drawPacman();
        drawGhosts();
