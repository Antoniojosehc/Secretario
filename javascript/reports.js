document.addEventListener('DOMContentLoaded', function () {
    const titleElement = document.getElementById('page-title');
    const tableBody = document.getElementById('reports-table-body');
    const pendingReportsList = document.getElementById('pending-reports-list');

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Calcula el mes y año anterior
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const previousMonthName = monthNames[previousMonth];

    // Actualiza el título de la página
    titleElement.textContent = `Informes de ${previousMonthName} de ${previousYear}`;

    // URLs de la API
    const reportsURL = 'http://localhost:8080/informeMensual';
    const publishersURL = 'http://localhost:8080/publicador';

    // Función para obtener datos de la API
    async function fetchData(url) {
        const response = await fetch(url);
        return response.json();
    }

    // Función para obtener el nombre del publicador por ID
    async function getPublisherNameById(id, publishers) {
        const publisher = publishers.find(p => p.id === id);
        return publisher ? publisher.fullName : 'Desconocido';
    }

    // Función para cargar los informes
    async function loadReports() {
        try {
            const reports = await fetchData(reportsURL);
            const publishers = await fetchData(publishersURL);

            // Filtra los informes del mes anterior
            const filteredReports = reports.filter(report => {
                const reportMonth = monthNames.indexOf(report.mes);
                const reportYear = report.anio;

                return reportMonth === previousMonth && reportYear === previousYear;
            });

            // Llena la tabla con los informes filtrados
            for (const report of filteredReports) {
                const publisherName = await getPublisherNameById(report.idPublicador, publishers);

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${publisherName}</td>
                    <td>${report.publicaciones}</td>
                    <td>${report.videos}</td>
                    <td>${report.horas}</td>
                `;
                tableBody.appendChild(row);
            }

            // Obtener todos los publicadores
            const allPublishers = await fetchData(publishersURL);

            // Filtrar publicadores que no tienen informes para el mes anterior
            const publishersWithoutReports = allPublishers.filter(publisher => {
                const hasReport = filteredReports.some(report => report.idPublicador === publisher.id);
                return !hasReport;
            });

            // Mostrar los publicadores sin informes en la sección de informes pendientes
            publishersWithoutReports.forEach(publisher => {
                const listItem = document.createElement('li');
                listItem.textContent = publisher.fullName;
                pendingReportsList.appendChild(listItem);
            });

        } catch (error) {
            console.error('Error al cargar los informes:', error);
        }
    }

    // Cargar los informes al cargar la página
    loadReports();
});
