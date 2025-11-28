// ===============================================
// CARGA DE FAVORITOS DEL USUARIO
// ===============================================

const favoritosContainer = document.getElementById("favoritosContainer");

// Traer usuario
function getUsuarioActual() {
    return JSON.parse(localStorage.getItem("usuarioLogueado"));
}

// Renderizar favoritos
function mostrarFavoritos() {
    const usuario = getUsuarioActual();

    if (!usuario) {
        favoritosContainer.innerHTML = `
            <p class="mensaje-error">Debés iniciar sesión para ver tus favoritos.</p>
        `;
        return;
    }

    if (usuario.favoritos.length === 0) {
        favoritosContainer.innerHTML = `
            <p class="mensaje-error">Todavía no agregaste ningún libro a favoritos.</p>
        `;
        return;
    }

    favoritosContainer.innerHTML = usuario.favoritos
        .map(libro => `
            <div class="libro" data-id="${libro.id}">
                <img src="${libro.cover ? 
                    `https://covers.openlibrary.org/b/id/${libro.cover}-L.jpg` : 
                    '/assets/img/placeholder-book.png'}"
                >
                <h4>${libro.title}</h4>
            </div>
        `)
        .join("");

    agregarEventosClick();
}

// Navegar al detalle
function agregarEventosClick() {
    document.querySelectorAll(".libro").forEach(card => {
        card.addEventListener("click", () => {
            const id = card.getAttribute("data-id");
            window.location.href = `/pages/detalle.html?id=${id}`;
        });
    });
}

mostrarFavoritos();
