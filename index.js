function loadData() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "https//localhost:8080/publicador");
    xhr.send();
    xhr.responseType = "json";
    xhr.onload = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            const data = xhr.response;
            console.log(data);
        } else {
            console.log('Error: ${xhr.status}');
        }
    };
}