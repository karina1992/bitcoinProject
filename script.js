

////////////////////////////////////////////////
////////////**OnLoad Function *////////////////
/////////////Shows All TheCoins////////////////

window.addEventListener("load", (event) => {
    getCoinsFromAPI(Baseurl);
});

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
///////////////**Variables Declaration For All The Project *////////////////////////
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

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

var reportCoins = {};

let toggleCounter = 0;

let sixthCoin = "";

letsixthCoinID = "";

let xAxisData = [];

let canvasData = [];

let coinsXPoints = {};

let graphInterval;
//////////////////////////////////////////////////
//////////////////**Url's *//////////////////////
////////////////////////////////////////////////

//List Of All Coins - First API
Baseurl = "https://api.coingecko.com/api/v3/coins/list";

//More Info About Coins - Second API
infoUrl = "https://api.coingecko.com/api/v3/coins/";

//////////////////////////////////////////////////
/////////////////**Functions *////////////////////
//////////////////////////////////////////////////


//Get All Coins From API Using The Baseurl 
function getCoinsFromAPI(url) {
    $.ajax({
        type: "GET",
        datatype: "json",
        url: url,
        success: function (data) {
            //    result = coins.filter(({ symbol }) => symbol === `${textToSearch}`);
            coins = data;
            // console.log(data);
            showAllCoins(coins);
            createToggleCounter();
            for (let coin in reports) {
                $(`#${coin}`).prop("checked", true);
            }
        },
        error: function (error) {
            console.log("error : ", error);
        },
    });
}

//This function Create the Modal with 5 coins that were selected on homepage and prints them on HTML. 
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
    $(".coinsModal").click(function () {
        if ($(this).is(":checked")) {
            delete reportsToDelete[$(this).attr("name")];
            //toggle off
        } else {
            reportsToDelete[$(this).attr("name")] = $(this).attr("name");
        }
    });
};

//Open The Modal when array Of Reports > 5 (=6)
let openToggleExceptionModal = () => {
    // alert("too much");
    addCoinsToModal();
    $("#reportsModal").modal("show");
};

