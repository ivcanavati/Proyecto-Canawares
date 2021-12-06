const HTTTPMethods = {
    "put": "PUT",
    "post": "POST",
    "get": "GET",
    "delete": "DELETE"
}
const APIURL = window.location.protocol + '//' + window.location.host + '/api';
let TOKEN = getTokenValue('token');

function getTokenValue(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function sendHTTPRequest(urlAPI, data, method, cbOK, cbError, authToken) {
    // 1. Crear XMLHttpRequest object
    let xhr = new XMLHttpRequest();
    // 2. Configurar:  PUT actualizar archivo
    xhr.open(method, urlAPI);
    // 3. indicar tipo de datos JSON
    xhr.setRequestHeader('Content-Type', 'application/json');
    if (authToken)
        xhr.setRequestHeader('x-auth-user', authToken);
    // 4. Enviar solicitud al servidor
    xhr.send(data);
    // 5. Una vez recibida la respuesta del servidor
    xhr.onload = function () {
        if (xhr.status != 200 && xhr.status != 201) { // analizar el estatus de la respuesta HTTP 
            // Ocurrió un error
            cbError(xhr.status + ': ' + xhr.statusText);
        } else {
            console.log(xhr.responseText); // Significa que fue exitoso
            cbOK({
                status: xhr.status,
                data: xhr.responseText
            });
        }
    };
}

function login() {
    console.log('login...');
    let user = document.getElementById('userInputLogin').value;
    let pass = document.getElementById('passwordInputLogin').value;
    let data = JSON.stringify({
        "email": user,
        "password": pass
    });
    let url = APIURL + "/login";
    sendHTTPRequest(url, data, HTTTPMethods.post, (data) => {
        console.log(data);
        TOKEN = JSON.parse(data.data).token;
        setCookie('token', TOKEN, 2);
        document.getElementById('loginResponseMSG').innerHTML = '<p class="text-success">Bienvenido a tu Portal Escolar!</p>'
    }, (error) => {
        console.log('errro');
        document.getElementById('loginResponseMSG').innerHTML = '<p class="text-danger">' + error + '</p>'
    })
}

function createUser() {
    console.log('createUser');
    let eles = document.getElementById('createFormModal').getElementsByTagName('input');
    let user = {};
    for (let i = 0; i < eles.length; i++) {
        if (eles[i].getAttribute('type') === 'text') {
            user[eles[i].getAttribute('name')] = eles[i].value;
        }
        if (eles[i].getAttribute('type') === 'email') {
            user[eles[i].getAttribute('name')] = eles[i].value;
        }
        if (eles[i].getAttribute('type') === 'password') {
            user['password'] = eles[i].value;
        }
        if (eles[i].getAttribute('type') === 'date') {
            user[eles[i].getAttribute('name')] = eles[i].value;
        }
        if (eles[i].getAttribute('type') === 'url') {
            user[eles[i].getAttribute('name')] = eles[i].value;
        }
        if (eles[i].getAttribute('type') === 'radio') {
            if (eles[i].checked)
                user[eles[i].getAttribute('name')] = eles[i].value;
        }
    }
    console.log(user);
    let url = APIURL + "/register";
    sendHTTPRequest(url, JSON.stringify(user), HTTTPMethods.post, (data) => {
        //window.location.replace('/consulta.html');
        document.getElementById('responseMSG').innerHTML = '<p class="text-success">Sucess!</p>';
    }, (error) => {
        document.getElementById('responseMSG').innerHTML = '<p class="text-danger">' + error + '</p>';
    }, TOKEN)


}


function eventsHandlers() {
    let loginBtn = document.getElementById('loginBtn');
    loginBtn.addEventListener('click', login);

    let registerBtn = document.getElementById('createUserBtn');
    registerBtn.addEventListener('click', createUser);

    let loginForm = document.getElementById('createFormModal');
    
    loginForm.onsubmit = (e) => {
        e.preventDefault();
        console.log('stopped!');
        createUser(e.target);
    }
    loginForm.addEventListener('change', (e) => {
        let disableBtn = false;
        let list = loginForm.querySelectorAll('input:invalid');
        if (list.length > 0) disableBtn = true;
        if (document.getElementById('password1').value !== document.getElementById('password2').value) disableBtn = true;
        document.getElementById('createUserBtn').disabled = disableBtn;
        console.log(`Status of createUserBtn:${disableBtn}`)
    });

}
document.addEventListener('DOMContentLoaded', () => {
    eventsHandlers();
    $('#createFormModal').on('show.bs.modal', function (event) {
        // console.log(event.relatedTarget);

    });


});