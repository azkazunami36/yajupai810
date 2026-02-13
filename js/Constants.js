// ===================== DIFFICULTY PRESETS =====================
var DIFFICULTY = {
    EASY: {
        label: 'EASY', lives: 6, bombs: 5, playerSpeed: 5, shootInterval: 12,
        spawnInterval: 1400, enemiesPerWave: 5, burstMin: 1, burstChance: 0.25, burstMax: 2,
        enemyHPMult: 0.6, enemySpeedMult: 0.5, obstacleInterval: 6000,
        waveBreak: 1500, dropRate: 0.2, bossHPBase: 15, bossHPPerStage: 10,
        scaleFactor: 0.7
    },
    NORMAL: {
        label: 'NORMAL', lives: 4, bombs: 3, playerSpeed: 4, shootInterval: 18,
        spawnInterval: 900, enemiesPerWave: 8, burstMin: 1, burstChance: 0.3, burstMax: 3,
        enemyHPMult: 1.0, enemySpeedMult: 0.8, obstacleInterval: 4000,
        waveBreak: 1100, dropRate: 0.12, bossHPBase: 25, bossHPPerStage: 18,
        scaleFactor: 0.9
    },
    HARD: {
        label: 'HARD', lives: 2, bombs: 2, playerSpeed: 3.5, shootInterval: 22,
        spawnInterval: 600, enemiesPerWave: 12, burstMin: 2, burstChance: 0.4, burstMax: 4,
        enemyHPMult: 1.3, enemySpeedMult: 1.1, obstacleInterval: 2500,
        waveBreak: 600, dropRate: 0.08, bossHPBase: 40, bossHPPerStage: 25,
        scaleFactor: 1.3
    },
    HELL: {
        label: '地獄', lives: 2, bombs: 1, playerSpeed: 3, shootInterval: 25,
        spawnInterval: 300, enemiesPerWave: 18, burstMin: 2, burstChance: 0.55, burstMax: 4,
        enemyHPMult: 1.6, enemySpeedMult: 1.5, obstacleInterval: 1500,
        waveBreak: 350, dropRate: 0.06, bossHPBase: 50, bossHPPerStage: 30,
        scaleFactor: 1.6
    }
};

// Expose to window to ensure global access
window.DIFFICULTY = DIFFICULTY;
