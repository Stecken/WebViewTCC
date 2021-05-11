/* Author: Stecken - Yuri Martins*/
/* 2021*/

const puxapage = (path) => {
    $(() => {
        window.document.body.style.backgroundColor = '#fff';
        window.document.body.style.opacity = '0.5';
        $("#le-pagina").load(path, (response, status, xhr) => {
            if (status == 'error') {
                console.log("Erro ao carregar o conteudo")
            }
            window.document.body.style.backgroundColor = '';
            window.document.body.style.opacity = '';
        });
    });
}

(() => {
    let windowPath = window.location.pathname;
    if (windowPath == "/dados/temperaturas") {
        puxapage("/pages/subpagesData/temperaturas.html");
    }
    else if (windowPath == "/dados/vazao") {
        puxapage("/pages/subpages/breno.html");
    }
    else if (windowPath == "/dados/luminosidade") {
        puxapage("/pages/subpages/paulo.html");
    }
    else if (windowPath == "/dados/radiacao") {
        puxapage("/pages/subpages/paulo.html");
    }
    else {
        console.log("problemas");
    }
})();
