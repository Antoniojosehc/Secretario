window.addEventListener("load", onloadwindow)
var indexUser = null;
var urlApiUser = "http://localhost:8080/publicador";

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
    //Creacion de objeto 
    var objUsuario = {
        "fullName": nombres,
        "sex": hombre.checked ? "Hombre" : "Mujer",
        "bornDate": fechaNacimiento,
        "baptismDate": fechaBautismo,
        "notes": notas
    };
    
    createData(objUsuario);

}

function loadData() {
    
}

function calcularEdad(fecha) {
    var dateNacimiento = new Date(fecha);
    var now = new Date();
    var diffAnios = now - dateNacimiento; //en milisegundos
    var equMiliAnio = 31536000*1000;
    var aniosConDecimal = diffAnios / equMiliAnio;
    var edad = Math.ceil(aniosConDecimal);
    return edad;
}

function printTable(data) {
    var html = "";
    for (var i = 0; i < data.length; i++) {
        html += "<tr>"
        html += "<th scope='row'>" + (i + 1) + "</th>"
        html += "<td>" + data[i].fullName + "</td>";        
        html += "<td>" + data[i].bornDate + "</td>";
        html += "<td>" + calcularEdad(data[i].bornDate) + "</td>";
        html += "<td>" + data[i].baptismDate + "</td>";
        html += "<td>" + data[i].sex + "</td>";
        html += "<td>" + data[i].notes + "</td>";
        html += "<td>";
        html += "<div data-id='" + data[i].id + "' class='eliminar'>Eliminar</div>";
        html += "<div data-id='" + data[i].id + "' class='editar'>Editar</div>"
        html += "</td>";
        html += "</tr>";
    }
    bodyList.innerHTML = html;

    var btnsEliminar = document.getElementsByClassName("eliminar");
    for(var i = 0; i < btnsEliminar.length; i++) {
        var btnEliminar = btnsEliminar[i];
        btnEliminar.addEventListener('click', function(e) {
            eliminar(e.target.getAttribute("data-id"));
        });
    }

    var btnsEditar = document.getElementsByClassName("editar");
    for(var i = 0; i < btnsEditar.length; i++) {
        var btnEditar = btnsEditar[i];
        btnEditar.addEventListener('click', function(e) {
            editar(e.target.getAttribute("data-id"));
        });
    }
}

function editar(i) {
    indexUser = i;
    var arrayUsers = loadData();
    if(i >= arrayUsers.length) {
        alert("El elemento a editar no existe!");
        return;
    } 
    if(i < 0) {
        alert("El elemento a editar no es valido!");
        return;
    } 
    var objEditar = arrayUsers[i];
    nombres.value = objEditar.nombres;
    fechaNacimiento.value = objEditar.fechaNacimiento;
    fechaBautismo.value = objEditar.fechaBautismo;
    notas.value = objEditar.notas;
    
}

function eliminar(i) {
    if(confirm("¿Está seguro que desea eliminar el publicador?")) {
        deleteData(i);
    }
}

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
            console.log('Error: ${xhr.status}');
        }
    };
}