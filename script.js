document.addEventListener('DOMContentLoaded', () => {
    const songCards = document.querySelectorAll('.song-card');
    const playerCover = document.getElementById('player-cover');
    const playerTitle = document.getElementById('player-title');
    const playerArtist = document.getElementById('player-artist');
    const playButton = document.querySelector('.player-controls .material-icons');

    let isPlaying = false;

    // Función para actualizar el reproductor
    function updatePlayer(title, artist, cover) {
        playerTitle.textContent = title;
        playerArtist.textContent = artist;
        playerCover.src = cover;
    }

    // Añadir evento de clic a cada tarjeta de canción
    songCards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.dataset.title;
            const artist = card.dataset.artist;
            const cover = card.dataset.cover;
            
            updatePlayer(title, artist, cover);
            
            // Simular que la nueva canción empieza a sonar
            playButton.textContent = 'pause';
            isPlaying = true;
        });
    });

    // Añadir evento de clic al botón de play/pausa
    playButton.addEventListener('click', () => {
        if (isPlaying) {
            playButton.textContent = 'play_arrow';
            isPlaying = false;
        } else {
            playButton.textContent = 'pause';
            isPlaying = true;
        }
    });

    // Funcionalidad para las pestañas de navegación (simulación)
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Evita que la página se recargue
            navLinks.forEach(nav => nav.classList.remove('active'));
            link.classList.add('active');
        });
    });
});