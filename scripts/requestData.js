let vet = [];
let chart;
let vetFim = []; //data

let minutesToAdd = 0;

let options = {
    chart: {
        type: 'line'
    },

    time: {
        useUTC: false
    },

    xAxis:[{
        type: 'datetime',
        labels:{
            formatter: function() {
                return timeConverter(this.value, "no");
            },
        }
    }],

    yAxis: {
        title: {
            text: "Temperatura (C)"
        },
        pointStart: 0,
        plotlines: [{ value: 0, width: 1, "color": "#808080" }]
    },
    tooltip: {
        valueSuffix: "°C"
    },
    legend: {
        layout: "vertical",
        align: "right",
        verticalAlign: "middle",
        borderWidth: 0
    },

    title: {
        text: 'Gráfico'
    },

    exporting: {
        enabled: false
    },

    series: [] // vazio de início
};

const puxaLastData = async () => {
    let headersLast = new Headers();
    headersLast.append("Content-Type", "application/x-www-form-urlencoded");

    let quant = null;

    switch(typeTime) {
        case "ult5min":
            quant = 5;
            break;
        case "ult30min":
            quant = 30;
            break;
        case "ult1h":
            quant = 60;
            break; 
        case "ult2h":
            quant = 120;
            break;   
        case "ult5h":
            quant = 300;
            break;
        case "ult10h":
            quant = 600;
            break; 
        case "ult24h":
            quant = 1440;
            break;   
    }

    let urlencoded = new URLSearchParams();
    urlencoded.append("typeTime", "lastData");
    urlencoded.append("typeData", `${$('#slct').val()}`);

    let listSensors = getListSensores();

    urlencoded.append("sensor", `${listSensors}`);
    urlencoded.append("quant", `${quant}`);

    let requestOptions = {
        method: 'POST',
        headers: headersLast,
        body: urlencoded,
        redirect: 'follow'
    };

    fetch("https://concentradorsolar.000webhostapp.com/api", requestOptions)
    .then(response => response.json())
    .then(result => {
        const sensoresResponseArray = Object.entries(result.content[0].sensores); // literal object to array, it is to use forEach
        sensoresResponseArray.forEach(sensor => {
            options.series.push({
                name: sensor[0],
                pointInterval: 60,
                data: []
            }) 
        }) // adiciono os sensores que chegaram a lista
        let count1 = 0;
        result.content.forEach((element) => {
            count1 = 0;
            Object.entries(element.sensores).forEach(sensor => {
                sensor[1] = Number(parseFloat(Number(sensor[1])).toFixed(2));
                options.series[count1].data.push([Number(element.tempo) * 1000, sensor[1]])
                count1 = count1 + 1;
            })
        });

        options.chart.type = `${$('.typePlot option:selected').val()}`;
        let events = {
            load: function () {               
                setInterval(function () {
                    puxaLastMinute(`${$('#slct').val()}`, listSensors);
                }, 5000);
            }
        }

        if ($('.dynamicData').prop('checked') == true) {
            options.chart.events = events;
        }
        else {
            options.chart.event = null;
        }

        if (!chart) {
            chart = new Highcharts.Chart('chart', options);
        }
    })
    .catch(error => console.log('error', error));
}

const puxaLastMinute = async (typedata, sensors) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("typeTime", "lastMinute");
    urlencoded.append("typeData", typedata);
    urlencoded.append("sensor", sensors);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
    };

    fetch("https://concentradorsolar.000webhostapp.com/api", requestOptions)
        .then(response => response.json())
        .then(result => {
            let count1 = 0;
            result.content.forEach((element) => {
                count1 = 0;
                minutesToAdd = minutesToAdd + 1;
                Object.entries(element.sensores).forEach(sensor => {
                    sensor[1] = Number(parseFloat(Number(sensor[1])).toFixed(2));
                    chart.series[count1].addPoint([(Number(element.tempo) * 1000) + minutesToAdd * 60000, 
                        sensor[1]], true, true)
                    count1 = count1 + 1;
                })
            });
        })
        .catch(error => console.log('error', error));
}

