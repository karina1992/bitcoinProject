/**OnLoad Function */
window.addEventListener("load", (event) => {
    getCoinsFromAPI(Baseurl);
});

/**Variables Declaration */
//the coins
var coins = [];
//filter Result -> Array for Search.
var result = [];
//coin info
var moreInfo = {};
//Reports object - Hold all Coins that toggled.
var reports = {};

var reportsToDelete = {};
//infoStorage Array -> Hold the more info for coin .
var infoStorage = [];

var coinsHtml = "";

let toggleCounter = 0;

let sixthCoin = "";

letsixthCoinID = "";

/**Url's */
Baseurl = "https://api.coingecko.com/api/v3/coins/list";

infoUrl = "https://api.coingecko.com/api/v3/coins/";

/**Functions */

//Get The Coins From API
function getCoinsFromAPI(url) {
    $.ajax({
        type: "GET",
        datatype: "json",
        url: url,
        success: function(data) {
            //    result = coins.filter(({ symbol }) => symbol === `${textToSearch}`);

            coins = data;
            showAllCoins(coins);
            createToggleCounter();
        },
        error: function(error) {
            console.log("error : ", error);
        },
    });
}

let addCoinsToModal = () => {
    let coinsIDArray = Object.keys(reports);
    coinsListHTML = "";
    coinsIDArray.map((coindID) => {
        coinsListHTML += `
        <div>${coindID}
            <div class="custom-control custom-switch">
            <input type="checkbox" class="custom-control-input coinsModal" id="${coindID}2" name="${coindID}" checked>
            <label class="custom-control-label" for="${coindID}2"></label>
            </div>
        </div>`;
    });

    $(".modal-body").html(coinsListHTML);
    //add on toggle click event
    $(".coinsModal").click(function() {
        if ($(this).is(":checked")) {
            delete reportsToDelete[$(this).attr("name")];
            //toggle off
        } else {
            reportsToDelete[$(this).attr("name")] = $(this).attr("name");
        }
    });
};

let openToggleExceptionModal = () => {
    // alert("too much");
    addCoinsToModal();
    $("#reportsModal").modal("show");
};

let createToggleCounter = () => {
    $(".custom-control-input").click(function() {
        if ($(this).is(":checked")) {
            if (toggleCounter == 5) {
                $(this).prop("checked", false);
                sixthCoin = $(this).attr("id");
                sixthCoinID = $(this).attr("name");
                openToggleExceptionModal();
            } else {
                reports[$(this).attr("id")] = $(this).attr("realID");
                toggleCounter++;
            }
            //toggle off
        } else {
            delete reports[$(this).attr("id")];
            toggleCounter--;
        }
    });
};

function showMoreInfo(id, i) {
    var infUrl = infoUrl + id;
    console.log(infUrl);
    getInfoAboutCoin(infUrl, id, i);
}

function getInfoAboutCoin(url, id, i) {
    //Check If the current Coin existing in the localStorage
    if (JSON.parse(localStorage.getItem(`${id}`))) {
        console.log("the coin exist in cache");
        createMoreinfoHtml(JSON.parse(localStorage.getItem(`${id}`)), i);
    } else {
        console.log("the coin doesnt exist in cache");
        //If not existing In A localStorage- > Ajax set to localStorage.
        $.ajax({
            type: "GET",
            datatype: "json",
            url: url,
            success: function(data) {
                moreInfo[id] = data;
                createMoreinfoHtml(moreInfo[id], i);
                // set coin to localStorage
                localStorage.setItem(`${id}`, JSON.stringify(moreInfo[id]));
                //After 2 minutes remove the coin from the localStorage
                setTimeout(function() {
                    localStorage.removeItem(`${id}`);
                }, 10000);
                console.log("getItem:", JSON.parse(localStorage.getItem(`${id}`)));
            },
            error: function(error) {
                console.log("error : ", error);
            },
        });
    }
}

//Function That Shows more info in Html.
function createMoreinfoHtml(x, i) {
    let coinInfo = "";
    coinInfo += `<div class='row'>`;
    coinInfo += `<div class='col-md-6'>`;
    coinInfo += `<img src="${x.image.small}">`;
    coinInfo += `</div>`;
    coinInfo += `<div class='col-md-6'>`;
    coinInfo += `<div>${x.market_data.current_price.usd}$</div>`;
    coinInfo += `<div>${x.market_data.current_price.eur}€</div>`;
    coinInfo += `<div>${x.market_data.current_price.ils}&#8362</div>`;
    coinInfo += `</div>`;
    coinInfo += `</div>`;
    $(`#collapse${i}`).html(coinInfo);
}

//Search Coin By Symbol -(ATC, BTC...])
function searchCoins() {
    var textToSearch = document.querySelector("#search-country-by-name").value;
    result = coins.filter(({ symbol }) => symbol === `${textToSearch}`);
    showAllCoins(result);
}

//Show Home Page
$("#home-tab").on("click", function(e) {
    getCoinsFromAPI(Baseurl);
    e.preventDefault();
    $(this).tab("show");
});

//Show all Coins - HTML
function showAllCoins(arr2) {
    coinsHtml = "";
    coinsHtml += `<div class='row'>`;
    for (i = 0; i < arr2.length; i++) {
        if (i <= 100) {
            createSingleCoin(arr2);
        } else {
            break;
        }
    }
    coinsHtml += `</div>`;

    $("#main-div").html(coinsHtml);
}

