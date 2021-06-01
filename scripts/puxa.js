let buttonControlGraphic, stateBt = false;
let vet = [];
let chart;
let vetFim = []; //data

let btConsulta;




let options = {
    chart: {
        type: 'line',
        events: {
            load: async function () {

                // set up the updating of the chart each second
                var series = this.series[0];
                setInterval(function () {
                    var x = (new Date()).getTime() // current time
                    //let dados = puxaData();
                    var y = Math.round(Math.random() * 100);
                    series.addPoint([x, y], true, true);
                }, 5000);
            }
        }
    },

    time: {
        useUTC: false
    },

    yAxis: {
        title: {
            text: "Temperatura (C)"
        },
        pointStart: 0,
        plotlines: [{ value: 0, width: 1, "color": "#808080" }]
    },
    tooltip: {
        valueSuffix: "C°"
    },
    legend: {
        layout: "vertical",
        align: "right",
        verticalAlign: "middle",
        borderWidth: 0
    },

    title: {
        text: 'Live random data'
    },

    exporting: {
        enabled: false
    },

    series: [{
        name: 'T1',
        data: vetFim
    }],
    plotOptions: {
        bar: {
            colorByPoint: true
        },
        series: {
            zones: [{
                color: '#4CAF50',
                value: 0
            }, {
                color: '#8BC34A',
                value: 10
            }, {
                color: '#CDDC39',
                value: 20
            }, {
                color: '#CDDC39',
                value: 30
            }, {
                color: '#FFEB3B',
                value: 40
            }, {
                color: '#FFEB3B',
                value: 50
            }, {
                color: '#FFC107',
                value: 60
            }, {
                color: '#FF9800',
                value: 70
            }, {
                color: '#FF5722',
                value: 80
            }, {
                color: '#F44336',
                value: 90
            }, {
                color: '#F44336',
                value: Number.MAX_VALUE
            }]
        }
    }
};

var urlencoded = new URLSearchParams();
urlencoded.append("option", "tudo");


let onChangeGraph;



const deleteGraph = () => {
    if (chart) {
        chart.destroy();
        chart = undefined;
    }
    $('#chart').remove(); 
    $("div.panel-body").append('<div id="chart"></div>');
}

$(document).ready(function () {
    let d = new Date();
    $('#time-hour').text(d.getHours());
    if(d.getMinutes() < 10) {
        $('#time-minute').text(`${0}${d.getMinutes()}`);
    }
    else {
        $('#time-minute').text(d.getMinutes());
    }
    
    $('#time-day').text(d.getDate());
    $('#time-month').text(d.getMonth() + 1); // porque o retorno começa de "0"
    $('#time-year').text(d.getFullYear());

    // 

    onChangeDataSensor();

    onChangePeriodo();

    onChangeInputDate();

    onChangeInputTypeGraphic();

    checkAllInputsData();

    //

    btConsulta = document.querySelectorAll('#button-realiza-consulta')[0];
    console.log(btConsulta);
    btConsulta.addEventListener('click', doRequestQueryAPI);

    document.querySelectorAll('#button-reset-inputs')[0].addEventListener('click', resetAllInputs);

    puxaData();
});

const puxaData = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");



    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
    };

    let fim = await fetch("http://concentradorsolar.000webhostapp.com/api", requestOptions)
        .then(response => response.json())
        .then((result) => {
            console.log(result);
            let resultInvert = result["content"].reverse();
            resultInvert.forEach((element) => {
                vet.push(parseInt(element[0].temperaturas[0]) + getRandomIntInclusive(1, 499));
            });
            var time = (new Date()).getTime();
            vet.forEach((element) => {
                vetFim.push([
                    time + Math.random() * 100 ,
                    Math.round(element + Math.random() * 100)
                ]);
            });
            console.log(vetFim)
            if (!chart) {
                chart = new Highcharts.Chart('chart', options);
            }
        })
        .catch(error => console.log('error', error));
        
    

    return fim;
}

const onChangeDataSensor = () => {
    const stateValue = ["temperatura", "vazao", "vento", "irradiancia"];
    let equalElement = false;
    $('#slct').change(function () {
        checkAllInputsData();
        resetCheckButtons();
        stateValue.forEach((element) => {
            if (element == $(this).val()) {
                equalElement = true;
                $('.quant-sensores-div').css('display', 'flex');
                
                if ($(this).val() == "temperatura") {
                    $('#temp-sensor').css('display', 'flex');
                    $('#vazao-sensor').css('display', 'none');
                    $('#vento-sensor').css('display', 'none');
                    $('#irradiancia-sensor').css('display', 'none');
                }
                else if ($(this).val() == "vazao") {
                    $('#vazao-sensor').css('display', 'flex');
                    $('#temp-sensor').css('display', 'none');
                    $('#vento-sensor').css('display', 'none');
                    $('#irradiancia-sensor').css('display', 'none');
                    document.querySelectorAll('input#vazao')[0].checked = true;
                }
                else if ($(this).val() == "vento") {
                    $('#vento-sensor').css('display', 'flex');
                    $('#temp-sensor').css('display', 'none');
                    $('#vazao-sensor').css('display', 'none');
                    $('#irradiancia-sensor').css('display', 'none');
                    document.querySelectorAll('input#vento')[0].checked = true;
                }
                else if ($(this).val() == "irradiancia"){
                    $('#irradiancia-sensor').css('display', 'flex');
                    $('#temp-sensor').css('display', 'none');
                    $('#vazao-sensor').css('display', 'none');
                    $('#vento-sensor').css('display', 'none');
                    document.querySelectorAll('input#irradiancia')[0].checked = true;
                }
                else {
                    $('.quant-sensores-div').css('display', 'none');
                }
            }
        });

        if (equalElement == false) {
            $('.quant-sensores-div').css('display', 'none');
        }
    });
}

