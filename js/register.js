const form = document.getElementById("formRegister");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Traer usuarios existentes
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Evitar duplicados
    const existe = usuarios.some(u => u.email === email);

    if (existe) {
        alert("Este correo ya está registrado.");
        return;
    }

    // Crear usuario nuevo
    const nuevoUsuario = {
        id: Date.now(),
        nombre,
        email,
        password,
        favoritos: []
    };

    usuarios.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("Usuario registrado con éxito");

    // Redirigir al login
    window.location.href = "../login.html";
});