//Create Single Coin
function createSingleCoin(arr) {
    //  \'' + result.name + '\'

    coinsHtml += `<div class='col-md-3 singleCard'>`;
    coinsHtml += `<div class="card">`;
    coinsHtml += `<div class="card-body">`;
    coinsHtml += `<div class='row'>`;
    coinsHtml += `<h5 class='col-md-6'>${arr[i].symbol}</h5>`;
    coinsHtml += `<div class="custom-control custom-switch col-md-6">`;
    coinsHtml += `<input type="checkbox" value="false" class="custom-control-input " id="${arr[i].symbol}" realID="${arr[i].id}" >`;
    coinsHtml += `<label class="custom-control-label" for="${arr[i].symbol}"></label>`;
    coinsHtml += `</div>`;
    coinsHtml += `</div>`;
    coinsHtml += `<p class="card-text">${arr[i].name}</p>`;
    coinsHtml += `<button id="infBtn${i}" onclick="showMoreInfo(\'${arr[i].id}'\,${i})" class="btn colbtn btn-outline-success my-2 my-sm-0" type="button" data-toggle="collapse" data-target="#collapse${i}" >More Info</button>`;
    coinsHtml += `<hr>`;
    coinsHtml += `<div class="collapse" id="collapse${i}">`;
    coinsHtml += `<img id='info-progress' src="progress.gif" alt="" />`;
    coinsHtml += `</div>`;
    coinsHtml += `</div>`;
    coinsHtml += `</div>`;
    coinsHtml += `</div>`;
}

$("#saveCoinsFromModal").on("click", function(e) {
    e.preventDefault();
    Object.keys(reportsToDelete).map((coinToUnToggle) => {
        $(`#${coinToUnToggle}`).prop("checked", false);
        delete reports[coinToUnToggle];
        toggleCounter--;
    });

    if (Object.keys(reportsToDelete).length > 0) {
        reports[sixthCoin] = sixthCoinID;
        $(`#${sixthCoin}`).prop("checked", true);
        toggleCounter++;
    }

    $("#reportsModal").modal("toggle");
    sixthCoin = "";

    reportsToDelete = {};
});

/**About Page */

//Show About Page
$("#about-tab").on("click", function(e) {
    coinsHtml = "";
    e.preventDefault();
    $(this).tab("show");
    coinsHtml += "<div> Hello World</div>";
    $("#main-div").html(coinsHtml);
});

//Show Charts Page

$("#reports-tab").on("click", function(e) {
    coinsHtml = "";

    e.preventDefault();
    $(this).tab("show");
    coinsHtml += `<div id="chartContainer" style="height: 370px; width: 100%;"></div>`;

    $("#main-div").html(coinsHtml);
    drawGraph();
});

function drawGraph() {
    var options = {
        exportEnabled: true,
        animationEnabled: true,
        title: {
            text: "Units Sold VS Profit",
        },
        subtitles: [{
            text: "Click Legend to Hide or Unhide Data Series",
        }, ],
        axisX: {
            title: "Coins",
        },
        axisY: {
            title: "Coin Value",
            titleFontColor: "#4F81BC",
            lineColor: "#4F81BC",
            labelFontColor: "#4F81BC",
            tickColor: "#4F81BC",
        },
        axisY2: {
            title: "Profit in USD",
            titleFontColor: "#C0504E",
            lineColor: "#C0504E",
            labelFontColor: "#C0504E",
            tickColor: "#C0504E",
        },
        toolTip: {
            shared: true,
        },
        legend: {
            cursor: "pointer",
            itemclick: toggleDataSeries,
        },
        data: [{
                type: "spline",
                name: "Units Sold",
                showInLegend: true,
                xValueFormatString: "MMM YYYY",
                yValueFormatString: "#,##0 Units",
                dataPoints: [
                    { x: new Date(2016, 0, 1), y: 120 },
                    { x: new Date(2016, 1, 1), y: 135 },
                    { x: new Date(2016, 2, 1), y: 144 },
                    { x: new Date(2016, 3, 1), y: 103 },
                    { x: new Date(2016, 4, 1), y: 93 },
                    { x: new Date(2016, 5, 1), y: 129 },
                    { x: new Date(2016, 6, 1), y: 143 },
                    { x: new Date(2016, 7, 1), y: 156 },
                    { x: new Date(2016, 8, 1), y: 122 },
                    { x: new Date(2016, 9, 1), y: 106 },
                    { x: new Date(2016, 10, 1), y: 137 },
                    { x: new Date(2016, 11, 1), y: 142 },
                ],
            },
            {
                type: "spline",
                name: "Profit",
                axisYType: "secondary",
                showInLegend: true,
                xValueFormatString: "MMM YYYY",
                yValueFormatString: "$#,##0.#",
                dataPoints: [
                    { x: new Date(2016, 0, 1), y: 19034.5 },
                    { x: new Date(2016, 1, 1), y: 20015 },
                    { x: new Date(2016, 2, 1), y: 27342 },
                    { x: new Date(2016, 3, 1), y: 20088 },
                    { x: new Date(2016, 4, 1), y: 20234 },
                    { x: new Date(2016, 5, 1), y: 29034 },
                    { x: new Date(2016, 6, 1), y: 30487 },
                    { x: new Date(2016, 7, 1), y: 32523 },
                    { x: new Date(2016, 8, 1), y: 20234 },
                    { x: new Date(2016, 9, 1), y: 27234 },
                    { x: new Date(2016, 10, 1), y: 33548 },
                    { x: new Date(2016, 11, 1), y: 32534 },
                ],
            },
        ],
    };
    $("#chartContainer").CanvasJSChart(options);

    function toggleDataSeries(e) {
        if (typeof e.dataSeries.visible === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        } else {
            e.dataSeries.visible = true;
        }
        e.chart.render();
    }
}