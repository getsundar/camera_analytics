var stompClient = null;
var ctx = null;
var chart = null;
var selectedGate = "";
var areasArray = ["BoardingGate", "Gate 1", "Gate 2"];
var zoneDataArray = [];
//* to be commented
var zoneDataArray = [{
        name: "Boarding Gate",
        numberOfAdult: 10,
        numberOfChild: 10,
        waitingTime: 30
    },
    {
        name: "Gate 1",
        numberOfAdult: 7,
        numberOfChild: 3,
        waitingTime: 10
    },
    {
        name: "Gate 2",
        numberOfAdult: 20,
        numberOfChild: 1,
        waitingTime: 90
    }
];
//*to be commented

function connect() {

    var socket = new SockJS('/camera-analytics-websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/objects', function (trackableObject) {
            //console.log('received trackableObject')
            //Call up update
            updateData(trackableObject);

        });
        //        stompClient.subscribe('/topic/removeObjects', function (trackableObject) {
        //            //console.log('received removeObjects trackableObject')
        //            //Call up update
        //            removeData(trackableObject);
        //
        //        });
        stompClient.subscribe('/topic/zone', function (zone) {
            //console.log('received removeObjects trackableObject')
            //Call up update
            updateZoneData(zone);

        });
    });
    stompClient.debug = null
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function addAreas() {
    //*to be commented
    addZoneData({
        name: "Gate 3",
        numberOfAdult: 10,
        numberOfChild: 10,
        waitingTime: 30
    });
    //*to be commented
    $('#areaDropDown').empty();
    var list = document.getElementById("areaDropDown");
    for (var i = 0; i < zoneDataArray.length; i++) {
        var btn = document.createElement("button");
        btn.type = "button";
        var text = document.createTextNode(zoneDataArray[i].name);
        btn.appendChild(text);
        btn.addEventListener("click", onSelectingAreas);
        btn.className = "btn btn-primary";
        btn.style.width = "100%";
        btn.style.backgroundColor = "#00a1de";
        btn.style.borderColor = "white";
        list.appendChild(btn);
    }
}

function onSelectingAreas(event) {
    selectedGate = event.currentTarget.textContent;
    let zoneToUpdate = zoneDataArray.find(function (zoneData) {
        return (zoneData.name === selectedGate)
    });
    updateDetails(zoneToUpdate);
}

function addZoneData(zoneObject) {
    let currentIndex = zoneDataArray.findIndex(function (zoneData) {
        return (zoneObject.name === zoneData.name);
    });
    if (currentIndex === -1) {
        zoneDataArray.push(zoneObject);
    } else {
        zoneDataArray[currentIndex] = zoneObject;
    }
}

function updateDetails(zoneObject) {
    if (zoneObject.name === selectedGate) {
        $("#waitingLineName").html(zoneObject.name);
        $("#peopleCount").html(zoneObject.numberOfAdult + zoneObject.numberOfChild);
        $("#waitingTime").html(zoneObject.waitingTime);
    } else if (zoneObject.name === 'BoardingArea') {
        $("#boardingArea").html(zoneObject.name);
        $("#adultCount").html(zoneObject.numberOfAdult);
        $("#child").html(zoneObject.numberOfChild);
        $("#Unknown").html(zoneObject.numberOfUnknownObjects);
    }
}

function updateZoneData(zone) {
    var zoneObject = JSON.parse(zone.body);
    addZoneData(zoneObject);
    addAreas();
    updateDetails(zoneObject);
}
$(function () {
    //connect();
    addAreas();
    ctx = document.getElementById("myChart").getContext('2d');
    chart = new Chart(ctx, {
        type: 'bubble',
        data: data,
        options: options
    });
});


//Chart code

var DATA_COUNT = 8;
var MIN_XY = -500;
var MAX_XY = 500;

function colorize(opaque, context) {
    var value = context.dataset.data[context.dataIndex];
    var x = value.x / 100;
    var y = value.y / 100;
    var r = x < 0 && y < 0 ? 250 : x < 0 ? 150 : y < 0 ? 50 : 0;
    var g = x < 0 && y < 0 ? 0 : x < 0 ? 50 : y < 0 ? 150 : 250;
    var b = x < 0 && y < 0 ? 0 : x > 0 && y > 0 ? 250 : 150;
    var a = opaque ? 1 : 0.5 * value.v / 1000;

    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
}

function generateData() {
    var data = [];
    return data;
}



var data = {
    datasets: [{
        data: generateData()
    }]
};

