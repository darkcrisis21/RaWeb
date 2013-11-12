// Main o Servidor ..
// Correr Manual Localmente

//1. Instalar Node.js
//2. cd app
//3. npm install -d
//4. node main.js
//////////////////////////////////////CODIGOOO//////////////////
var app = require('express')();
var server = require('http').createServer(app);
var webRTC = require('webrtc.io').listen(server);

//var port = process.env.PORT;
server.listen(8080);

console.log('Starting app on port ' + 8080);

app.get('/', function(req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get('/style.css', function(req, res) {
  res.sendfile(__dirname + '/style.css');
});

app.get('/webrtc.io.js', function(req, res) {
  res.sendfile(__dirname + '/webrtc.io.js');
});

app.get('/client.js', function(req, res) {
  res.sendfile(__dirname + '/client.js');
});

webRTC.rtc.on('connect', function(rtc) {
  //Cliente Conectado
  console.log('rtc connect');
});

webRTC.rtc.on('send answer', function(rtc) {
  //Enviando respuesta
  console.log('rtc send answer');
});

webRTC.rtc.on('disconnect', function(rtc) {
  //Cliente Desconectado 
  console.log('rtc disconnect');
});

webRTC.rtc.on('chat_msg', function(data, socket) {
  var roomList = webRTC.rtc.rooms[data.room] || [];

  for (var i = 0; i < roomList.length; i++) {
    var socketId = roomList[i];

    if (socketId !== socket.id) {
      var soc = webRTC.rtc.getSocket(socketId);

      if (soc) {
        soc.send(JSON.stringify({
          "eventName": "receive_chat_msg",
          "data": {
            "messages": data.messages,
            "color": data.color
          }
        }), function(error) {
          if (error) {
            console.log(error);
          }
        });
      }
    }
  }
});


