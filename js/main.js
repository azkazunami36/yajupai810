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
            if (star.x < 0) { star.x = this.game.width; star.y = Math.random() * this.game.height; }
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

// ===================== DIFFICULTY PRESETS =====================
const DIFFICULTY = {
    EASY: {
        label: 'EASY', lives: 5, bombs: 5, playerSpeed: 5, shootInterval: 12,
        spawnInterval: 1200, enemiesPerWave: 6, burstMin: 1, burstChance: 0.2, burstMax: 2,
        enemyHPMult: 0.6, enemySpeedMult: 0.7, obstacleInterval: 5000,
        waveBreak: 2000, dropRate: 0.18, bossHPBase: 20, bossHPPerStage: 10,
        scaleFactor: 0.8
    },
    NORMAL: {
        label: 'NORMAL', lives: 3, bombs: 3, playerSpeed: 4, shootInterval: 18,
        spawnInterval: 600, enemiesPerWave: 10, burstMin: 1, burstChance: 0.3, burstMax: 2,
        enemyHPMult: 1.0, enemySpeedMult: 1.0, obstacleInterval: 3000,
        waveBreak: 1200, dropRate: 0.12, bossHPBase: 30, bossHPPerStage: 20,
        scaleFactor: 1.0
    },
    HARD: {
        label: 'HARD', lives: 2, bombs: 2, playerSpeed: 3.5, shootInterval: 22,
        spawnInterval: 400, enemiesPerWave: 14, burstMin: 2, burstChance: 0.4, burstMax: 3,
        enemyHPMult: 1.3, enemySpeedMult: 1.3, obstacleInterval: 2000,
        waveBreak: 800, dropRate: 0.08, bossHPBase: 40, bossHPPerStage: 25,
        scaleFactor: 1.3
    },
    HELL: {
        label: '地獄', lives: 2, bombs: 1, playerSpeed: 3, shootInterval: 25,
        spawnInterval: 300, enemiesPerWave: 18, burstMin: 2, burstChance: 0.5, burstMax: 3,
        enemyHPMult: 1.6, enemySpeedMult: 1.5, obstacleInterval: 1500,
        waveBreak: 600, dropRate: 0.06, bossHPBase: 50, bossHPPerStage: 30,
        scaleFactor: 1.6
    }
};

// ===================== BEAM EFFECT =====================
class BeamEffect {
    constructor(game) {
        this.game = game;
        this.timer = 0;
        this.duration = 40; // frames
        this.active = true;
        this.y = game.player.y + game.player.height / 2;
    }
    update() {
        this.timer++;
        if (this.timer >= this.duration) this.active = false;
    }
    draw(ctx) {
        const progress = this.timer / this.duration;
        const alpha = 1 - progress;
        const beamHeight = 60 * (1 - progress * 0.5);

        // Main beam
        const grad = ctx.createLinearGradient(0, this.y - beamHeight, 0, this.y + beamHeight);
        grad.addColorStop(0, `rgba(0, 255, 255, 0)`);
        grad.addColorStop(0.3, `rgba(0, 255, 255, ${alpha * 0.5})`);
        grad.addColorStop(0.5, `rgba(255, 255, 255, ${alpha})`);
        grad.addColorStop(0.7, `rgba(0, 255, 255, ${alpha * 0.5})`);
        grad.addColorStop(1, `rgba(0, 255, 255, 0)`);

        ctx.fillStyle = grad;
        ctx.fillRect(this.game.player.x + this.game.player.width, this.y - beamHeight, this.game.width, beamHeight * 2);

        // Core line
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.lineWidth = 4 * (1 - progress);
        ctx.beginPath();
        ctx.moveTo(this.game.player.x + this.game.player.width, this.y);
        ctx.lineTo(this.game.width, this.y);
        ctx.stroke();
        ctx.lineWidth = 1;

        // Flash overlay
        if (this.timer < 5) {
            ctx.fillStyle = `rgba(255, 255, 255, ${0.4 * (1 - this.timer / 5)})`;
            ctx.fillRect(0, 0, this.game.width, this.game.height);
        }
    }
}

// ===================== GAME =====================
class Game {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.speed = 2;
        this.input = new InputHandler();
        this.difficulty = DIFFICULTY.NORMAL; // Default
        this.player = new Player(this);
        this.enemies = [];
        this.projectiles = [];
        this.particles = [];
        this.powerUps = [];
        this.obstacles = [];
        this.beamEffects = [];
        this.levelManager = new LevelManager(this);
        this.backgroundLayers = [
            new Layer(this, 0.2, '#222', 30),
            new Layer(this, 0.5, '#555', 40),
            new Layer(this, 1.0, '#aaa', 50)
        ];
        this.score = 0;
        this.lives = this.difficulty.lives;
        this.bombs = this.difficulty.bombs;
        this.gameOver = false;
        this.gameStarted = false;
        this.paused = false;
        this.selectedDifficulty = 1; // 0=EASY, 1=NORMAL, 2=HARD, 3=HELL

