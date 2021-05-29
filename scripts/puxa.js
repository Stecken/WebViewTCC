let buttonControlGraphic, stateBt = false;
let vet = [];
let chart;
let vetFim = []; //data

var urlencoded = new URLSearchParams();
urlencoded.append("option", "tudo");


let onChangeGraph;
/*
const controlGraphic = () => {
    stateBt = !stateBt;
    
    if(stateBt) {
        $("#bt-graphic").text("Desabilitar Gráfico");
        $("canvas#myChart").addClass("active");
        $("canvas#myChart").removeClass("not-active");
        //puxaData();
        drawChart();
        onChangeGraph = setInterval(() => {
            updateGraph();
        }, 5000);
    }
    else {
        clearInterval(onChangeGraph);
        deleteGraph();
        $("#bt-graphic").text("Habilitar Gráfico");

        $("canvas#myChart").addClass("not-active");
        $("canvas#myChart").removeClass("active");
    }
}
*/

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
            text: "Temperature (C)"
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
    // series: [{
    //     name: 'Random data',
    //     data: (function () {
    //         // generate an array of random data
    //         var data = [],
    //             time = (new Date()).getTime(),
    //             i;

    //         for (i = -999; i <= 0; i += 1) {
    //             data.push([
    //                 time + i * 1000,
    //                 Math.round(Math.random() * 100)
    //             ]);
    //         }
    //         console.log(data);
    //         return data;
    //     }())
    // }],
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


const deleteGraph = () => {
    $('#myChart').remove(); // this is my <canvas> element
    $('#chart').append('<canvas id="myChart" width="400" height="400"><canvas>');
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
            chart = new Highcharts.Chart('chart', options);
        })
        .catch(error => console.log('error', error));
        
    

    return fim;
}

// const puxaData = async () => {
//     var myHeaders = new Headers();
//     myHeaders.append("Content-Type", "application/x-www-form-urlencoded");



//     var requestOptions = {
//         method: 'POST',
//         headers: myHeaders,
//         body: urlencoded,
//         redirect: 'follow'
//     };

//     let fim = await fetch("http://concentradorsolar.000webhostapp.com/api", requestOptions)
//         .then(response => response.json())
//         .then((result) => {
//             console.log(result);
//             let resultInvert = result["content"].reverse();
//             resultInvert.forEach((element) => {
//                 vet.push(parseInt(element[0].temperaturas[0]) + getRandomIntInclusive(1, 499));
//             });
//             return vet;
//         })
//         .catch(error => console.log('error', error));
//     var data = [],
//         time = (new Date()).getTime(),
//         i;
//     fim.forEach((element) => {
//         for (i = -100; i <= 0; i += 1) {
//             data.push([
//                 time + i * 1000,
//                 Math.round(element + Math.random() * 100)
//             ]);
//         }
//     });

//     return data;
// }


// We recreate instead of using chart update to make sure the loaded CSV
// and such is completely gone.


/*
let myChart;

let drawChart = () => {
    const DATA_COUNT = 7;
    const NUMBER_CFG = { count: DATA_COUNT, min: -100, max: 100 };

    const labels = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Dataset 1',
                data: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                borderColor: "red",
                backgroundColor: "red",
            },
            {
                label: 'Dataset 1',
                data: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                borderColor: "blue",
                backgroundColor: "blue",
            }
        ]
    };
    // </block:setup>

    // <block:config:0>
    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            elements: {
                line: {
                    borderWidth: 2,
                    capBezierPoints: false
                }
            },
            plugins: {
                legend: {
                    position: 'top'
                },
                title: {
                    display: true,
                    text: 'Chart.js Line Chart'
                }
            },
            scales: {
                y: {
                    suggestedMin: 0,
                    suggestedMax: 500
                }
            }
        },
    };
    var ctx = document.getElementById('myChart').getContext('2d');
    myChart = new Chart(ctx, config);
    // </block:config>
}

function updateGraph() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");



    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
    };

    fetch("http://concentradorsolar.000webhostapp.com/api", requestOptions)
        .then(response => response.json())
        .then((result) => {
            console.log(result);
            let vet = [[], []];
            let resultInvert = result["content"].reverse();
            resultInvert.forEach((element) => {
                vet[0].push(parseInt(element[0].temperaturas[0]) + getRandomIntInclusive(1, 499));
                vet[1].push(parseInt(element[0].temperaturas[1]) + getRandomIntInclusive(1, 499));
            });
            myChart.data.datasets.forEach((dataset, i) => {
                dataset.data = vet[i];
            });
            myChart.update();
        })
        .catch(error => console.log('error', error));
}
*/
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return parseInt(Math.floor(Math.random() * (max - min + 1)) + min);
}