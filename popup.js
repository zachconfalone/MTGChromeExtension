//set click handler
document.addEventListener('DOMContentLoaded',function(){
    document.getElementById("EnteredCard").addEventListener("keyup",async function(event)
    {
        if(event.keyCode != 13 && event.keyCode != 32)
        {
            setTimeout(() => {
                var requestedCard = document.getElementById("EnteredCard").value;
                var url = 'https://api.scryfall.com/cards/autocomplete?q='+requestedCard;
                var returnedSuggestion = MakeRequest(url);
                parsedSuggestions = JSON.parse(returnedSuggestion);
                var suggestions = '';
                for(var i = 0; i < 11; i++)
                {
                    suggestions += '<option value="'+parsedSuggestions.data[i]+'" />';
                }
                document.getElementById('datalist').innerHTML = suggestions;
            }, 50);
        }
    }
);
    document.getElementById("mybutton").addEventListener("click",handler);
    document.getElementById("moreInfo").addEventListener("click",moreInfoinit);
    document.getElementById("flipButton").addEventListener("click",flipArt);
    document.getElementById("setSelector").addEventListener("change",selectArt);
    document.getElementById("EdhRec").addEventListener("click",gotoEDHRec);
    document.getElementById("buySelectorButton").addEventListener("click",gotoLink);
});

var parsedJson;
var divel = document.getElementById('cardPic');
var cardFace1;
var cardFace2;
var setArray = {};
var EbayLink;
var TcgPlayerLink;
var oracle1;
var oracle2;


var input = document.getElementById("EnteredCard");
input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        document.getElementById("datalist").innerHTML = '';
        document.getElementById("mybutton").click();
    }
});

//handle player input
function handler()
{
    if(document.getElementById("EnteredCard").value == '')
    {
        alert('Please enter a card');
        return;
    }
    document.getElementById('EdhRec').style.visibility = 'visible';
    document.getElementById("setSelector").innerHTML = "";
    document.getElementById('legalities').innerHTML = ' ';
    divel.innerHTML = '';
    var entCard = document.getElementById("EnteredCard").value;
    var returned = MakeRequest('https://api.scryfall.com/cards/named?fuzzy=' + entCard)
    parsedJson = JSON.parse(returned);
    var setSearch = MakeRequest(parsedJson.prints_search_uri);
    parsedSetJson = JSON.parse(setSearch);
    if(parsedJson.status == 404)
    {
        alert('ALERT: Can not parse your request, please enter it again');
        return;
    }
    for(var counter = 0;counter < parsedSetJson.total_cards;counter++)
    {
        setArray[counter] = parsedSetJson.data[counter];
    }
    select = document.getElementById("setSelector");

    for(var setCounter = 0;setCounter<parsedSetJson.total_cards;setCounter++)
    {
        var option = document.createElement('option');
        option.innerHTML = setArray[setCounter].set_name;
        option.value = setArray[setCounter].set_name;
        select.appendChild(option);
    }
    if(parsedJson.status == 404)
    {
        alert('ALERT: Can not parse your request, please enter it again');
    }
    var cardName = parsedJson.name;
    var buySelector = document.getElementById('buySelector');
    buySelector.style.visibility='visible';
    var buySelectorButton = document.getElementById('buySelectorButton');
    buySelectorButton.style.visibility = 'visible';
    var Ebay = document.createElement('option');
    Ebay.value = 'Ebay';
    Ebay.innerHTML = 'Ebay';
    var TcgPlayer = document.createElement('option');
    TcgPlayer.value = 'TcgPlayer';
    TcgPlayer.innerHTML = 'TcgPlayer';
    buySelector.appendChild(TcgPlayer);
    buySelector.appendChild(Ebay);
    EbayLink = parsedJson.purchase_uris.ebay;
    TcgPlayerLink = parsedJson.purchase_uris.tcgplayer;
    for(each in parsedJson.legalities)
    {
        document.getElementById('legalities').innerHTML +='<b>' + each[0].toUpperCase() + each.slice(1) + '</b>' + ": " +setArray[0].legalities[each].replace("_"," ") +  "<br />" ;
    }
    document.getElementById("price").innerHTML ='<b>'+'Current price' +'</b>'+ ' : $' + setArray[0].usd;
    if(setArray[0].layout == 'normal')
    {
        document.getElementById("flipButton").style.visibility="hidden";
        var pictureURL = setArray[0].image_uris.normal;
        document.getElementById("cardPic").src = pictureURL;
        document.getElementById("cardName").innerHTML =  cardName;
        document.getElementById("oracleText").innerHTML = "<b>" + "Oracle Text: " + "</b>"+setArray[0].oracle_text;
        document.getElementById("cardSet").innerHTML ='<b>' +setArray[0].set_name + '</b>' + " : " + setArray[0].rarity[0].toUpperCase()+ setArray[0].rarity.slice(1);
    }
    if(setArray[0].layout == 'transform')
    {
        oracle1 = setArray[0].card_faces[0].oracle_text
        oracle2 = setArray[0].card_faces[1].oracle_text;
        cardFace1 = setArray[0].card_faces[0].image_uris.normal;
        cardFace2 = setArray[0].card_faces[1].image_uris.normal;
        document.getElementById("cardName").innerHTML = cardName;
        document.getElementById("cardPic").src = cardFace1;
        document.getElementById("flipButton").style.visibility = "visible";
        document.getElementById("oracleText").innerHTML ="<b>" + "Oracle Text: " +"</b>"+ oracle1;
        document.getElementById("cardSet").innerHTML ='<b>' +setArray[0].set_name +'</b>'+ " : " + setArray[0].rarity[0].toUpperCase()+ setArray[0].rarity.slice(1);

    }
}


