const form = document.getElementById("formLogin");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Obtener lista de usuarios
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Buscar uno coincidente
    const usuario = usuarios.find(u => u.email === email && u.password === password);

    if (!usuario) {
        alert("Credenciales incorrectas.");
        return;
    }

    // Guardar sesión
    localStorage.setItem("usuarioLogueado", JSON.stringify(usuario));

    alert("Inicio de sesión exitoso.");

    window.location.href = "../index.html";
});
