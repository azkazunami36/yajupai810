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

        // Fast square particle instead of arc
        ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);

        // Simple cross-hair spark (only if size is large enough to save cycles)
        if (this.size > 2) {
            ctx.fillRect(this.x - this.size * 1.5, this.y - 0.5, this.size * 3, 1);
            ctx.fillRect(this.x - 0.5, this.y - this.size * 1.5, 1, this.size * 3);
        }

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

        this.piercing = false; // Can hit multiple enemies
        this.lifespan = 0; // 0 = infinite

        switch (type) {
            case 'LASER':
                this.width = 30; this.height = 3;
                this.color = '#8ff'; this.damage = 0.5;
                this.piercing = true;
                break;
            case 'SPREAD':
                this.width = 6; this.height = 6;
                this.color = '#ff0'; this.damage = 1;
                break;
            case 'HOMING':
                this.width = 6; this.height = 6;
                this.color = '#f0f'; this.damage = 1;
                break;
            case 'SLASH':
                this.width = 150; this.height = 100; // Romantic size
                this.color = '#f80'; this.damage = 30; // One-hit kill for most
                this.lifespan = 12; // Slightly longer duration
                this.piercing = true;
                this.cancelsBullets = true; // Key feature
                break;
            case 'ENEMY':
                this.width = 8; this.height = 8;
                this.color = '#f44'; this.damage = 1;
                break;
            case 'ENEMY_AIMED':
                this.width = 6; this.height = 6;
                this.color = '#ff0'; this.damage = 1;
                break;
            case 'FUNNEL_SHOT':
                this.width = 5; this.height = 5;
                this.color = '#0ff'; this.damage = 1;
                break;
            default:
                this.width = 10; this.height = 3;
                this.color = isPlayerProjectile ? '#0ff' : '#f00';
                this.damage = 1;
        }
    }
    update() {
        if (this.type === 'HOMING' && this.isPlayerProjectile) {
            let closest = null, minDist = Infinity;
            for (const e of this.game.enemies) {
                if (e.markedForDeletion) continue;
                const dx = e.x + e.width / 2 - this.x;
                const dy = e.y + e.height / 2 - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < minDist) { minDist = dist; closest = e; }
            }
            if (closest && minDist < 250) {
                const dx = closest.x + closest.width / 2 - this.x;
                const dy = closest.y + closest.height / 2 - this.y;
                const angle = Math.atan2(dy, dx);
                this.speed = Math.cos(angle) * 5.5;
                this.speedY = Math.sin(angle) * 5.5;
            }
        }
        this.x += this.speed;
        this.y += this.speedY;
        // Lifespan for short-range projectiles
        if (this.lifespan > 0) {
            this.lifespan--;
            if (this.lifespan <= 0) this.markedForDeletion = true;
        }
        if (this.x > this.game.width + 50 || this.x < -50 || this.y > this.game.height + 50 || this.y < -50) {
            this.markedForDeletion = true;
        }
    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = this.color;
        if (this.type === 'SLASH') {
            // Arc slash effect (Huge)
            ctx.save();
            ctx.globalAlpha = 0.8 + Math.random() * 0.2;
            ctx.strokeStyle = '#f80';
            ctx.lineWidth = 8;
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#ff0';
            ctx.lineCap = 'round';

            // Main slash arc
            ctx.beginPath();
            ctx.arc(this.x - 20, this.y + this.height / 2, this.width / 2, -1.0, 1.0);
            ctx.stroke();

            // Inner brighter arc
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(this.x - 20, this.y + this.height / 2, this.width / 2 - 10, -0.8, 0.8);
            ctx.stroke();

            // Trail effects
            ctx.strokeStyle = '#f40';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(this.x - 30, this.y + this.height / 2, this.width / 2 + 10, -0.9, 0.9);
            ctx.stroke();

            ctx.restore();
        } else if (this.type === 'SPREAD' || this.type === 'HOMING' || this.type === 'ENEMY' || this.type === 'ENEMY_AIMED' || this.type === 'FUNNEL_SHOT') {
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
        this.type = type; // 'RATE', 'SPREAD', 'LASER', 'HOMING', 'LIFE', 'BOMB'
        this.width = 24;
        this.height = 24;
        this.speedX = -2;
        this.markedForDeletion = false;
        this.angle = 0;
        switch (type) {
            case 'LIFE': this.color = '#0f0'; this.label = '笙･'; break;
            case 'RATE': this.color = '#f80'; this.label = 'R'; break;
            case 'BOMB': this.color = '#f00'; this.label = 'B'; break;
            case 'FUNNEL': this.color = '#0ff'; this.label = 'F'; break;
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
        ctx.fillStyle = '#000';
        ctx.font = 'bold 11px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.label, 0, 0);
        ctx.restore();
    }
}

