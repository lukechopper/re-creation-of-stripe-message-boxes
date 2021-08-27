import './css/global.css';
import './css/styles.css';

let allRowText = document.querySelectorAll('.main-container__list-item');
//DOCUMENT LOAD
let allPopovers = document.querySelectorAll('.main-container__popover');

function setPopoverHeight(){
    allPopovers.forEach((popover, index) => {
        popover.style.display = 'block', popover.style.transform = 'scale(1)', popover.style.transition = 'none'; //Display needs to be set in order to read the height of the element
        let height = popover.clientHeight - 20;
        popover.style.display = 'none', popover.style.transform = 'scale(0.5)', popover.style.transition = '';
        let lines = Math.floor(height / 20);
        let offsetTop = -(55 + ((lines - 1) * 20));
        popover.style.top = `${offsetTop}px`;
    });
}

setPopoverHeight();

addEventListener('resize', setPopoverHeight);

//GLOBALS
let mainContainerSection = null, listItem = null, popover = null;
let mousePos = {x: null, y: null};
let offsetPos = {x: null, width: null, y: null, height: null};
let containerSelected = false;
let selectingNewItem = false;

function resetEverything(){
    listItem.classList.remove('main-container__list-item--selected');
    mainContainerSection = null, listItem = null, popover = null;
    mousePos = {x: null, y: null};
    offsetPos = {x: null, width: null, y: null, height: null};
    containerSelected = false;
    selectingNewItem = false;
}

function setGlobals(){
    offsetPos.x = listItem.offsetLeft, offsetPos.y = listItem.offsetTop, offsetPos.width = listItem.offsetLeft + listItem.clientWidth, offsetPos.height = listItem.offsetTop + listItem.clientHeight;
    mainContainerSection = listItem.parentElement.parentElement;
    popover = listItem.querySelector('.main-container__popover');
}

allRowText.forEach(text => {
    text.addEventListener('mouseover', e => {
        if(containerSelected || window.innerWidth < 680) return;
        listItem = e.target;
        listItem.classList.add('main-container__list-item--selected');
        setGlobals();
        if(!popover) return;
        popover.style.display = 'block'; 
        setTimeout(() => {
            popover.style.opacity = '1', popover.style.transform = 'scale(1)';
        }, 0);
        containerSelected = true;
    });
});

function selectAdjacentListItem(direction){
    selectingNewItem = true;
    popover.style.opacity = '0', popover.style.transform = 'scale(0.5)'; let oldPopover = popover;
    setTimeout(() => {
        if(popover === oldPopover) return;
        oldPopover.style.display = 'none';
    }, 150);
    if(direction === 'clear'){
        resetEverything();
        return;
    }
    if(direction === 'up'){
        if(!listItem.previousElementSibling) {
            resetEverything();
            return;
        }
        listItem.classList.remove('main-container__list-item--selected');
        listItem = listItem.previousElementSibling;
        listItem.classList.add('main-container__list-item--selected');
        setGlobals();
        if(!popover) {
            resetEverything();
            return;
        }
        popover.style.display = 'block'; 
        setTimeout(() => {
            popover.style.opacity = '1', popover.style.transform = 'scale(1)';
        }, 0);
        selectingNewItem = false;
        return;
    }
    if(direction === 'down'){
        if(!listItem.nextElementSibling) {
            resetEverything();
            return;
        }
        listItem.classList.remove('main-container__list-item--selected');
        listItem = listItem.nextElementSibling;
        listItem.classList.add('main-container__list-item--selected');
        setGlobals();
        if(!popover) {
            resetEverything();
            return;
        }
        popover.style.display = 'block'; 
        setTimeout(() => {
            popover.style.opacity = '1', popover.style.transform = 'scale(1)';
        }, 0);
        selectingNewItem = false;
        return; 
    }
}

addEventListener('mousemove', e => {
    if(!popover || selectingNewItem) return;
    mousePos.x = e.clientX - mainContainerSection.offsetLeft, mousePos.y = e.clientY - (mainContainerSection.offsetTop - window.scrollY);
    if(mousePos.y < offsetPos.y - 15 && mousePos.x > offsetPos.x && mousePos.x < offsetPos.width){
        selectAdjacentListItem('up');
        return;
    }
    if(mousePos.y > offsetPos.height + 15 && mousePos.x > offsetPos.x && mousePos.x < offsetPos.width){
        selectAdjacentListItem('down');
        return;
    }
    if(mousePos.x < offsetPos.x || mousePos.x > offsetPos.width){
        selectAdjacentListItem('clear');
    }
});