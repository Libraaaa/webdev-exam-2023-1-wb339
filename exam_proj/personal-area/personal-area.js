let orderTemplate = document.querySelector('#order-template');
let searchRoutes;
let mainOrder;


// function nameRoute(routes) {
//     let routeName = searchRoutes.find(item => item.id == 1);
// }

// заявки
function deleteBtnModalHandler(event) {
    let orderItem = event.target.closest('.col');
    // console.log(orderItem.id);
    let form = document.querySelector('#del-order').querySelector('form');
    form.elements['order-id'].value = orderItem.id;
}


//элемент карточки
function createOrderListItemElement(order) {
    let itemElement = orderTemplate.content.firstElementChild.cloneNode(true);
    itemElement.id = order.id;
    let routeNameApi = searchRoutes.find(item => item.id == order.route_id);
    let nameRoute = itemElement.querySelector('.item-col-name');
    nameRoute.innerHTML = routeNameApi.name;
    let date = itemElement.querySelector('.item-col-date');
    date.innerHTML = order.date;
    let price = itemElement.querySelector('.item-col-price');
    price.innerHTML = order.price + ' руб.';
    let itemDel = itemElement.querySelector('.bi-trash3');
    itemDel.addEventListener('click', deleteBtnModalHandler);

    return itemElement;
}
// 
async function downloadRoute() {
    let url = new URL('http://exam-2023-1-api.std-900.ist.mospolytech.ru');
    url.pathname = '/api/routes';
    url.search = 'api_key=83d0d1af-0b9b-484e-bfc0-a2e63b7a456a';
    let response = await fetch(url);
    searchRoutes = await response.json();
    console.log('55');
    // let xhr = new XMLHttpRequest();
    // xhr.open('GET', url);
    // xhr.responseType = 'json';
    // xhr.onload = function () {
    //     searchRoutes = this.response;
    // };
    // xhr.send();
}

function renderOrders(orders, page) {
    let orderElement = document.querySelector('.elements');
    let bodyOrder = orderElement.querySelector('.row');
    bodyOrder.innerHTML = '';
    let notesOnPage = 5;
    let start = (page - 1) * notesOnPage;
    let end = Math.min(orders.length, start + notesOnPage);
    for (let i = start; i < end; i++) {
        bodyOrder.append(createOrderListItemElement(orders[i]));
    }
}

function paginationItemHandler(event) {
    renderOrders(mainOrder, event.target.innerText);
}

function createPaginationItem(orders) {
    let countOfItems = Math.ceil(orders.length / 5);
    let items = [];
    let ulPages = document.querySelector('.pagination-orders');
    ulPages.innerHTML = '';
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


function downloadOrders() {
    let ordersTable = document.querySelector('.elements');
    let url = new URL(ordersTable.dataset.url);
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = function () {
        mainOrder = this.response;
        console.log('44');
        renderOrders(this.response, 1);
        createPaginationItem(this.response);
    };
    xhr.send();
}

async function deleteOrder(order_id) {
    let deleteOrderBtn = document.querySelector('.delete-order-btn');
    let url = new URL(deleteOrderBtn.dataset.url);
    url.pathname = '/api/orders/' + order_id;
    url.search = 'api_key=83d0d1af-0b9b-484e-bfc0-a2e63b7a456a';
    // let repsonseFromServer = await fetch(url, {method: 'DELETE'});
    // let deletedId = await repsonseFromServer.json();
    // return deletedId;
    let xhr = new XMLHttpRequest();
    xhr.open('DELETE', url);
    xhr.responseType = 'json';
    xhr.onload = function () {
        downloadOrders(mainOrder);
    };
    xhr.send();
}

function deleteBtnHandler(event) {
    let form = event.target.closest('.modal').querySelector('form');
    let orderId = form.elements['order-id'].value;
    console.log(orderId);
    deleteOrder(orderId);
}


window.onload = async function () {
    await downloadRoute();
    downloadOrders();
    // downloadRoute();
    document.querySelector('.delete-order-btn').onclick = deleteBtnHandler;
};