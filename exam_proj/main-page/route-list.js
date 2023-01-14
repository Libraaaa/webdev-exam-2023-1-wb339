let guideElemId = 0;
let responce;


let searchRoutes;
function downloadRoutes() {
    let routesTable = document.querySelector('.route-elements');
    let url = new URL(routesTable.dataset.url);
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = function () {
        searchRoutes = this.response;
        renderRoutes(this.response, 1);
        renderObjectSelect(this.response);
        createPaginationItem(this.response);
    };
    xhr.send();
}

// маршруты
function renderRoutes(routes, page) {
    let bodyRoute = document.querySelector('.route-elements');
    bodyRoute.innerHTML = '';
    let notesOnPage = 10;
    let start = (page - 1) * notesOnPage;
    let end = Math.min(routes.length, start + notesOnPage);
    for (let i = start; i < end; i++) {
        bodyRoute.append(createRouteListItemElement(routes[i]));
    }

}


function createPaginationItem(routes) {
    let countOfItems = Math.ceil(routes.length / 10);
    let items = [];
    let ulPages = document.querySelector('.pagination-routes');
    for (let i = 1; i <= countOfItems; i++) {
        let pageItem = document.createElement('li');
        pageItem.classList.add('page-item');
        let aHrefPage = document.createElement('a');
        aHrefPage.classList.add('page-link');
        aHrefPage.innerHTML = i;
        pageItem.append(aHrefPage);
        ulPages.appendChild(pageItem);
        items.push(pageItem);
        pageItem.onclick = paginationItemHandler;
    }
    return items;
}

function paginationItemHandler(event) {
    renderRoutes(searchRoutes, event.target.innerText);
}

let routeTemplate = document.querySelector('#route-template');
function createRouteListItemElement(route) {
    let itemElement = routeTemplate.content.firstElementChild.cloneNode(true);
    itemElement.id = 'route' + route.id;
    let name = itemElement.querySelector('.item-col-name');
    name.innerHTML = route.name;
    let desc = itemElement.querySelector('.item-col-desc');
    desc.innerHTML = route.description;
    let mainObject = itemElement.querySelector('.item-col-mainobjects');
    mainObject.innerHTML = route.mainObject;
    itemElement.querySelector('#change-btn-route').addEventListener('click', changeRouteBtnHandler);
    return itemElement;
}
// 


let searchGuides;
function downloadGuides(route_id) {
    let guidesTable = document.querySelector('.guide-elements');
    let url = new URL(guidesTable.dataset.url);
    url.pathname = '/api/routes/' + route_id + '/guides';
    url.search = 'api_key=83d0d1af-0b9b-484e-bfc0-a2e63b7a456a';
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = function () {
        searchGuides = this.response;
        renderGuides(this.response);
        renderLangSelect(this.response);
    };
    xhr.send();
}

// гиды
function renderGuides(guides) {
    let bodyGuide = document.querySelector('.guide-elements').querySelector('.row');
    bodyGuide.innerHTML = '';
    for (let i = 0; i < guides.length; i++) {
        bodyGuide.append(createGuideListItemElement(guides[i]));
    }
}

let guideTemplate = document.querySelector('#guide-template');
function createGuideListItemElement(guide) {
    let itemElement = guideTemplate.content.firstElementChild.cloneNode(true);
    itemElement.id = 'guide' + guide.id;
    let name = itemElement.querySelector('.item-col-name');
    name.innerHTML = guide.name;
    let language = itemElement.querySelector('.item-col-language');
    language.innerHTML = guide.language;
    let experience = itemElement.querySelector('.item-col-experience');
    experience.innerHTML = guide.workExperience;
    let pricePerHour = itemElement.querySelector('.item-col-price-per-hour');
    pricePerHour.innerHTML = guide.pricePerHour + ' руб.';
    itemElement.querySelector('#change-btn-guide').addEventListener('click', changeGuideBtnHandler);
    console.log(itemElement);
    return itemElement;
}

let itElemId = 0;
function changeRouteBtnHandler(event) {
    let itemElement = event.target.closest('.card-route');
    document.querySelector('.list-guide').style.display = 'block';
    let span = document.querySelector('.name-route');
    if (itElemId == itemElement.id) {
        itemElement.style.boxShadow = '';
        document.querySelector('.list-guide').style.display = 'none';
        itElemId = 0;
    } else
        if (itElemId != 0) {
            itElemId = itemElement.id;
            document.getElementById(itElemId).style.boxShadow = '';
            itemElement.style.boxShadow = '0 0 10px #842029';
            document.querySelector('.list-guide').style.display = 'block';
            document.querySelector('.list-guide').scrollIntoView();
            span.innerHTML = '«' + itemElement.querySelector('.item-col-name').innerHTML + '»';
        } else {
            itElemId = itemElement.id;
            itemElement.style.boxShadow = '0 0 10px #842029';
            document.querySelector('.list-guide').scrollIntoView();
            span.innerHTML = '«' + itemElement.querySelector('.item-col-name').innerHTML + '»';

        }
    downloadGuides(itemElement.id.slice(5));
}

