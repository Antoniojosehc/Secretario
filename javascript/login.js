const urlApiUser = "http://localhost:8080/usuario";

function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const loginData = {
        nombreUsuario: username,
        contrasena: password
    };

    fetch(urlApiUser + "/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData)
    })
    .then(response => response.text())
    .then(data => {
        if (data === "Login exitoso") {
            window.location.href = "publishers.html";  // Redirigir a publishers.html en caso de éxito
        } else {
            alert("Usuario o contraseña incorrectos");
        }
    })
    .catch(error => console.error("Error:", error));
}
