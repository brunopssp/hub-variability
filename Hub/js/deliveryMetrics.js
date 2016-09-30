'use strict';

VSS.init({
    explicitNotifyLoaded: true,
    usePlatformStyles: true
});

var client = null;
var dados = new Array();
var resultQueryLength = 0;
var randomColor = function randomColor(opacity) {
    return 'rgba(' + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255) + ',' + (opacity || '.3') + ')';
};

VSS.require(["TFS/WorkItemTracking/RestClient", "TFS/Work/RestClient"], function (TFS_Wit_WebApi, TFS_Team_WebApi) {

    // Get a WIT client to make REST calls to VSTS
    client = TFS_Wit_WebApi.getClient();
    var myTeam = TFS_Team_WebApi.getClient();
    var teamContext = {
        project: VSS.getWebContext().project.name,
        projectId: VSS.getWebContext().project.id,
        team: VSS.getWebContext().team.name,
        teamId: VSS.getWebContext().team.id
    };

    myTeam.getTeamFieldValues(teamContext).then(function (areaPath) {
        //criar consulta
        //nocture.dk/2016/01/02/lets-make-a-visual-studio-team-services-extension/
        //blog.joergbattermann.com/2016/05/05/vsts-tfs-rest-api-06-retrieving-and-querying-for-existing-work-items/
        var whereConditions = "[System.WorkItemType] in ('Product Backlog Item', 'Bug') " + "AND [System.State] <> 'New' " + "AND [System.State] <> 'Removed' " + "AND [System.AreaPath] under '" + areaPath.defaultValue + "'";

        var Wiql = {
            query: "SELECT [System.Id],[System.Title] " + "FROM WorkItems " +
            //"WHERE [Microsoft.VSTS.Common.ClosedDate] >= @Today - 90 " +
            "WHERE [Microsoft.VSTS.Common.ClosedDate] >= '01/01/2013' " + "AND [System.State] ever 'Approved' " + "AND " + whereConditions
        };
        client.queryByWiql(Wiql).then(ResultQuery);
    });
    VSS.notifyLoadSucceeded();
});

function ResultQuery(resultQuery) {

    //Clean the variables for each save time
    // intCountDoneWI = new Array();
    // intCountWI = new Array();
    // nWIP = new Array();

    //ForEach workItem in query, get the respective Revision
    if (resultQuery.queryType == 1) {
        //flat query
        resultQueryLength = resultQuery.workItems.length;
        if (resultQueryLength > 0) {
            resultQuery.workItems.forEach(function (workItem) {
                client.getRevisions(workItem.id).then(ProcessRevisions);
            });
        }
    };

    // if (resultQueryLength == 0) {
    //     formatError();
    //     return WidgetHelpers.WidgetStatusHelper.Success();
    // }
}

function ProcessRevisions(revisions) {

    var RevApproved = revisions.find(function (workItemRevision) {
        return workItemRevision.fields["System.State"] == "Approved";
    });

    var RevDone = revisions.find(function (workItemRevision) {
        return workItemRevision.fields["System.State"] == "Done";
    });

    var dateApproved = RevApproved != null && RevApproved.fields != undefined ? new Date(RevApproved.fields["System.ChangedDate"]) : new Date();
    var dateDone = RevDone != null && RevDone.fields != undefined ? new Date(RevDone.fields["System.ChangedDate"]) : new Date();

    var produtionLeadTime = DaysBetween(dateApproved, dateDone);

    //dados.push({ x: dateDone.getDate(), y: produtionLeadTime });
    dados.push({ x: dateDone.toLocaleDateString("pt-BR"), y: Math.round(produtionLeadTime) });
    if (dados.length == resultQueryLength) {
        ShowChart();
    }
}

var timeFormat = 'DD/MM/YYYY';
var config = {
    type: 'line',
    data: {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [{
            label: "PBIs"
        }]
    },
    options: {
        title: {
            display: true,
            text: 'Lead Time'
        },
        legend: {
            display: true //não mostra a lengenda do dataset
        },
        tooltips: {
            //mode: 'single',
            callbacks: {
                beforeTitle: function beforeTitle() {
                    return 'Closed Date:';
                },
                afterLabel: function afterLabel() {
                    return 'Days';
                }
            }
        },
        scales: {
            xAxes: [{
                display: true,
                type: 'time',
                time: {
                    format: timeFormat
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
        }
    }
};

function ShowChart() {

    config.data.datasets[0].data = dados;
    config.data.datasets.forEach(function (dataset) {
        dataset.borderColor = randomColor(0.4);
        dataset.backgroundColor = randomColor(0.1);
        dataset.pointBorderColor = randomColor(0.7);
        dataset.pointBackgroundColor = randomColor(0.5);
        dataset.pointBorderWidth = 1;
        dataset.fill = false;
        dataset.showLine = false;
    });

    Chart.defaults.global.responsive = false;
    var ctx = document.getElementById("canvas").getContext("2d");

    new Chart.Scatter(ctx, config);
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
//# sourceMappingURL=deliveryMetrics.js.map