        this.ui = {
            score: document.getElementById('score'),
            lives: document.getElementById('lives'),
            bombs: document.getElementById('bombs'),
            weapon: document.getElementById('weapon'),
            fireRate: document.getElementById('fire-rate'),
            stage: document.getElementById('stage'),
            waveInfo: document.getElementById('wave-info'),
            startScreen: document.getElementById('start-screen'),
            gameOverScreen: document.getElementById('game-over-screen'),
            pauseScreen: document.getElementById('pause-screen'),
            finalScore: document.getElementById('final-score'),
            difficultySelector: document.getElementById('difficulty-selector'),
            difficultyOptions: document.querySelectorAll('.diff-option')
        };

        // Difficulty selection
        this.ui.difficultyOptions.forEach((el, idx) => {
            el.addEventListener('click', () => {
                if (this.gameStarted) return;
                this.selectedDifficulty = idx;
                this.ui.difficultyOptions.forEach(o => o.classList.remove('selected'));
                el.classList.add('selected');
            });
        });

        window.addEventListener('keydown', e => {
            if (!this.gameStarted) {
                // Arrow keys to change difficulty on start screen
                if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    this.selectedDifficulty = Math.max(0, this.selectedDifficulty - 1);
                    this.ui.difficultyOptions.forEach(o => o.classList.remove('selected'));
                    this.ui.difficultyOptions[this.selectedDifficulty].classList.add('selected');
                } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    this.selectedDifficulty = Math.min(3, this.selectedDifficulty + 1);
                    this.ui.difficultyOptions.forEach(o => o.classList.remove('selected'));
                    this.ui.difficultyOptions[this.selectedDifficulty].classList.add('selected');
                } else if (e.key === 'Enter' || e.key === ' ') {
                    this.startGame();
                }
            } else if (this.gameOver && e.key.toLowerCase() === 'r') {
                this.restartGame();
            } else if (this.gameStarted && !this.gameOver && (e.key === 'p' || e.key === 'P' || e.key === 'Escape')) {
                this.togglePause();
            } else if (this.gameStarted && !this.gameOver && !this.paused && (e.key === 'b' || e.key === 'B' || e.key === 'x' || e.key === 'X')) {
                this.useBomb();
            }
        });
    }

    applyDifficulty() {
        const keys = Object.keys(DIFFICULTY);
        this.difficulty = DIFFICULTY[keys[this.selectedDifficulty]];
    }

    useBomb() {
        if (this.bombs <= 0) return;
        this.bombs--;
        this.ui.bombs.innerText = 'BOMB: ' + '💣'.repeat(this.bombs);

        // Create beam effect
        this.beamEffects.push(new BeamEffect(this));

        // Kill all non-boss enemies
        this.enemies.forEach(e => {
            if (!(e instanceof Boss)) {
                e.lives = 0;
                // Trigger death effects
            }
        });

        // Clear all enemy projectiles
        this.projectiles = this.projectiles.filter(p => p.isPlayerProjectile);

        // Damage boss if present
        this.enemies.forEach(e => {
            if (e instanceof Boss) {
                e.lives -= 10;
                e.onHit();
            }
        });

        // Lots of explosions
        for (let i = 0; i < 20; i++) {
            const rx = Math.random() * this.width;
            const ry = Math.random() * this.height;
            this.createExplosion(rx, ry, ['#0ff', '#ff0', '#f0f', '#fff'][Math.floor(Math.random() * 4)], 8);
        }

        // Brief invincibility
        this.player.invincible = Math.max(this.player.invincible, 45);
    }

    togglePause() {
        this.paused = !this.paused;
        if (this.paused) {
            this.ui.pauseScreen.classList.remove('hidden');
        } else {
            this.ui.pauseScreen.classList.add('hidden');
            lastTime = performance.now();
            animate(performance.now());
        }
    }

    startGame() {
        this.applyDifficulty();
        this.lives = this.difficulty.lives;
        this.bombs = this.difficulty.bombs;
        this.player = new Player(this);
        this.levelManager = new LevelManager(this);
        this.gameStarted = true;
        this.ui.startScreen.classList.add('hidden');
        this.ui.lives.innerText = 'LIVES: ' + this.lives;
        this.ui.bombs.innerText = 'BOMB: ' + '💣'.repeat(this.bombs);
        lastTime = performance.now();
        animate(performance.now());
    }

    restartGame() {
        this.player = new Player(this);
        this.enemies = [];
        this.projectiles = [];
        this.particles = [];
        this.powerUps = [];
        this.obstacles = [];
        this.beamEffects = [];
        this.levelManager = new LevelManager(this);
        this.score = 0;
        this.lives = this.difficulty.lives;
        this.bombs = this.difficulty.bombs;
        this.gameOver = false;
        this.paused = false;
        this.ui.gameOverScreen.classList.add('hidden');
        this.ui.score.innerText = 'SCORE: 0';
        this.ui.lives.innerText = 'LIVES: ' + this.lives;
        this.ui.bombs.innerText = 'BOMB: ' + '💣'.repeat(this.bombs);
        this.ui.weapon.innerText = 'WEAPON: DEFAULT';
        this.ui.weapon.className = '';
        this.ui.fireRate.innerText = 'RATE: ☆☆☆☆☆';
        this.ui.stage.innerText = 'STAGE 1';
        this.ui.waveInfo.innerText = '';
        lastTime = performance.now();
        animate(performance.now());
    }

    update(deltaTime) {
        if (!this.gameStarted || this.gameOver || this.paused) return;

        // Background
        this.backgroundLayers.forEach(layer => layer.update());

        // Player
        this.player.update();

        // Beam effects
        this.beamEffects.forEach(b => b.update());
        this.beamEffects = this.beamEffects.filter(b => b.active);

        // Projectiles
        this.projectiles.forEach(p => p.update());
        this.projectiles = this.projectiles.filter(p => !p.markedForDeletion);

        // Obstacles
        this.obstacles.forEach(o => o.update());
        this.obstacles = this.obstacles.filter(o => !o.markedForDeletion);
        if (this.player.invincible <= 0) {
            this.obstacles.forEach(o => {
                if (this.checkCollision(this.player, o)) {
                    this.lives--;
                    this.ui.lives.innerText = 'LIVES: ' + this.lives;
                    this.player.invincible = 90;
                    this.createExplosion(this.player.x, this.player.y, '#aaa', 10);
                    if (this.lives <= 0) this.triggerGameOver();
                }
            });
        }
        this.obstacles.forEach(o => {
            this.projectiles.forEach(p => {
                if (p.isPlayerProjectile && this.checkCollision(p, o)) {
                    p.markedForDeletion = true;
                    this.createExplosion(p.x, p.y, '#888', 3);
                }
            });
        });

        // PowerUps
        this.powerUps.forEach(p => p.update());
        this.powerUps = this.powerUps.filter(p => !p.markedForDeletion);
        this.powerUps.forEach(p => {
            if (this.checkCollision(this.player, p)) {
                p.markedForDeletion = true;
                if (p.type === 'LIFE') {
                    this.lives++;
                    this.ui.lives.innerText = 'LIVES: ' + this.lives;
                } else if (p.type === 'RATE') {
                    this.player.fireRateLevel = Math.min(5, this.player.fireRateLevel + 1);
                    this.updateFireRateUI();
                } else if (p.type === 'BOMB') {
                    this.bombs++;
                    this.ui.bombs.innerText = 'BOMB: ' + '💣'.repeat(this.bombs);
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
            if (this.player.invincible <= 0 && this.checkCollision(this.player, e) && !e.markedForDeletion) {
                this.lives--;
                this.ui.lives.innerText = 'LIVES: ' + this.lives;
                this.player.invincible = 90;
                this.createExplosion(this.player.x, this.player.y, '#fff', 10);
                if (this.lives <= 0) this.triggerGameOver();
            }
            this.projectiles.forEach(p => {
                if (this.checkCollision(p, e) && p.isPlayerProjectile && !e.markedForDeletion) {
                    e.lives -= p.damage || 1;
                    e.onHit();
                    if (p.type !== 'LASER') p.markedForDeletion = true;
                    if (e.lives > 0) this.createExplosion(p.x, p.y, '#fff', 3);
                }
            });
        });
        // Enemy projectile-player collision
        if (this.player.invincible <= 0) {
            this.projectiles.forEach(p => {
                if (!p.isPlayerProjectile && this.checkCollision(p, this.player)) {
                    p.markedForDeletion = true;
                    this.lives--;
                    this.ui.lives.innerText = 'LIVES: ' + this.lives;
                    this.player.invincible = 90;
                    this.createExplosion(this.player.x, this.player.y, '#fff', 10);
                    if (this.lives <= 0) this.triggerGameOver();
                }
            });
        }
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
            this.ui.waveInfo.innerText = 'WAVE ' + this.levelManager.wave + '/' + this.levelManager.wavesPerStage + ' CLEAR';
            this.ui.waveInfo.style.color = '#0f0';
        } else {
            this.ui.waveInfo.innerText = 'WAVE ' + (this.levelManager.wave + 1) + '/' + this.levelManager.wavesPerStage;
            this.ui.waveInfo.style.color = '#aaa';
        }

        // Particles
        this.particles.forEach(p => p.update());
        this.particles = this.particles.filter(p => p.life > 0);
    }

    updateFireRateUI() {
        const lvl = this.player.fireRateLevel;
        let stars = '';
        for (let i = 0; i < 5; i++) stars += i < lvl ? '★' : '☆';
        this.ui.fireRate.innerText = 'RATE: ' + stars;
    }

    draw(ctx) {
        this.backgroundLayers.forEach(layer => layer.draw(ctx));
        this.obstacles.forEach(o => o.draw(ctx));
        this.powerUps.forEach(p => p.draw(ctx));
        this.player.draw(ctx);
        this.projectiles.forEach(p => p.draw(ctx));
        this.enemies.forEach(e => e.draw(ctx));
        this.beamEffects.forEach(b => b.draw(ctx));
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
        this.ui.finalScore.innerText = 'Score: ' + this.score + ' | Stage: ' + this.levelManager.stage + ' | ' + this.difficulty.label;
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
    if (game.paused) return;
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
