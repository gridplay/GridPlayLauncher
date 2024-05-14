const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
    const launchButton = document.getElementById('launch-button');
    const gameList = document.getElementById('game-list');

    const games = [
        { name: 'WoW 335a', path: 'C:\\Program Files\\GridPlay\\WoW\\WoW 335a.exe' },
        { name: 'BWO', path: 'C:\\Program Files\\GridPlay\\BWO\\BWO.exe' },
        // Add more games as needed
    ];

    games.forEach(game => {
        const option = document.createElement('option');
        option.textContent = game.name;
        gameList.appendChild(option);
    });

    launchButton.addEventListener('click', () => {
        const selectedIndex = gameList.selectedIndex;
        if (selectedIndex >= 0 && selectedIndex < games.length) {
            const selectedGame = games[selectedIndex];
            ipcRenderer.send('launch-game', selectedGame.path);
        } else {
            //alert('Please select a game to launch.');
        }
    });

    const closeButton = document.getElementById('close-button');
    closeButton.addEventListener('click', () => {
        ipcRenderer.send('close-window');
    });
});
