// This Sample Code is provided for the purpose of illustration only and is not intended to be used in a production environment.
// THIS SAMPLE CODE AND ANY RELATED INFORMATION ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A PARTICULAR PURPOSE.
// We grant You a nonexclusive, royalty-free right to use and modify the Sample Code and to reproduce and distribute the object code form of the Sample Code, provided that You agree: 
// (i) to not use Our name, logo, or trademarks to market Your software product in which the Sample Code is embedded; 
// (ii) to include a valid copyright notice on Your software product in which the Sample Code is embedded; and 
// (iii) to indemnify, hold harmless, and defend Us and Our suppliers from and against any claims or lawsuits, including attorneys’ fees, that arise or result from the use or distribution of the Sample Code.
// Please note: None of the conditions outlined in the disclaimer above will supercede the terms and conditions contained within the Premier Customer Services Description.

var client = null;
var myTeam = null;
var teamContext;

Date.prototype.getWeekNumber = function() {
    var d = new Date(+this);
    d.setHours(0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    return Math.ceil((((d - new Date(d.getFullYear(), 0, 1)) / 8.64e7) + 1) / 7);
}; //http://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php

function getDateRangeOfWeek(weekNo, actualYear) {
    var d1 = new Date(actualYear, 00, 01);
    numOfdaysPastSinceLastMonday = eval(d1.getDay() - 1);
    d1.setDate(d1.getDate() - numOfdaysPastSinceLastMonday);
    var weekNoToday = d1.getWeekNumber();
    var weeksInTheFuture = eval(weekNo - weekNoToday);
    d1.setDate(d1.getDate() + eval(7 * weeksInTheFuture));
    return eval(d1.getMonth() + 1) + "/" + d1.getDate() + "/" + d1.getFullYear();
}; //https://gist.github.com/Abhinav1217/5038863

var randomColor = function(opacity) {
    return 'rgba(' + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255) + ',' + (opacity || '.3') + ')';
};

function DaysBetween(date1, date2) {
    //Get 1 day in milliseconds
    var one_day = 1000 * 60 * 60 * 24;

    // Convert both dates to milliseconds
    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime(); //

    // Calculate the difference in milliseconds
    var difference_ms = date2_ms - date1_ms;

    // Convert back to days and return
    return Math.round(difference_ms / one_day);
}

function computeAvg(values) {
    var total = 0;
    for (var i = 0; i < values.length; i++)
        total += values[i].y;
    return total / values.length
} //http://elemarjr.com/pt/2011/11/11/functional-programming-map-e-reduce-com-javascript/

function computeStdDeviation(values, avg) {
    var total = 0;
    for (var i = 0; i < values.length; i++) {
        var d = values[i].y - avg;
        total += (d * d);
    }
    return Math.sqrt(total / (values.length));
}

function LoadNotations(dadosDesP) {
    var maxData = 0;
    var Avg = computeAvg(dadosDesP);
    var DesvP = computeStdDeviation(dadosDesP, Avg); //http://www.investpedia.com.br/artigo/O+que+e+desvio+padrao.aspx

    for (var i = dadosDesP.length; i--;) {
        if (dadosDesP[i].y > maxData) {
            maxData = dadosDesP[i].y;
        };
    };

    var notations = new Array();
    notations.push({
        type: 'line',
        mode: 'horizontal',
        scaleID: 'y-axis-1',
        value: Avg,
        borderColor: 'red',
        borderWidth: 2,
        borderDash: [2, 2]
    });
    if (DesvP > 0) {
        if (maxData == 0 || Avg + DesvP < maxData) {
            notations.push({
                type: 'line',
                mode: 'horizontal',
                scaleID: 'y-axis-1',
                value: Avg + DesvP,
                borderColor: 'blue',
                borderWidth: 2
            });
            if (Avg - DesvP > 0) {
                notations.push({
                    type: 'line',
                    mode: 'horizontal',
                    scaleID: 'y-axis-1',
                    value: Avg - DesvP,
                    borderColor: 'blue',
                    borderWidth: 2
                });
            };
        };
        if (maxData == 0 || Avg + (DesvP * 2) < maxData) {
            notations.push({
                type: 'line',
                mode: 'horizontal',
                scaleID: 'y-axis-1',
                value: Avg + (DesvP * 2),
                borderColor: 'green',
                borderWidth: 2
            });
            if (Avg - (DesvP * 2) > 0) {
                notations.push({
                    type: 'line',
                    mode: 'horizontal',
                    scaleID: 'y-axis-1',
                    value: Avg - (DesvP * 2),
                    borderColor: 'green',
                    borderWidth: 2
                });
            };
        };
    };
    return notations;
}

