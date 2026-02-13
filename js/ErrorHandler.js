window.onerror = function (msg, url, lineNo, columnNo, error) {
    const errorScreen = document.getElementById('error-screen');
    const errorText = document.getElementById('error-text');
    const btnCopy = document.getElementById('btn-copy-error');
    const btnReload = document.getElementById('btn-reload-game');

    if (!errorScreen || !errorText) {
        console.error("Critical: Error UI not found", msg);
        return false;
    }

    const errorDetails = [
        'TIMESTAMP: ' + new Date().toISOString(),
        'MESSAGE: ' + msg,
        'SOURCE: ' + url,
        'LOCATION: Line ' + lineNo + ', Column ' + columnNo,
        'STACK: ' + (error ? error.stack : 'N/A'),
        'USER_AGENT: ' + navigator.userAgent
    ].join('\n');

    errorText.textContent = errorDetails;
    errorScreen.classList.remove('hidden');

    // Setup buttons
    if (btnCopy) {
        btnCopy.onclick = () => {
            navigator.clipboard.writeText(errorDetails).then(() => {
                btnCopy.textContent = '✅ COPIED!';
                setTimeout(() => { btnCopy.textContent = '📋 COPY ERROR'; }, 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
                btnCopy.textContent = '❌ FAILED';
            });
        };
    }

    if (btnReload) {
        btnReload.onclick = () => {
            window.location.reload();
        };
    }

    console.error(errorDetails);

    // Stop game loop if possible (prevent infinite errors)
    if (window.game) {
        window.game.paused = true;
        window.game.gameOver = true;
    }

    return false;
};
