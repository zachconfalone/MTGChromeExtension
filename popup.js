//set click handler
document.addEventListener('DOMContentLoaded',function(){
    document.getElementById("EnteredCard").addEventListener("keyup",function(event)
    {
        if(event.keyCode != 13 && event.keyCode != 32)
        {
            setTimeout(() => {
                var requestedCard = document.getElementById("EnteredCard").value;
                var url = 'https://api.scryfall.com/cards/autocomplete?q='+requestedCard;
                MakeRequest(url,parsesuggestions);
            }, 50);
        }
    }
);
    document.getElementById("mybutton").addEventListener("click",handler);
    document.getElementById("moreInfo").addEventListener("click",moreInfoinit);
    document.getElementById("flipButton").addEventListener("click",flipArt);
    document.getElementById("setSelector").addEventListener("change",selectArt);
    document.getElementById("buySelectorButton").addEventListener("click",gotoLink);
    window.addEventListener('error', function(e) {
        alert('Could not find that card');
        console.log(e);
    }, true);
});

var divel = document.getElementById('cardPic');
var cardFace1;
var cardFace2;
var setArray = {};
var TcgPlayerLink;
var edh_link;
var gatherer_link;
var oracle1;
var oracle2;
var name1;
var name2; 
var selected_set;


document.getElementById("EnteredCard").addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        document.getElementById("mybutton").click();
    }
});

//Main calling point when enter is pressed
function handler()
{
    MakeRequest('https://api.scryfall.com/cards/named?fuzzy=' + document.getElementById("EnteredCard").value,parseSets)
}

function parseFullInfo(full_info)
{
    document.getElementById("setSelector").innerHTML = '';
    document.getElementById('buySelector').innerHTML = '';
    var parsedSetJson = JSON.parse(full_info);
    document.getElementById('reserved').style.visibility = 'visible';
    document.getElementById('moreInfo').style.visibility = 'visible';
    document.getElementById('setSelector').style.visibility = 'visible';
    document.getElementById('legalities').style.visibility = 'visible';
    divel.innerHTML = '';
    for(var counter = 0;counter < parsedSetJson.total_cards;counter++)
    {
        setArray[counter] = parsedSetJson.data[counter];
    }

    for(var setCounter = 0;setCounter<parsedSetJson.total_cards;setCounter++)
    {
        var option = document.createElement('option');
        option.innerHTML = setArray[setCounter].set_name;
        option.value = setArray[setCounter].set_name;
        document.getElementById("setSelector").appendChild(option);
    }

    document.getElementById('buySelectorButton').style.visibility = 'visible';
    var TcgPlayer = document.createElement('option');
    TcgPlayer.value = 'TcgPlayer';
    TcgPlayer.innerHTML = 'TcgPlayer';
    var Gatherer = document.createElement('option');
    Gatherer.value = 'Gatherer';
    Gatherer.innerHTML = 'Gatherer';
    var EdhRec = document.createElement('option');
    EdhRec.value = 'EdhRec';
    EdhRec.innerHTML = 'EdhRec';
    document.getElementById('buySelector').style.visibility='visible';
    document.getElementById('buySelector').appendChild(TcgPlayer);
    document.getElementById('buySelector').appendChild(Gatherer);
    document.getElementById('buySelector').appendChild(EdhRec);

    selectArt();
}

function parseSets(json_blob)
{
    var parsed = JSON.parse(json_blob)
    if(!document.getElementById('legalities').innerHTML)
    {
        for(each in parsed.legalities)
        {
            console.log(each);
            document.getElementById('legalities').innerHTML +='<b>' + each[0].toUpperCase() + each.slice(1) + '</b>' + ": " + parsed.legalities[each].replace("_"," ") +  "<br />" ;
        }
    }
    MakeRequest(parsed.prints_search_uri,parseFullInfo);
}

function moreInfoinit()
{
    var win = window.open(setArray[0].scryfall_uri, '_blank');
    win.focus();
}

function MakeRequest(url,callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function()
    {
        if(xmlHttp.readyState == 4 && xmlHttp.status == 200) 
        {
            callback(xmlHttp.responseText);
        }
    };
    xmlHttp.open( "GET", url);
    xmlHttp.send();
}