var config = {
    type: 'line',
    data: {
        datasets: [{
            label: "Duration",
        }]
    },
    options: {
        title: {
            display: true //,
                //text: 'Throughput'
        },
        legend: {
            display: false
        },
        tooltips: {
            mode: 'single',
            callbacks: {
                beforeTitle: function() {
                    return 'Closed Date';
                },
            }
        },
        scales: {
            xAxes: [{
                display: true,
                type: 'time',
                time: {
                    format: 'DD/MM/YYYY',
                    unit: 'week'
                },
                scaleLabel: {
                    display: false,
                    labelString: 'Date'
                }
            }],
            yAxes: [{
                display: true,
                position: 'left',
                gridLines: {
                    zeroLineColor: "rgba(0,255,0,1)"
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Days'
                }
            }]
        },
        annotation: {
            annotations: []
        }
    }
};

function GetWiql(areaPath) {
    //nocture.dk/2016/01/02/lets-make-a-visual-studio-team-services-extension/
    //blog.joergbattermann.com/2016/05/05/vsts-tfs-rest-api-06-retrieving-and-querying-for-existing-work-items/
    var whereConditions = "[System.WorkItemType] in ('Product Backlog Item', 'Bug') " +
        "AND [System.State] <> 'New' " +
        "AND [System.State] <> 'Removed' AND "

    var teamAreaPaths = "([System.AreaPath] under '" + areaPath.values[0].value + "' ";
    for (i = 1; i < areaPath.values.length; i++) {
        teamAreaPaths += " OR [System.AreaPath] under '" + areaPath.values[i].value + "' ";
    }
    whereConditions += teamAreaPaths + ") ";
    return "SELECT [System.Id],[System.Title] " +
        "FROM WorkItems " +
        "WHERE [Microsoft.VSTS.Common.ClosedDate] >= @Today - 120 " +
        //"WHERE [Microsoft.VSTS.Common.ClosedDate] >= '01/01/2013' " +
        "AND " + whereConditions
};

function LoadWI(strWiqlPlus) {
    VSS.require(["TFS/WorkItemTracking/RestClient", "TFS/Work/RestClient"], function(TFS_Wit_WebApi, TFS_Team_WebApi) {

        // Get a WIT client to make REST calls to VSTS
        client = TFS_Wit_WebApi.getClient();
        myTeam = TFS_Team_WebApi.getClient();
        teamContext = {
            project: VSS.getWebContext().project.name,
            projectId: VSS.getWebContext().project.id,
            team: VSS.getWebContext().team.name,
            teamId: VSS.getWebContext().team.id
        };

        myTeam.getTeamFieldValues(teamContext).then(function(areaPath) {
            //criar consulta
            var strWiql = {
                query: GetWiql(areaPath) + strWiqlPlus
            };
            client.queryByWiql(strWiql).then(ResultQuery);
        });
    });
};

function ShowChart() {

    VSS.notifyLoadSucceeded();

    $.each(config.data.datasets, function(i, dataset) {
        dataset.borderWidth = 0;
        dataset.backgroundColor = randomColor(0.9);
        dataset.pointBackgroundColor = dataset.backgroundColor;
        dataset.pointRadius = 5;
        dataset.fill = false;
        dataset.showLine = false;
    });

    config.options.annotation.annotations = LoadNotations(config.data.datasets[config.data.datasets.length - 1].data);

    Chart.defaults.global.responsive = false;
    var ctx = document.getElementById("canvas").getContext("2d");

    new Chart.Scatter(ctx, config);
};