class InputHandler {
    constructor() {
        this.keys = {};
        this.codeBuffer = [];
        this.onSecretCode = null;

        window.addEventListener('keydown', e => {
            // Prevent default scrolling for game keys
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                e.preventDefault();
            }
            this.keys[e.key] = true;
            this.keys[e.code] = true; // Use code for layout independence (e.g. WASD)

            // Secret Code Detection (BOSS)
            this.codeBuffer.push(e.key.toUpperCase());
            if (this.codeBuffer.length > 10) this.codeBuffer.shift();

            if (this.codeBuffer.join('').endsWith('BOSS')) {
                if (this.onSecretCode) this.onSecretCode('BOSS');
                this.codeBuffer = []; // Clear buffer after activation
            }
        });

        window.addEventListener('keyup', e => {
            this.keys[e.key] = false;
            this.keys[e.code] = false;
        });
    }

    isDown(key) {
        return !!this.keys[key];
    }
}
