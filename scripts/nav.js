let buttonNav;
let state1 = true;
let navReal;
let NavToda;
let NavTagA;

const percorre = (NodeL, para) => {
    NodeL.forEach((elem) => {
        elem.style.visibility = `${para}`;
    })
}

const navDisplay = () => {
    state1 = !state1;
    if(state1){
        buttonNav.style.transform = `rotate(${-90}deg)`;
        navReal.style.opacity = 1;
        navReal.style.width = "max-content";
        percorre(NavTagA, 'visible');
    }
    else {
        buttonNav.style.transform = `rotate(${-180}deg)`;
        navReal.style.opacity = 0;
        navReal.style.width = "3.5rem";
        percorre(NavTagA, 'hidden');
    }
}

$(document).ready(() => {
    buttonNav.addEventListener('click', navDisplay);
});