function changeGuideBtnHandler(event) {
    let itemElement = event.target.closest('.col');

    //если два раза нажать на одну и ту же кнопку
    if (guideElemId == itemElement.id) {
        // itemElement.style.boxShadow = '';
        guideElemId = 0;
    } else
        //перевыбор с одного поля на другое
        if (guideElemId != 0) {
            guideElemId = itemElement.id;
            newOrderModal(itemElement);
            // document.getElementById(guideElemId).style.boxShadow = '';
            // itemElement.style.boxShadow = '0 0 10px rgb(211, 199, 97)';
        } else {
            guideElemId = itemElement.id;
            // itemElement.style.boxShadow = '0 0 10px rgb(211, 199, 97)';
            newOrderModal(itemElement);
        }
}
//


//Оформление заявки
function newOrderModal(guideElement) {
    // let guideElement = document.getElementById(guideElemId);
    // console.log(guideElemId, guideElement);
    let modalWindow = document.querySelector('.modal');
    let spanGuideName = modalWindow.querySelector('.guide-name');
    spanGuideName.innerHTML = guideElement.querySelector('.item-col-name').innerHTML;
    console.log(spanGuideName);
    let routeElement = document.querySelector('.list-guide-h2');
    let spanRouteName = modalWindow.querySelector('.route-name');
    spanRouteName.innerHTML = routeElement.querySelector('.name-route').innerHTML;
    console.log(spanRouteName);

    calculateTotalPrice();
    // document.querySelector('#send-order').addEventListener('click', showSuccessAlertHandler);
    // document.querySelector('#send-order').addEventListener('click', showErrorAlertHandler);

    
}


function saveResponse(response) {
    responce = response;
    return responce;
}

async function checkDate(date) {
    let excursionDate = document.querySelector('#excursion-date');
    let url = new URL(excursionDate.dataset.url);
    url.pathname = '/' + date;
    let repsonseFromServer = await fetch(url);
    let response = repsonseFromServer.json();
    // responce = response;
    return response;
    // let xhr = new XMLHttpRequest();
    // xhr.open('GET', url);
    // xhr.responseType = 'json';
    // xhr.onload = function () {
    //     // responce = this.response;
    //     // console.log(responce, this.response);
    //     // return responce;
    //     saveResponse(this.response);
    //     console.log(1111);
    // };
    // xhr.send();
    // console.log(responce);
}

async function calculateTotalPrice() {
    let totalPrice;

    let modalWindow = document.querySelector('.modal');
    let guideElement = document.getElementById(guideElemId);
    let pricePerHourGuide = guideElement.querySelector('.item-col-price-per-hour').innerHTML.slice(-50, -4);
    let hours = modalWindow.querySelector('#excursion-duration').value.slice(0, 1);

    let excursionDate = modalWindow.querySelector('#excursion-date').value;
    responce = await checkDate(excursionDate);
    let isThisDayOff = 1;
    if (responce == 1) {
        isThisDayOff = 1.5;
    }

    let excursionTime = modalWindow.querySelector('#excursion-time').value;
    let isItTime = 0;
    if (excursionTime >= '09:00' && excursionTime < '12:00') {
        isItTime = 400;
    } else
        if (excursionTime >= '20:00' && excursionTime < '23:00') {
            isItTime = 1000;
        }

    let countPeople = modalWindow.querySelector('#count-people').value;
    let numberOfVisitors = 0;
    if (countPeople >= 5 && countPeople < 10) {
        numberOfVisitors = 1000;
    } else if (countPeople >= 10 && countPeople <= 20) {
        numberOfVisitors = 1500;
    }


    totalPrice = Math.round(pricePerHourGuide * hours * isThisDayOff + isItTime + numberOfVisitors);
    let option1 = document.querySelector('#option-quick-arrival');
    let increase1 = 0;
    if (option1.checked) {
        increase1 = totalPrice * 0.3;
    }


    let option2 = document.querySelector('#option-presents');
    let increase2 = 0;
    if (option2.checked) {
        increase2 = 500 * countPeople;
    }

    let spanTotalPrice = modalWindow.querySelector('.total-price').querySelector('span');
    spanTotalPrice.innerHTML = totalPrice + ' руб.';
    if (increase1 != 0 || increase2 != 0) {
        totalPrice = Math.round(totalPrice + increase1 + increase2);
        spanTotalPrice.innerHTML = totalPrice + ' руб.';
    }

}


function optionFirstHandler(event) {
    let option = event.target.querySelector('#option-quick-arrival');
    calculateTotalPrice();
}

function optionSecondtHandler(event) {
    let option = event.target.querySelector('#option-presents');
    calculateTotalPrice();
}

function showSuccessAlertHandler(event) {
    document.querySelector('.list-guide').style.display = 'none';
    let alertSuccess = document.querySelector('#alert-success');
    console.log(alertSuccess, 'success');
    alertSuccess.style.display = 'block';
    alertSuccess.scrollIntoView();
}

