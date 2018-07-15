//set click handler 

document.addEventListener('DOMContentLoaded',function(){
    document.getElementById("mybutton").addEventListener("click",handler);
});

//handle player input
function handler()
{
    var enteredPlayer = document.getElementById("myEnter").value;
    document.getElementById("output").innerHTML = enteredPlayer;
}