// ===================== PARALLAX LAYER =====================
class Layer {
    constructor(game, speedModifier, color, count) {
        this.game = game;
        this.speedModifier = speedModifier;
        this.color = color;
        this.stars = [];
        for (let i = 0; i < (count || 50); i++) {
            this.stars.push({
                x: Math.random() * this.game.width,
                y: Math.random() * this.game.height,
                size: Math.random() * 2 + 0.5
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

// ===================== GAME =====================
class Game {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.speed = 2;
        this.input = new InputHandler();
        this.player = new Player(this);
        this.enemies = [];
        this.projectiles = [];
        this.particles = [];
        this.powerUps = [];
        this.levelManager = new LevelManager(this);
        this.backgroundLayers = [
            new Layer(this, 0.2, '#222', 30),
            new Layer(this, 0.5, '#555', 40),
            new Layer(this, 1.0, '#aaa', 50)
        ];
        this.score = 0;
        this.lives = 3;
        this.gameOver = false;
        this.gameStarted = false;

        this.ui = {
            score: document.getElementById('score'),
            lives: document.getElementById('lives'),
            weapon: document.getElementById('weapon'),
            stage: document.getElementById('stage'),
            waveInfo: document.getElementById('wave-info'),
            startScreen: document.getElementById('start-screen'),
            gameOverScreen: document.getElementById('game-over-screen'),
            finalScore: document.getElementById('final-score')
        };

        window.addEventListener('keydown', e => {
            if (!this.gameStarted) {
                this.startGame();
            } else if (this.gameOver && e.key.toLowerCase() === 'r') {
                this.restartGame();
            }
        });
    }

    startGame() {
        this.gameStarted = true;
        this.ui.startScreen.classList.add('hidden');
        animate(0);
    }

    restartGame() {
        this.player = new Player(this);
        this.enemies = [];
        this.projectiles = [];
        this.particles = [];
        this.powerUps = [];
        this.levelManager = new LevelManager(this);
        this.score = 0;
        this.lives = 3;
        this.gameOver = false;
        this.ui.gameOverScreen.classList.add('hidden');
        this.ui.score.innerText = 'SCORE: 0';
        this.ui.lives.innerText = 'LIVES: 3';
        this.ui.weapon.innerText = 'WEAPON: DEFAULT';
        this.ui.stage.innerText = 'STAGE 1';
        this.ui.waveInfo.innerText = '';
        animate(0);
    }

    update(deltaTime) {
        if (!this.gameStarted || this.gameOver) return;

        // Background
        this.backgroundLayers.forEach(layer => layer.update());

        // Player
        this.player.update();

        // Projectiles
        this.projectiles.forEach(p => p.update());
        this.projectiles = this.projectiles.filter(p => !p.markedForDeletion);

        // PowerUps
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
                    this.ui.weapon.innerText = 'WEAPON: ' + p.type;
                    this.ui.weapon.className = 'weapon-' + p.type.toLowerCase();
                }
            }
        });

        // Enemies
        this.enemies.forEach(e => {
            e.update();
            // Player-Enemy collision
            if (this.player.invincible <= 0 && this.checkCollision(this.player, e) && !e.markedForDeletion) {
                this.lives--;
                this.ui.lives.innerText = 'LIVES: ' + this.lives;
                this.player.invincible = 90; // 1.5 sec invincibility
                this.createExplosion(this.player.x, this.player.y, '#fff', 10);
                if (this.lives <= 0) {
                    this.triggerGameOver();
                }
            }

            // Projectile-Enemy collision
            this.projectiles.forEach(p => {
                if (this.checkCollision(p, e) && p.isPlayerProjectile && !e.markedForDeletion) {
                    e.lives -= p.damage || 1;
                    e.onHit();
                    if (p.type !== 'LASER') p.markedForDeletion = true;
                    if (e.lives > 0) {
                        this.createExplosion(p.x, p.y, '#fff', 3);
                    }
                }
            });

            // Enemy Projectile-Player collision
            if (this.player.invincible <= 0) {
                this.projectiles.forEach(p => {
                    if (!p.isPlayerProjectile && this.checkCollision(p, this.player)) {
                        p.markedForDeletion = true;
                        this.lives--;
                        this.ui.lives.innerText = 'LIVES: ' + this.lives;
                        this.player.invincible = 90;
                        this.createExplosion(this.player.x, this.player.y, '#fff', 10);
                        if (this.lives <= 0) {
                            this.triggerGameOver();
                        }
                    }
                });
            }
        });
        this.enemies = this.enemies.filter(e => !e.markedForDeletion);

        // Level Management
        this.levelManager.update(deltaTime);

        // UI updates
        this.ui.stage.innerText = 'STAGE ' + this.levelManager.stage;
        if (this.levelManager.bossActive) {
            this.ui.waveInfo.innerText = '⚠ BOSS BATTLE ⚠';
            this.ui.waveInfo.style.color = '#f00';
        } else if (this.levelManager.stageTransition) {
            this.ui.waveInfo.innerText = '★ STAGE ' + this.levelManager.stage + ' ★';
            this.ui.waveInfo.style.color = '#ff0';
        } else if (this.levelManager.inWaveBreak) {
            this.ui.waveInfo.innerText = 'WAVE ' + (this.levelManager.wave) + '/' + this.levelManager.wavesPerStage + ' COMPLETE';
            this.ui.waveInfo.style.color = '#0f0';
        } else {
            this.ui.waveInfo.innerText = 'WAVE ' + (this.levelManager.wave + 1) + '/' + this.levelManager.wavesPerStage;
            this.ui.waveInfo.style.color = '#aaa';
        }

        // Particles
        this.particles.forEach(p => p.update());
        this.particles = this.particles.filter(p => p.life > 0);
    }

    draw(ctx) {
        this.backgroundLayers.forEach(layer => layer.draw(ctx));
        this.powerUps.forEach(p => p.draw(ctx));
        this.player.draw(ctx);
        this.projectiles.forEach(p => p.draw(ctx));
        this.enemies.forEach(e => e.draw(ctx));
        this.particles.forEach(p => p.draw(ctx));
    }

    checkCollision(a, b) {
        return (
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
        );
    }

    createExplosion(x, y, color, count) {
        for (let i = 0; i < (count || 10); i++) {
            this.particles.push(new Particle(this, x, y, color));
        }
    }

    triggerGameOver() {
        this.gameOver = true;
        this.ui.gameOverScreen.querySelector('h1').innerText = 'GAME OVER';
        this.ui.gameOverScreen.classList.remove('hidden');
        this.ui.finalScore.innerText = 'Score: ' + this.score + ' | Stage: ' + this.levelManager.stage;
    }
}

// ===================== INIT =====================
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const game = new Game(canvas.width, canvas.height);
let lastTime = 0;

function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    ctx.fillStyle = '#050510';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

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
