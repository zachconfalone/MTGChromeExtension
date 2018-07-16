//set click handler
document.addEventListener('DOMContentLoaded',function(){
    document.getElementById("mybutton").addEventListener("click",handler);
    document.getElementById("moreInfo").addEventListener("click",moreInfoinit);
    document.getElementById("flipButton").addEventListener("click",flipArt);
    document.getElementById("setPickerButton").addEventListener("click",selectArt);
});

var parsedJson;
var divel = document.getElementById('cardPic');
var cardFace1;
var cardFace2;
var setArray = {};

//handle player input
function handler()
{
    document.getElementById("setSelector").innerHTML = "";
    document.getElementById('legalities').innerHTML = ' ';
    divel.innerHTML = '';
    var entCard = document.getElementById("EnteredCard").value;
    var returned = MakeRequest('https://api.scryfall.com/cards/named?fuzzy=' + entCard)
    parsedJson = JSON.parse(returned);
    var setSearch = MakeRequest(parsedJson.prints_search_uri);
    parsedSetJson = JSON.parse(setSearch);
    //console.log(parsedSetJson.data[0]);
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
    for(each in parsedJson.legalities)
    {
        document.getElementById('legalities').textContent += each + ":" +parsedJson.legalities[each] + ' ' ;
    }
    if(parsedJson.layout == 'normal')
    {
        document.getElementById("flipButton").style.visibility="hidden";
        var pictureURL = parsedJson.image_uris.normal
        document.getElementById("cardPic").src = pictureURL;
        document.getElementById("cardName").innerHTML =  cardName;
        document.getElementById("cardSet").innerHTML = parsedJson.set_name;
    }
    if(parsedJson.layout == 'transform')
    {
        cardFace1 = parsedJson.card_faces[0].image_uris.normal;
        cardFace2 = parsedJson.card_faces[1].image_uris.normal;
        document.getElementById("cardName").innerHTML = cardName;
        document.getElementById("cardPic").src = cardFace1;
        document.getElementById("flipButton").style.visibility = "visible";
        document.getElementById("cardSet").innerHTML = parsedJson.set_name;

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
    var selector = document.getElementById("setSelector");
    var selectedSet = selector.selectedIndex;
    document.getElementById("cardPic").src = setArray[selectedSet].image_uris.normal;
    document.getElementById("cardSet").innerHTML = setArray[selectedSet].set_name;
}