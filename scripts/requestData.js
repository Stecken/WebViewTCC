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

    let listSensors = "";

    $('.quant-sensores-div > div').find("input").each(function () {
        if($(this).prop('checked') == true) {
            listSensors = listSensors + $(this).next("label").text().trim();
            listSensors = (listSensors + ",").trim();
        }
    });
    listSensors = listSensors.slice(0, -1); // retira a última virgula
    urlencoded.append("sensor", `${listSensors}`);
    urlencoded.append("quant", `${quant}`);

    let requestOptions = {
        method: 'POST',
        headers: headersLast,
        body: urlencoded,
        redirect: 'follow'
    };

    console.log(requestOptions);
    fetch("https://concentradorsolar.000webhostapp.com/api", requestOptions)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        const sensoresResponseArray = Object.entries(result.content[0].sensores); // literal object to array, it is to use forEach
        sensoresResponseArray.forEach(sensor => {
            options.series.push({
                name: sensor[0],
                pointInterval: 60,
                data: []
            }) 
        }) // adiciono os sensores que chegaram a lista
        console.log(options);
        let count1 = 0;
        result.content.forEach((element) => {
            count1 = 0;
            Object.entries(element.sensores).forEach(sensor => {
                console.log(typeof sensor, sensor);
                options.series[count1].data.push([Number(element.tempo) * 1000, Number(sensor[1]) + getRandomIntInclusive(1, 499)])
                count1 = count1 + 1;
            })
        });

        console.log("options", options);
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
            console.log(result)

            console.log(options);
            let count1 = 0;
            result.content.forEach((element) => {
                count1 = 0;
                minutesToAdd = minutesToAdd + 1;
                Object.entries(element.sensores).forEach(sensor => {
                    chart.series[count1].addPoint([(Number(element.tempo) * 1000) + minutesToAdd * 60000, 
                        Number(sensor[1]) + getRandomIntInclusive(1, 499)], true, true)
                    count1 = count1 + 1;
                })
            });
        })
        .catch(error => console.log('error', error));
}

const puxaDataCustom = async () => {
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

function getTimeString(date) {
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
  
    return day + '/' + month + '/' + year;
}

function timeConverter(UNIX_timestamp, footer) {
    var a = new Date(UNIX_timestamp);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    if (footer == "yes")
        var time = month + '/' + date + '/' + year;
    else
        var time = hour + ":" + min;
    return time;
}