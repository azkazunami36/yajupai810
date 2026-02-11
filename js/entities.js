// ===================== PARTICLE =====================
class Particle {
    constructor(game, x, y, color) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 4 + 1;
        this.speedX = Math.random() * 8 - 4;
        this.speedY = Math.random() * 8 - 4;
        this.life = 1.0;
        this.decay = Math.random() * 0.03 + 0.02;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= this.decay;
        this.size *= 0.98;
    }
    draw(ctx) {
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
    }
}

// ===================== PROJECTILE =====================
class Projectile {
    constructor(game, x, y, speed, type = 'DEFAULT', isPlayerProjectile = true) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.type = type;
        this.isPlayerProjectile = isPlayerProjectile;
        this.markedForDeletion = false;
        this.speedY = 0;

        switch (type) {
            case 'LASER':
                this.width = 40; this.height = 4;
                this.color = '#0ff'; this.damage = 2;
                break;
            case 'SPREAD':
                this.width = 8; this.height = 8;
                this.color = '#ff0'; this.damage = 1;
                break;
            case 'HOMING':
                this.width = 8; this.height = 8;
                this.color = '#f0f'; this.damage = 1;
                break;
            case 'ENEMY':
                this.width = 8; this.height = 8;
                this.color = '#f44'; this.damage = 1;
                break;
            case 'ENEMY_AIMED':
                this.width = 6; this.height = 6;
                this.color = '#ff0'; this.damage = 1;
                break;
            default:
                this.width = 12; this.height = 4;
                this.color = isPlayerProjectile ? '#0ff' : '#f00';
                this.damage = 1;
        }
    }
    update() {
        // Homing logic
        if (this.type === 'HOMING' && this.isPlayerProjectile) {
            let closest = null, minDist = Infinity;
            for (const e of this.game.enemies) {
                const dx = e.x - this.x, dy = e.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < minDist) { minDist = dist; closest = e; }
            }
            if (closest && minDist < 400) {
                const dx = closest.x - this.x, dy = closest.y - this.y;
                const angle = Math.atan2(dy, dx);
                this.speed = 8;
                this.speedY = Math.sin(angle) * 8;
                this.speed = Math.cos(angle) * 8;
            }
        }
        this.x += this.speed;
        this.y += this.speedY;
        if (this.x > this.game.width + 50 || this.x < -50 || this.y > this.game.height + 50 || this.y < -50) {
            this.markedForDeletion = true;
        }
    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        if (this.type === 'SPREAD' || this.type === 'HOMING' || this.type === 'ENEMY' || this.type === 'ENEMY_AIMED') {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.fillRect(this.x, this.y - this.height / 2, this.width, this.height);
        }
        ctx.shadowBlur = 0;
    }
}

// ===================== POWER-UP =====================
class PowerUp {
    constructor(game, x, y, type) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.type = type; // 'SPREAD', 'LASER', 'HOMING', 'LIFE'
        this.width = 24;
        this.height = 24;
        this.speedX = -2;
        this.markedForDeletion = false;
        this.angle = 0;
        switch (type) {
            case 'LIFE': this.color = '#0f0'; this.label = '♥'; break;
            case 'SPREAD': this.color = '#ff0'; this.label = 'S'; break;
            case 'LASER': this.color = '#0ff'; this.label = 'L'; break;
            case 'HOMING': this.color = '#f0f'; this.label = 'H'; break;
            default: this.color = '#fff'; this.label = '?'; break;
        }
    }
    update() {
        this.x += this.speedX;
        this.angle += 0.05;
        if (this.x + this.width < 0) this.markedForDeletion = true;
    }
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.angle);
        // Diamond shape
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.moveTo(0, -14);
        ctx.lineTo(14, 0);
        ctx.lineTo(0, 14);
        ctx.lineTo(-14, 0);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
        // Label
        ctx.fillStyle = '#000';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.label, 0, 0);
        ctx.restore();
    }
}

