"use strict";

//VSS.notifyLoadSucceeded();

function Strat1() {
    VSS.require(["TFS/WorkItemTracking/RestClient"], function (TFS_Wit_WebApi) {
        var getLeadTime = function getLeadTime() {
            ShowChart();
            // // Get a WIT client to make REST calls to VSTS
            // client = TFS_Wit_WebApi.getClient();
            // var projectId = VSS.getWebContext().project.id;
            // var queryPath = "settings.queryPath";
            // //Get a tfs query to get it's id
            // return client.getQuery(projectId, queryPath).then(query => {
            //     //Get query result
            //     client.queryById(query.id).then(ResultQuery);
            //     // ,
            //     //     function(error) {
            //     //         $('#error').text("There is an error in query " + queryPath.substr(15) + ": " + error.message);
            //     //     });
            // });
        };
        VSS.notifyLoadSucceeded();
    });
}

function ShowChart() {

    scatterChartData.datasets.forEach(function (dataset) {
        dataset.backgroundColor = randomColor(0.1);
        dataset.pointBorderColor = randomColor(0.7);
        dataset.pointBackgroundColor = randomColor(0.5);
        dataset.pointBorderWidth = 1;
        dataset.fill = false;
        dataset.showLine = false;
    });

    //var canvas = $('#canvas');
    // canvas.getContext("2d");
    Chart.defaults.global.responsive = false;
    var ctx = document.getElementById("canvas").getContext("2d");
    new Chart.Scatter(ctx, {
        data: scatterChartData,
        options: {
            title: {
                display: true,
                text: 'Cycle Time'
            },
            legend: {
                display: false //não mostra a lengenda do dataset
            },
            scales: {
                xAxes: [{
                    position: 'bottom',
                    gridLines: {
                        zeroLineColor: "rgba(0,255,0,1)"
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Date'
                    }
                }],
                yAxes: [{
                    position: 'left',
                    gridLines: {
                        zeroLineColor: "rgba(0,255,0,1)"
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Days'
                    }
                }]
            }
        }
    });
};

//window.onload = ShowChart();
var randomScalingFactor = function randomScalingFactor() {
    return (Math.random() > 0.5 ? 1.0 : -1.0) * Math.round(Math.random() * 100);
};
var randomColor = function randomColor(opacity) {
    return 'rgba(' + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255) + ',' + (opacity || '.3') + ')';
};

var scatterChartData = {
    datasets: [{
        label: "PBIs",

        data: [{
            x: randomScalingFactor(),
            y: randomScalingFactor()
        }, {
            x: randomScalingFactor(),
            y: randomScalingFactor()
        }, {
            x: randomScalingFactor(),
            y: randomScalingFactor()
        }, {
            x: randomScalingFactor(),
            y: randomScalingFactor()
        }, {
            x: randomScalingFactor(),
            y: randomScalingFactor()
        }, {
            x: randomScalingFactor(),
            y: randomScalingFactor()
        }, {
            x: randomScalingFactor(),
            y: randomScalingFactor()
        }]
    }]

};
//# sourceMappingURL=deliveryMetrics.js.map