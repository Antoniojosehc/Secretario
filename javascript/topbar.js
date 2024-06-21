document.addEventListener("DOMContentLoaded", function() {
    fetch("topbar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById('topbar-container').innerHTML = data;
        })
        .catch(error => console.error("Error loading top bar:", error));
});
