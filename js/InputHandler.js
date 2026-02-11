class InputHandler {
    constructor() {
        this.keys = {};
        
        window.addEventListener('keydown', e => {
            // Prevent default scrolling for game keys
            if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                e.preventDefault();
            }
            this.keys[e.key] = true;
            this.keys[e.code] = true; // Use code for layout independence (e.g. WASD)
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
