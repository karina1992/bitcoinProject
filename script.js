/**OnLoad Function */
window.addEventListener('load', (event) => {
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
//infoStorage Array -> Hold the more info for coin . 
var infoStorage = [];

var coinsHtml = "";

let toggleCounter=0;


/**Url's */
Baseurl =
    "https://api.coingecko.com/api/v3/coins/list";

infoUrl = "https://api.coingecko.com/api/v3/coins/";


/**Functions */

//Get The Coins From API
function getCoinsFromAPI(url) {
    $.ajax({
        type: "GET",
        datatype: "json",
        url: url,
        success: function (data) {
            coins = data;
            showAllCoins(coins);
            createToggleCounter();
            
            
        },
        error: function (error) {
            console.log("error : ", error);
        },
    });

}

let openToggleExceptionModal=()=>{
    alert("too much");
}

let createToggleCounter=()=>{
    $(".custom-control-input").click( function(){
        if( $(this).is(':checked') ){
            if(toggleCounter==5){
               openToggleExceptionModal(); 
            }else{
                reports[$(this).attr('id')]=$(this).attr('id');
                toggleCounter++;
            }
            //toggle off
        }else{
            delete reports[$(this).attr('id')];
            toggleCounter--;
        };
     });
}

function showMoreInfo(id, i) {
    var infUrl = infoUrl + id;
    console.log(infUrl);
    getInfoAboutCoin(infUrl, id, i);
}

function getInfoAboutCoin(url, id, i) {
    //Check If the current Coin existing in the localStorage 
    if (JSON.parse(localStorage.getItem(`${id}`))) {
      console.log("the coin exist in cache");
       createMoreinfoHtml(JSON.parse(localStorage.getItem(`${id}`)),i);
        

    } else {
        console.log("the coin doesnt exist in cache");
        //If not existing In A localStorage- > Ajax set to localStorage.
        $.ajax({
            type: "GET",
            datatype: "json",
            url: url,
            success: function (data) {
                moreInfo[id] = data;
                createMoreinfoHtml(moreInfo[id],i)
                // set coin to localStorage
                localStorage.setItem(`${id}`, JSON.stringify(moreInfo[id]));
                //After 2 minutes remove the coin from the localStorage
               setTimeout(function () { localStorage.removeItem(`${id}`); }, 10000);
               console.log("getItem:", JSON.parse(localStorage.getItem(`${id}`)));

            },
            error: function (error) {
                console.log("error : ", error);
            },
        });
    }
}

//Function That Shows more info in Html.
function createMoreinfoHtml(x,i){
                let coinInfo = '';
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
    result = coins.filter(({ symbol }) => symbol===(`${textToSearch}`));
    showAllCoins(result);
}

//Show Home Page
$('#home-tab').on('click', function (e) {
    getCoinsFromAPI(Baseurl);
    e.preventDefault();
    $(this).tab('show');

})


//Show all Coins - HTML
function showAllCoins(arr2) {
    coinsHtml = "";
    coinsHtml += `<div class='row'>`;
    for (i = 0; i < arr2.length; i++) {
        if (i <= 100) {
            createSingleCoin(arr2);
        }
        else {
            break;
        }
    }
    coinsHtml += `</div>`;

    $("#main-div").html(coinsHtml);
}

//Create Single Coin
function createSingleCoin(arr) {      //  \'' + result.name + '\'

    coinsHtml += `<div class='col-md-3 singleCard'>`;
    coinsHtml += `<div class="card">`;
    coinsHtml += `<div class="card-body">`;
    coinsHtml += `<div class='row'>`;
    coinsHtml += `<h5 class='col-md-6'>${arr[i].symbol}</h5>`;
    coinsHtml += `<div class="custom-control custom-switch col-md-6">`
    coinsHtml += `<input type="checkbox" value="false" class="custom-control-input" id="customSwitch${i}" >`;
    coinsHtml += `<label class="custom-control-label" for="customSwitch${i}"></label>`;
    coinsHtml += `</div>`;
    coinsHtml += `</div>`;
    coinsHtml += `<p class="card-text">${arr[i].name}</p>`;
    coinsHtml += `<button id="infBtn${i}" onclick="showMoreInfo(\'${arr[i].id}'\,${i})" class="btn colbtn btn-outline-success my-2 my-sm-0" type="button" data-toggle="collapse" data-target="#collapse${i}" >More Info</button>`;
    coinsHtml += `<hr>`
    coinsHtml += `<div class="collapse" id="collapse${i}">`;
    coinsHtml += `<img id='info-progress' src="progress.gif" alt="" />`
    coinsHtml += `</div>`;
    coinsHtml += `</div>`;
    coinsHtml += `</div>`;
    coinsHtml += `</div>`;

}
   

   


/**About Page */

//Show About Page
$('#about-tab').on('click', function (e) {
    coinsHtml = '';
    e.preventDefault()
    $(this).tab('show')
    coinsHtml += '<div> Hello World</div>';
    $("#main-div").html(coinsHtml);
})


