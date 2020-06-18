var colors = ["red","teal","lime","green"];
document.getElementById("butt").addEventListener("click",color);
var i = 0;
  function color(){

    document.getElementById("About").style.backgroundColor = colors[i];
    i++;
    if (i > 3)
    i = 0;
  }


  