function moreInfoinit()
{
    var moreInfoURL =setArray[0].scryfall_uri;
    var win = window.open(moreInfoURL, '_blank');
    win.focus();
}

function gotoEDHRec()
{
    var moreInfoURL = setArray[0].related_uris.edhrec;
    var win = window.open(moreInfoURL, '_blank');
    win.focus();
}


function MakeRequest(Url)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", Url, false ); // false for synchronous request
    xmlHttp.send();
    return xmlHttp.responseText;
}

function flipArt(){
    switch(document.getElementById("cardPic").src)
    {
        case cardFace1:
            document.getElementById("cardPic").src = cardFace2;
            document.getElementById("oracleText").innerHTML = "<b>" + "Oracle Text: " +"</b>"+ oracle2;
            return;
        case cardFace2:
            document.getElementById("cardPic").src = cardFace1;
            document.getElementById("oracleText").innerHTML = "<b>" + "Oracle Text: " +"</b>" +oracle1;
            return;
    }
}

function selectArt(){
    var selector = document.getElementById("setSelector");
    var selectedSet = selector.selectedIndex;

    document.getElementById("price").innerHTML = '<b>'+ 'Current price : $'+'</b>' + setArray[selectedSet].usd;
    EbayLink = setArray[selectedSet].purchase_uris.ebay;
    TcgPlayerLink = setArray[selectedSet].purchase_uris.tcgplayer;
    if(setArray[selectedSet].layout == 'transform')
    {
        cardFace1 = setArray[selectedSet].card_faces[0].image_uris.normal;
        cardFace2 = setArray[selectedSet].card_faces[1].image_uris.normal;
        document.getElementById("cardPic").src = cardFace1;
        document.getElementById("cardSet").innerHTML = '<b>' + setArray[selectedSet].set_name +'</b>' + " : " + setArray[selectedSet].rarity[0].toUpperCase()+ setArray[selectedSet].rarity.slice(1);
    }

    else{
    var selector = document.getElementById("setSelector");
    var selectedSet = selector.selectedIndex;
    document.getElementById("cardPic").src = setArray[selectedSet].image_uris.normal;
    document.getElementById("cardSet").innerHTML = '<b>' + setArray[selectedSet].set_name +'</b>' + " : " + setArray[selectedSet].rarity[0].toUpperCase()+ setArray[selectedSet].rarity.slice(1);
    }
}

function gotoLink()
{
    var selectorBuy = document.getElementById('buySelector');
    var desiredSite = selectorBuy.value;
    if(desiredSite == 'Ebay')
    {
        var win = window.open(EbayLink, '_blank');
        win.focus();
    }
    else
    {
        var win = window.open(TcgPlayerLink, '_blank');
        win.focus();
    }
    
}




