window.addEventListener("load", function() {
    cargarPublicadores();
    document.getElementById("btnVerInforme").addEventListener("click", verInformes);
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
            });
        } else {
            alert("Error al cargar los informes");
        }
    };
}
