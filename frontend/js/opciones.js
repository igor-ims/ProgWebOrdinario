document.getElementById("formOpciones").addEventListener("submit", function(event) {
    event.preventDefault();
    var opcionSeleccionada = document.querySelector('input[name="opcion"]:checked').value;
    if (opcionSeleccionada === "inscripcion") {
        window.location.href = "foro-registrar.html";
    } else if (opcionSeleccionada === "login") {
        window.location.href = "foro-login.html";
    }
});
