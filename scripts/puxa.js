let buttonControlGraphic, stateBt = false;
let typeTime = null;
const typesLast = ["ult5min", "ult30min", "ult1h", "ult2h", "ult5h", "ult10h", "ult24h"]
let btConsulta;



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

const onChangeDataSensor = () => {
    const stateValue = ["temperature", "flow", "velocityWind", "irradiance"];
    let equalElement = false;
    $('#slct').change(function () {
        checkAllInputsData();
        resetCheckButtons();
        stateValue.forEach((element) => {
            if (element == $(this).val()) {
                equalElement = true;
                $('.quant-sensores-div').css('display', 'flex');
                
                if ($(this).val() == "temperature") {
                    $('#temp-sensor').css('display', 'flex');
                    $('#vazao-sensor').css('display', 'none');
                    $('#vento-sensor').css('display', 'none');
                    $('#irradiancia-sensor').css('display', 'none');
                }
                else if ($(this).val() == "flow") {
                    $('#vazao-sensor').css('display', 'flex');
                    $('#temp-sensor').css('display', 'none');
                    $('#vento-sensor').css('display', 'none');
                    $('#irradiancia-sensor').css('display', 'none');
                    document.querySelectorAll('input#vazao')[0].checked = true;
                }
                else if ($(this).val() == "velocityWind") {
                    $('#vento-sensor').css('display', 'flex');
                    $('#temp-sensor').css('display', 'none');
                    $('#vazao-sensor').css('display', 'none');
                    $('#irradiancia-sensor').css('display', 'none');
                    document.querySelectorAll('input#vento')[0].checked = true;
                }
                else if ($(this).val() == "irradiance"){
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

    onChangeTimeCustom();

    $('#slct1').change(function () {
        checkAllInputsData();

        typeTime = $('#slct1').val(); // guardar configuração de tipo de tempo
        console.log(typeTime);
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

const onChangeTimeCustom = () => {
    let inputCustomType;
    $('#customTime').change(() => {
        inputCustomType = $('#customTime').val();
        if (inputCustomType) {
            $('.config-time-custom').css('display', 'flex');
        }
        else {
            $('.config-time-custom').css('display', 'none');
        }
    })
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
        console.log($('#initialDate').val() + 'T' + $('#initialTime').val() + ":00");
        
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
        
        if (typeTime == "custom") {
            puxaDataCustom();
        }
        else {
            puxaLastData();
        }
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
