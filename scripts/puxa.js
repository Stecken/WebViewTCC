let buttonControlGraphic, stateBt = false, g1 = [], g2 = [], obj;

var urlencoded = new URLSearchParams();
urlencoded.append("option", "tudo");

var myData = [
    {
        key: "T1",
        values: [],
        color: '#ff7f0e'
    }
];


$(document).ready(() => {
    buttonControlGraphic = document.querySelector('#control-graphic');
    buttonControlGraphic.addEventListener('click', controlGraphic);
});


let onChangeGraph;

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


const deleteGraph = () => {
    $('#myChart').remove(); // this is my <canvas> element
    $('#chart').append('<canvas id="myChart" width="400" height="400"><canvas>');
}

const puxaData = () => {
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
            let cont = 1;
            let resultInvert = result["content"].reverse();
            resultInvert.forEach((element) => {
                console.log(element[0].temperaturas[0]);
                myData[0].values.push({ "x": cont, "y": parseFloat(element[0].temperaturas[0]) });
                //myData[1].values.push({ x: cont, y: parseFloat((element[cont].temperaturas[cont]) - 1) });
                //.push({ "x": cont, "y": parseFloat(element[0].temperaturas[0]) });
                //g2.push({ "x": cont, "y": parseInt((element[cont].temperaturas[cont]) - 1) });
                if (element[0].id == 7) {
                    console.log("brincadeira" + cont);
                }
                cont = cont + 1;
            });
        })
        .catch(error => console.log('error', error));
}


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

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return parseInt(Math.floor(Math.random() * (max - min + 1)) + min);
}

/*
let drawChart = function () {
    nv.addGraph(function () {
        var chart = nv.models.lineChart()
            .margin({ left: 100 })  //Adjust chart margins to give the x-axis some breathing room.
            .useInteractiveGuideline(true)  //We want nice looking tooltips and a guideline!
            .showLegend(true)       //Show the legend, allowing users to turn on/off line series.
            .showYAxis(true)        //Show the y-axis
            .showXAxis(true)        //Show the x-axis
            ;

        chart.xAxis     //Chart x-axis settings
            .axisLabel('Time (ms)')
            .tickFormat(d3.format(',r'));

        chart.yAxis     //Chart y-axis settings
            .axisLabel('Temperatura (C°)')
            .tickFormat(d3.format('.02f'));

        //var myData = sinAndCos();   //You need data...
        console.log(myData)
        obj = d3.select('#chart svg')    //Select the <svg> element you want to render the chart in.
            .datum(myData)         //Populate the <svg> element with chart data...
            .call(chart);          //Finally, render the chart!

        //Update the chart when window resizes.
        nv.utils.windowResize(function () { chart.update() });
        return chart;
    });

};
*/