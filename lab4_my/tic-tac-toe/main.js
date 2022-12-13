function initBoard () {
    let gameBoard = document.getElementById('board');
    /*
    let createDiv =  document.createElement('div'); //создаём элемент, которого не было
    createDiv.className = 'cell'; //прописываем к нему класс
    createDiv.innerHTML = 'check this'; //добавляем текст
    gameBoard.append(createDiv); //добавляем элемент в поле, нужно создать ещё 8 элементов*/
    for (let i = 0; i < 9; i++) {
        let createDiv =  document.createElement('div'); //создаём элемент,
        createDiv.className = 'cell'; 
        createDiv.innerHTML = ''; 
        gameBoard.append(createDiv);
        createDiv.addEventListener('click', clickHandler); //назначили обработчик для ф-и клика
    }
    return gameBoard;
}


//функция, срабатывающая на клик пользователя по ячейке
let turn = 1;
let gameOver = false;
function clickHandler(event) {

    //блокировка изменения значения ячейки, если на неё уже кликали
    if (event.target.innerHTML != '') {
        showMessage('Это поле уже занято!', 'danger'); 
        return;
    }

    if (gameOver) {
        showMessage('Игра закончена', 'danger');
        return;
    }

    /*if (turn == 1) {
        event.target.innerHTML = 'x'; //Свойство innerHTML позволяет получить HTML-содержимое элемента в виде строки или его изменить
    } else {
        event.target.innerHTML = 'o';
    }
    или
    turn == 1 ?  event.target.innerHTML = 'x' : event.target.innerHTML = 'o';
    или 
    */
    event.target.innerHTML = turn == 1 ?  'x' : 'o';
    turn = (turn + 1) % 2;

    //после каждого хода польхователя проверяем, не получилась ли выигрышная комбинация
    let winner = findWinner ();
    if (winner != null  || !checkAvailable() ) {
        showMessage (winner ? `${winner} одержал победу!` : 'Ничья');
        gameOver = true;
    }
    
}

function newGame () {
    let cells = document.querySelectorAll('.cell');
    for (let i = 0; i < 9; i++) {
        cells[i].innerHTML = '';
    }
    gameOver = false;
    turn = 0;
}

function checkAvailable () {
    let cells = document.querySelectorAll('.cell');
    let nullCell = false;
    for (let i = 0; i < 9; i++) {
        if (cells[i].innerHTML == '') return true;
    }
    return false;
}

function findWinner () {
    let cells = document.querySelectorAll('.cell'); //ищем все объекты с классом cell
    /*  0 1 2
        3 4 5
        6 7 8 */
    let row, column, diag, diag1, winner;
    diag = cells[0].innerHTML != '' ? diag = cells[0].innerHTML : null;
    diag1 = cells[2].innerHTML != '' ? diag1 = cells[2].innerHTML : null;
    for (let i = 0; i < 3; i++) {
        //проверка строк и стоблцов
        row = cells[i*3 /*+ 0*/].innerHTML != '' ? row = cells[i*3].innerHTML : null; //проверяем первый элем строки: если он занят, то записать в row его же, если пуст - null
        column = cells[i].innerHTML != '' ? column = cells[i].innerHTML : null;
        for (let j = 0; j < 3; j++ ) {
           
            if (!row && !column) { 
                break;
            }

            if (cells[i*3 + j].innerHTML != row)  //если значение текущей ячейки не совпадает со значением row, то эта строка уже не может быть выигрышной 
                row = null;
            
            if (cells[j*3 + i].innerHTML != column)  
                column = null;

        }
        winner = row || column; //если хоть в одной строке или стоблце получилась нужная комбинация, то переменной winner присваиваем это значение
        if (winner) 
            return winner;

        //проверка диагоналей
        if (cells[i * 3 + i].innerHTML != diag)  
            diag = null;
        if (cells[i * 3 + 2 - i].innerHTML != diag1) 
            diag1 = null;
    }
    winner = diag || diag1;
        return winner; //вывод winner в любом случае, ибо проверены все возможные комбинации

}

//сообщение
function showMessage (message, category = 'success') {
    let messages = document.querySelector('.messages'); //ищем объект с классом messages и записываем его в переменную
    let createDiv = document.createElement('div'); //создаём новый объект для сообщения, которое хоти добавить на страницу
    createDiv.classList.add('message', category); //добавляем элементу 2 класса
    createDiv.innerHTML = message; //содержимое элемента - текст сообщения
    messages.append(createDiv); //добавляем текст сообщения на страницу
    setTimeout(() => createDiv.remove(), 2000); //удаление сообщения после определенного времени
}

// вызываем скрипт только после того, как весь остальной контент на странице
// был загружен (исп. браузерное событие)
window.onload = function() { //функция-обработчик события
    initBoard();
    let button = document.querySelector('.new-game-btn');
    button.addEventListener('click', newGame);
}




