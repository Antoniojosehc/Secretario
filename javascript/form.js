document.addEventListener('DOMContentLoaded', function() {
    const publicadorSelect = document.getElementById('publicador');

    // Cargar los publicadores al cargar la página
    fetch('http://localhost:8080/publicador')
        .then(response => response.json())
        .then(data => {
            data.forEach(publicador => {
                const option = document.createElement('option');
                option.value = publicador.id;
                option.textContent = publicador.fullName;
                publicadorSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error al cargar publicadores:', error));

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
            Revistas: formData.get('revistas'),
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
