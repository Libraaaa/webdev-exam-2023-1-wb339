function downloadOrders() {
    let ordersTable = document.querySelector('.orders-table');
    let url = new URL(ordersTable.dataset.url);
    // let perPage = document.querySelector('.per-page-btn').value;
    // url.searchParams.append('page', page);
    // url.searchParams.append('per-page', perPage);
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = function () {
        renderOrders(this.response);
        // setPaginationInfo(this.response['_pagination']);
        // renderPaginationElement(this.response['_pagination']);
    };
    xhr.send();
}

// заявки
function renderOrders(orders) {
    let bodyOrder = document.querySelector('.tbody-order');
    bodyOrder.innerHTML = '';
    for (let i = 0; i < routes.length; i++) {
        bodyOrder.append(createRouteListItemElement(routes[i]));
    }
}

let routeTemplate = document.querySelector('#order-template');
function createOrderListItemElement(order) {
    let itemElement = routeTemplate.content.firstElementChild.cloneNode(true);
    itemElement.querySelector('.item-col-num') = order.id;
    let name = itemElement.querySelector('.item-col-name');
    name.innerHTML = order.name;
    let date = itemElement.querySelector('.item-col-date');
    date.innerHTML = order.date;
    let price = itemElement.querySelector('.item-col-price');
    price.innerHTML = order.price;
    return itemElement;
}
// 