// ===================== ENEMY BASE =====================
class Enemy {
    constructor(game) {
        this.game = game;
        this.width = 40;
        this.height = 40;
        this.x = this.game.width + 10;
        this.y = Math.random() * (this.game.height - this.height - 40) + 20;
        this.speedX = -(Math.random() * 1.5 + 1.5);
        this.markedForDeletion = false;
        this.lives = 1;
        this.score = 10;
        this.color = '#f55';
        this.hitFlash = 0;
    }
    update() {
        this.x += this.speedX;
        if (this.x + this.width < -20) this.markedForDeletion = true;
        if (this.hitFlash > 0) this.hitFlash--;
        if (this.lives <= 0 && !this.markedForDeletion) {
            this.markedForDeletion = true;
            this.game.score += this.score;
            this.game.ui.score.innerText = 'SCORE: ' + this.game.score;
            this.game.createExplosion(this.x + this.width / 2, this.y + this.height / 2, this.color, 15);
            // Drop power-up (15% chance)
            if (Math.random() < 0.15) {
                const types = ['SPREAD', 'LASER', 'HOMING', 'LIFE'];
                const type = types[Math.floor(Math.random() * types.length)];
                this.game.powerUps.push(new PowerUp(this.game, this.x, this.y, type));
            }
        }
    }
    onHit() {
        this.hitFlash = 5;
    }
    draw(ctx) {
        const drawColor = this.hitFlash > 0 ? '#fff' : this.color;
        ctx.fillStyle = drawColor;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        // Arrow shape pointing left
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.height / 2);
        ctx.lineTo(this.x + this.width, this.y);
        ctx.lineTo(this.x + this.width - 10, this.y + this.height / 2);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

// ===================== SINE WAVE ENEMY =====================
class SineWaveEnemy extends Enemy {
    constructor(game) {
        super(game);
        this.color = '#f0f';
        this.angle = Math.random() * Math.PI * 2;
        this.amplitude = 3 + Math.random() * 3;
        this.angleSpeed = 0.05 + Math.random() * 0.1;
        this.lives = 2;
        this.score = 20;
    }
    update() {
        this.y += Math.sin(this.angle) * this.amplitude;
        this.angle += this.angleSpeed;
        super.update();
    }
}

// ===================== TRACKING ENEMY =====================
class TrackingEnemy extends Enemy {
    constructor(game) {
        super(game);
        this.color = '#0f0';
        this.speedX = -2.5;
        this.lives = 2;
        this.score = 30;
        this.trackSpeed = 1.5;
    }
    update() {
        const dy = this.game.player.y - this.y;
        if (Math.abs(dy) > 5) {
            this.y += Math.sign(dy) * this.trackSpeed;
        }
        super.update();
    }
    draw(ctx) {
        const drawColor = this.hitFlash > 0 ? '#fff' : this.color;
        ctx.fillStyle = drawColor;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        // Diamond shape
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.height / 2);
        ctx.lineTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x + this.width, this.y + this.height / 2);
        ctx.lineTo(this.x + this.width / 2, this.y + this.height);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

// ===================== SHIELD ENEMY =====================
class ShieldEnemy extends Enemy {
    constructor(game) {
        super(game);
        this.color = '#44f';
        this.lives = 5;
        this.score = 50;
        this.width = 50;
        this.height = 50;
        this.speedX = -1;
        this.shieldAngle = 0;
    }
    update() {
        this.shieldAngle += 0.03;
        super.update();
    }
    draw(ctx) {
        super.draw(ctx);
        // Rotating shield ring
        ctx.strokeStyle = '#0ff';
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 8]);
        ctx.lineDashOffset = this.shieldAngle * 30;
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width * 0.7, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.lineWidth = 1;
    }
}

