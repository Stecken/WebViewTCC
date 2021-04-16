let menu;
let state = false;
let menu_mobile;
let menutagA;
/*Menu Sobre Android*/
let buttonNavAndroid;
let eitaNav;
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

$(document).ready(() => {
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

/*
* Js para criar novos elementos e depois função de Js para abrir ao clicar

$(function () {

    $('#off-canvas-nav .megamenu .dropdown-toggle').each(function () {
        $(this).parent().append('<span class="open_dropdown"><i class="fa fa-sort-desc" aria-hidden="true"></i></span>');
    });

    $('#off-canvas-nav .open_dropdown').click(function (e) {
        e.preventDefault();
        var atual = $(this).parent().find('.dropdown-menu').css('display');
        if (atual == "none") {
            $(this).parent().find('.dropdown-menu').slideDown(500);
        } else {
            $(this).parent().find('.dropdown-menu').slideUp(500);
        }
    });

});*/