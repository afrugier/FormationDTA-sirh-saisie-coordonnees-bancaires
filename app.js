var elementListeCollabs;
var inputMatricule;
var inputBanque;
var inputBic;
var inputIban;

var buttonSubmit;

var classCollabLine;
var classMatricule;

$(document).ready(function () {
    initVariables();
    initStaticEvents();
    init();
});

function initVariables() {
    inputMatricule = $("#matricule");
    inputBanque = $("#banque");
    inputBic = $("#bic");
    inputIban = $("#iban");
    elementListeCollabs = $("#listeCollabs");

    buttonSubmit = $("#sauvegarderBtn");

    classCollabLine = "collab";
    classMatricule = "matricule";
}

function initStaticEvents() {
    buttonSubmit.on("click", function (e) {
        e.preventDefault();
        postBankData();
    });
}

function init() {
    updateInputFields("", "", "");
    getListCollabs();
    disableFields(true);
}

function populateTable(data) {
    elementListeCollabs.find(classCollabLine).remove();
    data.forEach(function (element) {
        var line = "<tr class='" + classCollabLine + "'>";
        line += "<td class='" + classMatricule + "'>" + element.matricule + "</td>";
        line += "<td>" + element.nom + "</td>";
        line += "<td>" + element.prenom + "</td>";
        line += "</tr>";

        elementListeCollabs.append(line);
    }, this);

    updateListeners();
}

function updateInputFields(bankData, matricule) {
    inputBanque.val(bankData.banque);
    inputBic.val(bankData.bic);
    inputIban.val(bankData.iban);
    inputMatricule.val(matricule);

    disableFields(false);
}

function disableFields(state) {
    inputBanque.prop("disabled", state);
    inputBic.prop("disabled", state);
    inputIban.prop("disabled", state);
    buttonSubmit.prop("disabled", state);
}

function updateListeners() {
    elementListeCollabs.find("." + classCollabLine).on("click", function () {
        var matricule = $(this).find("." + classMatricule).text();

        $.get("http://localhost:8080/sgp/api/collaborateurs/" + matricule + "/banque").done(function (collabBankData) {
            updateInputFields(collabBankData, matricule);
        });
    });
}

function getListCollabs() {
    $.get("http://localhost:8080/sgp/api/collaborateurs").done(function (data) {
        populateTable(data);
    });
}

function postBankData() {
    $.ajax({
        url: "http://localhost:8080/sgp/api/collaborateurs/" + encodeURIComponent(inputMatricule.val()) + "/banque?banque=" + encodeURIComponent(inputBanque.val()) + "&bic=" + encodeURIComponent(inputBic.val()) + "&iban=" + inputIban.val(),
        type: 'PUT',
        success: function (data) {
            alert("User with matricule [" + inputMatricule.val() + "] was updated");
            init();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("User could not be updated. Check your data");
        }
    });
}
