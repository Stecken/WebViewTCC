let menu;
let state = false;
let menu_mobile;
let menutagA;
/*Menu Sobre Android*/
let buttonNavAndroid;
let eitaNav;
let seta;


function imgMenu() {
    state = !state;
    if(state){
        menu.style.transform = `rotate(${-90}deg)`;
        menutagA.style.display = 'flex';
        menutagA.style.opacity = "1";
        menu_mobile.style.opacity = "1";
    }else{
        menu.style.transform = `rotate(${-180}deg)`;
        menutagA.style.display = 'none';
        menutagA.style.opacity = "0";
        menu_mobile.style.opacity = "0";
    }
}

const menuSobre = () => {
    state1 = !state1;
    if(state1){
        buttonNavAndroid.style.transform = `rotate(${-90}deg)`;
        eitaNav.style.maxHeight = '300px';
    }
    else{
        buttonNavAndroid.style.transform = `rotate(${-180}deg)`;
        eitaNav.style.maxHeight = '0';
    }
}

let stateArrow = false;

function giraSeta() {
    // Check to see if the counter has been initialized
    if (typeof giraSeta.state == 'undefined') {
        // It has not... perform the initialization
        giraSeta.state = false;
    }
    giraSeta.state = !giraSeta.state;
    
    if (giraSeta.state == true) {
        this.children[0].style.transform = `rotate(${-270}deg)`;
    }
    else {
        this.children[0].style.transform = `rotate(${-360}deg)`;
    }
    
}

$(document).ready(() => {
    seta = document.querySelectorAll('.label-lvl1-mobile');
    seta.forEach((element) => {
        element.addEventListener('click', giraSeta);
    });

    menu = document.querySelector('.risco3');
    menu_mobile = document.querySelector('.menu-mobile');
    menutagA = document.querySelector('.menu-ul-mobile');
    menu.addEventListener('click', imgMenu);
    /*
        Menu Sobre Config
    */
   
    buttonNavAndroid = document.querySelector('#img-sobre-real-android');
    eitaNav = document.querySelector('.eita1');
    buttonNavAndroid.addEventListener('click', menuSobre);

    
    
});