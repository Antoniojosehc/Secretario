window.addEventListener("load", onloadwindow);
var avatarBase64 = null;
var indexUser = null;
var urlApiUser = "http://localhost:8080/publicador";

function onloadwindow(e) {
    console.log("Window loaded");

    var btnSubmit = document.getElementById("btnSubmit");
    var btnClearLocalStorage = document.getElementById("deleteData");

    if (btnSubmit) {
        console.log("Found btnSubmit");
        btnSubmit.addEventListener("click", clickFrmSubmit);
    } else {
        console.log("btnSubmit not found");
    }

    if (btnClearLocalStorage) {
        console.log("Found btnClearLocalStorage");
        btnClearLocalStorage.addEventListener("click", deleteLocalStorageData);
    } else {
        console.log("btnClearLocalStorage not found");
    }

    loadData();
}

function deleteLocalStorageData() {
    if (confirm("¿Quiere eliminar el localStorage?")) {
        localStorage.clear();
        loadData();
    }
}

function validarForm() {
    console.log("Validating form");
    var isValid = true;
    var nombres = document.getElementById("nombres");
    var fechaNacimiento = document.getElementById("fechaNacimiento");
    var clave = document.getElementById("clave");
    var hombre = document.getElementById("hombre");
    var mujer = document.getElementById("mujer");

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

    clave.classList.remove("input-error");
    if (clave.value === "") {
        clave.classList.add("input-error");
        isValid = false;
    }

    hombre.classList.remove("input-error");
    mujer.classList.remove("input-error");
    if (!hombre.checked && !mujer.checked) {
        hombre.classList.add("input-error");
        mujer.classList.add("input-error");
        isValid = false;
    }

    console.log("Form validation result:", isValid);
    return isValid;
}

function clickFrmSubmit(e) {
    e.preventDefault();
    console.log("Submit button clicked");

    if (!validarForm()) {
        alert("Hay campos faltantes por rellenar");
        return;
    }

    var txtNombres = document.getElementById("nombres");
    var nombres = txtNombres.value;
    var txtFechaNacimiento = document.getElementById("fechaNacimiento");
    var fechaNacimiento = txtFechaNacimiento.value;
    var txtFechaBautismo = document.getElementById("fechaBautismo");
    var fechaBautismo = txtFechaBautismo.value;
    var txtNotas = document.getElementById("notas");
    var notas = txtNotas.value;
    var txtClave = document.getElementById("clave");
    var clave = txtClave.value;
    var inpAvatar = document.getElementById("avatar");

    var objUsuario = {
        "fullName": nombres,
        "sex": document.getElementById("hombre").checked ? "Hombre" : "Mujer",
        "bornDate": fechaNacimiento,
        "baptismDate": fechaBautismo,
        "notes": notas,
        "keyWord": clave,
        "avatar": ""
    };

    if (inpAvatar.files.length > 0) {
        console.log("Uploading avatar");
        upload(inpAvatar.files[0], function(fileName) {
            objUsuario.avatar = fileName;
            if (indexUser === null) {
                createData(objUsuario);
            } else {
                updateData(objUsuario, indexUser);
            }
        });
    } else {
        console.log("No avatar to upload");
        if (indexUser === null) {
            createData(objUsuario);
        } else {
            updateData(objUsuario, indexUser);
        }
    }
}

function upload(file, callback) {
    var formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:8080/file/upload", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                callback(file.name);
            } else {
                console.error("File upload failed. Status:", xhr.status);
                alert("Error al cargar el archivo. Estado: " + xhr.status);
            }
        }
    };
    xhr.send(formData);
}

function createData(request) {
    console.log("Creating data", request);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", urlApiUser);
    xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
    xhr.onload = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            loadData();
            document.getElementById("resetData").click();
        } else {
            alert("Error al ejecutar la transacción, el servidor no puede procesar la solicitud");
            console.log("Error:", xhr.status);
        }
    };
    xhr.send(JSON.stringify(request));
}

function updateData(request, id) {
    console.log("Updating data", request, id);
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", `${urlApiUser}/${id}`);
    xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
    xhr.onload = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            indexUser = null;
            loadData();
            document.getElementById("resetData").click();
        } else {
            alert("Error al ejecutar la transacción, el servidor no puede procesar la solicitud");
            console.log("Error:", xhr.status);
        }
    };
    xhr.send(JSON.stringify(request));
}

