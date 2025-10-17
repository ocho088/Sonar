// --- GESTOR DE BASE DE DATOS LOCAL (localStorage) ---

/**
 * Revisa si la base de datos existe en localStorage. Si no, crea la estructura inicial vacía.
 */
function inicializarBaseDeDatos() {
    if (!localStorage.getItem('sonar_data')) {
        const db = {
            artistas: [],
            discos: [],
            canciones: [],
            nextIds: {
                artista: 1,
                disco: 101,
                cancion: 1001,
            }
        };
        localStorage.setItem('sonar_data', JSON.stringify(db));
    }
}

/**
 * Obtiene todos los datos de localStorage y los convierte a un objeto JavaScript.
 * @returns {object} La base de datos completa.
 */
function obtenerDatos() {
    return JSON.parse(localStorage.getItem('sonar_data'));
}

/**
 * Guarda el objeto de la base de datos completo en localStorage.
 * @param {object} db - El objeto de la base de datos a guardar.
 */
function guardarDatos(db) {
    localStorage.setItem('sonar_data', JSON.stringify(db));
}

/**
 * Agrega un nuevo lanzamiento (disco, canciones y artista si es nuevo) a la base de datos.
 * @param {object} lanzamiento - Un objeto con toda la información del formulario.
 */
function agregarLanzamiento(lanzamiento) {
    const db = obtenerDatos();

    // Lógica para encontrar o crear un nuevo artista dinámicamente.
    let artista = db.artistas.find(a => a.nombre.toLowerCase() === lanzamiento.artistaNombre.toLowerCase());
    
    if (!artista) {
        // Si el artista NO existe, lo creamos con todos sus datos.
        artista = {
            id: db.nextIds.artista++,
            nombre: lanzamiento.artistaNombre,
            profilePic: lanzamiento.profilePic, // Imagen de perfil en Base64
            bannerPic: lanzamiento.bannerPic     // Imagen de banner en Base64
        };
        db.artistas.push(artista);
    }

    // Crear el nuevo disco/lanzamiento.
    const disco = {
        id: db.nextIds.disco++,
        titulo: lanzamiento.titulo,
        artistaId: artista.id,
        genero: lanzamiento.genero,
        cover: lanzamiento.cover
    };
    db.discos.push(disco);

    // Crear las canciones asociadas al disco.
    lanzamiento.canciones.forEach(nombreCancion => {
        const cancion = {
            id: db.nextIds.cancion++,
            titulo: nombreCancion,
            artistaId: artista.id,
            discoId: disco.id
        };
        db.canciones.push(cancion);
    });
    
    // Guardar todos los cambios en localStorage.
    guardarDatos(db);
}

// Asegurarse de que la base de datos se inicialice al cargar el script.
inicializarBaseDeDatos();