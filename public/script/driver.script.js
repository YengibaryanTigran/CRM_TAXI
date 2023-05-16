var socket=io.connect();
window.socket=socket;

var payDr,disDr;
var coordinateDr=[[],[]];
var input_val_Dr=[[],[]];

 
function ClientInfo() {

socket.on('coordriver',function(coordinate,pay,dis,url,input_val)  //harcumenq katarum coordinate ev gin stanalu hamar
{
//  console.log("A: "+coordinate[0],"\nB: "+coordinate[1],"\nPay: "+pay+" AMD","\nDistance: "+dis);
  coordinateDr=coordinate;
  payDr=pay;
  disDr=dis;
  input_val_Dr=input_val;

  $(".address_A").html("Адрес клиента: " + input_val[0]);
  $(".address_B").html("Адрес назначения: " + input_val[1]);
  $(".my_distance").html("Дистанция: " + dis);
  $(".my_price").html("Цена: " + pay + " AMD");
  document.getElementById("my_order_button").href = url ;
/*  function testfun() {
    document.getElementById("my_order_button").href = "testitng";
  }
  testfun();*/

  //  console.log(url);
  //$(".client_info").append('<a href="'+url+'"target="_blank"><button class="order_button_driver">Принять и перейти к маршруту</button></a>');
/*  $(".ymaps-2-1-77-route-panel-input__input")[0].value=coordinate[0];
  $(".ymaps-2-1-77-route-panel-input__input")[1].value=coordinate[1];*/
});

//
  setTimeout(ClientInfo,60000);
}
ClientInfo();