function editData(user) {
    console.log("Editing user:", user);
    var txtNombres = document.getElementById("nombres");
    var txtFechaNacimiento = document.getElementById("fechaNacimiento");
    var txtFechaBautismo = document.getElementById("fechaBautismo");
    var txtNotas = document.getElementById("notas");
    var txtClave = document.getElementById("clave");
    var hombre = document.getElementById("hombre");
    var mujer = document.getElementById("mujer");

    txtNombres.value = user.fullName;
    txtFechaNacimiento.value = formatDate(user.bornDate);
    txtFechaBautismo.value = formatDate(user.baptismDate);
    txtNotas.value = user.notes;
    txtClave.value = user.keyWord;
    if (user.sex === "Hombre") {
        hombre.checked = true;
    } else {
        mujer.checked = true;
    }

    indexUser = user.id;
}

function formatDate(dateString) {
    if (!dateString) return '';
    // Crear un objeto Date a partir de la cadena de fecha
    const date = new Date(dateString);
    // Obtener las partes de la fecha (año, mes, día)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses empiezan desde 0
    const day = String(date.getDate()).padStart(2, '0');
    // Formatear la fecha como "yyyy-MM-dd"
    return `${year}-${month}-${day}`;
}

function deleteData(id) {
    if (confirm("¿Está seguro de eliminar este publicador?")) {
        fetch(`${urlApiUser}/${id}`, {
            method: "DELETE"
        })
        .then(res => {
            if (res.status === 200) {
                return res.text();
            } else {
                throw new Error("Error al eliminar publicador");
            }
        })
        .then(data => {
            console.log("User deleted:", data);
            alert("Publicador eliminado con éxito!");
            loadData();
        })
        .catch(err => {
            console.error("Error deleting user:", err);
            alert("Error al eliminar publicador");
        });
    }
}

function loadData() {
    console.log("Loading data");

    fetch(urlApiUser, {
        method: "GET"
    })
    .then(res => res.json())
    .then(data => {
        console.log("Data loaded:", data);
        var bodyList = document.getElementById("bodyList");
        bodyList.innerHTML = "";

        data.forEach((user, index) => {
            var row = document.createElement("tr");

            var cellIndex = document.createElement("th");
            cellIndex.scope = "row";
            cellIndex.textContent = index + 1;
            row.appendChild(cellIndex);

            var cellFullName = document.createElement("td");
            cellFullName.textContent = user.fullName;
            row.appendChild(cellFullName);

            var cellBornDate = document.createElement("td");
            cellBornDate.textContent = formatDate(user.bornDate); // Formatear la fecha de nacimiento
            row.appendChild(cellBornDate);

            var cellAge = document.createElement("td");
            var age = calculateAge(new Date(user.bornDate));
            cellAge.textContent = age;
            row.appendChild(cellAge);

            var cellBaptismDate = document.createElement("td");
            cellBaptismDate.textContent = formatDate(user.baptismDate); // Formatear la fecha de bautismo
            row.appendChild(cellBaptismDate);

            var cellSex = document.createElement("td");
            cellSex.textContent = user.sex;
            row.appendChild(cellSex);

            var cellNotes = document.createElement("td");
            cellNotes.textContent = user.notes;
            row.appendChild(cellNotes);

            var cellClave = document.createElement("td");
            cellClave.textContent = user.keyWord;
            row.appendChild(cellClave);

            var cellAvatar = document.createElement("td");
            if (user.avatar) {
                var img = document.createElement("img");
                img.src = `http://localhost:8080/file/upload/${user.avatar}`;
                img.alt = "Avatar";
                img.width = 50;
                img.height = 50;
                cellAvatar.appendChild(img);
            }
            row.appendChild(cellAvatar);

            var cellActions = document.createElement("td");
            var btnEdit = document.createElement("button");
            btnEdit.textContent = "Editar";
            btnEdit.classList.add("btn", "btn-primary");
            btnEdit.onclick = function() {
                editData(user);
            };
            cellActions.appendChild(btnEdit);

            var btnDelete = document.createElement("button");
            btnDelete.textContent = "Eliminar";
            btnDelete.classList.add("btn", "btn-danger");
            btnDelete.onclick = function() {
                deleteData(user.id);
            };
            cellActions.appendChild(btnDelete);

            row.appendChild(cellActions);

            bodyList.appendChild(row);
        });
    })
    .catch(err => {
        console.error("Error loading data:", err);
        alert("Error al cargar datos");
    });
}

function calculateAge(bornDate) {
    var ageDifMs = Date.now() - bornDate.getTime();
    var ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

function updateLocalStorage() {
    var jsonData = JSON.stringify(users);
    localStorage.setItem("users", jsonData);
}

function loadDataFromLocalStorage() {
    var jsonData = localStorage.getItem("users");
    if (jsonData) {
        users = JSON.parse(jsonData);
    }
}