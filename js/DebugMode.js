// ===================== DEBUG MODE =====================
// Activated by Konami Code: ↑↑↓↓←→←→BA on title screen
// Toggle menu in-game with ` (backquote) key
class DebugMode {
    constructor(game) {
        this.game = game;
        this.unlocked = false;
        this.menuVisible = false;
        this.cheats = {
            invincible: false,
            infiniteBombs: false,
            maxPower: false,
            speedBoost: false,
            oneHitKill: false
        };

        // Konami Code sequence
        this._code = [
            'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
            'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
            'KeyB', 'KeyA'
        ];
        this._buffer = [];

        // Build UI
        this._buildMenu();

        // Listen for key input
        window.addEventListener('keydown', e => {
            // Konami code detection (works on title screen)
            if (!this.unlocked) {
                this._buffer.push(e.code);
                if (this._buffer.length > this._code.length) {
                    this._buffer.shift();
                }
                if (this._buffer.length === this._code.length &&
                    this._buffer.every((k, i) => k === this._code[i])) {
                    this._activate();
                }
                return;
            }

            // Toggle menu with backquote
            if (this.unlocked && e.code === 'Backquote') {
                e.preventDefault();
                this.menuVisible = !this.menuVisible;
                this._el.style.display = this.menuVisible ? 'flex' : 'none';
                if (this.game.gameStarted && !this.game.gameOver) {
                    if (this.menuVisible) {
                        // Remember if game was already paused
                        this._wasPaused = this.game.paused;
                        this.game.paused = true;
                    } else {
                        // Only resume if game wasn't paused before opening debug
                        if (!this._wasPaused) {
                            this.game.paused = false;
                            lastTime = performance.now();
                            animate(performance.now());
                        }
                    }
                }
            }
        });
    }

    _activate() {
        this.unlocked = true;
        this._buffer = [];
        // Flash effect
        const flash = document.createElement('div');
        flash.style.cssText = 'position:fixed;inset:0;background:#0ff;z-index:9999;opacity:0.6;pointer-events:none;transition:opacity 0.4s';
        document.body.appendChild(flash);
        setTimeout(() => { flash.style.opacity = '0'; }, 50);
        setTimeout(() => { flash.remove(); }, 500);
        // Show indicator
        this._indicator.style.display = 'block';
    }

    _buildMenu() {
        // Overlay container
        this._el = document.createElement('div');
        this._el.id = 'debug-overlay';
        this._el.style.display = 'none';

        const panel = document.createElement('div');
        panel.className = 'debug-panel';

        // Title
        const title = document.createElement('div');
        title.className = 'debug-title';
        title.textContent = '⚙ SYSTEM OVERRIDE';
        panel.appendChild(title);

        // Cheat toggles
        const cheats = [
            { key: 'invincible', label: 'INVINCIBLE', icon: '🛡' },
            { key: 'infiniteBombs', label: 'INF. BOMBS', icon: '💣' },
            { key: 'maxPower', label: 'MAX POWER', icon: '⚡' },
            { key: 'speedBoost', label: 'SPEED ×2', icon: '🚀' },
            { key: 'oneHitKill', label: 'ONE-HIT KILL', icon: '💀' }
        ];

        cheats.forEach(c => {
            const row = document.createElement('div');
            row.className = 'debug-row';

            const label = document.createElement('span');
            label.className = 'debug-label';
            label.textContent = `${c.icon} ${c.label}`;

            const btn = document.createElement('button');
            btn.className = 'debug-toggle';
            btn.textContent = 'OFF';
            btn.dataset.cheat = c.key;

            btn.addEventListener('click', () => {
                this.cheats[c.key] = !this.cheats[c.key];
                btn.textContent = this.cheats[c.key] ? 'ON' : 'OFF';
                btn.classList.toggle('debug-on', this.cheats[c.key]);

                // Apply immediate effects
                if (c.key === 'maxPower' && this.cheats.maxPower && this.game.player) {
                    this.game.player.fireRateLevel = 5;
                    this.game.updateFireRateUI();
                }
            });

            row.appendChild(label);
            row.appendChild(btn);
            panel.appendChild(row);
        });

        // Action buttons
        const actions = document.createElement('div');
        actions.className = 'debug-actions';

        const skipBtn = document.createElement('button');
        skipBtn.className = 'debug-action-btn';
        skipBtn.textContent = '⏩ SKIP STAGE';
        skipBtn.addEventListener('click', () => {
            if (this.game.gameStarted && !this.game.gameOver && this.game.levelManager) {
                this.game.levelManager.wave = this.game.levelManager.wavesPerStage;
                this.game.levelManager.waveEnemiesRemaining = 0;
                this.game.levelManager.activeEnemiesInWave = 0;
                this.game.enemies.forEach(e => e.markedForDeletion = true);
                this.game.projectiles = this.game.projectiles.filter(p => p.isPlayerProjectile);
            }
        });

        const addLifeBtn = document.createElement('button');
        addLifeBtn.className = 'debug-action-btn';
        addLifeBtn.textContent = '❤ +5 LIVES';
        addLifeBtn.addEventListener('click', () => {
            if (this.game.gameStarted) {
                this.game.lives += 5;
                this.game.ui.lives.innerText = this.game.settings.getText('lives') + this.game.lives;
            }
        });

        const addBombBtn = document.createElement('button');
        addBombBtn.className = 'debug-action-btn';
        addBombBtn.textContent = '💣 +5 BOMBS';
        addBombBtn.addEventListener('click', () => {
            if (this.game.gameStarted) {
                this.game.bombs += 5;
                this.game.ui.bombs.innerText = this.game.settings.getText('bomb') + '💣'.repeat(this.game.bombs);
            }
        });

        actions.appendChild(skipBtn);
        actions.appendChild(addLifeBtn);
        actions.appendChild(addBombBtn);
        panel.appendChild(actions);

        // Close hint
        const hint = document.createElement('div');
        hint.className = 'debug-hint';
        hint.textContent = 'Press ` to close';
        panel.appendChild(hint);

        this._el.appendChild(panel);
        document.body.appendChild(this._el);

        // Small indicator (top-right corner, very subtle)
        this._indicator = document.createElement('div');
        this._indicator.id = 'debug-indicator';
        this._indicator.textContent = '⚙';
        this._indicator.style.display = 'none';
        document.body.appendChild(this._indicator);
    }
}