var options = {
    aspectRatio: 1,
    legend: false,
    tooltips: {
        enabled: 'true',
        mode: 'single'
    },
    animation: {
        duration: 0
    },
    scales: {
        xAxes: [{
            display: false
        }],
        yAxes: [{
            display: false
        }]
    },
    annotation: {
        drawTime: 'beforeDatasetsDraw',
        events: ['dblclick'],
        annotations: [{
                type: 'box', //camera one
                xScaleID: 'x-axis-0',
                yScaleID: 'y-axis-0',
                xMin: -10,
                xMax: 10,
                yMin: -5,
                yMax: 5,
                backgroundColor: 'rgba(18, 7, 253, 0.5)',
                borderColor: 'rgb(236, 226, 224)',
                borderWidth: 1,
                onDblclick: function (e) {
                    console.log('Box', e.type, this);
                }
            },
            {
                type: 'box', //camera two
                xScaleID: 'x-axis-0',
                yScaleID: 'y-axis-0',
                xMin: -8,
                xMax: 13,
                yMin: 165,
                yMax: 175,
                backgroundColor: 'rgba(18, 7, 253, 0.5)',
                borderColor: 'rgb(236, 226, 224)',
                borderWidth: 1,
                onDblclick: function (e) {
                    console.log('Box', e.type, this);
                }
            },
            {
                type: 'box', //left door
                xScaleID: 'x-axis-0',
                yScaleID: 'y-axis-0',
                xMin: -70,
                xMax: -250,
                yMin: -90,
                yMax: -100,
                backgroundColor: 'rgba(173, 178, 189, 0.5)',
                borderColor: 'rgb(236, 226, 224)',
                borderWidth: 1,
                onDblclick: function (e) {
                    console.log('Box', e.type, this);
                }
            },
            {
                type: 'box', // right door
                xScaleID: 'x-axis-0',
                yScaleID: 'y-axis-0',
                xMin: 70,
                xMax: 250,
                yMin: -90,
                yMax: -100,
                backgroundColor: 'rgba(173, 178, 189, 0.5)',
                borderColor: 'rgb(236, 226, 224)',
                borderWidth: 1,
                onDblclick: function (e) {
                    console.log('Box', e.type, this);
                }
            },
            {
                type: 'box', // outer bottom
                xScaleID: 'x-axis-0',
                yScaleID: 'y-axis-0',
                xMin: -250,
                xMax: 250,
                yMin: -195,
                yMax: -200,
                backgroundColor: 'rgba(173, 178, 189, 0.5)',
                borderColor: 'rgb(0, 0, 0)',
                borderWidth: 1,
                onDblclick: function (e) {
                    console.log('Box', e.type, this);
                }
            },
            {
                type: 'box', // outer right
                xScaleID: 'x-axis-0',
                yScaleID: 'y-axis-0',
                xMin: 245,
                xMax: 250,
                yMin: 395,
                yMax: -200,
                backgroundColor: 'rgba(173, 178, 189, 0.5)',
                borderColor: 'rgb(0, 0, 0)',
                borderWidth: 1,
                onDblclick: function (e) {
                    console.log('Box', e.type, this);
                }
            },
            {
                type: 'box', // outer left
                xScaleID: 'x-axis-0',
                yScaleID: 'y-axis-0',
                xMin: -245,
                xMax: -250,
                yMin: 395,
                yMax: -200,
                backgroundColor: 'rgba(173, 178, 189, 0.5)',
                borderColor: 'rgb(0, 0, 0)',
                borderWidth: 1,
                onDblclick: function (e) {
                    console.log('Box', e.type, this);
                }
            },

            {
                type: 'box', // outer top
                xScaleID: 'x-axis-0',
                yScaleID: 'y-axis-0',
                xMin: -250,
                xMax: 250,
                yMin: 395,
                yMax: 400,
                backgroundColor: 'rgba(173, 178, 189, 0.5)',
                borderColor: 'rgb(0, 0, 0)',
                borderWidth: 1,
                onDblclick: function (e) {
                    console.log('Box', e.type, this);
                }
            },
            {
                type: 'box', // inner zone right
                xScaleID: 'x-axis-0',
                yScaleID: 'y-axis-0',
                xMin: 175,
                xMax: 175,
                yMin: 345,
                yMax: -144,
                backgroundColor: 'rgba(173, 178, 189, 0.5)',
                borderColor: 'rgb(236, 226, 224)',
                borderWidth: 1,
                onDblclick: function (e) {
                    console.log('Box', e.type, this);
                }
            },
            {
                type: 'box', // inner zone left
                xScaleID: 'x-axis-0',
                yScaleID: 'y-axis-0',
                xMin: -242,
                xMax: -242,
                yMin: 345,
                yMax: -144,
                backgroundColor: 'rgba(173, 178, 189, 0.5)',
                borderColor: 'rgb(236, 226, 224)',
                borderWidth: 1,
                onDblclick: function (e) {
                    console.log('Box', e.type, this);
                }
            },
            {
                type: 'box', // inner zone top
                xScaleID: 'x-axis-0',
                yScaleID: 'y-axis-0',
                xMin: -242,
                xMax: 175,
                yMin: 345,
                yMax: 345,
                backgroundColor: 'rgba(173, 178, 189, 0.5)',
                borderColor: 'rgb(236, 226, 224)',
                borderWidth: 1,
                onDblclick: function (e) {
                    console.log('Box', e.type, this);
                }
            },
            {
                type: 'box', // inner zone bottom
                xScaleID: 'x-axis-0',
                yScaleID: 'y-axis-0',
                xMin: -242,
                xMax: 175,
                yMin: -144,
                yMax: -144,
                backgroundColor: 'rgba(173, 178, 189, 0.5)',
                borderColor: 'rgb(236, 226, 224)',
                borderWidth: 1,
                onDblclick: function (e) {
                    console.log('Box', e.type, this);
                }
            },
            {
                type: 'box', // monitor zone
                xScaleID: 'x-axis-0',
                yScaleID: 'y-axis-0',
                xMin: -100,
                xMax: 100,
                yMin: 25,
                yMax: 150,
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                borderColor: 'rgb(0, 255, 0)',
                borderWidth: 1,
                onDblclick: function (e) {
                    console.log('Box', e.type, this);
                }
            }
        ]
    },
    elements: {
        point: {
            backgroundColor: 'rgba(255, 64, 0, 1)',

            //borderColor: colorize.bind(null, true),

            borderWidth: function (context) {
                return Math.min(Math.max(1, context.datasetIndex + 1), 8);
            },

            hoverBackgroundColor: 'transparent',

            hoverBorderColor: function (context) {
                return 'blue';
            },

            hoverBorderWidth: function (context) {
                var value = context.dataset.data[context.dataIndex];
                return Math.round(8 * value.v / 1000);
            },

            radius: function (context) {
                var value = context.dataset.data[context.dataIndex];
                var size = context.chart.width;
                var base = Math.abs(value.v) / 1000;
                return (size / 24) * base;
            },
            pointStyle: function (context) {
                var value = context.dataset.data[context.dataIndex];
                if (value.objType === 'ADULT') {
                    return 'circle';
                } else if (value.objType === 'CHILD') {
                    return 'rectRot';
                } else {
                    return 'triangle';
                }
            }
        },
        plugins: {
            datalabels: {
                anchor: function (context) {
                    var value = context.dataset.data[context.dataIndex];
                    return value.v < 50 ? 'end' : 'center';
                },
                align: function (context) {
                    var value = context.dataset.data[context.dataIndex];
                    return value.v < 50 ? 'end' : 'center';
                },
                color: function (context) {
                    var value = context.dataset.data[context.dataIndex];
                    return value.v < 50 ? context.dataset.backgroundColor : 'white';
                },
                font: {
                    weight: 'bold'
                },
                formatter: function (value) {
                    return Math.round(value.v);
                },
                offset: 2,
                padding: 0
            }
        }
    }
};

function addDataset() {
    chart.data.datasets.push({
        data: generateData()
    });
    chart.update();
}



function removeData(trackableObject) {
    //var object = JSON.parse(trackableObject.body)
    for (var i = 0; i < chart.data.datasets[0].data.length; i++) {
        if (chart.data.datasets[0].data[i].id == trackableObject.sTxId) {
            chart.data.datasets[0].data.splice(i, 1);
            break;
        }
    }
    chart.update();
}

function updateData(trackableObject) {
    var object = JSON.parse(trackableObject.body)
    if (object.plotType === 'REMOVE') {
        removeData(object);
    } else {
        var trackObject = $.grep(chart.data.datasets[0].data, function (obj) {
            return obj.id === object.sTxId;
        })[0];
        if (trackObject != null && trackObject != undefined) {
            trackObject.x = object.position.x;
            trackObject.y = object.position.y;
            trackObject.label = object.type.charAt(0) + '-' + object.sTxId;
        } else {
            chart.data.datasets[0].data.push({
                x: object.position.x,
                y: object.position.y,
                v: 300,
                id: object.sTxId,
                label: object.type.charAt(0) + '-' + object.sTxId,
                objType: object.type
            });
        }
        chart.update();
    }
}