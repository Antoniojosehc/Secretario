window.addEventListener("load", function() {
    cargarPublicadores();
    document.getElementById("btnVerInforme").addEventListener("click", verInformes);
    document.getElementById("btnUpdateInforme").addEventListener("click", actualizarInforme);

    // Configurar modal
    const modal = document.getElementById("updateModal");
    const span = document.getElementsByClassName("close")[0];
    span.onclick = function() {
        modal.style.display = "none";
    }
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
});

const urlApiPublicador = "http://localhost:8080/publicador";
const urlApiInforme = "http://localhost:8080/informeMensual";

function cargarPublicadores() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", urlApiPublicador);
    xhr.send();
    xhr.responseType = "json";
    xhr.onload = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            const data = xhr.response;
            const publicadorSelect = document.getElementById("publicador");
            data.forEach(publicador => {
                const option = document.createElement("option");
                option.value = publicador.id;
                option.textContent = publicador.fullName;
                publicadorSelect.appendChild(option);
            });
        } else {
            alert("Error al cargar los publicadores");
        }
    };
}

function verInformes() {
    const publicadorId = document.getElementById("publicador").value;
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `${urlApiInforme}/publicador/${publicadorId}`);
    xhr.send();
    xhr.responseType = "json";
    xhr.onload = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            const data = xhr.response;
            const informesTable = document.getElementById("informesTable").getElementsByTagName("tbody")[0];
            informesTable.innerHTML = "";
            data.forEach(informe => {
                const row = informesTable.insertRow();
                row.insertCell(0).textContent = informe.anio;
                row.insertCell(1).textContent = informe.mes;
                row.insertCell(2).textContent = informe.publicaciones;
                row.insertCell(3).textContent = informe.videos;
                row.insertCell(4).textContent = informe.horas;
                const actionsCell = row.insertCell(5);
                const updateButton = document.createElement("button");
                updateButton.textContent = "Actualizar";
                updateButton.onclick = () => openUpdateModal(informe);
                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Eliminar";
                deleteButton.onclick = () => eliminarInforme(informe.id);
                actionsCell.appendChild(updateButton);
                actionsCell.appendChild(deleteButton);
            });
        } else {
            alert("Error al cargar los informes");
        }
    };
}

function openUpdateModal(informe) {
    const modal = document.getElementById("updateModal");
    document.getElementById("updateId").value = informe.id;
    document.getElementById("updateAnio").value = informe.anio;
    document.getElementById("updateMes").value = informe.mes;
    document.getElementById("updatePublicaciones").value = informe.publicaciones;
    document.getElementById("updateVideos").value = informe.videos;
    document.getElementById("updateHoras").value = informe.horas;
    modal.style.display = "block";
}

function actualizarInforme() {
    const id = document.getElementById("updateId").value;
    const anio = document.getElementById("updateAnio").value;
    const mes = document.getElementById("updateMes").value;
    const publicaciones = document.getElementById("updatePublicaciones").value;
    const videos = document.getElementById("updateVideos").value;
    const horas = document.getElementById("updateHoras").value;

    const informeData = {
        anio: anio,
        mes: mes,
        publicaciones: publicaciones,
        videos: videos,
        horas: horas
    };

    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(informeData)
    };

    fetch(`${urlApiInforme}/${id}`, requestOptions)
        .then(response => {
            if (response.ok) {
                alert("Informe actualizado exitosamente");
                document.getElementById("updateModal").style.display = "none";
                verInformes(); // Recargar informes
            } else {
                response.json().then(data => {
                    alert(data.message || "Error al actualizar el informe");
                });
            }
        })
        .catch(error => {
            console.error('Error al actualizar el informe:', error);
            alert("Error al actualizar el informe");
        });
}

function eliminarInforme(id) {
    if (!confirm("¿Estás seguro de que deseas eliminar este informe?")) return;

    const requestOptions = {
        method: 'DELETE'
    };

    fetch(`${urlApiInforme}/${id}`, requestOptions)
        .then(response => {
            if (response.ok) {
                alert("Informe eliminado exitosamente");
                verInformes(); // Recargar informes
            } else {
                response.json().then(data => {
                    alert(data.message || "Error al eliminar el informe");
                });
            }
        })
        .catch(error => {
            console.error('Error al eliminar el informe:', error);
            alert("Error al eliminar el informe");
        });
}