function flipArt()
{
    switch(document.getElementById("cardPic").src)
    {
        case cardFace1:
            document.getElementById("cardName").innerHTML = name2
            document.getElementById("cardPic").src = cardFace2;
            document.getElementById("oracleText").innerHTML = "<b>" + "Oracle Text: " +"</b>"+ oracle2;
            return;
        case cardFace2:
            document.getElementById("cardName").innerHTML = name1;
            document.getElementById("cardPic").src = cardFace1;
            document.getElementById("oracleText").innerHTML = "<b>" + "Oracle Text: " +"</b>" +oracle1;
            return;
    }
}

function selectArt()
{
    selectedSet = document.getElementById("setSelector").selectedIndex;
    TcgPlayerLink = setArray[selectedSet].purchase_uris.tcgplayer;
    edh_link = setArray[selectedSet].related_uris.edhrec;
    gatherer_link = setArray[selectedSet].related_uris.gatherer;

    setPrices(selectedSet);


    if(setArray[selectedSet].layout == 'transform')
    {
        name1 = setArray[selectedSet].card_faces[0].name;
        name2 = setArray[selectedSet].card_faces[1].name;
        cardFace1 = setArray[selectedSet].card_faces[0].image_uris.normal;
        cardFace2 = setArray[selectedSet].card_faces[1].image_uris.normal;
        document.getElementById("cardName").innerHTML = name1;
        document.getElementById("cardPic").src = cardFace1;
        document.getElementById("cardSet").innerHTML = '<b>' + setArray[selectedSet].set_name +'</b>' + " : " + setArray[selectedSet].rarity[0].toUpperCase()+ setArray[selectedSet].rarity.slice(1);
        oracle1 = setArray[0].card_faces[0].oracle_text
        oracle2 = setArray[0].card_faces[1].oracle_text;
        cardFace1 = setArray[0].card_faces[0].image_uris.normal;
        cardFace2 = setArray[0].card_faces[1].image_uris.normal;
        document.getElementById("flipButton").style.visibility = "visible";
        document.getElementById("oracleText").innerHTML ="<b>" + "Oracle Text: " +"</b>"+ setArray[0].card_faces[0].oracle_text;
    }
    else
    {
        document.getElementById("cardPic").src = setArray[selectedSet].image_uris.normal;
        document.getElementById("cardSet").innerHTML = '<b>' + setArray[selectedSet].set_name +'</b>' + " : " + setArray[selectedSet].rarity[0].toUpperCase()+ setArray[selectedSet].rarity.slice(1);
        document.getElementById("cardName").innerHTML = setArray[selectedSet].name;
    }
}

function gotoLink()
{
    if(document.getElementById('buySelector').value == "TcgPlayer")
    {
        var win = window.open(TcgPlayerLink, '_blank');
    }
    else if(document.getElementById('buySelector').value == "Gatherer")
    {
        var win = window.open(gatherer_link, '_blank');
    }
    else
    {
        var win = window.open(edh_link, '_blank');
    }
    win.focus();
}

function parsesuggestions(var1)
{
    var suggestions = '';
    for(var i = 0; i < 5; i++)
    {
        suggestions += '<option value="'+JSON.parse(var1).data[i]+'" />'; // Load top 5 suggestions into selector
    }
    document.getElementById('suggestion_list').innerHTML = suggestions;
}

function setPrices(selected_set)
{
    if(!setArray[selected_set].prices.usd)
    {
        if(setArray[selected_set].prices.usd_foil)
        {
            document.getElementById("price").innerHTML = '<b>'+ 'Current price (Foil Only) : $'+'</b>' + setArray[selected_set].prices.usd_foil;
        }
        else if(setArray[selected_set].prices.tix && !setArray[selected_set].prices.eur)
        {
            document.getElementById("price").innerHTML = '<b>'+ 'Current price (Online Only) : Tix:'+'</b>' + setArray[selected_set].prices.tix;
        }
        else
        {
            console.log('price is undefined');
            document.getElementById("price").innerHTML = '<b>'+ 'Current price : '+'</b>' + 'Could not fetch current price';
        }
    }
    else if(setArray[selected_set].prices.usd && !setArray[selected_set].prices.usd_foil)
    {
        document.getElementById("price").innerHTML = '<b>'+ 'Current price : $'+'</b>' + setArray[selected_set].prices.usd + '<b>  Not Available in Foil' + '</b>';
    }
    else
    {
        document.getElementById("price").innerHTML = '<b>'+ 'Current price : $'+'</b>' + setArray[selected_set].prices.usd + '<b> Foil : $' + '</b>' + setArray[selected_set].prices.usd_foil;
    }
}


