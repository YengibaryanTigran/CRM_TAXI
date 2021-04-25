var socket=io.connect();
window.socket=socket;

function coorclick() {
  socket.emit('coordinate',coor,pay,distance,url,input_val); //poxancumenk kordinatner, vcharvo gumar rv distancian serverin
}
