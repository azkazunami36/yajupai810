class SoundManager {
    constructor(game) {
        this.game = game;
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.buffers = {};
        this.bgmSource = null;
        this.volume = { bgm: 0.5, se: 0.5 };
        this.soundList = [
            'bgm_main', 'bgm_boss',
            'se_shoot', 'se_explosion', 'se_powerup', 'se_damage', 'se_alert', 'se_select'
        ];
        this.enabled = true;
    }

    async loadSounds() {
        const loadPromises = this.soundList.map(async (name) => {
            try {
                const response = await fetch(`assets/sounds/${name}.wav`);
                if (!response.ok) throw new Error(`Failed to load ${name}`);
                const arrayBuffer = await response.arrayBuffer();
                const audioBuffer = await this.ctx.decodeAudioData(arrayBuffer);
                this.buffers[name] = audioBuffer;
                console.log(`Loaded sound: ${name}`);
            } catch (error) {
                console.warn(`Sound missing: ${name} (Place .wav in assets/sounds/)`);
            }
        });
        await Promise.all(loadPromises);
    }

    play(name, loop = false) {
        if (!this.enabled || !this.buffers[name]) return;

        // Resume context if suspended (browser policy)
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const source = this.ctx.createBufferSource();
        source.buffer = this.buffers[name];
        source.loop = loop;

        const gainNode = this.ctx.createGain();
        const isBgm = name.startsWith('bgm');
        gainNode.gain.value = isBgm ? this.volume.bgm : this.volume.se;

        source.connect(gainNode);
        gainNode.connect(this.ctx.destination);

        source.start(0);

        if (isBgm) {
            if (this.bgmSource) this.bgmSource.stop();
            this.bgmSource = source;
        }

        return source; // Return for control if needed
    }

    stopBgm() {
        if (this.bgmSource) {
            this.bgmSource.stop();
            this.bgmSource = null;
        }
    }

    setVolume(type, value) {
        this.volume[type] = Math.max(0, Math.min(1, value));
        // Real-time update for BGM could be added here if we stored the gain node
    }
}
