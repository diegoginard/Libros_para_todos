const userNav = document.getElementById("user-nav");

// Botón del Hero
const botonRegistrarseHero = document.querySelector(".botonRegistrarse");

function actualizarNavUsuario() {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));

    // Si NO está logueado → mostrar "Iniciar sesión" + "Registrarse"
    if (!usuario) {
        userNav.innerHTML = `
            <a class="linkNav" href="./pages/login.html">Iniciar Sesión</a>
            <a class="linkNav" href="./pages/register.html">Registrarse</a>
        `;
        return;
    }

    // Si está logueado → ocultar el botón del Hero
    if (botonRegistrarseHero) {
        botonRegistrarseHero.style.display = "none";
    }

    // Mostrar saludo + logout
    userNav.innerHTML = `
        <span class="linkNav">Hola, ${usuario.nombre}</span>
        <button id="logout-btn" class="linkNav" 
            style="background:none;border:none;color:white;cursor:pointer;">
            Cerrar sesión
        </button>
    `;

    // Evento para cerrar sesión
    document.getElementById("logout-btn").addEventListener("click", () => {
        localStorage.removeItem("usuarioLogueado");
        window.location.reload();
    });
}

actualizarNavUsuario();

// Mostrar/ocultar botón Favoritos según login
const favoritosNav = document.getElementById("nav-favoritos");

function actualizarFavoritosNav() {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));

    if (!usuario) {
        favoritosNav.style.display = "none"; // OCULTAR si NO hay sesión
    } else {
        favoritosNav.style.display = "block"; // MOSTRAR si está logueado
    }
}

actualizarFavoritosNav();

// Menú hamburguesa
document.getElementById("menu-toggle")?.addEventListener("click", () => {
    document.querySelector(".navegacion").classList.toggle("active");
});
