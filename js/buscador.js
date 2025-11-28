// ===============================
// CONFIGURACIÓN OPEN LIBRARY
// ===============================

const API_SEARCH = "https://openlibrary.org/search.json?q=";
const IMG_COVER = "https://covers.openlibrary.org/b/id/";
const IMG_FALLBACK = "../assets/img/placeholder-book.png";

// ===============================
// SELECTORES
// ===============================

const buscadorForm = document.getElementById("formBusqueda");
const inputBuscar = document.getElementById("buscar");

// Aquí se mostrarán los resultados (reutilizamos la sección de tendencias)
const resultadosContainer = document.getElementById("tendenciasContainer");

// ===============================
// FUNCIONES
// ===============================

// Crea cada libro como card
function crearCard(libro) {
    const cover = libro.cover_i
        ? `${IMG_COVER}${libro.cover_i}-M.jpg`
        : IMG_FALLBACK;

    return `
        <div class="libro" data-id="${libro.key.replace("/works/", "")}">
            <img src="${cover}" alt="${libro.title}">
            <h4>${libro.title}</h4>
        </div>
    `;
}

// Permite navegar al detalle
function activarNavegacion() {
    document.querySelectorAll(".libro").forEach(card => {
        card.addEventListener("click", () => {
            const id = card.getAttribute("data-id");
            window.location.href = `./pages/detalle.html?id=${id}`;
        });
    });
}

// Busca libros en Open Library
async function buscarLibros(query) {
    try {
        const res = await fetch(API_SEARCH + encodeURIComponent(query));
        const data = await res.json();

        return data.docs.slice(0, 20); // Máximo 20 resultados
    } catch (err) {
        console.error("Error buscando libros:", err);
        return [];
    }
}

// ===============================
// EVENTO DE BÚSQUEDA
// ===============================

buscadorForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const texto = inputBuscar.value.trim();
    if (texto === "") return;

    // Buscar libros
    const resultados = await buscarLibros(texto);

    // Mostrar resultados
    resultadosContainer.innerHTML = resultados.map(crearCard).join("");

    // Activar navegación a detalle
    activarNavegacion();
});