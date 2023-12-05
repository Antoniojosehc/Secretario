window.addEventListener("load", onloadwindow)
var indexUser = null;

function onloadwindow(e) {
    var btnSubmit = document.getElementById("btnSubmit");
    btnSubmit.addEventListener("click", clickFrmSubmit);

    var btnClearLocalStorage = document.getElementById("deleteData");
    btnClearLocalStorage.addEventListener("click", deleteLocalStorageData);

    var arrayUsers = loadData();
    printTable(arrayUsers);
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

    fechaBautismo.classList.remove("input-error");
    if (fechaBautismo.value === "") {
        fechaBautismo.classList.add("input-error");
        isValid = false;
    }

    telefono.classList.remove("input-error");
    if (telefono.value === "") {
        telefono.classList.add("input-error");
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
    var txtTelefono = document.getElementById("telefono");
    var telefono = txtTelefono.value;
    
    var arrayUsers = loadData();

    window.setTimeout(function () {
        //-----
        //Creacion de objeto 
        var objUsuario = {
            "nombres": nombres,
            "fechaNacimiento": fechaNacimiento,
            "fechaBautismo": fechaBautismo,
            "telefono": telefono
        };
        console.log(objUsuario);
        //*********/
        if(indexUser===null) {
            arrayUsers.push(objUsuario);
        } else {
            arrayUsers[indexUser] = objUsuario;
        }

        indexUser = null;
        
        printTable(arrayUsers);
        //*********/
        jArray = JSON.stringify(arrayUsers);
        localStorage.setItem("usersData", jArray);
        //*********/
        resetData.click();
    }, 3000);
}

function loadData() {
    var arrayUsers = [];
    //*********/
    var usersData = localStorage.getItem("usersData");
    if (usersData === null) {
        localStorage.setItem("usersData", "[]");
    } else {
        arrayUsers = JSON.parse(usersData);
    }
    return arrayUsers;
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
        html += "<td>" + data[i].nombres + "</td>";
        html += "<td>" + data[i].fechaNacimiento + "</td>";
        html += "<td>" + calcularEdad(data[i].fechaNacimiento) + "</td>";
        html += "<td>" + data[i].fechaBautismo + "</td>";
        html += "<td>" + data[i].telefono + "</td>";
        html += "<td>";
        html += "<div data-id='" + i + "' class='eliminar'>Eliminar</div>";
        html += "<div data-id='" + i + "' class='editar'>Editar</div>"
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
    telefono.value = objEditar.telefono;
    
}

function eliminar(i) {
    var arrayUsers = loadData();
    if(i >= arrayUsers.length) {
        alert("El elemento a eliminar no existe!");
        return;
    } 
    if(i < 0) {
        alert("El elemento a eliminar no es valido!");
        return;
    } 
    if(confirm("¿Está seguro que desea eliminar a " + arrayUsers[i].nombres + " de la lista?")) {
        var arrTemp = [];
        for(var j = 0; j < arrayUsers.length; j++) {
            if(j != i) {
                arrTemp.push(arrayUsers[j]);
            }
        }
        jArray = JSON.stringify(arrTemp);
        localStorage.setItem("usersData", jArray);
        printTable(arrTemp);
    }
}