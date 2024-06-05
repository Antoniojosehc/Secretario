window.addEventListener("load", onLoadWindow);

const urlApiPublicador = "http://localhost:8080/publicador";
const urlApiInforme = "http://localhost:8080/informeMensual";

// Función que se ejecuta cuando la ventana ha cargado
function onLoadWindow() {
    loadPublicadores();
    loadAnioMesOptions();
    
    const btnEnviarInforme = document.getElementById("btnEnviarInforme");
    btnEnviarInforme.addEventListener("click", enviarInforme);
}

// Cargar la lista de publicadores
function loadPublicadores() {
    fetch(urlApiPublicador)
        .then(response => response.json())
        .then(data => {
            const publicadorSelect = document.getElementById("publicador");
            data.forEach(publicador => {
                const option = document.createElement("option");
                option.value = publicador.id;
                option.text = publicador.fullName;
                publicadorSelect.add(option);
            });
        })
        .catch(error => console.error('Error al cargar publicadores:', error));
}

// Cargar opciones de año y mes
function loadAnioMesOptions() {
    const anioSelect = document.getElementById("anio");
    const mesSelect = document.getElementById("mes");
    const currentYear = new Date().getFullYear();

    for (let year = currentYear; year >= 2000; year--) {
        const option = document.createElement("option");
        option.value = year;
        option.text = year;
        anioSelect.add(option);
    }

    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    meses.forEach((mes, index) => {
        const option = document.createElement("option");
        option.value = index + 1;
        option.text = mes;
        mesSelect.add(option);
    });
}

// Enviar el informe
function enviarInforme() {
    const publicador = document.getElementById("publicador").value;
    const anio = document.getElementById("anio").value;
    const mesNumero = document.getElementById("mes").value;
    const mesNombre = obtenerNombreMes(mesNumero); // Obtener el nombre del mes
    const publicaciones = document.getElementById("publicaciones").value;
    const videos = document.getElementById("videos").value;
    const horas = document.getElementById("horas").value;

    const informeData = {
        idPublicador: publicador,
        anio: anio,
        mes: mesNombre, // Utilizar el nombre del mes
        publicaciones: publicaciones,
        videos: videos,
        horas: horas
    };

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(informeData)
    };

    fetch(urlApiInforme, requestOptions)
        .then(response => {
            if (response.ok) {
                alert("Informe enviado exitosamente");
                document.getElementById("informeForm").reset();
            } else {
                response.json().then(data => {
                    alert(data.message || "Error al enviar el informe. Puede que el informe ya exista.");
                });
            }
        })
        .catch(error => {
            console.error('Error al enviar el informe:', error);
            alert("Error al enviar el informe");
        });
}

// Función para obtener el nombre del mes a partir de su número
function obtenerNombreMes(numeroMes) {
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    return meses[numeroMes - 1]; // Restar 1 porque los arrays comienzan en índice 0
}
