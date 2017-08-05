var elementListeCollabs;

var inputMatricule;
var inputBanque;
var inputBic;
var inputIban;

var inputFilterNom;
var selectFilterDepartement;
var filters;

var emptyFilterNom;

var buttonSubmit;

var classCollabLine;
var classMatricule;
var classNoCollabLoaded;

var textNoCollabsFound;

$(document).ready(function() {
  initVariables();
  initStaticEvents();

  loadListeDepartements();

  updateContent();
});

function initVariables() {
  elementListeCollabs = $("#listeCollabs");

  inputMatricule = $("#matricule");
  inputBanque = $("#banque");
  inputBic = $("#bic");
  inputIban = $("#iban");

  inputFilterNom = $("#filterNom");
  selectFilterDepartement = $("#filterDepartement");
  filters = $("[id^=filter]");

  emptyFilterNom = $("#emptyFilterNom");

  buttonSubmit = $("#sauvegarderBtn");

  classCollabLine = "collab";
  classMatricule = "matricule";
  classNoCollabLoaded = "noCollabLoaded";

  textNoCollabsFound = "Aucun collaborateur trouvé";
}

function initStaticEvents() {
  buttonSubmit.on("click", function(e) {
    e.preventDefault();
    postBankData();
  });

  filters.on("change input", function(e) {
    e.preventDefault();
    updateContent();
  });

  emptyFilterNom.on("click", function(e) {
    e.preventDefault();
    inputFilterNom.val("");
    updateContent();
  });
}

function updateContent() {
  updateInputFields("", "", "");
  disableInputFields(true);

  loadListeCollabs();
}

function updateInputFields(bankData, matricule) {
  inputBanque.val(bankData.banque);
  inputBic.val(bankData.bic);
  inputIban.val(bankData.iban);
  inputMatricule.val(matricule);

  disableInputFields(false);
}

function disableInputFields(state) {
  inputBanque.prop("disabled", state);
  inputBic.prop("disabled", state);
  inputIban.prop("disabled", state);
  buttonSubmit.prop("disabled", state);
}

function updateListeners() {
  elementListeCollabs.find("." + classCollabLine).on("click", function() {
    var matricule = $(this).find("." + classMatricule).text();

    $.get("http://localhost:8080/sgp/api/collaborateurs/" + matricule + "/banque").done(function(collabBankData) {
      updateInputFields(collabBankData, matricule);
    });
  });
}

// REST calls - START
function loadListeCollabs(nomCollab = inputFilterNom.val(), idDept = selectFilterDepartement.find(":selected").val()) {
  var urlEnd = "";
  var param = "";

  if (nomCollab.length > 0) {
    urlEnd = "nom/" + nomCollab;
  }

  if (idDept != undefined && idDept.length > 0) {
    param = "?departement=" + idDept;
  }

  console.log("http://localhost:8080/sgp/api/collaborateurs/" + urlEnd + param);

  $.get("http://localhost:8080/sgp/api/collaborateurs/" + urlEnd + param).done(function(data) {
    populateTableCollabs(data);
  });
}

function loadListeDepartements() {
  $.get("http://localhost:8080/sgp/api/departements").done(function(data) {
    populateListeDepartements(data);
  });
}

function postBankData() {
  $.ajax({
    url: "http://localhost:8080/sgp/api/collaborateurs/" + encodeURIComponent(inputMatricule.val()) + "/banque?banque=" + encodeURIComponent(inputBanque.val()) + "&bic=" + encodeURIComponent(inputBic.val()) + "&iban=" + inputIban.val(),
    type: 'PUT',
    success: function(data) {
      alert("Les coordonnées bancaires du collaborateur avec le matricule [" + inputMatricule.val() + "] ont été mises à jour.");
      updateContent();
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      alert("User could not be updated. Check your data");
    }
  });
}
// REST calls - END

// Populate data methods - START
function populateTableCollabs(collabs) {
  elementListeCollabs.find("." + classCollabLine).remove();
  elementListeCollabs.find("." + classNoCollabLoaded).remove();

  collabs.forEach(function(collab) {
    var collabAsline = "<tr class='" + classCollabLine + "'>";
    collabAsline += "<td class='" + classMatricule + "'>" + collab.matricule + "</td>";
    collabAsline += "<td>" + collab.nom + "</td>";
    collabAsline += "<td>" + collab.prenom + "</td>";
    collabAsline += "</tr>";

    elementListeCollabs.append(collabAsline);
  }, this);

  if (collabs.length == 0) {
    var noCollabLoadedLine = "<tr><td colspan='3' class='" + classNoCollabLoaded + " text-center'>" + textNoCollabsFound + "</td></tr>";
    elementListeCollabs.append(noCollabLoadedLine);
  }

  updateListeners();
}

function populateListeDepartements(departements) {
  selectFilterDepartement.find("option").slice(1).remove();

  departements.forEach(function(departement) {
    var deptAsOpt = "<option value='" + departement.id + "'>" + departement.nom + "</option>";
    selectFilterDepartement.append(deptAsOpt);
  }, this);
}
// Populate data methods - START
