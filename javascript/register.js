const urlApiUser = "http://localhost:8080/usuario";

function register() {
    const username = document.getElementById("registerUsername").value;
    const password = document.getElementById("registerPassword").value;

    const registerData = {
        nombreUsuario: username,
        contrasena: password
    };

    fetch(urlApiUser + "/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(registerData)
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
        if (data === "Usuario registrado con éxito") {
            window.location.href = "login.html";  // Redirigir a la página de login en caso de éxito
        } else {
            alert("Error al registrar el usuario");
        }
        // Limpiar los campos del formulario de registro
        document.getElementById("registerForm").reset();
    })
    .catch(error => console.error("Error:", error));
}
