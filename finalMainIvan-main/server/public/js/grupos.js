const HTTTPMethods = {
    "put": "PUT",
    "post": "POST",
    "get": "GET",
    "delete": "DELETE"
}
const APIURL = window.location.protocol + '//' + window.location.host + '/api';
let TOKEN = getTokenValue('token');
let PAGES = {
    current: 1,
    currentIndex: 0,
};
let NAME_FILTER = '';

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

function sendHTTPRequest(urlAPI, data, method, cbOK, cbError, ) {
    // 1. Crear XMLHttpRequest object
    let xhr = new XMLHttpRequest();
    // 2. Configurar:  PUT actualizar archivo
    xhr.open(method, urlAPI);
    // 3. indicar tipo de datos JSON
    xhr.setRequestHeader('Content-Type', 'application/json');
    //console.log(TOKEN);
    xhr.setRequestHeader('x-auth-user', TOKEN);
    // 4. Enviar solicitud al servidor
    xhr.send(data);
    // 5. Una vez recibida la respuesta del servidor
    xhr.onload = function () {
        if (xhr.status != 200) { // analizar el estatus de la respuesta HTTP 
            // Ocurrió un error
            alert(xhr.status + ': ' + xhr.statusText); // e.g. 404: Not Found
            cbError(xhr.status + ': ' + xhr.statusText);
        } else {
            // console.log(xhr.responseText); // Significa que fue exitoso
            cbOK({
                status: xhr.status,
                data: xhr.responseText
            });
        }
    };
}

const userToHTML = (grupo) => {
    return `
    <div class="col-md-4 col-xs-12 my-2 d-flex justify-content-center">
                <div class="card" style="width: 18rem;">
                    <img src="grupos.jpg" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${grupo.nombre}</h5>
                        <p class="card-text">Nombre del profesor: ${grupo.profesor} <br> Descripción de la materia: ${grupo.descripcion}</p>
                        
                    </div>
                </div>
            </div>
            `
}
const userListToHTML = (list, campeon) => {
    console.log(list);
    if (campeon && list && document.getElementById(campeon)) {
        document.getElementById(campeon).innerHTML = list.map(userToHTML).join('');
    }
}

function getUsersPage(page, filter) {
    console.log('hola');
    let nfilter = (filter) ? `${filter}` : '';
    let url = APIURL + "/users?page=" + page + "&limit=3" + nfilter;
    console.log(url);
    sendHTTPRequest(url, null, HTTTPMethods.get, (data) => {
        let users = JSON.parse(data.data);
        console.log(users);
        updatePaginationHTML(users.totalPages, page, nfilter);
        userListToHTML(users.content, 'lista');
    }, (error) => {

    })
}


function updatePaginationHTML(totalPages, currentPage, nameFilter) {
    let content = '';
    let currentPageLbl = currentPage + 1;
    
    if (totalPages <= 1)
        content = `
            <li class="page-item disabled" ><a class="page-link" href="#">Previous</a></li>
            <li class="page-item  disabled"><a class="page-link  " href="#">1</a></li>
            <li class="page-item disabled"><a class="page-link" href="#">2</a></li>
            <li class="page-item disabled"><a class="page-link" href="#">3</a></li>
            <li class="page-item disabled"><a class="page-link" href="#">Next</a></li>
        `;
    else {
        if (currentPage <= 1) {
            content += ` <li class="page-item disabled" ><a class="page-link" href="#">Previous</a></li>`;
        } else {
            content += ` <li class="page-item" onclick="getUsersPage(${currentPage-1},'${nameFilter}')" ><a class="page-link" href="#">Previous</a></li>
                        <li class="page-item" onclick="getUsersPage(${currentPage-1},'${nameFilter}')"><a class="page-link" href="#">${currentPage-1}</a></li>`;

        }
        content += `<li class="page-item active" onclick="getUsersPage(${currentPage},'${nameFilter}')"><a class="page-link" href="#">${currentPage}</a></li>`;
        if ((totalPages - currentPage) >= 1) {
            content += `
            <li class="page-item" onclick="getUsersPage(${currentPage+1},'${nameFilter}')"><a class="page-link" href="#">${currentPage+1}</a></li>
            <li class="page-item" onclick="getUsersPage(${currentPage+1},'${nameFilter}')"><a class="page-link" href="#">Next</a></li>
            `;
        } else {
            content += `
            <li class="page-item disabled" ><a class="page-link" href="#">Next</a></li>
            `;
        }
    }

    document.getElementById('pagesList').innerHTML = content;
}



document.addEventListener('DOMContentLoaded', () => {
    getUsersPage(1, NAME_FILTER);

});