function showErrorAlertHandler(event) {
    document.querySelector('.list-guide').style.display = 'none';
    let alertDanger = document.querySelector('#alert-danger');
    console.log(alertDanger, 'error');

    alertDanger.style.display = 'block';
    alertDanger.scrollIntoView();
}

//



async function postOrder(event) {
    let sendOrderBtn = document.querySelector('#send-order');
    let url = new URL(sendOrderBtn.dataset.url);

    let modalWindow = document.querySelector('.modal');
    let formInputs = modalWindow.querySelector('form').elements;
    let guide_id = document.getElementById(guideElemId).id.slice(5);
    let route_id = document.getElementById(itElemId).id.slice(5);
    let date = formInputs['excursion-date'].value;
    let time = formInputs['excursion-time'].value;
    let duration = formInputs['excursion-duration'].value.slice(0, 1);
    let persons = formInputs['count-people'].value;
    let optionFirst = formInputs['option-quick-arrival'].checked ? 1 : 0;
    let optionSecond = formInputs['option-presents'].checked ? 1 : 0;
    let price = modalWindow.querySelector('.total-price').querySelector('span').innerHTML.slice(-50, -4);

    let formData = new FormData();
    formData.append('guide_id', guide_id);
    formData.append('route_id', route_id);
    formData.append('date', date);
    formData.append('time', time);
    formData.append('duration', duration);
    formData.append('persons', persons);
    formData.append('optionFirst', optionFirst);
    formData.append('optionSecond', optionSecond);
    formData.append('price', price);

    let responce = await fetch(url, { method: 'POST', body: formData });
    
    if (responce.ok) {
        // let responsePars = await responce.json();
        console.log(responce.ok, 'success');
        showSuccessAlertHandler();
    } else {
        console.log(responce.ok, 'error');
        showErrorAlertHandler();
    }

    modalWindow.querySelector('form').reset();
    document.getElementById(itElemId).style.boxShadow = '';
    // return responsePars;

}





// выпадающий список Язык экскурсии
function renderLangSelect(guides) {
    let languageSelect = document.querySelector('#language-select');

    for (let i = 0; i < guides.length; i++) {
        languageSelect.append(createItemLang(guides[i]));
    }
}

function createItemLang(guide) {
    var itemLang = document.createElement('option');
    let textOption = document.createTextNode(guide.language);
    // for (let i = 0; i < guide.length; i++) {
    //     let k = 0;

    // }
    itemLang.appendChild(textOption);
    return itemLang;
}
//

// выпадающий список Основные объекты
function renderObjectSelect(routes) {
    let objectSelect = document.querySelector('#object-select');

    for (let i = 0; i < routes.length; i++) {
        objectSelect.append(createItemObject(routes[i]));
    }
}

function createItemObject(route) {
    var itemObject = document.createElement('option');
    let textOption = document.createTextNode(route.mainObject);
    itemObject.appendChild(textOption);
    return itemObject;
}
//

//Поиск Маршруты
function searchRouteHandler(event) {
    let name = document.querySelector('#searchOfName');
    let object = document.querySelector('#object-select');
    let routes = searchRoutes;
    console.log(routes);

    if (object.value != 'Не выбрано') {
        routes = routes.filter(route => route.mainObject.includes(object.value));
    }

    if (name.value != '') {
        routes = routes.filter(route => route.name.includes(name.value));
    }

    renderRoutes(routes);
}
//

//Поиск Гиды
function searchGuideHandler(event) {
    let from = document.querySelector('.from');
    let to = document.querySelector('.to');
    let language = document.querySelector('#language-select');
    let guides = searchGuides;

    if (language.value != 'Не выбрано') {
        guides = guides.filter(guide => guide.language.includes(language.value));
    }

    if (from.value != '') {
        guides = guides.filter(guide => guide.workExperience >= from.value);
    }
    if (to.value != '')
        guides = guides.filter(guide => guide.workExperience <= to.value);

    renderGuides(guides);
}
//


window.onload = function () {
    downloadRoutes();
    document.querySelector('.from').onchange = searchGuideHandler;
    document.querySelector('.to').onchange = searchGuideHandler;
    document.querySelector('#language-select').onchange = searchGuideHandler;
    document.querySelector('#searchOfName').oninput = searchRouteHandler;
    document.querySelector('#object-select').onchange = searchRouteHandler;
    document.querySelector('#option-quick-arrival').onclick = optionFirstHandler;
    document.querySelector('#option-presents').onclick = optionSecondtHandler;
    document.querySelector('.modal').querySelector('form').onchange = calculateTotalPrice;

    document.querySelector('#send-order').onclick = postOrder;
    // document.querySelector('.btn-close').onclick = closeModalHandler;
    // document.querySelector('#btn-cancel').onclick = closeModalHandler;

    // let showModal = document.getElementById('show-order');
    // showModal.addEventListener('show.bs.modal', newOrderModal);
}