// ===================== BURST ENEMY =====================
class BurstEnemy extends Enemy {
    constructor(game) {
        super(game);
        this.color = '#fa0';
        this.shootTimer = 0;
        this.shootInterval = 80 + Math.random() * 40;
        this.lives = 3;
        this.score = 40;
    }
    update() {
        super.update();
        if (this.lives > 0) {
            this.shootTimer++;
            if (this.shootTimer >= this.shootInterval) {
                this.shootTimer = 0;
                // Aimed shot toward player
                const dx = this.game.player.x - this.x;
                const dy = this.game.player.y - this.y;
                const angle = Math.atan2(dy, dx);
                const p = new Projectile(this.game, this.x, this.y + this.height / 2, Math.cos(angle) * 4, 'ENEMY_AIMED', false);
                p.speedY = Math.sin(angle) * 4;
                this.game.projectiles.push(p);
            }
        }
    }
    draw(ctx) {
        const drawColor = this.hitFlash > 0 ? '#fff' : this.color;
        ctx.fillStyle = drawColor;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        // Hexagonal shape
        const cx = this.x + this.width / 2, cy = this.y + this.height / 2, r = this.width / 2;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const a = (Math.PI / 3) * i - Math.PI / 6;
            ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
        }
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

// ===================== SPIRAL ENEMY (NEW) =====================
class SpiralEnemy extends Enemy {
    constructor(game) {
        super(game);
        this.color = '#f0a';
        this.lives = 3;
        this.score = 45;
        this.angle = 0;
        this.shootTimer = 0;
    }
    update() {
        this.angle += 0.04;
        this.y += Math.sin(this.angle) * 2;
        this.x += this.speedX;

        if (this.lives > 0) {
            this.shootTimer++;
            if (this.shootTimer >= 50) {
                this.shootTimer = 0;
                // Spiral burst - 3 bullets in a circle pattern
                for (let i = 0; i < 3; i++) {
                    const a = this.angle + (Math.PI * 2 / 3) * i;
                    const p = new Projectile(this.game, this.x, this.y + this.height / 2, Math.cos(a) * 3, 'ENEMY', false);
                    p.speedY = Math.sin(a) * 3;
                    this.game.projectiles.push(p);
                }
            }
        }

        if (this.x + this.width < -20) this.markedForDeletion = true;
        if (this.hitFlash > 0) this.hitFlash--;
        if (this.lives <= 0 && !this.markedForDeletion) {
            this.markedForDeletion = true;
            this.game.score += this.score;
            this.game.ui.score.innerText = 'SCORE: ' + this.game.score;
            this.game.createExplosion(this.x + this.width / 2, this.y + this.height / 2, this.color, 20);
            if (Math.random() < 0.2) {
                const types = ['SPREAD', 'LASER', 'HOMING', 'LIFE'];
                const type = types[Math.floor(Math.random() * types.length)];
                this.game.powerUps.push(new PowerUp(this.game, this.x, this.y, type));
            }
        }
    }
    draw(ctx) {
        const drawColor = this.hitFlash > 0 ? '#fff' : this.color;
        ctx.fillStyle = drawColor;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        // Star shape
        const cx = this.x + this.width / 2, cy = this.y + this.height / 2;
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const outerA = (Math.PI * 2 / 5) * i - Math.PI / 2 + this.angle;
            const innerA = outerA + Math.PI / 5;
            ctx.lineTo(cx + 20 * Math.cos(outerA), cy + 20 * Math.sin(outerA));
            ctx.lineTo(cx + 10 * Math.cos(innerA), cy + 10 * Math.sin(innerA));
        }
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

// ===================== BOSS =====================
class Boss extends Enemy {
    constructor(game) {
        super(game);
        this.width = 150;
        this.height = 150;
        this.x = game.width + 10;
        this.y = (game.height - this.height) / 2;
        this.color = '#f00';
        this.lives = 50;
        this.maxLives = 50;
        this.score = 1000;
        this.speedX = -1;
        this.entered = false;
        this.actionTimer = 0;
        this.attackPattern = 0;
        this.moveAngle = 0;
    }
    update() {
        if (this.hitFlash > 0) this.hitFlash--;

        // Entering phase
        if (!this.entered) {
            this.x += this.speedX;
            if (this.x <= this.game.width - this.width - 80) {
                this.entered = true;
            }
            return;
        }

        // Movement
        this.moveAngle += 0.02;
        this.y += Math.sin(this.moveAngle) * 2;
        this.y = Math.max(20, Math.min(this.game.height - this.height - 20, this.y));

        // Attack patterns
        this.actionTimer++;
        if (this.actionTimer >= 60) {
            this.actionTimer = 0;
            this.attackPattern = (this.attackPattern + 1) % 4;
            switch (this.attackPattern) {
                case 0: this.attackSpread(); break;
                case 1: this.attackAimed(); break;
                case 2: this.attackCircle(); break;
                case 3: this.attackWall(); break;
            }
        }

        // Death
        if (this.lives <= 0 && !this.markedForDeletion) {
            this.markedForDeletion = true;
            this.game.score += this.score;
            this.game.ui.score.innerText = 'SCORE: ' + this.game.score;
            this.game.createExplosion(this.x + this.width / 2, this.y + this.height / 2, '#ff0', 40);
            this.game.createExplosion(this.x + this.width / 4, this.y + this.height / 4, '#f00', 20);
            this.game.createExplosion(this.x + this.width * 3 / 4, this.y + this.height * 3 / 4, '#f0f', 20);
            this.game.levelManager.onBossDefeated();
        }
    }
    attackSpread() {
        const cy = this.y + this.height / 2;
        for (let i = -3; i <= 3; i++) {
            const p = new Projectile(this.game, this.x, cy, -5, 'ENEMY', false);
            p.speedY = i * 1.5;
            this.game.projectiles.push(p);
        }
    }
    attackAimed() {
        const dx = this.game.player.x - this.x;
        const dy = this.game.player.y - (this.y + this.height / 2);
        const angle = Math.atan2(dy, dx);
        for (let i = -1; i <= 1; i++) {
            const a = angle + i * 0.15;
            const p = new Projectile(this.game, this.x, this.y + this.height / 2, Math.cos(a) * 5, 'ENEMY_AIMED', false);
            p.speedY = Math.sin(a) * 5;
            this.game.projectiles.push(p);
        }
    }
    attackCircle() {
        const cx = this.x + this.width / 4;
        const cy = this.y + this.height / 2;
        for (let i = 0; i < 12; i++) {
            const a = (Math.PI * 2 / 12) * i;
            const p = new Projectile(this.game, cx, cy, Math.cos(a) * 3, 'ENEMY', false);
            p.speedY = Math.sin(a) * 3;
            this.game.projectiles.push(p);
        }
    }
    attackWall() {
        for (let i = 0; i < 6; i++) {
            const py = (this.game.height / 7) * (i + 1);
            const p = new Projectile(this.game, this.x, py, -4, 'ENEMY', false);
            this.game.projectiles.push(p);
        }
    }
    draw(ctx) {
        const drawColor = this.hitFlash > 0 ? '#fff' : this.color;
        ctx.fillStyle = drawColor;
        ctx.shadowBlur = 30;
        ctx.shadowColor = this.color;

        // Main body
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Core
        ctx.fillStyle = '#ff0';
        ctx.beginPath();
        ctx.arc(this.x + 40, this.y + this.height / 2, 20, 0, Math.PI * 2);
        ctx.fill();

        // Wings
        ctx.fillStyle = drawColor;
        ctx.beginPath();
        ctx.moveTo(this.x + this.width, this.y);
        ctx.lineTo(this.x + this.width + 40, this.y - 30);
        ctx.lineTo(this.x + this.width, this.y + 30);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(this.x + this.width, this.y + this.height);
        ctx.lineTo(this.x + this.width + 40, this.y + this.height + 30);
        ctx.lineTo(this.x + this.width, this.y + this.height - 30);
        ctx.closePath();
        ctx.fill();

        ctx.shadowBlur = 0;

        // Health Bar (bottom of screen)
        const barW = 400, barH = 12;
        const barX = (this.game.width - barW) / 2;
        const barY = this.game.height - 30;
        ctx.fillStyle = '#222';
        ctx.fillRect(barX, barY, barW, barH);
        const ratio = Math.max(0, this.lives / this.maxLives);
        const grad = ctx.createLinearGradient(barX, barY, barX + barW * ratio, barY);
        grad.addColorStop(0, '#f00');
        grad.addColorStop(1, '#ff0');
        ctx.fillStyle = grad;
        ctx.fillRect(barX, barY, barW * ratio, barH);
        ctx.strokeStyle = '#fff';
        ctx.strokeRect(barX, barY, barW, barH);
        // Boss label
        ctx.fillStyle = '#fff';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('BOSS', this.game.width / 2, barY - 5);
    }
}

// ===================== PLAYER =====================
class Player {
    constructor(game) {
        this.game = game;
        this.width = 50;
        this.height = 30;
        this.x = 50;
        this.y = game.height / 2;
        this.speed = 5;
        this.shootTimer = 0;
        this.shootInterval = 12;
        this.weaponType = 'DEFAULT';
        this.invincible = 0;
    }
    update() {
        // Movement
        if (this.game.input.isDown('ArrowUp') || this.game.input.isDown('KeyW')) this.y -= this.speed;
        if (this.game.input.isDown('ArrowDown') || this.game.input.isDown('KeyS')) this.y += this.speed;
        if (this.game.input.isDown('ArrowLeft') || this.game.input.isDown('KeyA')) this.x -= this.speed;
        if (this.game.input.isDown('ArrowRight') || this.game.input.isDown('KeyD')) this.x += this.speed;
        // Clamp
        this.x = Math.max(0, Math.min(this.game.width - this.width, this.x));
        this.y = Math.max(0, Math.min(this.game.height - this.height, this.y));
        // Invincibility
        if (this.invincible > 0) this.invincible--;
        // Shooting
        if (this.shootTimer > 0) this.shootTimer--;
        if ((this.game.input.isDown(' ') || this.game.input.isDown('KeyZ') || this.game.input.isDown('Enter')) && this.shootTimer === 0) {
            this.shoot();
            this.shootTimer = this.shootInterval;
        }
    }
    shoot() {
        const px = this.x + this.width;
        const py = this.y + this.height / 2;
        switch (this.weaponType) {
            case 'SPREAD': {
                for (let i = -2; i <= 2; i++) {
                    const p = new Projectile(this.game, px, py, 10, 'SPREAD', true);
                    p.speedY = i * 1.5;
                    this.game.projectiles.push(p);
                }
                break;
            }
            case 'LASER': {
                const p = new Projectile(this.game, px, py, 18, 'LASER', true);
                this.game.projectiles.push(p);
                break;
            }
            case 'HOMING': {
                const p = new Projectile(this.game, px, py, 8, 'HOMING', true);
                this.game.projectiles.push(p);
                break;
            }
            default: {
                this.game.projectiles.push(new Projectile(this.game, px, py, 12, 'DEFAULT', true));
                break;
            }
        }
    }
    draw(ctx) {
        // Blink when invincible
        if (this.invincible > 0 && Math.floor(this.invincible / 3) % 2 === 0) return;

        const colors = { DEFAULT: '#0ff', SPREAD: '#ff0', LASER: '#0ff', HOMING: '#f0f' };
        ctx.fillStyle = colors[this.weaponType] || '#0ff';
        ctx.shadowBlur = 20;
        ctx.shadowColor = ctx.fillStyle;
        // Ship body
        ctx.beginPath();
        ctx.moveTo(this.x + this.width, this.y + this.height / 2);
        ctx.lineTo(this.x + 5, this.y);
        ctx.lineTo(this.x, this.y + 5);
        ctx.lineTo(this.x, this.y + this.height - 5);
        ctx.lineTo(this.x + 5, this.y + this.height);
        ctx.closePath();
        ctx.fill();
        // Engine glow
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(this.x - 2, this.y + this.height / 2, 4 + Math.random() * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}
