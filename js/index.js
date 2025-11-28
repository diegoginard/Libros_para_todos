import { API_SEARCH, API_WORK, API_COVERS, IMG_PLACEHOLDER } from "./config.js";
import { httpGet } from "./httpCliente.js";

// =============================
// SELECTORES
// =============================
const tendenciasContainer = document.getElementById("tendenciasContainer");
const generosContainer = document.getElementById("generosContainer");
const aclamadasContainer = document.getElementById("aclamadasContainer");

const btnAntGenero = document.getElementById("botonAnteriorGeneros");
const btnSigGenero = document.getElementById("botonSiguienteGeneros");

const selectGenero = document.getElementById("selectGenero");

const inputBuscar = document.getElementById("buscar");
const buscadorForm = document.getElementById("formBusqueda");

// =============================
// FUNCIONES GENERALES
// =============================
function crearCard(libro) {
    const idLimpio = libro.key.replace("/works/", "").replace("/books/", "");

    const img = libro.cover_i
        ? `${API_COVERS}${libro.cover_i}-L.jpg`
        : IMG_PLACEHOLDER;

    return `
        <div class="libro" data-id="${idLimpio}">
            <img src="${img}" alt="${libro.title}">
            <h4>${libro.title}</h4>
        </div>
    `;
}

function activarNavegacionDetalle() {
    document.querySelectorAll(".libro").forEach(card => {
        card.addEventListener("click", () => {
            const id = card.dataset.id;
            window.location.href = `/pages/detalle.html?id=${id}`;
        });
    });
}

// =============================
// TENDENCIAS (simuladas con bestseller)
// =============================
async function cargarTendencias() {
    const data = await httpGet(`${API_SEARCH}bestseller`);
    if (!data) return;

    tendenciasContainer.innerHTML = data.docs
        .slice(0, 12)
        .map(crearCard)
        .join("");

    activarNavegacionDetalle();
}

// =============================
// GÉNEROS CON PAGINACIÓN
// =============================
let generoActual = selectGenero.value;
let paginaGenero = 1;

async function cargarGenero() {
    const url = `${API_SEARCH}subject:${generoActual}&page=${paginaGenero}`;

    const data = await httpGet(url);
    if (!data) return;

    generosContainer.innerHTML = data.docs
        .slice(0, 12)
        .map(crearCard)
        .join("");

    activarNavegacionDetalle();
}

// Cuando el usuario cambia el género
selectGenero.addEventListener("change", () => {
    generoActual = selectGenero.value;
    paginaGenero = 1;
    cargarGenero();
});

// Botón siguiente → nueva página del mismo género
btnSigGenero.addEventListener("click", () => {
    paginaGenero++;
    cargarGenero();
});

// Botón anterior → vuelve de página
btnAntGenero.addEventListener("click", () => {
    if (paginaGenero > 1) {
        paginaGenero--;
        cargarGenero();
    }
});

// =============================
// ACLAMADOS
// =============================
async function cargarAclamados() {
    const data = await httpGet(`${API_SEARCH}award+winning`);
    if (!data) return;

    aclamadasContainer.innerHTML = data.docs
        .slice(0, 12)
        .map(crearCard)
        .join("");

    activarNavegacionDetalle();
}

// =============================
// BUSCADOR
// =============================
buscadorForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const query = inputBuscar.value.trim();
    if (!query) return;

    const data = await httpGet(`${API_SEARCH}${query}`);
    if (!data) return;

    tendenciasContainer.innerHTML = data.docs
        .slice(0, 12)
        .map(crearCard)
        .join("");

    activarNavegacionDetalle();
});

// =============================
// INICIALIZAR TODO
// =============================
cargarTendencias();
cargarGenero();
cargarAclamados();