function resetCheckButtons() {
    let nodes = document.querySelectorAll('input.inp-cbx');

    for (let i = 0; i < nodes.length; i++) {
        nodes[i].checked = false;
    }
}

const onChangePeriodo = () => {
    const stateValue = ["ult5min", "ult30min", "ult1h", "ult2h", "ult5h", "ult10h", "ult24h", "custom"];
    let equalElement = false;
    $('#slct1').change(function () {
        checkAllInputsData();
        stateValue.forEach((element) => {
            if (element == $(this).val()) {
                equalElement = true;
                if ($(this).val() == "custom") {
                    $('.engloba-input-customizado').css('display', 'flex');
                }
                else {
                    $('.engloba-input-customizado').css('display', 'none');
                    resetInputDate();
                }
            }
        });

        if (equalElement == false) {
            $('.engloba-input-customizado').css('display', 'none');
        }
    });
}

const onInputDateSucced = () => {
    let initialDate = $('#initialDate').val();
    let endDate = $('#endDate').val();
    if (initialDate === "" || endDate === "") {
        return "error";
    }
    let date1 = new Date(initialDate.replace(/-/g, "/"));
    var date2 = new Date(endDate.replace(/-/g, "/"));
    var timeDiff = Math.abs(date2.getTime() - date1.getTime()); // retorna o parâmetro como modulo de x
    let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return diffDays;
}


const onChangeInputDate = () => {
    $('#initialDate, #endDate').change(function () {
        checkAllInputsData();
        if (onInputDateSucced() <= 3) {
            $('div.reso').css('display', 'flex');
            $('div.engloba-info').css('display', 'none');
            if(onInputDateSucced() == 1) {
                $('.select-data-1').css('display', 'flex');
                $('.select-data-2').css('display', 'none');
                $('.select-data-3').css('display', 'none');
            }
            else if (onInputDateSucced() == 2) {
                $('.select-data-2').css('display', 'flex');
                $('.select-data-1').css('display', 'none');
                $('.select-data-3').css('display', 'none');
            }
            else if (onInputDateSucced() == 3) {
                $('.select-data-3').css('display', 'flex');
                $('.select-data-2').css('display', 'none');
                $('.select-data-1').css('display', 'none');
            }
        }
        else if (onInputDateSucced() == "error") {
            $('div.reso').css('display', 'none');    
            $('div.engloba-info').css('display', 'none');
        }
        else {
            $('div.reso').css('display', 'none');
            $('div.engloba-info').css('display', 'flex');
        }
    });
}

const onChangeInputTypeGraphic = () => {
    $('#slct2').change(function () {
        checkAllInputsData();
        if($(this).val() !== null) {
            if ($(this).val() == "linear-graphic") {
                options.chart.type = "line";
            }
            else if ($(this).val() == "barrinha-graphic") {
                options.chart.type = "column";
            }
        }
    })
}

const checkAllInputsData = () => {
    if ($('#slct').val() !== null && $('#slct1').val() !== null && $('#slct2').val() !== null) {
        console.log('aaa');
        
        $('div#button-realiza-consulta').removeClass('disabled');
        return true;
    }
    else {
        $('div#button-realiza-consulta').addClass('disabled');
        return false;
    }
}

const doRequestQueryAPI = () => {
    if(checkAllInputsData()) {
        deleteGraph();
        puxaData();
    }
}

function resetInputDate() {
    $('#initialDate').val("");
    $('#endDate').val("");
    $('div.engloba-info').css('display', 'none');
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return parseInt(Math.floor(Math.random() * (max - min + 1)) + min);
}

const resetAllInputs = () => {
    $('#slct').val(null);
    resetCheckButtons();
    $('#temp-sensor').css('display', 'none');
    $('#vazao-sensor').css('display', 'none');
    $('#vento-sensor').css('display', 'none');
    $('#irradiancia-sensor').css('display', 'none');
    $('#slct1').val(null);
    $('.engloba-input-customizado').css('display', 'none');
    $('.reso').css('display', 'none');
    $('#initialDate').val("");
    $('#endDate').val("");
    $('#slct2').val(null);
    checkAllInputsData();
}
