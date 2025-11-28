// ===============================================
// DETALLE DEL LIBRO (Open Library)
// ===============================================

// Seleccionar contenedores
const portada = document.getElementById("detalle-portada");
const titulo = document.getElementById("detalle-titulo");
const autores = document.getElementById("detalle-autores");
const descripcion = document.getElementById("detalle-descripcion");
const año = document.getElementById("detalle-anio");
const btnFavorito = document.getElementById("btnFavorito");

// Obtener ID de la URL
const params = new URLSearchParams(window.location.search);
const libroID = params.get("id");

// -------------------------------
// Obtener datos del libro
// -------------------------------
async function cargarDetalle() {
    if (!libroID) return;

    try {
        const res = await fetch(`https://openlibrary.org/works/${libroID}.json`);
        const data = await res.json();

        // Portada
        if (data.covers && data.covers.length > 0) {
            portada.src = `https://covers.openlibrary.org/b/id/${data.covers[0]}-L.jpg`;
        } else {
            portada.src = "/assets/img/placeholder-book.png";
        }

        // Título
        titulo.textContent = data.title || "Título no disponible";

        // Autores
        if (data.authors && data.authors.length > 0) {
            const autoresData = await cargarAutores(data.authors);
            autores.textContent = autoresData.join(", ");
        } else {
            autores.textContent = "Autor desconocido";
        }

        // Descripción
        if (typeof data.description === "string") {
            descripcion.textContent = data.description;
        } else if (data.description && data.description.value) {
            descripcion.textContent = data.description.value;
        } else {
            descripcion.textContent = "Descripción no disponible.";
        }

        // Año / fecha de creación
        año.textContent = data.created ? new Date(data.created.value).getFullYear() : "—";

        actualizarEstadoFavorito(data);

    } catch (error) {
        console.error("Error cargando detalle:", error);
    }
}

// -------------------------------
// Obtener autores (Open Library)
// -------------------------------
async function cargarAutores(listaAutores) {
    const nombres = [];

    for (const a of listaAutores) {
        try {
            const res = await fetch(`https://openlibrary.org${a.author.key}.json`);
            const data = await res.json();
            nombres.push(data.name);
        } catch {
            nombres.push("Autor desconocido");
        }
    }

    return nombres;
}

// ===============================================
// FAVORITOS
// ===============================================

function getUsuarioActual() {
    return JSON.parse(localStorage.getItem("usuarioLogueado"));
}

function actualizarUsuarios(lista) {
    localStorage.setItem("usuarios", JSON.stringify(lista));
}

// Ver si ya está en favoritos
function estaEnFavoritos(usuario, id) {
    return usuario.favoritos.some(f => f.id === id);
}

function actualizarEstadoFavorito(dataLibro) {
    const usuario = getUsuarioActual();

    if (!usuario) {
        btnFavorito.textContent = "Inicia sesión para agregar";
        btnFavorito.disabled = true;
        return;
    }

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const libroEsFavorito = estaEnFavoritos(usuario, libroID);

    // Icono inicial
    btnFavorito.textContent = libroEsFavorito
        ? "★ Quitar de Favoritos"
        : "☆ Agregar a Favoritos";

    // EVENTO DEL BOTÓN
    btnFavorito.addEventListener("click", () => {
        const indexUsuario = usuarios.findIndex(u => u.email === usuario.email);
        const usuarioDB = usuarios[indexUsuario];

        if (!usuarioDB) return;

        if (estaEnFavoritos(usuarioDB, libroID)) {
            // Quitar favorito
            usuarioDB.favoritos = usuarioDB.favoritos.filter(f => f.id !== libroID);
            btnFavorito.textContent = "☆ Agregar a Favoritos";
        } else {
            // Agregar favorito
            usuarioDB.favoritos.push({
                id: libroID,
                title: dataLibro.title,
                cover: dataLibro.covers ? dataLibro.covers[0] : null
            });
            btnFavorito.textContent = "★ Quitar de Favoritos";
        }

        // Guardar cambios globales
        actualizarUsuarios(usuarios);

        // Actualizar sesión
        localStorage.setItem("usuarioLogueado", JSON.stringify(usuarioDB));
    });
}

// Inicializar
cargarDetalle();
