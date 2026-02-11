class LevelManager {
    constructor(game) {
        this.game = game;
        this.stage = 1;
        this.wave = 0;
        this.wavesPerStage = 5;
        this.spawnTimer = 0;
        this.spawnInterval = 1500; // ms between spawns
        this.enemiesSpawnedThisWave = 0;
        this.enemiesPerWave = 5;
        this.waveBreakTimer = 0;
        this.inWaveBreak = false;
        this.bossActive = false;
        this.bossDefeated = false;
        this.stageTransition = false;
        this.stageTransitionTimer = 0;

        // Enemy type pools per stage difficulty
        this.enemyPools = {
            1: [
                { cls: 'Enemy', weight: 50 },
                { cls: 'SineWaveEnemy', weight: 30 },
                { cls: 'TrackingEnemy', weight: 20 }
            ],
            2: [
                { cls: 'Enemy', weight: 25 },
                { cls: 'SineWaveEnemy', weight: 20 },
                { cls: 'TrackingEnemy', weight: 20 },
                { cls: 'BurstEnemy', weight: 20 },
                { cls: 'ShieldEnemy', weight: 15 }
            ],
            3: [
                { cls: 'SineWaveEnemy', weight: 15 },
                { cls: 'TrackingEnemy', weight: 20 },
                { cls: 'BurstEnemy', weight: 25 },
                { cls: 'ShieldEnemy', weight: 20 },
                { cls: 'SpiralEnemy', weight: 20 }
            ]
        };
    }

    getPool() {
        const maxDefined = Math.max(...Object.keys(this.enemyPools).map(Number));
        const key = Math.min(this.stage, maxDefined);
        return this.enemyPools[key];
    }

    reset() {
        this.stage = 1;
        this.wave = 0;
        this.spawnTimer = 0;
        this.enemiesSpawnedThisWave = 0;
        this.waveBreakTimer = 0;
        this.inWaveBreak = false;
        this.bossActive = false;
        this.bossDefeated = false;
        this.stageTransition = false;
        this.stageTransitionTimer = 0;
        this.spawnInterval = 1500;
        this.enemiesPerWave = 5;
    }

    update(deltaTime) {
        if (this.game.gameOver) return;

        // Stage transition animation
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
            // Scale difficulty
            this.spawnInterval = Math.max(400, 1500 - (this.stage - 1) * 150);
            this.enemiesPerWave = 5 + this.stage * 2;
            this.wavesPerStage = 5 + Math.floor(this.stage / 2);
            return;
        }

        // Boss is active, wait for it to die
        if (this.bossActive) return;

        // Wave break
        if (this.inWaveBreak) {
            this.waveBreakTimer += deltaTime;
            if (this.waveBreakTimer > 2000) {
                this.inWaveBreak = false;
                this.waveBreakTimer = 0;
            }
            return;
        }

        // Check if all waves done -> spawn boss
        if (this.wave >= this.wavesPerStage) {
            this.spawnBoss();
            return;
        }

        // Spawn enemies in current wave
        this.spawnTimer += deltaTime;
        if (this.spawnTimer >= this.spawnInterval) {
            this.spawnTimer = 0;
            this.spawnRandomEnemy();
            this.enemiesSpawnedThisWave++;

            if (this.enemiesSpawnedThisWave >= this.enemiesPerWave) {
                // Wave complete
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
            if (r <= 0) {
                this.createEnemy(entry.cls);
                return;
            }
        }
        // Fallback
        this.createEnemy('Enemy');
    }

    createEnemy(type) {
        let enemy;
        switch (type) {
            case 'SineWaveEnemy': enemy = new SineWaveEnemy(this.game); break;
            case 'TrackingEnemy': enemy = new TrackingEnemy(this.game); break;
            case 'BurstEnemy': enemy = new BurstEnemy(this.game); break;
            case 'ShieldEnemy': enemy = new ShieldEnemy(this.game); break;
            case 'SpiralEnemy': enemy = new SpiralEnemy(this.game); break;
            default: enemy = new Enemy(this.game); break;
        }
        // Scale stats by stage
        enemy.lives = Math.ceil(enemy.lives * (1 + (this.stage - 1) * 0.3));
        enemy.score = Math.ceil(enemy.score * (1 + (this.stage - 1) * 0.5));
        this.game.enemies.push(enemy);
    }

    spawnBoss() {
        if (!this.bossActive) {
            const boss = new Boss(this.game);
            boss.lives = 30 + this.stage * 20;
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
