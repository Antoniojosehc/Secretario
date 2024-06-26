// Añadir un evento que se dispara cuando la ventana ha cargado completamente
window.addEventListener("load", onloadwindow)
var indexUser = null;
var urlApiUser = "http://localhost:8080/publicador";

// Función que se ejecuta cuando la ventana ha cargado
function onloadwindow(e) {
    var btnSubmit = document.getElementById("btnSubmit");
    btnSubmit.addEventListener("click", clickFrmSubmit);

    var btnClearLocalStorage = document.getElementById("deleteData");
    btnClearLocalStorage.addEventListener("click", deleteLocalStorageData);

    var arrayUsers = loadData();
}

function deleteLocalStorageData() {
    if (confirm("Quiere eliminar el localStorage?")) {
        localStorage.clear();
        //location.reload();
        var arrayUsers = loadData();
        printTable(arrayUsers);
    }

}

// Función para validar los campos obligatorios del formulario
function validarForm() {
    var isValid = true;

    nombres.classList.remove("input-error");
    if (nombres.value === "") {
        nombres.classList.add("input-error");
        isValid = false;
    }

    fechaNacimiento.classList.remove("input-error");
    if (fechaNacimiento.value === "") {
        fechaNacimiento.classList.add("input-error");
        isValid = false;
    }

    var hombre = document.getElementById("hombre");
    var mujer = document.getElementById("mujer");

    hombre.classList.remove("input-error");
    mujer.classList.remove("input-error");
    if (!hombre.checked && !mujer.checked) {
        hombre.classList.add("input-error");
        mujer.classList.add("input-error");
        isValid = false;
        
    }

    return isValid;

}

// Función que se ejecuta al enviar el formulario
function clickFrmSubmit(e) {
    if (!validarForm()) {
        alert("Hay campos faltantes por rellenar");
        return;
    }

    var txtNombres = document.getElementById("nombres");
    var nombres = txtNombres.value;
    //-----
    var txtFechaNacimiento = document.getElementById("fechaNacimiento");
    var fechaNacimiento = txtFechaNacimiento.value;
    //-----
    var txtFechaBautismo = document.getElementById("fechaBautismo");
    var fechaBautismo = txtFechaBautismo.value;
    //-----
    var txtNotas = document.getElementById("notas");
    var notas = txtNotas.value;
    
    var arrayUsers = loadData();

//-----
    //Crear objeto de usuario con los datos del formulario 
    var objUsuario = {
        "fullName": nombres,
        "sex": hombre.checked ? "Hombre" : "Mujer",
        "bornDate": fechaNacimiento,
        "baptismDate": fechaBautismo,
        "notes": notas
    };

    // Crear o actualizar los datos del usuario según el índice de usuario
    if(indexUser===null) {
        createData(objUsuario);
    } else {
        updateData(objUsuario, indexUser);
    } 

}

// Función para calcular la edad a partir de la fecha de nacimiento
function calcularEdad(fecha) {
    var dateNacimiento = new Date(fecha);
    var now = new Date();
    var diffAnios = now - dateNacimiento; //en milisegundos
    var equMiliAnio = 31536000*1000;
    var aniosConDecimal = diffAnios / equMiliAnio;
    var edad = Math.ceil(aniosConDecimal);
    return edad;
}