// ===================== OBSTACLE =====================
class Obstacle {
    constructor(game) {
        this.game = game;
        this.size = 20 + Math.random() * 40;
        this.width = this.size;
        this.height = this.size;
        this.x = game.width + this.size;
        this.y = Math.random() * (game.height - this.size);
        this.speedX = -(1.5 + Math.random() * 2);
        this.rotation = 0;
        this.rotSpeed = (Math.random() - 0.5) * 0.04;
        this.markedForDeletion = false;
        this.color = '#888';
        this.vertices = [];
        // Generate asteroid shape
        const numVerts = 6 + Math.floor(Math.random() * 4);
        for (let i = 0; i < numVerts; i++) {
            const a = (Math.PI * 2 / numVerts) * i;
            const r = (this.size / 2) * (0.7 + Math.random() * 0.3);
            this.vertices.push({ x: Math.cos(a) * r, y: Math.sin(a) * r });
        }
    }
    update() {
        this.x += this.speedX;
        this.rotation += this.rotSpeed;
        if (this.x + this.size < -10) this.markedForDeletion = true;
    }
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x + this.size / 2, this.y + this.size / 2);
        ctx.rotate(this.rotation);
        ctx.fillStyle = this.color;
        ctx.strokeStyle = '#aaa';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(this.vertices[0].x, this.vertices[0].y);
        for (let i = 1; i < this.vertices.length; i++) {
            ctx.lineTo(this.vertices[i].x, this.vertices[i].y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
}

// ===================== ENEMY BASE =====================
class Enemy {
    constructor(game) {
        this.game = game;
        this.width = 35;
        this.height = 35;
        this.x = this.game.width + 10;
        this.y = Math.random() * (this.game.height - this.height - 40) + 20;
        this.speedX = -(Math.random() * 2.5 + 2.5);
        this.markedForDeletion = false;
        this.lives = 2;
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
            if (this.game.stats) this.game.stats.recordKill(this.constructor.name);
            this.game.score += this.score;
            this.game.ui.score.innerText = 'SCORE: ' + this.game.score;
            this.game.createExplosion(this.x + this.width / 2, this.y + this.height / 2, this.color, 12);
            if (this.game.onEnemyKilled) this.game.onEnemyKilled(this);
            const dr = this.game.difficulty ? this.game.difficulty.dropRate : 0.1;
            if (Math.random() < dr) {
                const types = ['RATE', 'LIFE', 'BOMB', 'FUNNEL'];
                const type = types[Math.floor(Math.random() * types.length)];
                this.game.powerUps.push(new PowerUp(this.game, this.x, this.y, type));
            }
        }
    }
    onHit() { this.hitFlash = 5; }
    draw(ctx) {
        const c = this.hitFlash > 0 ? '#fff' : this.color;
        ctx.fillStyle = c;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.height / 2);
        ctx.lineTo(this.x + this.width, this.y);
        ctx.lineTo(this.x + this.width - 8, this.y + this.height / 2);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

// ===================== SINE WAVE =====================
class SineWaveEnemy extends Enemy {
    constructor(game) {
        super(game);
        this.color = '#f0f';
        this.angle = Math.random() * Math.PI * 2;
        this.amplitude = 5 + Math.random() * 4;
        this.angleSpeed = 0.08 + Math.random() * 0.12;
        this.lives = 3;
        this.score = 20;
        this.speedX = -(Math.random() * 2 + 2.5);
    }
    update() {
        this.y += Math.sin(this.angle) * this.amplitude;
        this.angle += this.angleSpeed;
        super.update();
    }
}

// ===================== TRACKING =====================
class TrackingEnemy extends Enemy {
    constructor(game) {
        super(game);
        this.color = '#0f0';
        this.speedX = -4;
        this.lives = 3;
        this.score = 30;
        this.trackSpeed = 2.5;
    }
    update() {
        const dy = this.game.player.y - this.y;
        if (Math.abs(dy) > 3) this.y += Math.sign(dy) * this.trackSpeed;
        super.update();
    }
    draw(ctx) {
        const c = this.hitFlash > 0 ? '#fff' : this.color;
        ctx.fillStyle = c;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        const cx = this.x + this.width / 2, cy = this.y + this.height / 2, r = this.width / 2;
        ctx.beginPath();
        ctx.moveTo(this.x, cy);
        ctx.lineTo(cx, this.y);
        ctx.lineTo(this.x + this.width, cy);
        ctx.lineTo(cx, this.y + this.height);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

// ===================== SHIELD =====================
class ShieldEnemy extends Enemy {
    constructor(game) {
        super(game);
        this.color = '#44f';
        this.lives = 8;
        this.score = 50;
        this.width = 50;
        this.height = 50;
        this.speedX = -1.5;
        this.shieldAngle = 0;
    }
    update() {
        this.shieldAngle += 0.03;
        super.update();
    }
    draw(ctx) {
        super.draw(ctx);
        ctx.strokeStyle = '#0ff';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 6]);
        ctx.lineDashOffset = this.shieldAngle * 30;
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width * 0.65, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.lineWidth = 1;
    }
}

// ===================== BURST (aimed shots) =====================
class BurstEnemy extends Enemy {
    constructor(game) {
        super(game);
        this.color = '#fa0';
        this.shootTimer = 0;
        this.shootInterval = 50 + Math.random() * 30; // Increased interval (slower firing)
        this.lives = 4;
        this.score = 40;
        this.speedX = -(Math.random() * 1.5 + 2);
    }
    update() {
        super.update();
        if (this.lives > 0) {
            this.shootTimer++;
            if (this.shootTimer >= this.shootInterval) {
                this.shootTimer = 0;
                const dx = this.game.player.x - this.x;
                const dy = this.game.player.y - this.y;
                const angle = Math.atan2(dy, dx);
                const p = new Projectile(this.game, this.x, this.y + this.height / 2, Math.cos(angle) * 6, 'ENEMY_AIMED', false);
                p.speedY = Math.sin(angle) * 6;
                this.game.projectiles.push(p);
                // Removed second shot for better balance
            }
        }
    }
    draw(ctx) {
        const c = this.hitFlash > 0 ? '#fff' : this.color;
        ctx.fillStyle = c;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
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

// ===================== SPIRAL =====================
class SpiralEnemy extends Enemy {
    constructor(game) {
        super(game);
        this.color = '#f0a';
        this.lives = 3;
        this.score = 45;
        this.angle = 0;
        this.speedX = -(Math.random() * 1.5 + 2);
        this.shootTimer = 0;
    }
    update() {
        this.angle += 0.04;
        this.y += Math.sin(this.angle) * 2;
        this.x += this.speedX;
        if (this.lives > 0) {
            this.shootTimer++;
            if (this.shootTimer >= 60) {
                this.shootTimer = 0;
                for (let i = 0; i < 3; i++) {
                    const a = this.angle + (Math.PI * 2 / 3) * i;
                    const p = new Projectile(this.game, this.x, this.y + this.height / 2, Math.cos(a) * 2.5, 'ENEMY', false);
                    p.speedY = Math.sin(a) * 3;
                    this.game.projectiles.push(p);
                }
            }
        }
        if (this.x + this.width < -20) this.markedForDeletion = true;
        if (this.hitFlash > 0) this.hitFlash--;
        if (this.lives <= 0 && !this.markedForDeletion) {
            this.markedForDeletion = true;
            if (this.game.stats) this.game.stats.recordKill('SpiralEnemy');
            this.game.score += this.score;
            this.game.ui.score.innerText = 'SCORE: ' + this.game.score;
            this.game.createExplosion(this.x + this.width / 2, this.y + this.height / 2, this.color, 15);
            if (this.game.onEnemyKilled) this.game.onEnemyKilled(this);
            if (Math.random() < 0.15) {
                const types = ['RATE', 'LIFE', 'BOMB', 'FUNNEL'];
                const type = types[Math.floor(Math.random() * types.length)];
                this.game.powerUps.push(new PowerUp(this.game, this.x, this.y, type));
            }
        }
    }
    draw(ctx) {
        const c = this.hitFlash > 0 ? '#fff' : this.color;
        ctx.fillStyle = c;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        const cx = this.x + this.width / 2, cy = this.y + this.height / 2;
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const outerA = (Math.PI * 2 / 5) * i - Math.PI / 2 + this.angle;
            const innerA = outerA + Math.PI / 5;
            ctx.lineTo(cx + 18 * Math.cos(outerA), cy + 18 * Math.sin(outerA));
            ctx.lineTo(cx + 8 * Math.cos(innerA), cy + 8 * Math.sin(innerA));
        }
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

// ===================== ZIGZAG =====================
class ZigZagEnemy extends Enemy {
    constructor(game) {
        super(game);
        this.color = '#0ff';
        this.lives = 2;
        this.score = 15;
        this.zigTimer = 0;
        this.zigDir = 1;
        this.speedX = -5;
    }
    update() {
        this.zigTimer++;
        if (this.zigTimer > 12) {
            this.zigDir *= -1;
            this.zigTimer = 0;
        }
        this.y += this.zigDir * 6;
        this.y = Math.max(5, Math.min(this.game.height - this.height - 5, this.y));
        super.update();
    }
    draw(ctx) {
        const c = this.hitFlash > 0 ? '#fff' : this.color;
        ctx.fillStyle = c;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        // Small triangle
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.height / 2);
        ctx.lineTo(this.x + this.width, this.y);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

// ===================== KAMIKAZE =====================
class KamikazeEnemy extends Enemy {
    constructor(game) {
        super(game);
        this.color = '#f00';
        this.lives = 1;
        this.score = 25;
        this.width = 25;
        this.height = 25;
        this.speedX = -1.5;
        this.locked = false;
        this.chargeSpeed = 7; // Reduced from 10 for better balance
    }
    update() {
        if (!this.locked && this.x < this.game.width * 0.7) {
            this.locked = true;
            const dx = this.game.player.x - this.x;
            const dy = this.game.player.y - this.y;
            const angle = Math.atan2(dy, dx);
            this.speedX = Math.cos(angle) * this.chargeSpeed;
            this.speedY = Math.sin(angle) * this.chargeSpeed;
        }
        this.x += this.speedX;
        if (this.locked) this.y += (this.speedY || 0);
        if (this.x + this.width < -20 || this.x > this.game.width + 50 || this.y < -50 || this.y > this.game.height + 50) {
            this.markedForDeletion = true;
        }
        if (this.hitFlash > 0) this.hitFlash--;
        if (this.lives <= 0 && !this.markedForDeletion) {
            this.markedForDeletion = true;
            if (this.game.stats) this.game.stats.recordKill('KamikazeEnemy');
            this.game.score += this.score;
            this.game.ui.score.innerText = 'SCORE: ' + this.game.score;
            this.game.createExplosion(this.x + this.width / 2, this.y + this.height / 2, this.color, 12);
            if (this.game.onEnemyKilled) this.game.onEnemyKilled(this);
            if (Math.random() < 0.1) {
                const types = ['RATE', 'LIFE', 'BOMB', 'FUNNEL'];
                const type = types[Math.floor(Math.random() * types.length)];
                this.game.powerUps.push(new PowerUp(this.game, this.x, this.y, type));
            }
        }
    }
    draw(ctx) {
        const c = this.hitFlash > 0 ? '#fff' : this.color;
        ctx.fillStyle = c;
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#f00';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
        ctx.fill();
        // Warning X
        ctx.strokeStyle = '#ff0';
        ctx.lineWidth = 2;
        const cx = this.x + this.width / 2, cy = this.y + this.height / 2;
        ctx.beginPath();
        ctx.moveTo(cx - 6, cy - 6); ctx.lineTo(cx + 6, cy + 6);
        ctx.moveTo(cx + 6, cy - 6); ctx.lineTo(cx - 6, cy + 6);
        ctx.stroke();
        ctx.lineWidth = 1;
        ctx.shadowBlur = 0;
    }
}

// ===================== FORMATION =====================
class FormationEnemy extends Enemy {
    constructor(game, yOffset) {
        super(game);
        this.color = '#ff0';
        this.lives = 1;
        this.score = 15;
        this.speedX = -2;
        if (yOffset !== undefined) this.y = yOffset;
    }
    draw(ctx) {
        const c = this.hitFlash > 0 ? '#fff' : this.color;
        ctx.fillStyle = c;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.shadowBlur = 0;
    }
}

// ===================== WALL ENEMY =====================
class WallEnemy extends Enemy {
    constructor(game) {
        super(game);
        this.color = '#a0a';
        this.lives = 4;
        this.score = 20;
        this.speedX = -2.5;
        this.width = 30;
        this.height = 60;
    }
    draw(ctx) {
        const c = this.hitFlash > 0 ? '#fff' : this.color;
        ctx.fillStyle = c;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        // Stripe
        ctx.strokeStyle = '#f0f';
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.height / 2);
        ctx.lineTo(this.x + this.width, this.y + this.height / 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
    }
}

// ===================== MIRAGE =====================
// Flickers in and out of invincibility
class MirageEnemy extends Enemy {
    constructor(game) {
        super(game);
        this.color = '#a8f';
        this.lives = 2;
        this.score = 30;
        this.speedX = -(Math.random() * 2 + 2.5);
        this.flickerTimer = 0;
        this.flickerInterval = 60 + Math.floor(Math.random() * 40);
        this.phased = false;
        this.phaseTimer = 0;
        this.phaseDuration = 30;
        this.alpha = 1;
    }
    update() {
        this.x += this.speedX;
        this.y += Math.sin(this.flickerTimer * 0.05) * 1.5;
        this.flickerTimer++;
        if (this.phased) {
            this.phaseTimer++;
            this.alpha = 0.15 + Math.sin(this.phaseTimer * 0.3) * 0.1;
            if (this.phaseTimer >= this.phaseDuration) {
                this.phased = false;
                this.phaseTimer = 0;
                this.alpha = 1;
            }
        } else if (this.flickerTimer % this.flickerInterval === 0) {
            this.phased = true;
            this.phaseTimer = 0;
        }
        if (this.x + this.width < -20) this.markedForDeletion = true;
        if (this.hitFlash > 0) this.hitFlash--;
        if (this.lives <= 0 && !this.markedForDeletion) {
            this.markedForDeletion = true;
            this.game.score += this.score;
            this.game.ui.score.innerText = 'SCORE: ' + this.game.score;
            this.game.createExplosion(this.x + this.width / 2, this.y + this.height / 2, this.color, 12);
            if (this.game.onEnemyKilled) this.game.onEnemyKilled(this);
            if (this.game.stats) this.game.stats.recordKill('MirageEnemy');
            if (Math.random() < 0.1) {
                const types = ['RATE', 'LIFE', 'BOMB', 'FUNNEL'];
                this.game.powerUps.push(new PowerUp(this.game, this.x, this.y, types[Math.floor(Math.random() * types.length)]));
            }
        }
    }
    // Override collision: phased = invincible
    get isPhased() { return this.phased; }
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        const c = this.hitFlash > 0 ? '#fff' : this.color;
        ctx.fillStyle = c;
        ctx.shadowBlur = this.phased ? 15 : 6;
        ctx.shadowColor = '#a8f';
        const cx = this.x + this.width / 2, cy = this.y + this.height / 2;
        // Diamond body
        ctx.beginPath();
        ctx.moveTo(cx, cy - 16);
        ctx.lineTo(cx + 14, cy);
        ctx.lineTo(cx, cy + 16);
        ctx.lineTo(cx - 14, cy);
        ctx.closePath();
        ctx.fill();
        // Inner glow
        ctx.fillStyle = '#fff';
        ctx.globalAlpha = this.alpha * 0.5;
        ctx.beginPath();
        ctx.arc(cx, cy, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();
    }
}

// ===================== BOMBER =====================
// Drops slow-moving mines while oscillating vertically
class BomberEnemy extends Enemy {
    constructor(game) {
        super(game);
        this.color = '#8a5';
        this.lives = 4;
        this.score = 35;
        this.width = 40;
        this.height = 30;
        this.speedX = -(Math.random() * 1 + 1.5);
        this.dropTimer = 0;
        this.dropInterval = 80 + Math.floor(Math.random() * 40);
        this.bobAngle = Math.random() * Math.PI * 2;
    }
    update() {
        this.bobAngle += 0.04;
        this.x += this.speedX;
        this.y += Math.sin(this.bobAngle) * 2;
        this.y = Math.max(10, Math.min(this.game.height - this.height - 10, this.y));
        this.dropTimer++;
        if (this.dropTimer >= this.dropInterval && this.lives > 0) {
            this.dropTimer = 0;
            // Drop a slow mine
            const p = new Projectile(this.game, this.x + this.width / 2, this.y + this.height, -1.5, 'ENEMY', false);
            p.speedY = 0.5;
            p.color = '#8a5';
            p.width = 8;
            p.height = 8;
            this.game.projectiles.push(p);
        }
        if (this.x + this.width < -20) this.markedForDeletion = true;
        if (this.hitFlash > 0) this.hitFlash--;
        if (this.lives <= 0 && !this.markedForDeletion) {
            this.markedForDeletion = true;
            this.game.score += this.score;
            this.game.ui.score.innerText = 'SCORE: ' + this.game.score;
            this.game.createExplosion(this.x + this.width / 2, this.y + this.height / 2, this.color, 15);
            if (this.game.onEnemyKilled) this.game.onEnemyKilled(this);
            if (this.game.stats) this.game.stats.recordKill('BomberEnemy');
            if (Math.random() < 0.12) {
                const types = ['RATE', 'LIFE', 'BOMB', 'FUNNEL'];
                this.game.powerUps.push(new PowerUp(this.game, this.x, this.y, types[Math.floor(Math.random() * types.length)]));
            }
        }
    }
    draw(ctx) {
        const c = this.hitFlash > 0 ? '#fff' : this.color;
        ctx.fillStyle = c;
        ctx.shadowBlur = 6;
        ctx.shadowColor = this.color;
        // Chunky body
        ctx.fillRect(this.x + 4, this.y + 4, this.width - 8, this.height - 8);
        // Wings
        ctx.fillStyle = this.hitFlash > 0 ? '#fff' : '#6a3';
        ctx.fillRect(this.x, this.y, this.width, 6);
        ctx.fillRect(this.x, this.y + this.height - 6, this.width, 6);
        // Bomb bay indicator
        ctx.fillStyle = '#ff0';
        ctx.fillRect(this.x + this.width / 2 - 3, this.y + this.height - 4, 6, 4);
        ctx.shadowBlur = 0;
    }
}

// ===================== SNIPER =====================
// Stops at screen edge, charges, then fires a fast aimed shot
class SniperEnemy extends Enemy {
    constructor(game) {
        super(game);
        this.color = '#f44';
        this.lives = 2;
        this.score = 40;
        this.speedX = -3;
        this.width = 30;
        this.height = 20;
        this.state = 'enter'; // enter -> aim -> fire -> exit
        this.aimTimer = 0;
        this.aimDuration = 90;
        this.stopX = game.width * (0.6 + Math.random() * 0.25);
        this.laserAlpha = 0;
    }
    update() {
        if (this.hitFlash > 0) this.hitFlash--;
        switch (this.state) {
            case 'enter':
                this.x += this.speedX;
                if (this.x <= this.stopX) {
                    this.state = 'aim';
                    this.aimTimer = 0;
                }
                break;
            case 'aim':
                this.aimTimer++;
                this.laserAlpha = Math.min(1, this.aimTimer / this.aimDuration);
                if (this.aimTimer >= this.aimDuration) {
                    this.state = 'fire';
                    // Fire fast aimed shot
                    const a = Math.atan2(this.game.player.y - this.y, this.game.player.x - this.x);
                    const p = new Projectile(this.game, this.x, this.y + this.height / 2, Math.cos(a) * 12, 'ENEMY_AIMED', false);
                    p.speedY = Math.sin(a) * 12;
                    p.color = '#f44';
                    p.width = 12;
                    p.height = 4;
                    p.damage = 1;
                    this.game.projectiles.push(p);
                    this.laserAlpha = 0;
                }
                break;
            case 'fire':
                this.speedX = -(Math.random() * 2 + 3);
                this.state = 'exit';
                break;
            case 'exit':
                this.x += this.speedX;
                break;
        }
        if (this.x + this.width < -20) this.markedForDeletion = true;
        if (this.lives <= 0 && !this.markedForDeletion) {
            this.markedForDeletion = true;
            this.game.score += this.score;
            this.game.ui.score.innerText = 'SCORE: ' + this.game.score;
            this.game.createExplosion(this.x + this.width / 2, this.y + this.height / 2, this.color, 12);
            if (this.game.onEnemyKilled) this.game.onEnemyKilled(this);
            if (this.game.stats) this.game.stats.recordKill('SniperEnemy');
            if (Math.random() < 0.12) {
                const types = ['RATE', 'LIFE', 'BOMB', 'FUNNEL'];
                this.game.powerUps.push(new PowerUp(this.game, this.x, this.y, types[Math.floor(Math.random() * types.length)]));
            }
        }
    }
    draw(ctx) {
        const c = this.hitFlash > 0 ? '#fff' : this.color;
        ctx.fillStyle = c;
        ctx.shadowBlur = 6;
        ctx.shadowColor = '#f44';
        // Long narrow body
        const cx = this.x + this.width / 2, cy = this.y + this.height / 2;
        ctx.beginPath();
        ctx.moveTo(this.x - 8, cy);
        ctx.lineTo(this.x + this.width * 0.6, this.y);
        ctx.lineTo(this.x + this.width + 5, cy);
        ctx.lineTo(this.x + this.width * 0.6, this.y + this.height);
        ctx.closePath();
        ctx.fill();
        // Scope dot
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(this.x + 4, cy, 3, 0, Math.PI * 2);
        ctx.fill();
        // Aiming laser
        if (this.state === 'aim' && this.laserAlpha > 0) {
            ctx.save();
            ctx.globalAlpha = this.laserAlpha * 0.4;
            ctx.strokeStyle = '#f44';
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(this.x, cy);
            ctx.lineTo(this.game.player.x + this.game.player.width / 2, this.game.player.y + this.game.player.height / 2);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.restore();
        }
        ctx.shadowBlur = 0;
    }
}

// ===================== PULSAR =====================
// Periodically emits ring-shaped shockwaves
class PulsarEnemy extends Enemy {
    constructor(game) {
        super(game);
        this.color = '#0af';
        this.lives = 3;
        this.score = 35;
        this.speedX = -(Math.random() * 1.5 + 1.5);
        this.pulseTimer = 0;
        this.pulseInterval = 100 + Math.floor(Math.random() * 30);
        this.pulsePhase = 0;
        this.width = 32;
        this.height = 32;
    }
    update() {
        this.x += this.speedX;
        this.pulsePhase += 0.06;
        this.pulseTimer++;
        if (this.pulseTimer >= this.pulseInterval && this.lives > 0) {
            this.pulseTimer = 0;
            // Emit ring of 6 slow projectiles
            const cx = this.x + this.width / 2, cy = this.y + this.height / 2;
            for (let i = 0; i < 6; i++) {
                const a = (Math.PI * 2 / 6) * i + this.pulsePhase;
                const p = new Projectile(this.game, cx, cy, Math.cos(a) * 2.5, 'ENEMY', false);
                p.speedY = Math.sin(a) * 2.5;
                p.color = '#0af';
                this.game.projectiles.push(p);
            }
        }
        if (this.x + this.width < -20) this.markedForDeletion = true;
        if (this.hitFlash > 0) this.hitFlash--;
        if (this.lives <= 0 && !this.markedForDeletion) {
            this.markedForDeletion = true;
            this.game.score += this.score;
            this.game.ui.score.innerText = 'SCORE: ' + this.game.score;
            this.game.createExplosion(this.x + this.width / 2, this.y + this.height / 2, this.color, 15);
            if (this.game.onEnemyKilled) this.game.onEnemyKilled(this);
            if (this.game.stats) this.game.stats.recordKill('PulsarEnemy');
            if (Math.random() < 0.1) {
                const types = ['RATE', 'LIFE', 'BOMB', 'FUNNEL'];
                this.game.powerUps.push(new PowerUp(this.game, this.x, this.y, types[Math.floor(Math.random() * types.length)]));
            }
        }
    }
    draw(ctx) {
        ctx.save();
        const c = this.hitFlash > 0 ? '#fff' : this.color;
        ctx.fillStyle = c;
        ctx.shadowBlur = 10 + Math.sin(this.pulsePhase) * 5;
        ctx.shadowColor = '#0af';
        const cx = this.x + this.width / 2, cy = this.y + this.height / 2;
        // Pulsing circle
        const r = 14 + Math.sin(this.pulsePhase) * 3;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
        // Inner rings
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.5 + Math.sin(this.pulsePhase * 2) * 0.3;
        ctx.beginPath();
        ctx.arc(cx, cy, r * 0.5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
        // Core
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(cx, cy, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// ===================== CLOAKER =====================
// Approaches invisible, reveals at close range and attacks
class CloakerEnemy extends Enemy {
    constructor(game) {
        super(game);
        this.color = '#4f4';
        this.lives = 2;
        this.score = 45;
        this.speedX = -(Math.random() * 1.5 + 2);
        this.width = 28;
        this.height = 28;
        this.revealed = false;
        this.revealDist = 120 + Math.random() * 60;
        this.alpha = 0.08;
        this.attackFired = false;
    }
    update() {
        this.x += this.speedX;
        if (!this.revealed) {
            const dx = this.game.player.x - this.x;
            const dy = this.game.player.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < this.revealDist) {
                this.revealed = true;
                this.alpha = 1;
                this.game.createExplosion(this.x + this.width / 2, this.y + this.height / 2, '#4f4', 8);
            }
        }
        if (this.revealed && !this.attackFired && this.lives > 0) {
            this.attackFired = true;
            // Fire 3 aimed shots
            for (let i = -1; i <= 1; i++) {
                const a = Math.atan2(this.game.player.y - this.y, this.game.player.x - this.x) + i * 0.2;
                const p = new Projectile(this.game, this.x, this.y + this.height / 2, Math.cos(a) * 6, 'ENEMY_AIMED', false);
                p.speedY = Math.sin(a) * 6;
                p.color = '#4f4';
                this.game.projectiles.push(p);
            }
        }
        if (this.x + this.width < -20) this.markedForDeletion = true;
        if (this.hitFlash > 0) this.hitFlash--;
        if (this.lives <= 0 && !this.markedForDeletion) {
            this.markedForDeletion = true;
            this.game.score += this.score;
            this.game.ui.score.innerText = 'SCORE: ' + this.game.score;
            this.game.createExplosion(this.x + this.width / 2, this.y + this.height / 2, this.color, 15);
            if (this.game.onEnemyKilled) this.game.onEnemyKilled(this);
            if (this.game.stats) this.game.stats.recordKill('CloakerEnemy');
            if (Math.random() < 0.12) {
                const types = ['RATE', 'LIFE', 'BOMB', 'FUNNEL'];
                this.game.powerUps.push(new PowerUp(this.game, this.x, this.y, types[Math.floor(Math.random() * types.length)]));
            }
        }
    }
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        const c = this.hitFlash > 0 ? '#fff' : this.color;
        ctx.fillStyle = c;
        ctx.shadowBlur = this.revealed ? 12 : 0;
        ctx.shadowColor = '#4f4';
        const cx = this.x + this.width / 2, cy = this.y + this.height / 2;
        // Hexagonal body
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const a = (Math.PI * 2 / 6) * i - Math.PI / 6;
            ctx.lineTo(cx + 14 * Math.cos(a), cy + 14 * Math.sin(a));
        }
        ctx.closePath();
        ctx.fill();
        // Eye
        if (this.revealed) {
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(cx - 2, cy, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#f00';
            ctx.beginPath();
            ctx.arc(cx - 2, cy, 1.5, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.shadowBlur = 0;
        ctx.restore();
    }
}

// ===================== MINI CARRIER =====================
// Spawns 2 small drones on death
class MiniCarrierEnemy extends Enemy {
    constructor(game) {
        super(game);
        this.color = '#da0';
        this.lives = 6;
        this.score = 50;
        this.width = 50;
        this.height = 40;
        this.speedX = -(Math.random() * 1 + 1.5);
        this.bayAngle = 0;
    }
    update() {
        this.x += this.speedX;
        this.bayAngle += 0.05;
        if (this.x + this.width < -20) this.markedForDeletion = true;
        if (this.hitFlash > 0) this.hitFlash--;
        if (this.lives <= 0 && !this.markedForDeletion) {
            this.markedForDeletion = true;
            this.game.score += this.score;
            this.game.ui.score.innerText = 'SCORE: ' + this.game.score;
            this.game.createExplosion(this.x + this.width / 2, this.y + this.height / 2, this.color, 20);
            if (this.game.onEnemyKilled) this.game.onEnemyKilled(this);
            if (this.game.stats) this.game.stats.recordKill('MiniCarrierEnemy');
            // Spawn 2 mini drones
            for (let i = 0; i < 2; i++) {
                const drone = new Enemy(this.game);
                drone.x = this.x + this.width / 2 + (i - 0.5) * 20;
                drone.y = this.y + this.height / 2 + (i - 0.5) * 20;
                drone.lives = 1;
                drone.score = 10;
                drone.speedX = -(Math.random() * 2 + 2);
                drone.width = 18;
                drone.height = 18;
                drone.color = '#fa0';
                this.game.enemies.push(drone);
            }
            if (Math.random() < 0.15) {
                const types = ['RATE', 'LIFE', 'BOMB', 'FUNNEL'];
                this.game.powerUps.push(new PowerUp(this.game, this.x, this.y, types[Math.floor(Math.random() * types.length)]));
            }
        }
    }
    draw(ctx) {
        const c = this.hitFlash > 0 ? '#fff' : this.color;
        ctx.fillStyle = c;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#da0';
        // Main hull
        ctx.fillRect(this.x + 5, this.y + 8, this.width - 10, this.height - 16);
        // Top/bottom decks
        ctx.fillStyle = this.hitFlash > 0 ? '#fff' : '#b80';
        ctx.fillRect(this.x, this.y, this.width, 10);
        ctx.fillRect(this.x, this.y + this.height - 10, this.width, 10);
        // Bay doors (animated)
        ctx.fillStyle = '#ff0';
        const bayW = 6 + Math.sin(this.bayAngle) * 2;
        ctx.fillRect(this.x + this.width / 2 - bayW / 2, this.y + this.height / 2 - 3, bayW, 6);
        // Mini drone indicators
        ctx.fillStyle = '#fff';
        ctx.fillRect(this.x + 8, this.y + this.height / 2 - 2, 4, 4);
        ctx.fillRect(this.x + this.width - 12, this.y + this.height / 2 - 2, 4, 4);
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
        if (!this.entered) {
            this.x += this.speedX;
            if (this.x <= this.game.width - this.width - 80) this.entered = true;
            return;
        }
        this.moveAngle += 0.02;
        this.y += Math.sin(this.moveAngle) * 2;
        this.y = Math.max(20, Math.min(this.game.height - this.height - 20, this.y));
        this.actionTimer++;
        if (this.actionTimer >= 40) { // Increased from 25
            this.actionTimer = 0;
            this.attackPattern = (this.attackPattern + 1) % 4;
            switch (this.attackPattern) {
                case 0: this.attackSpread(); break;
                case 1: this.attackAimed(); break;
                case 2: this.attackCircle(); break;
                case 3: this.attackWall(); break;
            }
        }
        if (this.lives <= 0 && !this.markedForDeletion) {
            this.markedForDeletion = true;
            if (this.game.stats) this.game.stats.recordKill('Boss'); // Use fixed ID for Boss or class name
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
        for (let i = -3; i <= 3; i++) { // Reduced from 11 shots to 7
            const p = new Projectile(this.game, this.x, cy, -7, 'ENEMY', false);
            p.speedY = i * 1.2;
            this.game.projectiles.push(p);
        }
    }
    attackAimed() {
        const dx = this.game.player.x - this.x;
        const dy = this.game.player.y - (this.y + this.height / 2);
        const angle = Math.atan2(dy, dx);
        for (let i = -1; i <= 1; i++) {
            const a = angle + i * 0.12;
            const p = new Projectile(this.game, this.x, this.y + this.height / 2, Math.cos(a) * 7, 'ENEMY_AIMED', false);
            p.speedY = Math.sin(a) * 7;
            this.game.projectiles.push(p);
        }
    }
    attackCircle() {
        const cx = this.x + this.width / 4, cy = this.y + this.height / 2;
        const count = 12; // Reduced from 20
        for (let i = 0; i < count; i++) {
            const a = (Math.PI * 2 / count) * i;
            const p = new Projectile(this.game, cx, cy, Math.cos(a) * 5, 'ENEMY', false);
            p.speedY = Math.sin(a) * 5;
            this.game.projectiles.push(p);
        }
    }
    attackWall() {
        for (let i = 0; i < 6; i++) { // Reduced from 10
            const py = (this.game.height / 7) * (i + 1);
            this.game.projectiles.push(new Projectile(this.game, this.x, py, -6, 'ENEMY', false));
        }
    }
    draw(ctx) {
        const c = this.hitFlash > 0 ? '#fff' : this.color;
        ctx.fillStyle = c;
        ctx.shadowBlur = 30;
        ctx.shadowColor = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = '#ff0';
        ctx.beginPath();
        ctx.arc(this.x + 40, this.y + this.height / 2, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = c;
        ctx.beginPath();
        ctx.moveTo(this.x + this.width, this.y);
        ctx.lineTo(this.x + this.width + 35, this.y - 25);
        ctx.lineTo(this.x + this.width, this.y + 25);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(this.x + this.width, this.y + this.height);
        ctx.lineTo(this.x + this.width + 35, this.y + this.height + 25);
        ctx.lineTo(this.x + this.width, this.y + this.height - 25);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
        // Health bar
        const barW = 400, barH = 12;
        const barX = (this.game.width - barW) / 2, barY = this.game.height - 30;
        ctx.fillStyle = '#222';
        ctx.fillRect(barX, barY, barW, barH);

        let ratio = (this.lives || 0) / (this.maxLives || 1);
        if (isNaN(ratio) || !isFinite(ratio)) ratio = 0;
        ratio = Math.max(0, Math.min(1, ratio));

        const grad = ctx.createLinearGradient(barX, barY, barX + Math.max(1, barW * ratio), barY);
        grad.addColorStop(0, '#f00'); grad.addColorStop(1, '#ff0');
        ctx.fillStyle = grad;
        ctx.fillRect(barX, barY, barW * ratio, barH);
        ctx.strokeStyle = '#fff';
        ctx.strokeRect(barX, barY, barW, barH);
        ctx.fillStyle = '#fff';
        ctx.font = '14px Orbitron, Arial';
        ctx.textAlign = 'center';
    }
}

// ===================== SPEED BOSS =====================
class SpeedBoss extends Boss {
    constructor(game) {
        super(game);
        this.color = '#0ff'; // Cyan
        this.speedX = -3; // Faster entry
        this.moveSpeed = 4;
        this.actionInterval = 35; // Increased from 20
    }

    update() {
        if (this.hitFlash > 0) this.hitFlash--;
        if (!this.entered) {
            this.x += this.speedX;
            if (this.x <= this.game.width - this.width - 80) this.entered = true;
            return;
        }

        // More erratic movement
        this.moveAngle += 0.05;
        this.y += Math.sin(this.moveAngle) * this.moveSpeed;
        this.x = (this.game.width - this.width - 80) + Math.cos(this.moveAngle * 0.7) * 50;

        this.y = Math.max(20, Math.min(this.game.height - this.height - 20, this.y));

        this.actionTimer++;
        if (this.actionTimer >= this.actionInterval) {
            this.actionTimer = 0;
            this.attackPattern = (this.attackPattern + 1) % 3;
            switch (this.attackPattern) {
                case 0: this.attackRapidStream(); break;
                case 1: this.attackDash(); break;
                case 2: this.attackOmniBurst(); break;
            }
        }

        if (this.lives <= 0 && !this.markedForDeletion) {
            this.markedForDeletion = true;
            if (this.game.stats) this.game.stats.recordKill('SpeedBoss');
            this.game.score += this.score;
            this.game.ui.score.innerText = 'SCORE: ' + this.game.score;
            this.game.createExplosion(this.x + this.width / 2, this.y + this.height / 2, '#0ff', 40);
            this.game.createExplosion(this.x + this.width / 4, this.y + this.height / 4, '#fff', 20);
            this.game.createExplosion(this.x + this.width * 3 / 4, this.y + this.height * 3 / 4, '#00f', 20);
            this.game.levelManager.onBossDefeated();
        }
    }

    attackRapidStream() {
        const cy = this.y + this.height / 2;
        // Fire 3 quick shots aimed at player
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                if (this.markedForDeletion) return;
                const dx = this.game.player.x - this.x;
                const dy = this.game.player.y - cy;
                const angle = Math.atan2(dy, dx);
                const p = new Projectile(this.game, this.x, cy, Math.cos(angle) * 9, 'ENEMY_AIMED', false);
                p.speedY = Math.sin(angle) * 9;
                p.color = '#0ff';
                this.game.projectiles.push(p);
            }, i * 100);
        }
    }

    attackDash() {
        // Quick dash forward and back
        // For simplicity, just fire a wall of fast projectiles
        for (let i = 0; i < 8; i++) {
            const py = (this.game.height / 9) * (i + 1);
            const p = new Projectile(this.game, this.x, py, -10, 'ENEMY', false);
            p.color = '#fff';
            p.width = 20;
            this.game.projectiles.push(p);
        }
    }

    attackOmniBurst() {
        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;
        for (let i = 0; i < 12; i++) {
            const a = (Math.PI * 2 / 12) * i;
            const p = new Projectile(this.game, cx, cy, Math.cos(a) * 6, 'ENEMY', false);
            p.speedY = Math.sin(a) * 6;
            p.color = '#f0f';
            this.game.projectiles.push(p);
        }
    }

    draw(ctx) {
        const c = this.hitFlash > 0 ? '#fff' : this.color;
        ctx.fillStyle = c;
        ctx.shadowBlur = 30;
        ctx.shadowColor = this.color;

        // Sleeker design
        ctx.beginPath();
        ctx.moveTo(this.x + this.width, this.y); // Top right
        ctx.lineTo(this.x, this.y + this.height / 2); // Middle left (nose)
        ctx.lineTo(this.x + this.width, this.y + this.height); // Bottom right
        ctx.lineTo(this.x + this.width * 0.7, this.y + this.height / 2); // Indent
        ctx.closePath();
        ctx.fill();

        // Engine glow
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(this.x + this.width * 0.8, this.y + this.height * 0.3, 10, 0, Math.PI * 2);
        ctx.arc(this.x + this.width * 0.8, this.y + this.height * 0.7, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;

        // Health bar
        const barW = 400, barH = 12;
        const barX = (this.game.width - barW) / 2, barY = this.game.height - 30;
        ctx.fillStyle = '#222';
        ctx.fillRect(barX, barY, barW, barH);
        let ratio = (this.lives || 0) / (this.maxLives || 1);
        if (isNaN(ratio) || !isFinite(ratio)) ratio = 0;
        ratio = Math.max(0, Math.min(1, ratio));

        const grad = ctx.createLinearGradient(barX, barY, barX + Math.max(1, barW * ratio), barY);
        grad.addColorStop(0, '#0ff'); grad.addColorStop(1, '#fff');
        ctx.fillStyle = grad;
        ctx.fillRect(barX, barY, barW * ratio, barH);
        ctx.strokeStyle = '#fff';
        ctx.strokeRect(barX, barY, barW, barH);
        ctx.fillStyle = '#fff';
        ctx.font = '14px Orbitron, Arial';
        ctx.textAlign = 'center';

        const name = this.game.settings.getText('name_SpeedBoss') || 'SPEED BOSS';
        ctx.fillText(name, this.game.width / 2, barY - 5);
    }
}


// ===================== FORTRESS BOSS =====================
// Massive slow-moving fortress with heavy firepower
class FortressBoss extends Boss {
    constructor(game) {
        super(game);
        this.color = '#fa0';
        this.width = 180;
        this.height = 180;
        this.speedX = -0.5;
        this.actionInterval = 50; // Increased from 35
        this.turretAngle = 0;
    }
    update() {
        if (this.hitFlash > 0) this.hitFlash--;
        if (!this.entered) {
            this.x += this.speedX;
            if (this.x <= this.game.width - this.width - 60) this.entered = true;
            return;
        }
        // Slow vertical hover
        this.moveAngle += 0.012;
        this.y += Math.sin(this.moveAngle) * 1;
        this.y = Math.max(20, Math.min(this.game.height - this.height - 20, this.y));
        this.turretAngle += 0.02;

        this.actionTimer++;
        if (this.actionTimer >= this.actionInterval) {
            this.actionTimer = 0;
            this.attackPattern = (this.attackPattern + 1) % 3;
            switch (this.attackPattern) {
                case 0: this.attackBulletWall(); break;
                case 1: this.attackLaserSweep(); break;
                case 2: this.attackDroneSwarm(); break;
            }
        }
        if (this.lives <= 0 && !this.markedForDeletion) {
            this.markedForDeletion = true;
            if (this.game.stats) this.game.stats.recordKill('FortressBoss');
            this.game.score += this.score;
            this.game.ui.score.innerText = 'SCORE: ' + this.game.score;
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    this.game.createExplosion(
                        this.x + Math.random() * this.width,
                        this.y + Math.random() * this.height,
                        ['#fa0', '#f00', '#ff0'][Math.floor(Math.random() * 3)], 25
                    );
                }, i * 150);
            }
            this.game.levelManager.onBossDefeated();
        }
    }
    attackBulletWall() {
        const count = 10; // Reduced from 15
        for (let i = 0; i < count; i++) {
            const py = (this.game.height / (count + 1)) * (i + 1);
            const p = new Projectile(this.game, this.x, py, -5, 'ENEMY', false);
            p.color = '#fa0';
            this.game.projectiles.push(p);
        }
    }
    attackLaserSweep() {
        const cx = this.x;
        const cy = this.y + this.height / 2;
        for (let i = -3; i <= 3; i++) { // Reduced from -4 to 4 (9 shots to 7)
            const a = (Math.PI / 8) * i + Math.PI;
            const p = new Projectile(this.game, cx, cy, Math.cos(a) * 8, 'ENEMY', false);
            p.speedY = Math.sin(a) * 8;
            p.color = '#ff0';
            p.width = 15;
            p.height = 3;
            this.game.projectiles.push(p);
        }
    }
    attackDroneSwarm() {
        for (let i = 0; i < 3; i++) {
            const dy = (this.height / 4) * (i + 1);
            const p = new Projectile(this.game, this.x, this.y + dy, -3, 'ENEMY_AIMED', false);
            const angle = Math.atan2(this.game.player.y - (this.y + dy), this.game.player.x - this.x);
            p.speedX = Math.cos(angle) * 4;
            p.speedY = Math.sin(angle) * 4;
            p.color = '#f80';
            this.game.projectiles.push(p);
        }
    }
    draw(ctx) {
        const c = this.hitFlash > 0 ? '#fff' : this.color;
        ctx.fillStyle = c;
        ctx.shadowBlur = 25;
        ctx.shadowColor = this.color;
        // Main body
        ctx.fillRect(this.x + 20, this.y + 10, this.width - 40, this.height - 20);
        // Top/bottom armor plates
        ctx.fillRect(this.x, this.y + 30, this.width, 30);
        ctx.fillRect(this.x, this.y + this.height - 60, this.width, 30);
        // Core
        ctx.fillStyle = '#ff0';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, 20, 0, Math.PI * 2);
        ctx.fill();
        // Turrets
        ctx.fillStyle = c;
        const tx = this.x + 10;
        ctx.fillRect(tx, this.y, 20, 20);
        ctx.fillRect(tx, this.y + this.height - 20, 20, 20);
        ctx.shadowBlur = 0;
        // Health bar
        const barW = 400, barH = 12;
        const barX = (this.game.width - barW) / 2, barY = this.game.height - 30;
        ctx.fillStyle = '#222';
        ctx.fillRect(barX, barY, barW, barH);
        let ratio = (this.lives || 0) / (this.maxLives || 1);
        if (isNaN(ratio) || !isFinite(ratio)) ratio = 0;
        ratio = Math.max(0, Math.min(1, ratio));

        const grad = ctx.createLinearGradient(barX, barY, barX + Math.max(1, barW * ratio), barY);
        grad.addColorStop(0, '#fa0'); grad.addColorStop(1, '#ff0');
        ctx.fillStyle = grad;
        ctx.fillRect(barX, barY, barW * ratio, barH);
        ctx.strokeStyle = '#fff';
        ctx.strokeRect(barX, barY, barW, barH);
        ctx.fillStyle = '#fff';
        ctx.font = '14px Orbitron, Arial';
        ctx.textAlign = 'center';
        const name = this.game.settings.getText('name_FortressBoss') || 'FORTRESS';
        ctx.fillText(name, this.game.width / 2, barY - 5);
    }
}

// ===================== PHANTOM BOSS =====================
// Teleporting trickster boss
class PhantomBoss extends Boss {
    constructor(game) {
        super(game);
        this.color = '#a0f';
        this.width = 120;
        this.height = 120;
        this.speedX = -2;
        this.teleportTimer = 0;
        this.teleportInterval = 120;
        this.alpha = 1;
        this.fadeDir = 0;
    }
    update() {
        if (this.hitFlash > 0) this.hitFlash--;
        if (!this.entered) {
            this.x += this.speedX;
            if (this.x <= this.game.width - this.width - 80) this.entered = true;
            return;
        }
        // Gentle float
        this.moveAngle += 0.03;
        this.y += Math.sin(this.moveAngle) * 1.5;
        this.y = Math.max(20, Math.min(this.game.height - this.height - 20, this.y));

        // Teleport mechanic
        this.teleportTimer++;
        if (this.fadeDir === 1) {
            this.alpha -= 0.05;
            if (this.alpha <= 0) {
                this.alpha = 0;
                this.fadeDir = 2;
                // Teleport to new position
                this.x = this.game.width * 0.5 + Math.random() * (this.game.width * 0.4);
                this.y = 30 + Math.random() * (this.game.height - this.height - 60);
            }
        } else if (this.fadeDir === 2) {
            this.alpha += 0.05;
            if (this.alpha >= 1) {
                this.alpha = 1;
                this.fadeDir = 0;
                this.teleportTimer = 0;
            }
        } else if (this.teleportTimer >= this.teleportInterval) {
            this.fadeDir = 1;
        }

        this.actionTimer++;
        if (this.actionTimer >= 45) { // Increased from 30
            this.actionTimer = 0;
            this.attackPattern = (this.attackPattern + 1) % 3;
            switch (this.attackPattern) {
                case 0: this.attackSnipe(); break;
                case 1: this.attackCloneShot(); break;
                case 2: this.attackVoidBurst(); break;
            }
        }
        if (this.lives <= 0 && !this.markedForDeletion) {
            this.markedForDeletion = true;
            if (this.game.stats) this.game.stats.recordKill('PhantomBoss');
            this.game.score += this.score;
            this.game.ui.score.innerText = 'SCORE: ' + this.game.score;
            this.game.createExplosion(this.x + this.width / 2, this.y + this.height / 2, '#a0f', 40);
            this.game.createExplosion(this.x + this.width / 2, this.y + this.height / 2, '#fff', 20);
            this.game.levelManager.onBossDefeated();
        }
    }
    attackSnipe() {
        const dx = this.game.player.x - this.x;
        const dy = this.game.player.y - (this.y + this.height / 2);
        const angle = Math.atan2(dy, dx);
        const p = new Projectile(this.game, this.x, this.y + this.height / 2, Math.cos(angle) * 12, 'ENEMY_AIMED', false);
        p.speedY = Math.sin(angle) * 12;
        p.color = '#f0f';
        p.width = 12;
        p.height = 12;
        this.game.projectiles.push(p);
    }
    attackCloneShot() {
        // Fire from 3 phantom positions
        for (let i = 0; i < 3; i++) {
            const ox = this.x + (i - 1) * 60;
            const oy = this.y + this.height / 2;
            const a = Math.atan2(this.game.player.y - oy, this.game.player.x - ox);
            const p = new Projectile(this.game, ox, oy, Math.cos(a) * 7, 'ENEMY_AIMED', false);
            p.speedY = Math.sin(a) * 7;
            p.color = '#c0f';
            this.game.projectiles.push(p);
        }
    }
    attackVoidBurst() {
        const cx = this.x + this.width / 2, cy = this.y + this.height / 2;
        const count = 6; // Reduced from 8
        for (let i = 0; i < count; i++) {
            const a = (Math.PI * 2 / count) * i + this.moveAngle;
            const p = new Projectile(this.game, cx, cy, Math.cos(a) * 4, 'ENEMY', false);
            p.speedY = Math.sin(a) * 4;
            p.color = '#a0f';
            this.game.projectiles.push(p);
        }
    }
    draw(ctx) {
        ctx.globalAlpha = this.alpha;
        const c = this.hitFlash > 0 ? '#fff' : this.color;
        ctx.fillStyle = c;
        ctx.shadowBlur = 30;
        ctx.shadowColor = '#f0f';
        // Ghost-like diamond body
        const cx = this.x + this.width / 2, cy = this.y + this.height / 2;
        ctx.beginPath();
        ctx.moveTo(cx, this.y);
        ctx.lineTo(this.x + this.width, cy);
        ctx.lineTo(cx, this.y + this.height);
        ctx.lineTo(this.x, cy);
        ctx.closePath();
        ctx.fill();
        // Inner eye
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(cx, cy, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
        // Health bar
        const barW = 400, barH = 12;
        const barX = (this.game.width - barW) / 2, barY = this.game.height - 30;
        ctx.fillStyle = '#222';
        ctx.fillRect(barX, barY, barW, barH);

        let ratio = (this.lives || 0) / (this.maxLives || 1);
        if (isNaN(ratio) || !isFinite(ratio)) ratio = 0;
        ratio = Math.max(0, Math.min(1, ratio));

        const grad = ctx.createLinearGradient(barX, barY, barX + Math.max(1, barW * ratio), barY);
        grad.addColorStop(0, '#a0f'); grad.addColorStop(1, '#f0f');
        ctx.fillStyle = grad;
        ctx.fillRect(barX, barY, barW * ratio, barH);
        ctx.strokeStyle = '#fff';
        ctx.strokeRect(barX, barY, barW, barH);
        ctx.fillStyle = '#fff';
        ctx.font = '14px Orbitron, Arial';
        ctx.textAlign = 'center';
        const name = this.game.settings.getText('name_PhantomBoss') || 'PHANTOM';
        ctx.fillText(name, this.game.width / 2, barY - 5);
    }
}

// ===================== STORM BOSS =====================
// Storm-type boss with spiral and tornado attacks
class StormBoss extends Boss {
    constructor(game) {
        super(game);
        this.color = '#0f0';
        this.width = 140;
        this.height = 140;
        this.speedX = -1.5;
        this.spiralAngle = 0;
        this.rotationSpeed = 0.06;
    }
    update() {
        if (this.hitFlash > 0) this.hitFlash--;
        if (!this.entered) {
            this.x += this.speedX;
            if (this.x <= this.game.width - this.width - 80) this.entered = true;
            return;
        }
        // Circular movement
        this.moveAngle += 0.025;
        this.x = (this.game.width - this.width - 80) + Math.cos(this.moveAngle) * 40;
        this.y = (this.game.height - this.height) / 2 + Math.sin(this.moveAngle * 1.3) * 80;
        this.y = Math.max(20, Math.min(this.game.height - this.height - 20, this.y));
        this.spiralAngle += this.rotationSpeed;

        this.actionTimer++;
        if (this.actionTimer >= 35) { // Increased from 22
            this.actionTimer = 0;
            this.attackPattern = (this.attackPattern + 1) % 3;
            switch (this.attackPattern) {
                case 0: this.attackSpiral(); break;
                case 1: this.attackTornado(); break;
                case 2: this.attackLightning(); break;
            }
        }
        if (this.lives <= 0 && !this.markedForDeletion) {
            this.markedForDeletion = true;
            if (this.game.stats) this.game.stats.recordKill('StormBoss');
            this.game.score += this.score;
            this.game.ui.score.innerText = 'SCORE: ' + this.game.score;
            this.game.createExplosion(this.x + this.width / 2, this.y + this.height / 2, '#0f0', 40);
            this.game.createExplosion(this.x + this.width / 2, this.y + this.height / 2, '#ff0', 30);
            this.game.levelManager.onBossDefeated();
        }
    }
    attackSpiral() {
        const cx = this.x + this.width / 2, cy = this.y + this.height / 2;
        const count = 4; // Reduced from 6
        for (let i = 0; i < count; i++) {
            const a = this.spiralAngle + (Math.PI * 2 / count) * i;
            const p = new Projectile(this.game, cx, cy, Math.cos(a) * 5, 'ENEMY', false);
            p.speedY = Math.sin(a) * 5;
            p.color = '#0f0';
            this.game.projectiles.push(p);
        }
    }
    attackTornado() {
        const cx = this.x, cy = this.y + this.height / 2;
        for (let i = 0; i < 3; i++) { // Reduced from 5
            const offset = (i - 1) * 35;
            const p = new Projectile(this.game, cx, cy + offset, -6 - i * 0.5, 'ENEMY', false);
            p.speedY = Math.sin(i) * 2;
            p.color = '#8f8';
            this.game.projectiles.push(p);
        }
    }
    attackLightning() {
        // Fast aimed shots
        for (let i = 0; i < 4; i++) {
            setTimeout(() => {
                if (this.markedForDeletion) return;
                const a = Math.atan2(this.game.player.y - (this.y + this.height / 2), this.game.player.x - this.x);
                const p = new Projectile(this.game, this.x, this.y + this.height / 2, Math.cos(a) * 10, 'ENEMY_AIMED', false);
                p.speedY = Math.sin(a) * 10;
                p.color = '#ff0';
                this.game.projectiles.push(p);
            }, i * 80);
        }
    }
    draw(ctx) {
        const c = this.hitFlash > 0 ? '#fff' : this.color;
        ctx.fillStyle = c;
        ctx.shadowBlur = 25;
        ctx.shadowColor = '#0f0';
        // Swirling body
        const cx = this.x + this.width / 2, cy = this.y + this.height / 2, r = this.width / 2;
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
            const a = this.spiralAngle + (Math.PI * 2 / 8) * i;
            const outerR = r * (0.85 + Math.sin(a * 3) * 0.15);
            ctx.lineTo(cx + Math.cos(a) * outerR, cy + Math.sin(a) * outerR);
        }
        ctx.closePath();
        ctx.fill();
        // Inner vortex
        ctx.fillStyle = '#8f8';
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const a = -this.spiralAngle * 2 + (Math.PI * 2 / 6) * i;
            ctx.lineTo(cx + Math.cos(a) * r * 0.4, cy + Math.sin(a) * r * 0.4);
        }
        ctx.closePath();
        ctx.fill();
        // Core
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(cx, cy, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        // Health bar
        const barW = 400, barH = 12;
        const barX = (this.game.width - barW) / 2, barY = this.game.height - 30;
        ctx.fillStyle = '#222';
        ctx.fillRect(barX, barY, barW, barH);

        let ratio = (this.lives || 0) / (this.maxLives || 1);
        if (isNaN(ratio) || !isFinite(ratio)) ratio = 0;
        ratio = Math.max(0, Math.min(1, ratio));

        const grad = ctx.createLinearGradient(barX, barY, barX + Math.max(1, barW * ratio), barY);
        grad.addColorStop(0, '#0f0'); grad.addColorStop(1, '#ff0');
        ctx.fillStyle = grad;
        ctx.fillRect(barX, barY, barW * ratio, barH);
        ctx.strokeStyle = '#fff';
        ctx.strokeRect(barX, barY, barW, barH);
        ctx.fillStyle = '#fff';
        ctx.font = '14px Orbitron, Arial';
        ctx.textAlign = 'center';
        const name = this.game.settings.getText('name_StormBoss') || 'STORM LORD';
        ctx.fillText(name, this.game.width / 2, barY - 5);
    }
}

// ===================== HYDRA BOSS =====================
// Multi-headed boss with multiple attack origins
class HydraBoss extends Boss {
    constructor(game) {
        super(game);
        this.color = '#f44';
        this.width = 160;
        this.height = 170;
        this.speedX = -1;
        this.headAngles = [0, 0, 0];
    }
    update() {
        if (this.hitFlash > 0) this.hitFlash--;
        if (!this.entered) {
            this.x += this.speedX;
            if (this.x <= this.game.width - this.width - 70) this.entered = true;
            return;
        }
        this.moveAngle += 0.018;
        this.y += Math.sin(this.moveAngle) * 1.8;
        this.y = Math.max(30, Math.min(this.game.height - this.height - 30, this.y));
        // Animate heads
        for (let i = 0; i < 3; i++) {
            this.headAngles[i] += 0.03 + i * 0.01;
        }

        this.actionTimer++;
        if (this.actionTimer >= 40) { // Increased from 28
            this.actionTimer = 0;
            this.attackPattern = (this.attackPattern + 1) % 3;
            switch (this.attackPattern) {
                case 0: this.attackTripleShot(); break;
                case 1: this.attackHomingSwarm(); break;
                case 2: this.attackHeadSpin(); break;
            }
        }
        if (this.lives <= 0 && !this.markedForDeletion) {
            this.markedForDeletion = true;
            if (this.game.stats) this.game.stats.recordKill('HydraBoss');
            this.game.score += this.score;
            this.game.ui.score.innerText = 'SCORE: ' + this.game.score;
            this.game.createExplosion(this.x + this.width / 2, this.y + this.height / 2, '#f44', 40);
            this.game.createExplosion(this.x + 30, this.y + 30, '#f80', 20);
            this.game.createExplosion(this.x + 30, this.y + this.height - 30, '#ff0', 20);
            this.game.levelManager.onBossDefeated();
        }
    }
    _getHeadPositions() {
        const cx = this.x + 20;
        return [
            { x: cx, y: this.y + 25 },
            { x: cx, y: this.y + this.height / 2 },
            { x: cx, y: this.y + this.height - 25 }
        ];
    }
    attackTripleShot() {
        const heads = this._getHeadPositions();
        heads.forEach(h => {
            const a = Math.atan2(this.game.player.y - h.y, this.game.player.x - h.x);
            const p = new Projectile(this.game, h.x, h.y, Math.cos(a) * 7, 'ENEMY_AIMED', false);
            p.speedY = Math.sin(a) * 7;
            p.color = '#f44';
            this.game.projectiles.push(p);
        });
    }
    attackHomingSwarm() {
        const heads = this._getHeadPositions();
        heads.forEach(h => {
            for (let i = -1; i <= 1; i++) {
                const a = Math.atan2(this.game.player.y - h.y, this.game.player.x - h.x) + i * 0.3;
                const p = new Projectile(this.game, h.x, h.y, Math.cos(a) * 5, 'ENEMY', false);
                p.speedY = Math.sin(a) * 5;
                p.color = '#f80';
                this.game.projectiles.push(p);
            }
        });
    }
    attackHeadSpin() {
        const cx = this.x + this.width / 2, cy = this.y + this.height / 2;
        const count = 8; // Reduced from 12
        for (let i = 0; i < count; i++) {
            const a = (Math.PI * 2 / count) * i + this.moveAngle;
            const p = new Projectile(this.game, cx, cy, Math.cos(a) * 5.5, 'ENEMY', false);
            p.speedY = Math.sin(a) * 5.5;
            p.color = '#ff4';
            this.game.projectiles.push(p);
        }
    }
    draw(ctx) {
        const c = this.hitFlash > 0 ? '#fff' : this.color;
        ctx.fillStyle = c;
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#f44';
        // Main body
        const cx = this.x + this.width / 2, cy = this.y + this.height / 2;
        ctx.beginPath();
        ctx.ellipse(cx, cy, this.width / 2 - 10, this.height / 2 - 10, 0, 0, Math.PI * 2);
        ctx.fill();
        // Three heads (necks + circles)
        const heads = this._getHeadPositions();
        heads.forEach((h, i) => {
            ctx.strokeStyle = c;
            ctx.lineWidth = 8;
            ctx.beginPath();
            ctx.moveTo(cx, cy + (i - 1) * 35);
            ctx.quadraticCurveTo(h.x + 40, h.y, h.x, h.y);
            ctx.stroke();
            ctx.lineWidth = 1;
            ctx.fillStyle = c;
            ctx.beginPath();
            ctx.arc(h.x, h.y, 16, 0, Math.PI * 2);
            ctx.fill();
            // Eyes
            ctx.fillStyle = '#ff0';
            ctx.beginPath();
            ctx.arc(h.x - 4, h.y - 3, 4, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.shadowBlur = 0;
        // Health bar
        const barW = 400, barH = 12;
        const barX = (this.game.width - barW) / 2, barY = this.game.height - 30;
        ctx.fillStyle = '#222';
        ctx.fillRect(barX, barY, barW, barH);

        let ratio = (this.lives || 0) / (this.maxLives || 1);
        if (isNaN(ratio) || !isFinite(ratio)) ratio = 0;
        ratio = Math.max(0, Math.min(1, ratio));

        const grad = ctx.createLinearGradient(barX, barY, barX + Math.max(1, barW * ratio), barY);
        grad.addColorStop(0, '#f44'); grad.addColorStop(1, '#ff4');
        ctx.fillStyle = grad;
        ctx.fillRect(barX, barY, barW * ratio, barH);
        ctx.strokeStyle = '#fff';
        ctx.strokeRect(barX, barY, barW, barH);
        ctx.fillStyle = '#fff';
        ctx.font = '14px Orbitron, Arial';
        ctx.textAlign = 'center';
        const name = this.game.settings.getText('name_HydraBoss') || 'HYDRA';
        ctx.fillText(name, this.game.width / 2, barY - 5);
    }
}

// ===================== NEMESIS BOSS =====================
// Ultimate boss with phase transitions
class NemesisBoss extends Boss {
    constructor(game) {
        super(game);
        this.color = '#fff';
        this.width = 160;
        this.height = 160;
        this.speedX = -1.5;
        this.phase = 1; // 1 = normal, 2 = enraged (below 50% HP)
        this.phaseAngle = 0;
    }
    update() {
        if (this.hitFlash > 0) this.hitFlash--;
        if (!this.entered) {
            this.x += this.speedX;
            if (this.x <= this.game.width - this.width - 80) this.entered = true;
            return;
        }

        // Phase transition at 50% HP
        if (this.phase === 1 && this.lives <= this.maxLives * 0.5) {
            this.phase = 2;
            this.color = '#f0f';
            this.game.createExplosion(this.x + this.width / 2, this.y + this.height / 2, '#f0f', 30);
        }

        const speed = this.phase === 2 ? 3 : 1.5;
        this.moveAngle += this.phase === 2 ? 0.04 : 0.02;
        this.phaseAngle += 0.03;
        this.y += Math.sin(this.moveAngle) * speed;
        this.x = (this.game.width - this.width - 80) + Math.cos(this.moveAngle * 0.8) * (this.phase === 2 ? 60 : 30);
        this.y = Math.max(20, Math.min(this.game.height - this.height - 20, this.y));

        const interval = this.phase === 2 ? 25 : 40; // Increased from 15/25
        this.actionTimer++;
        if (this.actionTimer >= interval) {
            this.actionTimer = 0;
            const patterns = this.phase === 2 ? 5 : 4;
            this.attackPattern = (this.attackPattern + 1) % patterns;
            switch (this.attackPattern) {
                case 0: this.attackSpread(); break;
                case 1: this.attackAimed(); break;
                case 2: this.attackCircle(); break;
                case 3: this.attackCross(); break;
                case 4: this.attackRage(); break;
            }
        }
        if (this.lives <= 0 && !this.markedForDeletion) {
            this.markedForDeletion = true;
            if (this.game.stats) this.game.stats.recordKill('NemesisBoss');
            this.game.score += this.score;
            this.game.ui.score.innerText = 'SCORE: ' + this.game.score;
            // Massive explosion sequence
            for (let i = 0; i < 8; i++) {
                setTimeout(() => {
                    this.game.createExplosion(
                        this.x + Math.random() * this.width,
                        this.y + Math.random() * this.height,
                        ['#fff', '#f0f', '#0ff', '#ff0'][Math.floor(Math.random() * 4)], 20
                    );
                }, i * 100);
            }
            this.game.levelManager.onBossDefeated();
        }
    }
    attackCross() {
        const cx = this.x, cy = this.y + this.height / 2;
        const count = 6; // Reduced from 8
        for (let i = 0; i < count; i++) {
            const py = (this.game.height / (count + 1)) * (i + 1);
            const p = new Projectile(this.game, cx, py, -7, 'ENEMY', false);
            p.color = this.phase === 2 ? '#f0f' : '#fff';
            this.game.projectiles.push(p);
        }
    }
    attackRage() {
        // Phase 2 only: rapid spiral + aimed combo
        const cx = this.x + this.width / 2, cy = this.y + this.height / 2;
        const count = 7; // Reduced from 10
        for (let i = 0; i < count; i++) {
            const a = this.phaseAngle + (Math.PI * 2 / count) * i;
            const p = new Projectile(this.game, cx, cy, Math.cos(a) * 6, 'ENEMY', false);
            p.speedY = Math.sin(a) * 6;
            p.color = '#f0f';
            this.game.projectiles.push(p);
        }
        // Plus aimed
        const a = Math.atan2(this.game.player.y - cy, this.game.player.x - cx);
        for (let i = -1; i <= 1; i++) {
            const angle = a + i * 0.15;
            const p = new Projectile(this.game, cx, cy, Math.cos(angle) * 9, 'ENEMY_AIMED', false);
            p.speedY = Math.sin(angle) * 9;
            p.color = '#fff';
            this.game.projectiles.push(p);
        }
    }
    draw(ctx) {
        const c = this.hitFlash > 0 ? '#fff' : this.color;
        ctx.fillStyle = c;
        ctx.shadowBlur = this.phase === 2 ? 40 : 25;
        ctx.shadowColor = this.phase === 2 ? '#f0f' : '#fff';
        // Geometric body
        const cx = this.x + this.width / 2, cy = this.y + this.height / 2, r = this.width / 2;
        ctx.beginPath();
        const sides = this.phase === 2 ? 6 : 8;
        for (let i = 0; i < sides; i++) {
            const a = this.phaseAngle + (Math.PI * 2 / sides) * i;
            ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
        }
        ctx.closePath();
        ctx.fill();
        // Inner shape
        ctx.fillStyle = this.phase === 2 ? '#f0f' : '#aaa';
        ctx.beginPath();
        for (let i = 0; i < sides; i++) {
            const a = -this.phaseAngle * 1.5 + (Math.PI * 2 / sides) * i;
            ctx.lineTo(cx + Math.cos(a) * r * 0.5, cy + Math.sin(a) * r * 0.5);
        }
        ctx.closePath();
        ctx.fill();
        // Core
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(cx, cy, this.phase === 2 ? 14 : 10, 0, Math.PI * 2);
        ctx.fill();
        // Phase 2 aura rings
        if (this.phase === 2) {
            ctx.strokeStyle = `rgba(255, 0, 255, ${0.3 + Math.sin(this.phaseAngle * 3) * 0.2})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(cx, cy, r + 10 + Math.sin(this.phaseAngle * 2) * 5, 0, Math.PI * 2);
            ctx.stroke();
            ctx.lineWidth = 1;
        }
        ctx.shadowBlur = 0;
        // Health bar
        const barW = 400, barH = 12;
        const barX = (this.game.width - barW) / 2, barY = this.game.height - 30;
        ctx.fillStyle = '#222';
        ctx.fillRect(barX, barY, barW, barH);
        let ratio = (this.lives || 0) / (this.maxLives || 1);
        if (isNaN(ratio) || !isFinite(ratio)) ratio = 0;
        ratio = Math.max(0, Math.min(1, ratio));

        const grad = ctx.createLinearGradient(barX, barY, barX + Math.max(1, barW * ratio), barY);
        if (this.phase === 2) {
            grad.addColorStop(0, '#f0f'); grad.addColorStop(1, '#fff');
        } else {
            grad.addColorStop(0, '#fff'); grad.addColorStop(1, '#0ff');
        }
        ctx.fillStyle = grad;
        ctx.fillRect(barX, barY, barW * ratio, barH);
        ctx.strokeStyle = '#fff';
        ctx.strokeRect(barX, barY, barW, barH);
        ctx.fillStyle = '#fff';
        ctx.font = '14px Orbitron, Arial';
        ctx.textAlign = 'center';
        const name = this.game.settings.getText('name_NemesisBoss') || 'NEMESIS';
        ctx.fillText(name, this.game.width / 2, barY - 5);
    }
}


// ===================== PLAYER =====================
class Player {
    constructor(game) {
        this.game = game;
        const d = game.difficulty || DIFFICULTY.NORMAL;
        this.width = 45;
        this.height = 26;
        this.x = 50;
        this.y = game.height / 2;
        // Ship Type Logic
        this.type = this.game.selectedShipType || 'VANGUARD';

        // Base stats
        this.speed = d.playerSpeed;
        this.shootTimer = 0;
        this.shootInterval = d.shootInterval;
        this.weaponType = 'DEFAULT';
        this.fireRateLevel = 0; // 0-5
        this.invincible = 0;
        this.funnels = [];
        this.bombTimer = 0; // Cooldown between bombs
        this.bombInteractTimer = 0; // To prevent accidental double taps

        // Apply Ship Specifics
        if (this.type === 'STORM') {
            this.speed *= 1.15;
            this.color = '#ff0';
            this.weaponType = 'HOMING';
            this.addFunnel();
        } else if (this.type === 'BASTION') {
            this.speed *= 0.7;
            this.color = '#f00';
            this.weaponType = 'SPREAD';
            this.shield = 2;
            this.maxShield = 2;
        } else if (this.type === 'BLADE') {
            this.speed *= 1.1;
            this.color = '#f80';
            this.weaponType = 'SLASH';
            this.shootInterval += 30; // Slower fire rate for balance (Heavy weapon)
        } else if (this.type === 'RAY') {
            this.speed *= 0.9;
            this.color = '#8ff';
            this.weaponType = 'LASER';
            this.shootInterval = Math.max(3, this.shootInterval - 4);
        } else {
            // VANGUARD
            this.color = '#0ff';
            this.weaponType = 'DEFAULT';
        }
    }
    getFireInterval() {
        return Math.max(6, this.shootInterval - this.fireRateLevel * 2);
    }
    update() {
        if (this.game.input.isDown('ArrowUp') || this.game.input.isDown('KeyW')) this.y -= this.speed;
        if (this.game.input.isDown('ArrowDown') || this.game.input.isDown('KeyS')) this.y += this.speed;
        if (this.game.input.isDown('ArrowLeft') || this.game.input.isDown('KeyA')) this.x -= this.speed;
        if (this.game.input.isDown('ArrowRight') || this.game.input.isDown('KeyD')) this.x += this.speed;
        this.x = Math.max(0, Math.min(this.game.width - this.width, this.x));
        this.y = Math.max(0, Math.min(this.game.height - this.height, this.y));
        if (this.invincible > 0) this.invincible--;
        if (this.shootTimer > 0) this.shootTimer--;
        if ((this.game.input.isDown(' ') || this.game.input.isDown('KeyZ') || this.game.input.isDown('Enter')) && this.shootTimer === 0) {
            this.shoot();
            this.shootTimer = this.getFireInterval();
        }

        // Bomb Input
        if (this.bombTimer > 0) this.bombTimer--;
        if (this.bombInteractTimer > 0) this.bombInteractTimer--;
        if ((this.game.input.isDown('KeyX') || this.game.input.isDown('KeyB')) && this.bombInteractTimer === 0) {
            if (this.game.bombs > 0 && this.bombTimer === 0) {
                this.game.triggerBomb();
                this.bombTimer = 180; // 3 seconds global cooldown
                this.bombInteractTimer = 30; // Input debounce
            }
        }
        // Update funnels
        this.funnels.forEach(f => f.update());
        this.funnels = this.funnels.filter(f => !f.markedForDeletion);
        // Bastion shield regeneration
        if (this.type === 'BASTION' && this.shield < this.maxShield) {
            if (!this.shieldRegenTimer) this.shieldRegenTimer = 0;
            this.shieldRegenTimer++;
            if (this.shieldRegenTimer >= 600) { // 10 seconds at 60fps
                this.shield++;
                this.shieldRegenTimer = 0;
                this.game.createExplosion(this.x + this.width / 2, this.y + this.height / 2, '#0ff', 6);
            }
        } else if (this.type === 'BASTION') {
            this.shieldRegenTimer = 0;
        }
    }
    shoot() {
        const px = this.x + this.width;
        const py = this.y + this.height / 2;

        // Boss Mode special shooting
        if (this.game.bossModeActive) {
            const count = 5;
            for (let i = 0; i < count; i++) {
                const angle = (Math.PI / 6) * (i - (count - 1) / 2);
                const p = new Projectile(this.game, this.x + this.width, this.y + this.height / 2, Math.cos(angle) * 12, 'DEFAULT');
                p.speedY = Math.sin(angle) * 12;
                p.color = '#f0f';
                p.width = 15;
                p.height = 5;
                p.damage = 3; // Powerful!
                this.game.projectiles.push(p);
            }
            this.game.soundManager.play('se_shoot');
            return;
        }

        switch (this.weaponType) {
            case 'SPREAD': {
                for (let i = -1; i <= 1; i++) {
                    const p = new Projectile(this.game, px, py, 8, 'SPREAD', true);
                    p.speedY = i * 1.8;
                    this.game.projectiles.push(p);
                }
                break;
            }
            case 'LASER': {
                this.game.projectiles.push(new Projectile(this.game, px, py, 14, 'LASER', true));
                break;
            }
            case 'HOMING': {
                this.game.projectiles.push(new Projectile(this.game, px, py, 6, 'HOMING', true));
                break;
            }
            case 'SLASH': {
                // Spawn further forward due to huge size
                const p = new Projectile(this.game, px + 50, py, 4, 'SLASH', true);
                this.game.projectiles.push(p);
                break;
            }
            default: {
                this.game.projectiles.push(new Projectile(this.game, px, py, 8, 'DEFAULT', true));
                break;
            }
        }
    }

    draw(ctx) {
        const isBoss = this.game.bossModeActive;
        const scale = isBoss ? 1.5 : 1.0;
        const drawW = this.width * scale;
        const drawH = this.height * scale;
        const drawX = this.x - (drawW - this.width) / 2;
        const drawY = this.y - (drawH - this.height) / 2;

        if (this.invincible % 4 > 1) return;

        ctx.save();
        if (isBoss) {
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#f0f';
        }

        const c = isBoss ? '#f0f' : this.color;
        ctx.fillStyle = c;
        // Main Body
        if (this.type === 'BASTION' && !isBoss) {
            // Bulky blocky body
            ctx.fillRect(drawX, drawY, drawW, drawH);
            ctx.fillStyle = '#fff';
            ctx.fillRect(drawX + drawW * 0.45, drawY + drawH * 0.2, drawW * 0.2, drawH * 0.6);
            // Draw shield if active
            if (this.shield > 0) {
                ctx.strokeStyle = `rgba(0, 255, 255, ${this.shield / this.maxShield})`;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(drawX + drawW / 2, drawY + drawH / 2, 35 * scale, 0, Math.PI * 2);
                ctx.stroke();
                ctx.lineWidth = 1;
            }
        } else if (this.type === 'STORM' && !isBoss) {
            // Sleek delta
            ctx.beginPath();
            ctx.moveTo(drawX + drawW, drawY + drawH / 2);
            ctx.lineTo(drawX, drawY);
            ctx.lineTo(drawX + drawW * 0.2, drawY + drawH / 2);
            ctx.lineTo(drawX, drawY + drawH);
            ctx.closePath();
            ctx.fill();
        } else {
            // VANGUARD / Boss / default
            ctx.beginPath();
            ctx.moveTo(drawX, drawY + drawH / 2);
            ctx.lineTo(drawX + drawW * 0.8, drawY);
            ctx.lineTo(drawX + drawW, drawY + drawH / 2);
            ctx.lineTo(drawX + drawW * 0.8, drawY + drawH);
            ctx.closePath();
            ctx.fill();

            // Cockpit
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(drawX + drawW * 0.45, drawY + drawH / 2, drawH * 0.2, 0, Math.PI * 2);
            ctx.fill();
        }

        // Glow/Engine
        ctx.fillStyle = isBoss ? '#f0f' : this.color;
        ctx.fillRect(drawX, drawY + drawH * 0.3, drawW * 0.2, drawH * 0.4);

        ctx.restore();

        ctx.shadowBlur = 0;

        // Health bar
        const barW = 400, barH = 12;
        const barX = (this.game.width - barW) / 2, barY = this.game.height - 30;
        ctx.fillStyle = '#222';
        ctx.fillRect(barX, barY, barW, barH);

        const currentLives = this.game.lives || 0;
        const maxLives = (this.game.difficulty && this.game.difficulty.lives) || 1;
        let ratio = currentLives / maxLives;
        if (isNaN(ratio) || !isFinite(ratio)) ratio = 0;
        ratio = Math.max(0, Math.min(1, ratio));

        const grad = ctx.createLinearGradient(barX, barY, barX + Math.max(1, barW * ratio), barY);
        grad.addColorStop(0, '#00f'); grad.addColorStop(1, '#0ff');
        ctx.fillStyle = grad;
        ctx.fillRect(barX, barY, barW * ratio, barH);
        ctx.strokeStyle = '#fff';
        ctx.strokeRect(barX, barY, barW, barH);
        ctx.fillStyle = '#fff';
        ctx.font = '14px Orbitron, Arial';
        ctx.textAlign = 'center';
        ctx.fillText('PLAYER HP', this.game.width / 2, barY - 5);

        this.funnels.forEach(f => f.draw(ctx));
    }
    addFunnel() {
        // Max 4 funnels
        if (this.funnels.length >= 4) return;
        const idx = this.funnels.length;
        this.funnels.push(new FunnelBit(this.game, this, idx));
    }
}

// ===================== FUNNEL BIT =====================
class FunnelBit {
    constructor(game, player, index) {
        this.game = game;
        this.player = player;
        this.index = index;
        this.angle = (Math.PI * 2 / 4) * index;
        this.orbitRadius = 50 + index * 12;
        this.orbitSpeed = 0.04;
        this.x = player.x;
        this.y = player.y;
        this.width = 10;
        this.height = 10;
        this.shootTimer = 0;
        this.shootInterval = 30; // Auto-fire interval
        this.markedForDeletion = false;
        this.life = 1800; // ~30 seconds at 60fps
        this.glowPhase = Math.random() * Math.PI * 2;
    }
    update() {
        this.angle += this.orbitSpeed;
        this.life--;
        if (this.life <= 0) this.markedForDeletion = true;

        // Orbit around player
        const cx = this.player.x + this.player.width / 2;
        const cy = this.player.y + this.player.height / 2;
        this.x = cx + Math.cos(this.angle) * this.orbitRadius - this.width / 2;
        this.y = cy + Math.sin(this.angle) * this.orbitRadius - this.height / 2;

        this.glowPhase += 0.1;

        // Auto-shoot at nearest enemy
        this.shootTimer++;
        if (this.shootTimer >= this.shootInterval) {
            this.shootTimer = 0;
            let closest = null, minDist = Infinity;
            for (const e of this.game.enemies) {
                if (e.markedForDeletion) continue;
                const dx = e.x + e.width / 2 - this.x;
                const dy = e.y + e.height / 2 - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < minDist) { minDist = dist; closest = e; }
            }
            if (closest && minDist < 500) {
                const dx = closest.x + closest.width / 2 - (this.x + this.width / 2);
                const dy = closest.y + closest.height / 2 - (this.y + this.height / 2);
                const angle = Math.atan2(dy, dx);
                const p = new Projectile(this.game, this.x + this.width / 2, this.y + this.height / 2, Math.cos(angle) * 8, 'FUNNEL_SHOT', true);
                p.speedY = Math.sin(angle) * 8;
                this.game.projectiles.push(p);
            }
        }
    }
    draw(ctx) {
        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;
        const glow = 0.6 + Math.sin(this.glowPhase) * 0.4;

        // Outer glow
        ctx.shadowBlur = 12;
        ctx.shadowColor = `rgba(0, 255, 255, ${glow})`;

        // Body - diamond shape
        ctx.fillStyle = `rgba(0, 255, 255, ${0.7 + glow * 0.3})`;
        ctx.beginPath();
        ctx.moveTo(cx, cy - 7);
        ctx.lineTo(cx + 5, cy);
        ctx.lineTo(cx, cy + 7);
        ctx.lineTo(cx - 5, cy);
        ctx.closePath();
        ctx.fill();

        // Core
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(cx, cy, 2, 0, Math.PI * 2);
        ctx.fill();

        // Life indicator (fading when about to expire)
        if (this.life < 300) {
            ctx.globalAlpha = Math.sin(this.life * 0.2) * 0.5 + 0.5;
        }

        // Connection line to player
        ctx.strokeStyle = `rgba(0, 255, 255, ${0.15 * glow})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2);
        ctx.stroke();

        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
        ctx.lineWidth = 1;
    }
}


// ===================== BEAM EFFECT =====================
class BeamEffect {
    constructor(game, player) {
        this.game = game;
        this.player = player || game.player;
        this.x = this.player.x + this.player.width;
        this.y = this.player.y + this.player.height / 2;
        this.width = this.game.width - this.x;
        this.height = 10;
        this.life = 60; // 1 second
        this.maxLife = 60;
        this.active = true;
    }
    update() {
        this.active = this.life > 0;
        this.life--;
        this.x = this.player.x + this.player.width;
        this.y = this.player.y + this.player.height / 2;
        this.width = this.game.width - this.x;

        // Oscillation
        this.height = 10 + Math.sin(this.life * 0.5) * 5;
    }
    draw(ctx) {
        if (!this.active) return;
        const opacity = this.life / this.maxLife;
        const h = this.height * (0.5 + opacity * 0.5);

        ctx.save();
        ctx.globalAlpha = opacity;

        // Inner beam
        ctx.fillStyle = '#fff';
        ctx.fillRect(this.x, this.y - h / 2, this.width, h);

        // Outer glow
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#0ff';
        ctx.fillStyle = '#0ff';
        ctx.fillRect(this.x, this.y - h, this.width, h * 2);

        ctx.restore();
    }
}
