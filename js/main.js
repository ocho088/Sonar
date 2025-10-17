document.addEventListener('DOMContentLoaded', () => {
    // --- OBTENER DATOS DESDE localStorage ---
    const { artistas, discos, canciones } = obtenerDatos();

    // --- ELEMENTOS DEL DOM ---
    
    // Contenedores de Vistas
    const mainView = document.getElementById('main-view');
    const artistView = document.getElementById('artist-view');

    // Elementos de la Vista Principal
    const songGrid = document.getElementById('song-grid');
    const searchInput = document.getElementById('searchInput');

    // Elementos de la Vista de Artista
    const artistBannerImg = document.getElementById('artist-banner-img');
    const artistProfileImg = document.getElementById('artist-profile-img');
    const artistViewName = document.getElementById('artist-view-name');
    const artistSongsList = document.getElementById('artist-songs-list');
    const backToMainBtn = document.getElementById('back-to-main-view');

    // Elementos del Reproductor y "Now Playing"
    const playerCover = document.getElementById('player-cover');
    const playerTitle = document.getElementById('player-title');
    const playerArtist = document.getElementById('player-artist');
    const nowPlayingView = document.getElementById('now-playing-view');
    let currentSongData = {}; // Guarda datos de la canción en reproducción

    // --- FUNCIÓN PARA RENDERIZAR LA GRILLA PRINCIPAL ---
    function renderMainGrid(cancionesAMostrar) {
        songGrid.innerHTML = '';
        if (cancionesAMostrar.length === 0) {
            songGrid.innerHTML = `<p style="color: var(--color-text-secondary);">Aún no hay música. ¡Ve al Panel de Carga para subir tu primer lanzamiento!</p>`;
            return;
        }

        cancionesAMostrar.forEach(cancion => {
            const artista = artistas.find(a => a.id === cancion.artistaId);
            const disco = discos.find(d => d.id === cancion.discoId);
            if (!artista || !disco) return;

            const card = document.createElement('div');
            card.className = 'song-card';
            card.innerHTML = `
                <img src="${disco.cover}" alt="${disco.titulo}">
                <h4>${cancion.titulo}</h4>
                <p class="artist-link" data-artist-id="${artista.id}">${artista.nombre}</p>
            `;
            
            // Evento para cargar la canción en el reproductor (al hacer clic en la PORTADA)
            card.querySelector('img').addEventListener('click', () => {
                playerCover.src = disco.cover;
                playerTitle.textContent = cancion.titulo;
                playerArtist.textContent = artista.nombre;
                currentSongData = { cover: disco.cover, title: cancion.titulo, artist: artista.nombre };
            });
            
            songGrid.appendChild(card);
        });
    }

    // --- FUNCIÓN PARA RENDERIZAR LA PÁGINA DE ARTISTA ---
    function renderArtistPage(artistId) {
        const artista = artistas.find(a => a.id === artistId);
        if (!artista) return;

        // Poblar la cabecera del artista
        artistBannerImg.src = artista.bannerPic || 'https://via.placeholder.com/1200x300/181818/181818?text=Banner';
        artistProfileImg.src = artista.profilePic || 'https://via.placeholder.com/150/FFFFFF/000000?text=P';
        artistViewName.textContent = artista.nombre;

        // Filtrar y mostrar la discografía del artista
        const discosDelArtista = discos.filter(d => d.artistaId === artistId);
        artistSongsList.innerHTML = discosDelArtista.map(disco => {
             return `<div class="release-item">
                        <img src="${disco.cover}" alt="${disco.titulo}">
                        <div>
                            <h4>${disco.titulo}</h4>
                            <p>${disco.genero}</p>
                        </div>
                    </div>`;
        }).join('');
        
        // Cambiar de vista
        mainView.style.display = 'none';
        artistView.style.display = 'block';
    }
    
    // --- MANEJO DE LA NAVEGACIÓN Y EVENTOS ---

    // Usar delegación de eventos para los clics en los nombres de artista
    document.body.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('artist-link')) {
            const artistId = parseInt(e.target.dataset.artistId, 10);
            renderArtistPage(artistId);
        }
    });

    // Evento para el botón de "Volver"
    backToMainBtn.addEventListener('click', () => {
        artistView.style.display = 'none';
        mainView.style.display = 'block';
    });

    // Lógica para abrir/cerrar "Now Playing" (sin cambios)
    playerCover.addEventListener('click', () => {
        if (currentSongData.cover) {
            document.getElementById('now-playing-cover').src = currentSongData.cover;
            document.getElementById('now-playing-title').textContent = currentSongData.title;
            document.getElementById('now-playing-artist').textContent = currentSongData.artist;
            nowPlayingView.classList.add('visible');
        }
    });
    document.getElementById('close-now-playing').addEventListener('click', () => {
        nowPlayingView.classList.remove('visible');
    });

    // Lógica de Búsqueda (sin cambios)
    searchInput.addEventListener('keyup', (e) => {
        const termino = e.target.value.toLowerCase();
        if (termino.length < 2) { renderMainGrid(canciones); return; }
        const resultados = canciones.filter(c => {
            const artista = artistas.find(a => a.id === c.artistaId);
            const disco = discos.find(d => d.id === c.discoId);
            return c.titulo.toLowerCase().includes(termino) ||
                   artista.nombre.toLowerCase().includes(termino) ||
                   disco.titulo.toLowerCase().includes(termino);
        });
        renderMainGrid(resultados);
    });

    // --- INICIALIZACIÓN ---
    renderMainGrid(canciones);
});