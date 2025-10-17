document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DEL DOM ---
    const releasesList = document.getElementById('releases-list');
    
    // Elementos del Modal y Formulario
    const uploadModal = document.getElementById('upload-modal');
    const uploadMusicBtn = document.getElementById('upload-music-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const uploadForm = document.getElementById('upload-form');
    
    // Campos del Formulario
    const artistNameInput = document.getElementById('artist-name');
    const artistSuggestions = document.getElementById('artist-suggestions');
    const newArtistFields = document.getElementById('new-artist-fields');
    const profilePicInput = document.getElementById('artist-profile-pic');
    const bannerPicInput = document.getElementById('artist-banner-pic');

    // Elementos de Carga de Archivos
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const songListEditor = document.getElementById('song-list-editor');
    
    let uploadedFiles = [];

    // --- RENDERIZADO DEL PANEL PRINCIPAL ---
    function renderPanel() {
        const { discos, artistas } = obtenerDatos();
        if (discos.length > 0) {
            releasesList.innerHTML = discos.map(disco => {
                const artista = artistas.find(a => a.id === disco.artistaId);
                return `
                    <div class="release-item">
                        <img src="${disco.cover}" alt="${disco.titulo}">
                        <div>
                            <h4>${disco.titulo}</h4>
                            <p>${artista ? artista.nombre : 'Artista Desconocido'}</p>
                        </div>
                    </div>
                `;
            }).join('');
        } else {
            releasesList.innerHTML = `<p>Aún no has subido ningún lanzamiento.</p>`;
        }
    }

    // --- LÓGICA DEL MODAL ---
    uploadMusicBtn.addEventListener('click', () => {
        // 1. Limpiar y resetear el formulario cada vez que se abre
        uploadForm.reset();
        songListEditor.innerHTML = '';
        uploadedFiles = [];
        newArtistFields.style.display = 'block'; // Asegurarse de que los campos sean visibles al inicio

        // 2. Cargar las sugerencias de artistas existentes
        const { artistas } = obtenerDatos();
        artistSuggestions.innerHTML = artistas.map(a => `<option value="${a.nombre}"></option>`).join('');

        // 3. Mostrar el modal
        uploadModal.classList.add('visible');
    });

    closeModalBtn.addEventListener('click', () => uploadModal.classList.remove('visible'));

    // --- LÓGICA DEL INPUT DE ARTISTA INTELIGENTE ---
    artistNameInput.addEventListener('input', () => {
        const { artistas } = obtenerDatos();
        const textoActual = artistNameInput.value.toLowerCase();
        // some() revisa si al menos un elemento del array cumple la condición
        const artistaExiste = artistas.some(a => a.nombre.toLowerCase() === textoActual);

        if (artistaExiste) {
            newArtistFields.style.display = 'none'; // Ocultar si el artista ya existe
        } else {
            newArtistFields.style.display = 'block'; // Mostrar si es un artista nuevo
        }
    });

    // --- LÓGICA DE CARGA DE ARCHIVOS (Drag & Drop) ---
    dropZone.addEventListener('click', () => fileInput.click());
    dropZone.addEventListener('dragover', e => e.preventDefault());
    dropZone.addEventListener('drop', e => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
    });
    fileInput.addEventListener('change', e => handleFiles(e.target.files));

    function handleFiles(files) {
        uploadedFiles = [...files].filter(file => file.type === 'audio/mpeg');
        songListEditor.innerHTML = '<h4>Edita los nombres de las canciones</h4>';
        uploadedFiles.forEach((file) => {
            const defaultTitle = file.name.replace(/\.[^/.]+$/, "");
            songListEditor.innerHTML += `<div class="song-editor-item"><i class="fas fa-music"></i><input type="text" class="song-title-input" value="${defaultTitle}"></div>`;
        });
    }

    // --- LÓGICA DE ENVÍO DEL FORMULARIO ---
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const artistName = artistNameInput.value;
        const { artistas } = obtenerDatos();
        const esArtistaNuevo = !artistas.some(a => a.nombre.toLowerCase() === artistName.toLowerCase());

        // Validaciones
        if (esArtistaNuevo && (!profilePicInput.files[0] || !bannerPicInput.files[0])) {
            alert('Para un artista nuevo, la foto de perfil y el banner son obligatorios.');
            return; // Detener el envío
        }
        if (!document.getElementById('release-cover').files[0] || uploadedFiles.length === 0) {
            alert('La portada del lanzamiento y al menos un archivo MP3 son obligatorios.');
            return;
        }

        // Función auxiliar para convertir archivos a Base64
        const readFileAsBase64 = (file) => new Promise((resolve, reject) => {
            if (!file) return resolve(null);
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });

        try {
            const [cover, profilePic, bannerPic] = await Promise.all([
                readFileAsBase64(document.getElementById('release-cover').files[0]),
                readFileAsBase64(profilePicInput.files[0]),
                readFileAsBase64(bannerPicInput.files[0])
            ]);

            const nuevoLanzamiento = {
                artistaNombre: artistName,
                profilePic: profilePic,
                bannerPic: bannerPic,
                titulo: document.getElementById('release-title').value,
                genero: document.getElementById('release-genre').value,
                cover: cover,
                canciones: Array.from(document.querySelectorAll('.song-title-input')).map(input => input.value)
            };

            agregarLanzamiento(nuevoLanzamiento);
            
            uploadModal.classList.remove('visible');
            renderPanel(); // Actualizar la lista de lanzamientos en la página
        } catch (error) {
            console.error("Error al procesar las imágenes:", error);
            alert("Hubo un problema al cargar las imágenes. Inténtalo de nuevo.");
        }
    });

    // --- INICIALIZACIÓN ---
    renderPanel();
});