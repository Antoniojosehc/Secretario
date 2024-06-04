document.addEventListener('DOMContentLoaded', function() {
    const publicadorSelect = document.getElementById('publicador');
    const anioSelect = document.getElementById('anio');
    const mesSelect = document.getElementById('mes');

    // Cargar los publicadores al dar clic
    publicadorSelect.addEventListener('click', function() {
        if (publicadorSelect.options.length === 0) {
            fetch('http://localhost:8080/publicador')
                .then(response => response.json())
                .then(data => {
                    data.sort((a, b) => a.fullName.localeCompare(b.fullName)); // Ordenar alfabéticamente
                    data.forEach(publicador => {
                        const option = document.createElement('option');
                        option.value = publicador.id;
                        option.textContent = publicador.fullName;
                        publicadorSelect.appendChild(option);
                    });
                })
                .catch(error => console.error('Error al cargar publicadores:', error));
        }
    }); 

    // Llenar el año actual y el año anterior
    const currentYear = new Date().getFullYear();
    [currentYear, currentYear - 1].forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        anioSelect.appendChild(option);
    });

    // Llenar los meses actual y anterior
    const currentMonth = new Date().getMonth() + 1;
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    // Agregar mes actual y mes anterior
    for (let i = currentMonth; i >= currentMonth - 1 && i > 0; i--) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = months[i - 1];
        mesSelect.appendChild(option);
    }

    // Manejar el envío del formulario
    const informeForm = document.getElementById('informeForm');
    informeForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(informeForm);
        const informeData = {
            Anio: formData.get('anio'),
            Mes: formData.get('mes'),
            Publicaciones: formData.get('publicaciones'),
            Videos: formData.get('videos'),
            Horas: formData.get('horas'),
            ID_Publicador: formData.get('publicador')
        };

        fetch('http://localhost:8080/informeMensual', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(informeData)
        })
        .then(response => {
            if (response.ok) {
                alert('Informe agregado exitosamente');
                informeForm.reset();
            } else {
                alert('Error al agregar informe');
            }
        })
        .catch(error => console.error('Error al enviar el informe:', error));
    });
});
