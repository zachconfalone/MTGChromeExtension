//set click handler
document.addEventListener('DOMContentLoaded',function(){
    document.getElementById("mybutton").addEventListener("click",handler);
    document.getElementById("moreInfo").addEventListener("click",moreInfoinit);
});

var parsedJson;
var divel = document.getElementById('output');

//handle player input
function handler()
{
    divel.innerHTML = '';
    var entCard = document.getElementById("EnteredCard").value;
    var returned = MakeRequest('https://api.scryfall.com/cards/named?fuzzy=' + entCard)
    parsedJson = JSON.parse(returned);
    if(parsedJson.status == 404)
    {
        alert('ALERT: Can not parse your request, please enter it again');
    }
    var cardName = parsedJson.name;
    if(parsedJson.layout == 'normal')
    {
        var pictureURL = parsedJson.image_uris.normal
        var pic = document.createElement("img");
        pic.src = pictureURL;
        pic.setAttribute("height", "350");
        pic.setAttribute("width", "275");
        divel.appendChild(pic)
        document.getElementById('cardInfo').innerHTML = cardName;
    }
    if(parsedJson.layout == 'transform')
    {
        var cardFace1 = parsedJson.card_faces[0].image_uris.normal;
        var cardFace2 = parsedJson.card_faces[1].image_uris.normal;
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