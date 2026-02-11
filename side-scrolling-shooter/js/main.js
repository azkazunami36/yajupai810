class Layer {
    constructor(game, speedModifier, color) {
        this.game = game;
        this.speedModifier = speedModifier;
        this.color = color;
        this.stars = [];
        for (let i = 0; i < 50; i++) {
            this.stars.push({
                x: Math.random() * this.game.width,
                y: Math.random() * this.game.height,
                size: Math.random() * 2
            });
        }
    }

    update() {
        this.stars.forEach(star => {
            star.x -= this.game.speed * this.speedModifier;
            if (star.x < 0) {
                star.x = this.game.width;
                star.y = Math.random() * this.game.height;
            }
        });
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        this.stars.forEach(star => {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
        });
    }
}

class Boss extends Enemy {
    constructor(game) {
        super(game);
        this.width = 200;
        this.height = 200;
        this.y = (game.height - this.height) / 2;
        this.color = '#f00';
        this.lives = 50;
        this.score = 1000;
        this.speedX = -0.5; // Slowly enters
        this.phase = 1;
        this.actionTimer = 0;
    }

    update() {
        if (this.x > this.game.width - this.width - 50) {
            this.x += this.speedX;
        } else {
            // Boss behavior pattern
            this.y += Math.sin(this.game.enemyTimer * 0.05) * 2;
            this.actionTimer++;

            if (this.actionTimer > 60) {
                this.attack();
                this.actionTimer = 0;
            }
        }

        if (this.lives <= 0) {
            this.markedForDeletion = true;
            this.game.score += this.score;
            this.game.triggerVictory();
        }
    }

    attack() {
        // Phase 1: Spread shot
        const startY = this.y + this.height / 2;
        for (let i = -2; i <= 2; i++) {
            const p = new Projectile(this.game, this.x, startY, -5, 'ENEMY', false);
            p.speedY = i;
            this.game.projectiles.push(p);
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Eye
        ctx.fillStyle = '#ff0';
        ctx.fillRect(this.x + 20, this.y + 50, 20, 100);

        // Health Bar
        ctx.fillStyle = '#333';
        ctx.fillRect(this.x + 20, this.y - 20, this.width - 40, 10);
        ctx.fillStyle = '#0f0';
        ctx.fillRect(this.x + 20, this.y - 20, (this.width - 40) * (this.lives / 50), 10);

        ctx.shadowBlur = 0;
    }
}

class Game {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.speed = 2; // Background scroll speed
        this.input = new InputHandler();
        this.player = new Player(this);
        this.enemies = [];
        this.projectiles = [];
        this.particles = [];
        this.powerUps = [];
        this.levelManager = new LevelManager(this); // [NEW] - Initialize here
        this.backgroundLayers = [
            new Layer(this, 0.2, '#333'),
            new Layer(this, 0.5, '#666'),
            new Layer(this, 1.0, '#fff')
        ];
        this.enemyTimer = 0;
        this.enemyInterval = 1000;
        this.score = 0;
        this.lives = 3;
        this.gameOver = false;
        this.gameStarted = false;
        this.gameWon = false; // [NEW]

        this.ui = {
            score: document.getElementById('score'),
            lives: document.getElementById('lives'),
            startScreen: document.getElementById('start-screen'),
            gameOverScreen: document.getElementById('game-over-screen'),
            finalScore: document.getElementById('final-score')
        };

        window.addEventListener('keydown', e => {
            if (!this.gameStarted) {
                this.startGame();
            } else if ((this.gameOver || this.gameWon) && e.key.toLowerCase() === 'r') {
                this.restartGame();
            }
        });
    }

    startGame() {
        this.gameStarted = true;
        this.ui.startScreen.classList.add('hidden');
        this.lastTime = 0;
        animate(0);
    }

    restartGame() {
        this.player = new Player(this);
        this.enemies = [];
        this.projectiles = [];
        this.particles = [];
        this.powerUps = [];
        this.score = 0;
        this.lives = 3;
        this.gameOver = false;
        this.gameWon = false;
        this.ui.gameOverScreen.classList.add('hidden');
        this.ui.score.innerText = 'SCORE: ' + this.score;
        this.ui.lives.innerText = 'LIVES: ' + this.lives;
        this.lastTime = 0;
        animate(0);
    }

    triggerVictory() {
        this.gameWon = true;
        this.gameOver = true; // Stop loop logic kinda
        this.ui.gameOverScreen.querySelector('h1').innerText = "MISSION COMPLETE";
        this.ui.gameOverScreen.classList.remove('hidden');
        this.ui.finalScore.innerText = 'Score: ' + this.score;
    }

