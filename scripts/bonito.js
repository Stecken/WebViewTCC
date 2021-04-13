let headerText;
let divImageCentral;
let titulo
function scrollBanner() {
    var scrollPos;
    scrollPos = window.scrollY;
    if (scrollPos <= 600) {
        titulo.style.opacity = 0 + (scrollPos / 100);
    }
}

$(document).ready(() => {
    titulo = document.querySelector('.menu');
    titulo.style.opacity = 0;
    // Apaga nodes e espaços em
    $('#link').contents().filter(function () {
        return this.nodeType == 3;
    }).remove();
    /*
    divImageCentral = document.querySelector('.div-image-central');
    divImageCentral.style.Top = `${headerText.offsetHeight}px`;
    */
    window.addEventListener('scroll', scrollBanner);
});