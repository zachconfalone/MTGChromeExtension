//set click handler
document.addEventListener('DOMContentLoaded',function(){
    document.getElementById("mybutton").addEventListener("click",handler);
    document.getElementById("moreInfo").addEventListener("click",moreInfoinit);
    document.getElementById("flipButton").addEventListener("click",flipArt);
    document.getElementById("setPicker").addEventListener("click",selectArt);
});

var parsedJson;
var divel = document.getElementById('cardPic');
var cardFace1;
var cardFace2;
var setArray = {};

//handle player input
function handler()
{
    document.getElementById('legalities').innerHTML = ' ';
    divel.innerHTML = '';
    var entCard = document.getElementById("EnteredCard").value;
    var returned = MakeRequest('https://api.scryfall.com/cards/named?fuzzy=' + entCard)
    parsedJson = JSON.parse(returned);
    var setSearch = MakeRequest(parsedJson.prints_search_uri);
    parsedSetJson = JSON.parse(setSearch);
    //console.log(parsedSetJson.data[0]);
    var counter = 0
    for(counter = 0;counter < parsedSetJson.total_cards;counter++)
    {
        setArray[counter] = parsedSetJson.data[counter];
    }
    var setCounter = 0;
    /*
    for(setCounter = 0;setCounter<parsedSetJson.total_cards;setCounter++)
    {
        console.log(setArray[setCounter].set_name);
    }
    */
    if(parsedJson.status == 404)
    {
        alert('ALERT: Can not parse your request, please enter it again');
    }
    var cardName = parsedJson.name;
    for(each in parsedJson.legalities)
    {
        document.getElementById('legalities').textContent += each + ":" +parsedJson.legalities[each] + ' ' ;
    }
    if(parsedJson.layout == 'normal')
    {
        document.getElementById("flipButton").style.visibility="hidden";
        var pictureURL = parsedJson.image_uris.normal
        document.getElementById("cardPic").src = pictureURL;
        document.getElementById("cardInfo").innerHTML =  cardName;
    }
    if(parsedJson.layout == 'transform')
    {
        cardFace1 = parsedJson.card_faces[0].image_uris.normal;
        cardFace2 = parsedJson.card_faces[1].image_uris.normal;
        document.getElementById("cardInfo").innerHTML = cardName;
        document.getElementById("cardPic").src = cardFace1;
        document.getElementById("flipButton").style.visibility = "visible";

    }
}

function moreInfoinit()
{
    var moreInfoURL = parsedJson.scryfall_uri;
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
            return;
        case cardFace2:
            document.getElementById("cardPic").src = cardFace1;
            return;
    }
}

function selectArt(){
    console.log(setArray[2].image_uris.normal);
    document.getElementById("cardPic").src = setArray[2].image_uris.normal;
}