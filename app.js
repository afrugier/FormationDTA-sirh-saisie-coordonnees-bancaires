$(document).ready(function () {
    init();
});

function init() {
    $("#sauvegarderBtn").on("click", function (e) {
        e.preventDefault();
        postBankData();
    });
    updateInputFields("", "", "");
    getListCollabs();
}

function getListCollabs() {
    $.get("http://localhost:8080/sgp/api/collaborateurs").done(function (data) {
        populateTable(data);
    });
};

function postBankData() {
    $.ajax({
        url: "http://localhost:8080/sgp/api/collaborateurs/" + encodeURIComponent($("#matricule").val()) + "/banque?banque=" + encodeURIComponent($("#banque").val()) + "&bic=" + encodeURIComponent($("#bic").val()) + "&iban=" + $("#iban").val(),
        type: 'PUT',
        success: function (data) {
            alert("User with matricule [" + $("#matricule").val() + "] was updated");
            init();
        }
    });
};

function populateTable(data) {
    $("#listeCollabs > .collab").remove();
    data.forEach(function (element) {
        var line = "<tr class='collab'>";
        line += "<td class='matricule'>" + element.matricule + "</td>";
        line += "<td>" + element.nom + "</td>";
        line += "<td>" + element.prenom + "</td>";
        line += "</tr>";

        $("#listeCollabs").append(line);
    }, this);

    updateListeners();
};

function updateListeners() {
    $("#listeCollabs > .collab").on("click", function () {
        var matricule = $(this).find(".matricule").text();

        $.get("http://localhost:8080/sgp/api/collaborateurs/" + matricule + "/banque").done(function (collabBankData) {
            updateInputFields(collabBankData, matricule);
        });
    });
};

function updateInputFields(bankData, matricule) {
    $("#banque").val(bankData.banque);
    $("#bic").val(bankData.bic);
    $("#iban").val(bankData.iban);
    $("#matricule").val(matricule);
};