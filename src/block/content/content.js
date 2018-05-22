'use strict';

let item = Array.from(document.querySelectorAll('.content__item'));
let list = document.querySelector('.content__list');
let targetEl = null;

//начальное положение слайдов
for(let i = 0; i < item.length; i++) {
  item[i].style.left = i*(100/item.length) + '%';
}

//обработчик события на наведение мыши
list.addEventListener('mouseover', function(event) {
  //необходимо определить, что движение совершено в новом слайде, если новый, но сначала сбрасываем
  //положение слайдов на изначальное, запоминаем текущий слайд и вызываем ф-цию сhangePosition(target).
  if(targetEl === null || targetEl.dataset.number !== event.target.closest('li').dataset.number) {
    for(let i = 0; i < item.length; i++) {
      item[i].style.left = i*(100/item.length) + '%';
    }
    targetEl = event.target.closest('li');
    changePosition(targetEl);
  }
})

//обработчик события на всем документе - проверка, что мышка ушла со слайдера
document.addEventListener('mouseover', function(event) {
  if(!event.target.closest('li')) {
    for(let i = 0; i < item.length; i++) {
      item[i].style.left = i*(100/item.length) + '%';
    }
  }
});

//функция меняет инлайновый стиль style.left у текущего слайда и у соседних слайдов
//переменная shiftDouble - сдвиг, который нужен для крайнего правого слайда и второго слайда, есди наводим на первый и последний слайды
//переменная shift - сдвиг у остальных слайдов
function changePosition(targetEl) {
  let previous = targetEl.previousElementSibling;
  let next = targetEl.nextElementSibling;
  let shiftDouble = (targetEl.clientWidth - list.clientWidth/item.length)
  let shift = (shiftDouble/2);

  if (previous === null) {
    let nextNext = next.nextElementSibling;
    nextNext.style.left = `calc( ${nextNext.style.left} + ${shift}px)`;
    next.style.left = `calc( ${next.style.left} + ${shiftDouble}px)`;
  } else if (next === null) {
    let prevPrevios = previous.previousElementSibling;
    prevPrevios.style.left = `calc( ${prevPrevios.style.left} - ${shift}px)`;
    targetEl.style.left = `calc( ${targetEl.style.left} - ${shiftDouble}px)`;
    previous.style.left = `calc( ${previous.style.left} - ${shift}px)`;
  } else {
    previous.style.left = `calc( ${previous.style.left} - ${shift}px)`;
    targetEl.style.left = `calc( ${targetEl.style.left} - ${shift}px)`;
    next.style.left = `calc( ${next.style.left} + ${shift}px)`;
  }
}
