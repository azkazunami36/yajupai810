class Encyclopedia {
    constructor(game) {
        this.game = game;
        this.screen = document.getElementById('encyclopedia-screen');
        this.list = document.getElementById('enemy-list');
        this.previewCanvas = document.getElementById('enemy-preview-canvas');
        this.ctx = this.previewCanvas.getContext('2d');

        this.entries = [
            { id: 'Enemy', cls: Enemy, hp: 2, score: 10 },
            { id: 'SineWaveEnemy', cls: SineWaveEnemy, hp: 3, score: 20 },
            { id: 'TrackingEnemy', cls: TrackingEnemy, hp: 3, score: 30 },
            { id: 'ZigZagEnemy', cls: ZigZagEnemy, hp: 2, score: 15 },
            { id: 'FormationEnemy', cls: FormationEnemy, hp: 1, score: 15 },
            { id: 'BurstEnemy', cls: BurstEnemy, hp: 4, score: 40 },
            { id: 'KamikazeEnemy', cls: KamikazeEnemy, hp: 1, score: 25 },
            { id: 'WallEnemy', cls: WallEnemy, hp: 4, score: 20 },
            { id: 'ShieldEnemy', cls: ShieldEnemy, hp: 8, score: 50 },
            { id: 'SpiralEnemy', cls: SpiralEnemy, hp: 3, score: 45 },
            { id: 'MirageEnemy', cls: MirageEnemy, hp: 2, score: 30 },
            { id: 'BomberEnemy', cls: BomberEnemy, hp: 4, score: 35 },
            { id: 'SniperEnemy', cls: SniperEnemy, hp: 2, score: 40 },
            { id: 'PulsarEnemy', cls: PulsarEnemy, hp: 3, score: 35 },
            { id: 'CloakerEnemy', cls: CloakerEnemy, hp: 2, score: 45 },
            { id: 'MiniCarrierEnemy', cls: MiniCarrierEnemy, hp: 6, score: 50 },
            { id: 'Boss', cls: Boss, hp: 50, score: 1000 },
            { id: 'SpeedBoss', cls: SpeedBoss, hp: 40, score: 1500 },
            { id: 'FortressBoss', cls: FortressBoss, hp: 60, score: 2000 },
            { id: 'PhantomBoss', cls: PhantomBoss, hp: 50, score: 2500 },
            { id: 'StormBoss', cls: StormBoss, hp: 55, score: 3000 },
            { id: 'HydraBoss', cls: HydraBoss, hp: 60, score: 3500 },
            { id: 'NemesisBoss', cls: NemesisBoss, hp: 70, score: 4000 }
        ];

        this.selectedId = null;
        this.dummyEnemy = null;
        this.dummyGame = null;
        this.animationFrame = null;

        this.setupUI();
    }

    setupUI() {
        document.getElementById('btn-encyclopedia').addEventListener('click', () => this.open());
        document.getElementById('btn-encyclopedia-back').addEventListener('click', () => this.close());
    }

    open() {
        this.screen.classList.remove('hidden');
        this.game.ui.startScreen.classList.add('hidden');
        this.populateList();
        // Select first by default if nothing selected
        if (!this.selectedId && this.entries.length > 0) {
            this.select(this.entries[0].id);
        } else if (this.selectedId) {
            this.select(this.selectedId); // Refresh text
        }
        this.startPreviewLoop();
    }

    close() {
        this.screen.classList.add('hidden');
        this.game.ui.startScreen.classList.remove('hidden');
        this.stopPreviewLoop();
    }

    populateList() {
        this.list.innerHTML = '';
        this.entries.forEach(entry => {
            const li = document.createElement('li');
            li.className = 'enemy-list-item';
            li.innerText = this.game.settings.getText('name_' + entry.id);
            li.dataset.id = entry.id;
            li.onclick = () => this.select(entry.id);
            if (this.selectedId === entry.id) li.classList.add('selected');
            this.list.appendChild(li);
        });
    }

    select(id) {
        this.selectedId = id;

        // Update list UI
        Array.from(this.list.children).forEach(li => {
            if (li.dataset.id === id) li.classList.add('selected');
            else li.classList.remove('selected');
        });

        // Update Details
        const entry = this.entries.find(e => e.id === id);
        if (!entry) return;

        document.getElementById('enemy-name').innerText = this.game.settings.getText('name_' + entry.id);
        document.getElementById('enemy-desc').innerText = this.game.settings.getText('desc_' + entry.id);

        let hpText = typeof entry.hp === 'number' ? entry.hp : '?';
        const bossIds = ['Boss', 'SpeedBoss', 'FortressBoss', 'PhantomBoss', 'StormBoss', 'HydraBoss', 'NemesisBoss'];
        if (bossIds.includes(entry.id)) hpText = entry.hp + '+'; // Boss HP scales
        document.getElementById('enemy-hp').innerText = 'HP: ' + hpText;

        let scoreText = typeof entry.score === 'number' ? entry.score : '?';
        if (bossIds.includes(entry.id)) scoreText = entry.score + '+'; // Boss score scales
        document.getElementById('enemy-score').innerText = this.game.settings.getText('score') + scoreText;


        // Kill Count
        const kills = this.game.stats ? this.game.stats.getKills(entry.id) : 0;
        document.getElementById('enemy-hp').innerText += ` | KILLS: ${kills}`;


        // Setup Dummy for Preview
        // We create a dummy game object reference for the entity to use
        this.dummyGame = {
            width: 300,
            height: 200,
            player: { x: 150, y: 150, width: 10, height: 10 }, // For tracking enemies
            score: 0,
            ui: { score: { innerText: '' } },
            createExplosion: () => { },
            powerUps: [],
            projectiles: [],
            particles: [],
            enemies: [],
            stats: { recordKill: () => { }, getKills: () => 0 },
            difficulty: this.game.difficulty, // Use current difficulty settings for drawing?
            settings: this.game.settings, // FIX: Pass settings for Boss.draw
            levelManager: { onBossDefeated: () => { } }
        };

        this.dummyEnemy = new entry.cls(this.dummyGame);
        this.dummyEnemy.x = 150 - this.dummyEnemy.width / 2;
        this.dummyEnemy.y = 100 - this.dummyEnemy.height / 2;

        // Special positioning for bosses
        if (bossIds.includes(entry.id)) {
            this.dummyEnemy.x = 150 - this.dummyEnemy.width / 2;
            this.dummyEnemy.y = 100 - this.dummyEnemy.height / 2;
            this.dummyEnemy.entered = true;
            this.dummyEnemy.y = 20;
        }
    }

    startPreviewLoop() {
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
        const loop = () => {
            this.updatePreview();
            this.drawPreview();
            this.animationFrame = requestAnimationFrame(loop);
        };
        loop();
    }

    stopPreviewLoop() {
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
    }

    updatePreview() {
        if (this.dummyEnemy && this.dummyGame) {
            // Restore position to keep it centered (as update might move it)
            const cx = 150 - this.dummyEnemy.width / 2;
            const cy = 100 - this.dummyEnemy.height / 2;

            // Update enemy to allow it to shoot
            if (this.dummyEnemy.update) {
                this.dummyEnemy.update();
            }

            // Force position back for static preview unless it's a mover that should move?
            // If we reset X/Y every frame, it won't move.
            // But if we don't, it flies away.
            // Let's keep X centered but allow Y movement if it's boss?
            // Or just reset it every frame to center
            const isBoss = ['Boss', 'SpeedBoss', 'FortressBoss', 'PhantomBoss', 'StormBoss', 'HydraBoss', 'NemesisBoss'].includes(this.selectedId);
            if (!isBoss) {
                this.dummyEnemy.x = cx;
                this.dummyEnemy.y = cy;
            } else {
                this.dummyEnemy.x = cx;
            }

            // Update projectiles
            this.dummyGame.projectiles.forEach(p => {
                p.update();
                // Wrap or delete if out of preview
                if (p.x < 0 || p.x > 300 || p.y < 0 || p.y > 200) p.markedForDeletion = true;
            });
            this.dummyGame.projectiles = this.dummyGame.projectiles.filter(p => !p.markedForDeletion);
        }
    }

    drawPreview() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, 300, 200);

        // Grid background
        this.ctx.strokeStyle = '#111';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        for (let x = 0; x <= 300; x += 20) { this.ctx.moveTo(x, 0); this.ctx.lineTo(x, 200); }
        for (let y = 0; y <= 200; y += 20) { this.ctx.moveTo(0, y); this.ctx.lineTo(300, y); }
        this.ctx.stroke();

        if (this.dummyEnemy) {
            this.ctx.save();
            // Some enemies draw relative to game logic, but mostly self-contained using this.x/y
            this.dummyEnemy.draw(this.ctx);
            // Draw projectiles
            if (this.dummyGame && this.dummyGame.projectiles) {
                this.dummyGame.projectiles.forEach(p => p.draw(this.ctx));
            }
            this.ctx.restore();
        }
    }
}