// Función para imprimir la tabla de usuarios
function printTable(data) {
    var html = "";
    for (var i = 0; i < data.length; i++) {
        html += "<tr>"
        html += "<th scope='row'>" + (i + 1) + "</th>"
        html += "<td>" + data[i].fullName + "</td>";
        html += "<td>" + formatDate(data[i].bornDate) + "</td>";
        html += "<td>" + calcularEdad(data[i].bornDate) + "</td>";
        html += "<td>" + (data[i].baptismDate ? formatDate(data[i].baptismDate) : "") + "</td>";
        html += "<td>" + data[i].sex + "</td>";
        html += "<td>" + data[i].notes + "</td>";
        html += "<td>";
        html += "<div data-id='" + data[i].id + "' class='eliminar'>Eliminar</div>";
        html += "<div data-id='" + data[i].id + "' class='editar'>Editar</div>"
        html += "</td>";
        html += "</tr>";
    }
    bodyList.innerHTML = html;

    // Añadir eventos de clic a los botones de eliminar
    var btnsEliminar = document.getElementsByClassName("eliminar");
    for(var i = 0; i < btnsEliminar.length; i++) {
        var btnEliminar = btnsEliminar[i];
        btnEliminar.addEventListener('click', function(e) {
            eliminar(e.target.getAttribute("data-id"));
        });
    }

    // Añadir eventos de clic a los botones de editar
    var btnsEditar = document.getElementsByClassName("editar");
    for(var i = 0; i < btnsEditar.length; i++) {
        var btnEditar = btnsEditar[i];
        btnEditar.addEventListener('click', function(e) {
            editar(e.target.getAttribute("data-id"));
        });
    }
}

// Función para editar un usuario por su ID
function editar(i) {
    loadDataById(i);
    
}

// Función para formatear una fecha en formato legible
function formatDate(dateString) {
    return dateString.split('T')[0];
}

// Función para actualizar los datos de un usuario
function updateData(request, id) {
    request = JSON.stringify(request);
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", urlApiUser + "/" + id);
    xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
    xhr.send(request);
    //xhr.responseType = "json";
    xhr.onload = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            indexUser = null;
            const data = xhr.response;
            console.log(data);
            loadData();
            resetData.click();
        } else {
            alert("Error al ejecutar la transacción, el servidor no puede procesar la solicitud");
            console.log('Error: ${xhr.status}');
        }
    };
}

// Función para eliminar un usuario por su ID
function eliminar(i) {
    if(confirm("¿Está seguro que desea eliminar el publicador?")) {
        deleteData(i);
    }
}

function loadDataById(id) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", urlApiUser + "/" + id);
    xhr.send();
    xhr.responseType = "json";
    xhr.onload = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            const data = xhr.response;
            console.log(data);
            resetData.click();
            nombres.value = data.fullName;            

            var formattedBornDate = formatDate(data.bornDate);
            fechaNacimiento.value = formattedBornDate;

            // Procesar fecha de bautismo
            if (data.baptismDate) {
                var formattedBaptismDate = formatDate(data.baptismDate);
                fechaBautismo.value = formattedBaptismDate;
            } else {
                fechaBautismo.value = ""; // Limpiar el campo si no hay fecha
            }

            notas.value = data.notes;

            //Cargar el campo de Sexo
            if (data.sex === "Hombre") {
                document.getElementById("hombre").checked = true;
            } else if (data.sex === "Mujer") {
                document.getElementById("mujer").checked = true;
            }

            indexUser = id;
            
        } else {
            alert("Error al ejecutar la transacción, el servidor no puede procesar la solicitud");
            console.log('Error: ${xhr.status}');
        }
    };
}

// Función para crear un nuevo usuario
function createData(request) {
    request = JSON.stringify(request);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", urlApiUser);
    xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
    xhr.send(request);
    //xhr.responseType = "json";
    xhr.onload = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            const data = xhr.response;
            console.log(data);
            loadData();
            resetData.click();
        } else {
            alert("Error al ejecutar la transacción, el servidor no puede procesar la solicitud");
            console.log('Error: ${xhr.status}');
        }
    };
}

function loadData() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", urlApiUser);
    xhr.send();
    xhr.responseType = "json";
    xhr.onload = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            const data = xhr.response;
            console.log(data);
            printTable(data);
        } else {
            alert("Error al ejecutar la transacción, el servidor no puede procesar la solicitud");
            console.log('Error: ${xhr.status}');
        }
    };
}

function deleteData(id) {
    const xhr = new XMLHttpRequest();
    xhr.open("DELETE", urlApiUser + "/" + id);
    xhr.send();
    //xhr.responseType = "json";
    xhr.onload = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            const data = xhr.response;
            loadData();
        } else {
            alert("Error al ejecutar la transacción, el servidor no puede procesar la solicitud");
            console.log('Error: ${xhr.status}');
        }
    };
}