const puxaDataCustom = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("typeTime", "custom");
    urlencoded.append("typeData", `${$('#slct').val()}`); // pega o tipo de sensor

    let listSensors = getListSensores();
    
    urlencoded.append("sensor", `${listSensors}`);

    const [initTime, endTime] = getMinMaxCustomTime();

    urlencoded.append("initDate", `${initTime}`); // data de início -> pode ter hora e minuto
    urlencoded.append("endDate", `${endTime}`); // por padrão, colocar o final do dia

    urlencoded.append("resolution", `${resolution}`); // resolução de tempo

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
    };

    fetch("https://concentradorsolar.000webhostapp.com/api", requestOptions)
        .then(response => response.json())
        .then(result => {
            const sensoresResponseArray = Object.entries(result.content[0].sensores); // literal object to array, it is to use forEach
            sensoresResponseArray.forEach(sensor => {
                options.series.push({
                    name: sensor[0],
                    pointInterval: 60,
                    data: []
                }) 
            }) // adiciono os sensores que chegaram a lista
            let count1 = 0;
            result.content.forEach((element) => {
                count1 = 0;
                Object.entries(element.sensores).forEach(sensor => {
                    sensor[1] = Number(parseFloat(Number(sensor[1])).toFixed(2));
                    options.series[count1].data.push([Number(element.tempo) * 1000, sensor[1]])
                    count1 = count1 + 1;
                })
            });
            options.chart.type = `${$('.typePlot option:selected').val()}`;
            let events = {
                load: function () {               
                    setInterval(function () {
                        puxaLastMinute(`${$('#slct').val()}`, listSensors);
                    }, 5000);
                }
            }

            if ($('.dynamicData').prop('checked') == true) {
                options.chart.events = events;
            }
            else {
                options.chart.event = null;
            }

            if (!chart) {
                chart = new Highcharts.Chart('chart', options);
            }
        })
        .catch(error => console.log('error', error));
}

function getMinMaxCustomTime() {
    let initdate = $('#initialDate').val(); // dia inicial
    let initTime = $('#initialTime').val(); // horário inicial

    let endDate = $('#endDate').val(); // dia final
    let endTime = $('#endTime').val(); // horário final

    let exportInitDate = initdate + "T" + "01:00:00"; // horário padrão

    if (initTime != "") {
        exportInitDate = initdate + "T" + initTime + ":00"; // horário padrão
    }

    let exportEndDate = endDate + "T" + "23:59:00";

    if (endTime != "") {
        exportEndDate = endDate + "T" + endTime + ":00";
    }

    return [exportInitDate, exportEndDate];
}

function getTimeString(date) {
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
  
    return day + '/' + month + '/' + year;
}

function timeConverter(UNIX_timestamp, footer) { // extern function
    var a = new Date(UNIX_timestamp);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    
    let time = null;
    if (footer == "yes") {
        time = month + '/' + date + '/' + year;
    } 
    else {
        if (!(min < 9)) {
            time = hour + ":" + min;
            return time;
        }
        time = hour + ":0" + min;
    }
    return time;
}

function getListSensores() {
    let listSensors = "";

    $('.quant-sensores-div > div').find("input").each(function () {
        if($(this).prop('checked') == true) {
            listSensors = listSensors + $(this).next("label").text().trim(); // concatena cada sensor selecionado, tira os espaços e quebras de linha, e adiciona virgula
            listSensors = (listSensors + ",").trim();
        }
    });
    listSensors = listSensors.slice(0, -1); // retira a última virgula

    return listSensors;
}

function updateAllSensorsLastMinute() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("typeTime", "lastMinute");
    urlencoded.append("typeData", "all");

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow'
    };

    fetch("https://concentradorsolar.000webhostapp.com/api", requestOptions)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        let tempMedia = 0;
        for (let i = 1; i < 11; i++) {
            console.log(result.content[0].sensores[`T${i}`])
            tempMedia += Number(result.content[0].sensores[`T${i}`]);
        }
        $('#temperatura-valor').text(`${parseInt(tempMedia) / 10} °C`); // coloca a média aritmética das temperaturas
        $('#irradiancia-valor').text(`${parseInt(result.content[0].sensores["IR1"])} W/m²`)
        $('#vazao-valor').text(`${parseInt(result.content[0].sensores["V1"])} mL/min`)
        $('#luminosidade-valor').text(`${parseInt(result.content[0].sensores["L1"])} W/m²`)
        $('#vento-valor').text(`${parseInt(result.content[0].sensores["AN1"])} Km/h`)
    })
    .catch(error => console.log('error', error));
}