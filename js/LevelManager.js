class LevelManager {
    constructor(game) {
        this.game = game;
        const d = game.difficulty;
        this.stage = 1;
        this.wave = 0;
        this.wavesPerStage = 5;
        this.spawnTimer = 0;
        this.baseSpawnInterval = d.spawnInterval;
        this.spawnInterval = d.spawnInterval;
        this.enemiesSpawnedThisWave = 0;
        this.baseEnemiesPerWave = d.enemiesPerWave;
        this.enemiesPerWave = d.enemiesPerWave;
        this.waveBreakTimer = 0;
        this.waveBreakDuration = d.waveBreak;
        this.inWaveBreak = false;
        this.bossActive = false;
        this.bossDefeated = false;
        this.stageTransition = false;
        this.stageTransitionTimer = 0;
        this.obstacleTimer = 0;
        this.obstacleInterval = d.obstacleInterval;
        this.burstMin = d.burstMin;
        this.burstChance = d.burstChance;
        this.burstMax = d.burstMax;

        this.enemyPools = {
            1: [
                { cls: 'Enemy', weight: 30 },
                { cls: 'SineWaveEnemy', weight: 20 },
                { cls: 'TrackingEnemy', weight: 15 },
                { cls: 'ZigZagEnemy', weight: 20 },
                { cls: 'FormationEnemy', weight: 15 }
            ],
            2: [
                { cls: 'Enemy', weight: 15 },
                { cls: 'SineWaveEnemy', weight: 15 },
                { cls: 'TrackingEnemy', weight: 15 },
                { cls: 'BurstEnemy', weight: 15 },
                { cls: 'ZigZagEnemy', weight: 10 },
                { cls: 'KamikazeEnemy', weight: 15 },
                { cls: 'WallEnemy', weight: 10 },
                { cls: 'FormationEnemy', weight: 5 }
            ],
            3: [
                { cls: 'SineWaveEnemy', weight: 10 },
                { cls: 'TrackingEnemy', weight: 12 },
                { cls: 'BurstEnemy', weight: 15 },
                { cls: 'ShieldEnemy', weight: 12 },
                { cls: 'SpiralEnemy', weight: 15 },
                { cls: 'KamikazeEnemy', weight: 15 },
                { cls: 'ZigZagEnemy', weight: 8 },
                { cls: 'WallEnemy', weight: 8 },
                { cls: 'FormationEnemy', weight: 5 }
            ]
        };
    }

    getPool() {
        const maxDefined = Math.max(...Object.keys(this.enemyPools).map(Number));
        return this.enemyPools[Math.min(this.stage, maxDefined)];
    }

    update(deltaTime) {
        if (this.game.gameOver) return;
        const d = this.game.difficulty;

        // Obstacles
        this.obstacleTimer += deltaTime;
        if (this.obstacleTimer >= this.obstacleInterval) {
            this.obstacleTimer = 0;
            this.game.obstacles.push(new Obstacle(this.game));
        }

        // Stage transition
        if (this.stageTransition) {
            this.stageTransitionTimer += deltaTime;
            if (this.stageTransitionTimer > 3000) {
                this.stageTransition = false;
                this.stageTransitionTimer = 0;
            }
            return;
        }

        // Boss defeated -> next stage
        if (this.bossDefeated) {
            this.bossDefeated = false;
            this.bossActive = false;
            this.stage++;
            this.wave = 0;
            this.enemiesSpawnedThisWave = 0;
            this.stageTransition = true;
            this.stageTransitionTimer = 0;
            const sf = d.scaleFactor;
            this.spawnInterval = Math.max(100, this.baseSpawnInterval - (this.stage - 1) * 30 * sf);
            this.enemiesPerWave = Math.ceil(this.baseEnemiesPerWave + this.stage * 3 * sf);
            this.wavesPerStage = 5 + Math.floor(this.stage * sf);
            this.obstacleInterval = Math.max(500, d.obstacleInterval - (this.stage - 1) * 150 * sf);
            return;
        }

        if (this.bossActive) return;

        // Wave break
        if (this.inWaveBreak) {
            this.waveBreakTimer += deltaTime;
            if (this.waveBreakTimer > this.waveBreakDuration) {
                this.inWaveBreak = false;
                this.waveBreakTimer = 0;
            }
            return;
        }

        // All waves done -> boss
        if (this.wave >= this.wavesPerStage) {
            this.spawnBoss();
            return;
        }

        // Spawn enemies
        this.spawnTimer += deltaTime;
        if (this.spawnTimer >= this.spawnInterval) {
            this.spawnTimer = 0;
            const burst = Math.random() < this.burstChance ? this.burstMax : this.burstMin;
            for (let i = 0; i < burst; i++) {
                this.spawnRandomEnemy();
                this.enemiesSpawnedThisWave++;
            }
            if (this.enemiesSpawnedThisWave >= this.enemiesPerWave) {
                this.wave++;
                this.enemiesSpawnedThisWave = 0;
                this.inWaveBreak = true;
                this.waveBreakTimer = 0;
            }
        }
    }

    spawnRandomEnemy() {
        const pool = this.getPool();
        const totalWeight = pool.reduce((sum, e) => sum + e.weight, 0);
        let r = Math.random() * totalWeight;
        for (const entry of pool) {
            r -= entry.weight;
            if (r <= 0) { this.createEnemy(entry.cls); return; }
        }
        this.createEnemy('Enemy');
    }

    createEnemy(type) {
        const d = this.game.difficulty;
        let enemy;
        switch (type) {
            case 'SineWaveEnemy': enemy = new SineWaveEnemy(this.game); break;
            case 'TrackingEnemy': enemy = new TrackingEnemy(this.game); break;
            case 'BurstEnemy': enemy = new BurstEnemy(this.game); break;
            case 'ShieldEnemy': enemy = new ShieldEnemy(this.game); break;
            case 'SpiralEnemy': enemy = new SpiralEnemy(this.game); break;
            case 'ZigZagEnemy': enemy = new ZigZagEnemy(this.game); break;
            case 'KamikazeEnemy': enemy = new KamikazeEnemy(this.game); break;
            case 'WallEnemy': enemy = new WallEnemy(this.game); break;
            case 'FormationEnemy': {
                const count = 3 + Math.floor(Math.random() * 3);
                const baseY = Math.random() * (this.game.height - count * 45);
                for (let i = 0; i < count; i++) {
                    const fe = new FormationEnemy(this.game, baseY + i * 45);
                    fe.x = this.game.width + i * 30;
                    fe.lives = Math.ceil(fe.lives * d.enemyHPMult * (1 + (this.stage - 1) * 0.3));
                    fe.score = Math.ceil(fe.score * (1 + (this.stage - 1) * 0.5));
                    fe.speedX *= d.enemySpeedMult;
                    this.game.enemies.push(fe);
                }
                return;
            }
            default: enemy = new Enemy(this.game); break;
        }
        enemy.lives = Math.ceil(enemy.lives * d.enemyHPMult * (1 + (this.stage - 1) * 0.3));
        enemy.score = Math.ceil(enemy.score * (1 + (this.stage - 1) * 0.5));
        enemy.speedX *= d.enemySpeedMult;
        this.game.enemies.push(enemy);
    }

    spawnBoss() {
        if (!this.bossActive) {
            const d = this.game.difficulty;
            const boss = new Boss(this.game);
            boss.lives = d.bossHPBase + this.stage * d.bossHPPerStage;
            boss.maxLives = boss.lives;
            boss.score = 500 + this.stage * 500;
            this.game.enemies.push(boss);
            this.bossActive = true;
        }
    }

    onBossDefeated() {
        this.bossDefeated = true;
    }
}
