//VERIFICA SE L'UTENTE NON HA UN ACCOUNT E PROVA AD ACCEDERE ALLA CHAT E SE L'UTENTE HA UN ACCOUNT ED ACCEDE ALLA PAGINA DI LOGIN
if (localStorage.getItem("utente") == null && window.location == "http://127.0.0.1:5500/16_ajax/chat.html") {
    window.location = "http://127.0.0.1:5500/16_ajax/login.html"
}
else if (localStorage.getItem("utente") != null && window.location == "http://127.0.0.1:5500/16_ajax/login.html") {
    window.location = "http://127.0.0.1:5500/16_ajax/chat.html"
}

//SALVO NEL LOCALSTORAGE IL NOME INSERITO NEL FORM DEL LOGIN
function login() {
    $("#btnClicca").on("click", function () {
        utente = $("#nome").val();
        localStorage.setItem("utente", utente)
        localStorage.setItem("colore", colore())
        window.location = "http://127.0.0.1:5500/16_ajax/chat.html"
    })
}

//STAMPO I MESSAGGI
function elencoMessaggi() {
    $.ajax(
        {
            url: "http://localhost:3000/chat",
            type: 'GET',
            success: function (data) {
                stampaChat(data);
            },
            error: function (err) {
                console.log('non mandato')
            }
        }
    )
}

//PRENDE L'ORA DAL PC
function oraMex() {
    let ora = new Date();
    let oraCorrente =
        ora.getHours() + ":"
        + ora.getMinutes()
    return oraCorrente
}

function getMex() {
    let utente = localStorage.getItem("utente")
    let mess = $("#msg").val()
    let ora = oraMex()
    let dati = {utente : utente, mess: mess, ora: ora, color: localStorage.getItem("colore")}
    $.ajax(
        {
            //INSERIRE INVIO DEI DATI AL DB
            url: "http://localhost:3000/chat",
            type: 'POST',
            data: dati,
            success: function () {
                elencoMessaggi()
            },
            error: function (err) {
                console.log('non mandato')
            }
        }
    )
}

function colore() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

//PRENDE DAL DB I MESSAGGI E LI STAMPA
function stampaChat(messaggi) {
    let chat = ""
    for (let [idx, item] of messaggi.entries()) {
        if (localStorage.getItem('utente') == item.utente) {
            chat += `
            <div class="card card-body mb-3 bg-primary text-light d-flex ms-auto" style="width: 300px;">
                <h5>${item.utente}</h5>
                <p>${item.testo}</p>
                <p class="fs-6 text-end fw-light mb-0 mt-2 text-light">${item.ora}</p>
            </div>`
        }
        else {
            chat += `
            <div class="card card-body mb-3" style="width: 300px; background-color:${item.colore}">
                <h5>${item.utente}</h5>
                <p>${item.testo}</p>
                <p class="fs-6 text-end fw-light mb-0 mt-2 text-light">${item.ora}</p>
            </div>`
        }
    }
    $('#chat').html(chat)
}

$(document).ready(
    function () {
        elencoMessaggi()
        $("#btnClicca").on("click", function () {
            login();
        })

        $("#btnSend").on("click", function () {
            getMex()
        })

        setInterval(() => {
            elencoMessaggi()
        }, 3000)
    })