//Count the number of coins in the array Of Reports.
let createToggleCounter = () => {
    $(".custom-control-input").click(function () {
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

// The additional information about the selected coin from the second API.
function showMoreInfo(id, i) {
    var infUrl = infoUrl + id;
    console.log(infUrl);
    getInfoAboutCoin(infUrl, id, i);
}

//Brings more information and saves it in localStorage for 2 Minutes.

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
            success: function (data) {
                moreInfo[id] = data;
                createMoreinfoHtml(moreInfo[id], i);
                // set coin to localStorage
                localStorage.setItem(`${id}`, JSON.stringify(moreInfo[id]));
                //After 2 minutes remove the coin from the localStorage
                setTimeout(function () {
                    localStorage.removeItem(`${id}`);
                }, 2 * 60 * 1000);
                console.log("getItem:", JSON.parse(localStorage.getItem(`${id}`)));
            },
            error: function (error) {
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

//Search Coin By Symbol -(ATC, BTC...) Shows Only Full  Symbol name search 
function searchCoins() {
    var textToSearch = document.querySelector("#search-country-by-name").value;
    result = coins.filter(({ symbol }) => symbol === `${textToSearch}`);
    showAllCoinsSearch(result);
    console.log(result)
}

//Show Home Page
$("#home-tab").on("click", function (e) {
    clearGraph();
    getCoinsFromAPI(Baseurl);
    e.preventDefault();
    $(this).tab("show");
});

//Show all Coins - HTML
function showAllCoins(arr2) {
    coinsHtml = "";
    coinsHtml += `<div class='row'>`;
    //Shows Only 100 Coins 
    for (i = 1003; i < arr2.length; i++) {
        if (i < 1103) {
            createSingleCoin(arr2);
        } else {
            break;
        }
    }
    coinsHtml += `</div>`;

    $("#main-div").html(coinsHtml);
}

function showAllCoinsSearch(arr2) {
    coinsHtml = "";
    coinsHtml += `<div class='row'>`;
    for (i = 0; i < arr2.length; i++) {
        if (i < arr2.length) {
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
    console.log(arr)
    coinsHtml += `<div class='column-2 px-2 mb-r singleCard'>`;
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

$("#saveCoinsFromModal").on("click", function (e) {
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


///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
/////////////////////**Report Page *////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

//Show Charts Page
$("#reports-tab").on("click", function (e) {
    console.log(reportCoins);
    coinsHtml = "";
    e.preventDefault();
    $(this).tab("show");
    coinsHtml += `<div id="chartContainer" style="height: 370px; width: 100%;"></div>`;
    $("#main-div").html(coinsHtml);
    drawGraph(reportCoins);
    if (Object.keys(reports).length > 0) {
        graphInterval = setInterval(() => {
            getMultiPricesFromAPI();
        }, 2000)
    }
});



//Get The Prices For multiple currencies - Third API
function getMultiPricesFromAPI() {
    //get symbol from all reports.
    coinsSymbolArray = Object.keys(reports);

    console.log(coinsSymbolArray)
    $.ajax({
        type: "GET",
        datatype: "json",
        url: `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${coinsSymbolArray}&tsyms=USD`,
        success: function (data) {
            reportCoins = data;
            console.log(reportCoins);
            // drawGraph(reportCoins)
            var chart = $("#chartContainer").CanvasJSChart();
            // var length = chart.options.data[0].dataPoints.length;
            for (let coin in data) {
                // console.log("coin usd",data[coin]["USD"]);
                console.log("api coin key", coin);
                console.log("coinsXPoints:", coinsXPoints);
                chart.options.data[coinsXPoints[coin]["index"]].dataPoints.push({ x: new Date(), y: data[coin]["USD"] });
                chart.render();
            }

        },
        error: function (error) {
            console.log("error : ", error);
        },
    });
}

//Draws a graph using the Array of reports from the Home page.
function drawGraph(reportCoins) {
    //console.log(reportCoins);
    clearGraph();
    arrCoinToUSD = Object.keys(reportCoins);
    arrTitle = Object.keys(reports);
    let coinCounter = 0;
    for (let coin in reports) {
        coinsXPoints[coin.toUpperCase()] = {};
        coinsXPoints[coin.toUpperCase()]["index"] = coinCounter;
        canvasData.push(
            {
                type: "spline",
                name: coin.toUpperCase(),
                showInLegend: true,
                // xValueFormatString: "mm-ss",
                xValueType: "dateTime",
                yValueFormatString: "#,##0 Units",
                dataPoints: [],
            }
        );
        coinCounter++;
    }

    var options = {
        exportEnabled: true,
        animationEnabled: true,
        title: {
            text: `${arrTitle} To USD`,
        },
        axisX: {
            title: "Coins",
            valueFormatString: "mm:ss",
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
        data: canvasData
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

//This function clear the Graph
let clearGraph = () => {
    if (graphInterval) {
        clearInterval(graphInterval);
    }
    coinsXPoints = {};
    canvasData = [];
}


///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
/////////////////////**About Page *////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

//Show About Page
$("#about-tab").on("click", function (e) {
    clearGraph();
    coinsHtml = "";
    e.preventDefault();
    $(this).tab("show");

    coinsHtml += `<div class="mb-3" style="max-width: 1500px;">
    <div class="row no-gutters justify-content-md-center">
    <div class="col-md-2"></div>
      <div class="col-md-4">
        <img src="karina.png" class="card-img" alt="...">
      </div>
      <div class="col-md-4 aboutpage">
        <div class="card-body ">
          <h5 class="card-title">About Me</h5>
          <p class="card-text">Junior FullStack Developer From Haifa,Israel.</p>
          <h5 class="card-title">About Project</h5>
          <p class="card-text">This Project as part of a FullStack course, The final of The part About JS,JQuery,AJAX.</p>
          <p class="card-text">Displays information About currencies and their Value from external sources.</p>
          <p class="card-text">The project also presents real-time reports on currency prices in dollars.</p>
        </div>
        
      </div>
    </div>
  </div>`
    coinsHtml += "</div>"
    $("#main-div").html(coinsHtml);
});

