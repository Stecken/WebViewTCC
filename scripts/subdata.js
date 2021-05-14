/* Author: Stecken - Yuri Martins*/
/* 2021*/

const puxapage = (path) => {
    let jqxhr = $.getJSON(path, (data) => {
    })
        .done(function () {
        })
        .fail(function () {
            console.log("error");
        })
        .always(function () {
            console.log("complete");
            $(".title-dados").text(jqxhr.responseJSON.title);
            $(".aluno-p").text(jqxhr.responseJSON.info);
        });
}

(() => {
    let windowPath = window.location.pathname;
    if (windowPath == "/dados/temperatura") {
        puxapage("/pages/subpagesData/temperaturas.json");
    }
    else if (windowPath == "/dados/vazao") {
        puxapage("/pages/subpagesData/vazao.json");
    }
    else if (windowPath == "/dados/luminosidade") {
        puxapage("/pages/subpagesData/luminosidade.json");
    }
    else if (windowPath == "/dados/radiacao") {
        puxapage("/pages/subpagesData/radiacao.json");
    }
    else {
        console.log("problemas");
    }
})();
