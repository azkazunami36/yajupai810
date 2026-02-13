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
        this.burstChance = d.burstChance;
        this.burstMax = d.burstMax;

        this.warningShown = false;
        this.bossSpawnTimer = 0;
        this.bossWarningElem = document.getElementById('boss-warning');

        // Mid-wave event system
        this.midEventActive = false;
        this.midEventTimer = 0;
        this.midEventDuration = 0;
        this.midEventType = null;
        this.midEventSpawned = 0;

        // Wave break stragglers
        this.breakStraggleTimer = 0;

        this.enemyPools = {
            1: [
                { cls: 'Enemy', weight: 25 },
                { cls: 'SineWaveEnemy', weight: 15 },
                { cls: 'TrackingEnemy', weight: 12 },
                { cls: 'ZigZagEnemy', weight: 15 },
                { cls: 'FormationEnemy', weight: 13 },
                { cls: 'MirageEnemy', weight: 10 },
                { cls: 'BomberEnemy', weight: 10 }
            ],
            2: [
                { cls: 'Enemy', weight: 10 },
                { cls: 'SineWaveEnemy', weight: 10 },
                { cls: 'TrackingEnemy', weight: 12 },
                { cls: 'BurstEnemy', weight: 12 },
                { cls: 'ZigZagEnemy', weight: 8 },
                { cls: 'KamikazeEnemy', weight: 12 },
                { cls: 'WallEnemy', weight: 8 },
                { cls: 'FormationEnemy', weight: 5 },
                { cls: 'MirageEnemy', weight: 5 },
                { cls: 'BomberEnemy', weight: 5 },
                { cls: 'SniperEnemy', weight: 8 },
                { cls: 'PulsarEnemy', weight: 5 }
            ],
            3: [
                { cls: 'SineWaveEnemy', weight: 8 },
                { cls: 'TrackingEnemy', weight: 8 },
                { cls: 'BurstEnemy', weight: 10 },
                { cls: 'ShieldEnemy', weight: 8 },
                { cls: 'SpiralEnemy', weight: 8 },
                { cls: 'KamikazeEnemy', weight: 10 },
                { cls: 'ZigZagEnemy', weight: 5 },
                { cls: 'WallEnemy', weight: 5 },
                { cls: 'FormationEnemy', weight: 3 },
                { cls: 'SniperEnemy', weight: 8 },
                { cls: 'PulsarEnemy', weight: 8 },
                { cls: 'CloakerEnemy', weight: 10 },
                { cls: 'MiniCarrierEnemy', weight: 7 },
                { cls: 'MirageEnemy', weight: 5 },
                { cls: 'BomberEnemy', weight: 5 }
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

        // Stage transition (shortened to 1.5s)
        if (this.stageTransition) {
            this.stageTransitionTimer += deltaTime;
            if (this.stageTransitionTimer > 1500) {
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
            this.warningShown = false;
            const sf = d.scaleFactor;
            this.spawnInterval = Math.max(100, this.baseSpawnInterval - (this.stage - 1) * 30 * sf);
            this.enemiesPerWave = Math.ceil(this.baseEnemiesPerWave + this.stage * 3 * sf);
            this.wavesPerStage = 5 + Math.floor(this.stage * sf);
            this.obstacleInterval = Math.max(500, d.obstacleInterval - (this.stage - 1) * 150 * sf);
            return;
        }

        if (this.bossActive) return;

        // Mid-wave event processing
        if (this.midEventActive) {
            this.midEventTimer += deltaTime;
            this.updateMidEvent(deltaTime);
            if (this.midEventTimer >= this.midEventDuration) {
                this.midEventActive = false;
                this.midEventType = null;
            }
            return;
        }

        // Wave break — with straggler spawns
        if (this.inWaveBreak) {
            this.waveBreakTimer += deltaTime;
            // Straggler spawns during break (every 800ms, 30% chance)
            this.breakStraggleTimer += deltaTime;
            if (this.breakStraggleTimer >= 800 && Math.random() < 0.3) {
                this.breakStraggleTimer = 0;
                this.spawnRandomEnemy();
            }
            if (this.waveBreakTimer > this.waveBreakDuration) {
                this.inWaveBreak = false;
                this.waveBreakTimer = 0;
                this.breakStraggleTimer = 0;
            }
            return;
        }

        // All waves done -> boss
        if (this.wave >= this.wavesPerStage) {
            if (!this.bossActive && !this.warningShown) {
                this.showBossWarning();
            } else if (!this.bossActive && this.warningShown && this.bossSpawnTimer <= 0) {
                this.spawnBoss();
            } else if (this.warningShown) {
                this.bossSpawnTimer -= deltaTime;
            }
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
                // Trigger mid-wave event (50% chance, not before boss wave)
                if (this.wave < this.wavesPerStage && Math.random() < 0.5) {
                    this.triggerMidEvent();
                } else {
                    this.inWaveBreak = true;
                    this.waveBreakTimer = 0;
                    this.breakStraggleTimer = 0;
                }
            }
        }
    }

    // ===================== MID-WAVE EVENTS =====================
    triggerMidEvent() {
        const events = ['rush', 'powerup_chance', 'squadron', 'elite'];
        this.midEventType = events[Math.floor(Math.random() * events.length)];
        this.midEventActive = true;
        this.midEventTimer = 0;
        this.midEventSpawned = 0;

        switch (this.midEventType) {
            case 'rush':
                this.midEventDuration = 3000; // 3 seconds of fast spawns
                break;
            case 'powerup_chance':
                this.midEventDuration = 2500; // Power-ups rain for 2.5s
                break;
            case 'squadron':
                this.midEventDuration = 1500; // Quick formation spawn
                break;
            case 'elite':
                this.midEventDuration = 1000; // Single elite spawn
                break;
        }

        // Show event label
        if (this.game.addFloatingText) {
            const labels = {
                rush: '⚠ RUSH!',
                powerup_chance: '★ BONUS!',
                squadron: '✦ SQUADRON!',
                elite: '◆ ELITE!'
            };
            this.game.addFloatingText(
                this.game.width / 2, this.game.height / 2 - 30,
                labels[this.midEventType], '#ff0', 28, 60
            );
        }
    }

    updateMidEvent(deltaTime) {
        const d = this.game.difficulty;
        switch (this.midEventType) {
            case 'rush': {
                // Rapid spawn of fast enemies every 300ms
                if (this.midEventTimer - this.midEventSpawned * 300 >= 300) {
                    this.midEventSpawned++;
                    const rushTypes = ['KamikazeEnemy', 'ZigZagEnemy', 'Enemy', 'SineWaveEnemy'];
                    const type = rushTypes[Math.floor(Math.random() * rushTypes.length)];
                    this.createEnemy(type);
                    // Make them faster
                    const last = this.game.enemies[this.game.enemies.length - 1];
                    if (last) last.speedX *= 1.3;
                }
                break;
            }
            case 'powerup_chance': {
                // Drop power-ups every 500ms
                if (this.midEventTimer - this.midEventSpawned * 500 >= 500) {
                    this.midEventSpawned++;
                    const types = ['RATE', 'LIFE', 'BOMB', 'FUNNEL'];
                    const type = types[Math.floor(Math.random() * types.length)];
                    const x = this.game.width + 10;
                    const y = Math.random() * (this.game.height - 60) + 30;
                    this.game.powerUps.push(new PowerUp(this.game, x, y, type));
                }
                break;
            }
            case 'squadron': {
                // Spawn 2 formation groups immediately
                if (this.midEventSpawned === 0) {
                    this.midEventSpawned = 1;
                    for (let g = 0; g < 2; g++) {
                        const count = 3 + Math.floor(Math.random() * 3);
                        const baseY = Math.random() * (this.game.height - count * 45);
                        for (let i = 0; i < count; i++) {
                            const fe = new FormationEnemy(this.game, baseY + i * 45);
                            fe.x = this.game.width + i * 30 + g * 150;
                            fe.lives = Math.ceil(fe.lives * d.enemyHPMult * (1 + (this.stage - 1) * 0.3));
                            fe.score = Math.ceil(fe.score * (1 + (this.stage - 1) * 0.5));
                            fe.speedX *= d.enemySpeedMult;
                            this.game.enemies.push(fe);
                        }
                    }
                }
                break;
            }
            case 'elite': {
                // Spawn a single elite enemy with 2x HP, guaranteed drop, red glow
                if (this.midEventSpawned === 0) {
                    this.midEventSpawned = 1;
                    const eliteTypes = ['ShieldEnemy', 'MiniCarrierEnemy', 'SpiralEnemy', 'BurstEnemy'];
                    const type = eliteTypes[Math.floor(Math.random() * eliteTypes.length)];
                    this.createEnemy(type);
                    const elite = this.game.enemies[this.game.enemies.length - 1];
                    if (elite) {
                        elite.lives *= 2;
                        elite.score *= 3;
                        elite.isElite = true;
                        elite.color = '#f22'; // Red tint for elites
                    }
                }
                break;
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
            case 'MirageEnemy': enemy = new MirageEnemy(this.game); break;
            case 'BomberEnemy': enemy = new BomberEnemy(this.game); break;
            case 'SniperEnemy': enemy = new SniperEnemy(this.game); break;
            case 'PulsarEnemy': enemy = new PulsarEnemy(this.game); break;
            case 'CloakerEnemy': enemy = new CloakerEnemy(this.game); break;
            case 'MiniCarrierEnemy': enemy = new MiniCarrierEnemy(this.game); break;
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
            // Select boss based on stage
            const bossOrder = [Boss, SpeedBoss, FortressBoss, PhantomBoss, StormBoss, HydraBoss, NemesisBoss];
            const idx = Math.min(this.stage - 1, bossOrder.length - 1);
            const BossClass = bossOrder[idx];

            const boss = new BossClass(this.game);
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

    showBossWarning() {
        this.warningShown = true;
        this.bossSpawnTimer = 2000; // Shortened from 3000 to 2000
        if (this.bossWarningElem) {
            this.bossWarningElem.classList.add('active');
            this.game.soundManager.play('se_alert');

            // Hide after 2s
            setTimeout(() => {
                this.bossWarningElem.classList.remove('active');
            }, 2000);
        }
    }
}
