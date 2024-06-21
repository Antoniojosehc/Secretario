window.addEventListener("load", function() {
    cargarInformesMensuales();
});

const urlApiInforme = "http://localhost:8080/informeMensual";

function cargarInformesMensuales() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", urlApiInforme);
    xhr.send();
    xhr.responseType = "json";
    xhr.onload = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            const data = xhr.response;
            const informesPorMes = {};

            data.forEach(informe => {
                const key = `${informe.anio}-${informe.mes}`;
                if (!informesPorMes[key]) {
                    informesPorMes[key] = {
                        anio: informe.anio,
                        mes: informe.mes,
                        publicaciones: 0,
                        videos: 0,
                        horas: 0,
                        totalInformes: 0
                    };
                }
                informesPorMes[key].publicaciones += informe.publicaciones;
                informesPorMes[key].videos += informe.videos;
                informesPorMes[key].horas += informe.horas;
                informesPorMes[key].totalInformes += 1;
            });

            const tableBody = document.getElementById('monthlyReportsBody');
            for (const key in informesPorMes) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${informesPorMes[key].anio}</td>
                    <td>${informesPorMes[key].mes}</td>
                    <td>${informesPorMes[key].publicaciones}</td>
                    <td>${informesPorMes[key].videos}</td>
                    <td>${informesPorMes[key].horas}</td>
                    <td>${informesPorMes[key].totalInformes}</td>
                `;
                tableBody.appendChild(row);
            }
        } else {
            alert("Error al cargar los informes");
        }
    };
}
