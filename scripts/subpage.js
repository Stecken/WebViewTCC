/* Author: Stecken - Yuri Martins*/
/* 2021*/

const puxapage = (path) => {
    $(() => {
        window.document.body.style.backgroundColor = '#fff';
        window.document.body.style.opacity = '0.5';
        $("#le-pagina").load(path, (response, status, xhr) => {
            if(status == 'error'){
                console.log("Erro ao carregar o conteudo")
            }
            window.document.body.style.backgroundColor = '';
            window.document.body.style.opacity = '';
        });
    });
}

(() => {
    let windowPath = window.location.pathname;
    if (windowPath == "/sobre/resumo" || windowPath == "/sobre" || windowPath == "/sobre/") {
        puxapage("/pages/subpages/resumo.html");
    }
    else if (windowPath == "/sobre/alison") {
        puxapage("/pages/subpages/alison.html");
    }
    else if (windowPath == "/sobre/breno") {
        puxapage("/pages/subpages/breno.html");
    }
    else if (windowPath == "/sobre/paulo") {
        puxapage("/pages/subpages/paulo.html");
    }
    else if (windowPath == "/sobre/samuel") {
        puxapage("/pages/subpages/samuel.html");
    }
    else if (windowPath == "/sobre/yuri") {
        puxapage("/pages/subpages/yuri.html");
    }
    else if (windowPath == "/sobre/rafael" || windowPath == "/sobre/rafafael" || windowPath == "/sobre/fefel") {
        puxapage("/pages/subpages/rafael.html");
    }
    else {
        console.log("problemas");
    }
})();