    update(deltaTime) {
        if (!this.gameStarted || (this.gameOver && !this.gameWon)) return;

        // Background
        this.backgroundLayers.forEach(layer => layer.update());

        if (this.gameOver) return; // Stop updates if won/lost

        // Player
        this.player.update();

        // Projectiles
        this.projectiles.forEach(p => p.update());
        this.projectiles = this.projectiles.filter(p => !p.markedForDeletion);

        // PowerUps [NEW]
        this.powerUps.forEach(p => p.update());
        this.powerUps = this.powerUps.filter(p => !p.markedForDeletion);
        this.powerUps.forEach(p => {
            if (this.checkCollision(this.player, p)) {
                p.markedForDeletion = true;
                if (p.type === 'LIFE') {
                    this.lives++;
                    this.ui.lives.innerText = 'LIVES: ' + this.lives;
                } else {
                    this.player.weaponType = p.type;
                }
            }
        });

        // Enemies
        this.enemies.forEach(e => {
            e.update();
            if (this.checkCollision(this.player, e)) {
                e.markedForDeletion = true;
                this.lives--;
                this.ui.lives.innerText = 'LIVES: ' + this.lives;
                this.createExplosion(e.x, e.y, e.color);
                if (this.lives <= 0) {
                    this.triggerGameOver();
                }
            }

            this.projectiles.forEach(p => {
                if (this.checkCollision(p, e) && p.isPlayerProjectile) {
                    e.lives -= p.damage || 1; // Use damage from projectile
                    p.markedForDeletion = true;
                    if (p.type === 'LASER') p.markedForDeletion = false; // Laser pierces

                    if (e.lives <= 0) {
                        // Score updated in enemy update when dying
                    } else {
                        // Hit effect
                        this.createExplosion(p.x, p.y, '#fff');
                    }
                }
            });
        });
        this.enemies = this.enemies.filter(e => !e.markedForDeletion);

        // Level Management
        this.levelManager.update(deltaTime);

        // Particles
        this.particles.forEach(p => p.update());
        this.particles = this.particles.filter(p => p.life > 0);
    }

    draw(ctx) {
        // Clear screen with trail effect
        // NOTE: Handled in animate function mostly, but we draw background here
        this.backgroundLayers.forEach(layer => layer.draw(ctx));

        this.powerUps.forEach(p => p.draw(ctx)); // [NEW]
        this.player.draw(ctx);
        this.projectiles.forEach(p => p.draw(ctx));
        this.enemies.forEach(e => e.draw(ctx));
        this.particles.forEach(p => p.draw(ctx));
    }

    checkCollision(rect1, rect2) {
        return (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.height + rect1.y > rect2.y
        );
    }

    addEnemy() {
        const randomize = Math.random();
        let enemy;
        if (randomize < 0.2) {
            enemy = new SineWaveEnemy(this);
        } else if (randomize < 0.4) {
            enemy = new TrackingEnemy(this);
        } else if (randomize < 0.5) {
            enemy = new BurstEnemy(this);
        } else if (randomize < 0.6) {
            enemy = new ShieldEnemy(this);
        } else {
            enemy = new Enemy(this);
        }
        this.enemies.push(enemy);
    }

    createExplosion(x, y, color) {
        for (let i = 0; i < 10; i++) {
            this.particles.push(new Particle(this, x, y, color));
        }
    }

    triggerGameOver() {
        this.gameOver = true;
        this.ui.gameOverScreen.querySelector('h1').innerText = "GAME OVER";
        this.ui.gameOverScreen.classList.remove('hidden');
        this.ui.finalScore.innerText = 'Score: ' + this.score;
    }
}

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const game = new Game(canvas.width, canvas.height);
let lastTime = 0;

function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    // Clear and Redraw
    ctx.fillStyle = '#050510'; // Solid background color to clear previous frame correctly for Parallax
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid effect (Optional retro feel)
    // ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
    // for (let i = 0; i < canvas.width; i += 50) {
    //     ctx.beginPath();
    //     ctx.moveTo(i, 0);
    //     ctx.lineTo(i, canvas.height);
    //     ctx.stroke();
    // }
    // for (let i = 0; i < canvas.height; i += 50) {
    //     ctx.beginPath();
    //     ctx.moveTo(0, i);
    //     ctx.lineTo(canvas.width, i);
    //     ctx.stroke();
    // }

    game.update(deltaTime);
    game.draw(ctx);

    if (!game.gameOver) {
        requestAnimationFrame(animate);
    }
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    game.width = canvas.width;
    game.height = canvas.height;
});
