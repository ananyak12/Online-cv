
function mess(){
  var str = document.getElementById("message");
  var num = str.value.length;
  var ab = document.getElementById("coll");
  ab.innerHTML = "Remaining characters: " + (500-num);


}
document.getElementById("message").addEventListener('keyup', mess);
