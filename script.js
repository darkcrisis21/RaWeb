var videos = []; //Declaramos variable video asigandole espacio para que lo reciba
var PeerConnection = window.PeerConnection || window.webkitPeerConnection00 || window.webkitRTCPeerConnection || window.mozRTCPeerConnection || window.RTCPeerConnection;
// crea una variable peer connection para saber que tipo de kit utilizara deacuerdo al navegador
var mutarmicro = document.getElementById('tu');

function getNumPerRow() {
  var len = videos.length;
  var biggest;

  // todo esta funcion determina las ventanas
  if(len % 2 === 1) {
    len++;
  }

  biggest = Math.ceil(Math.sqrt(len));
  while(len % biggest !== 0) {
    biggest++;
  }
  return biggest;
}

function subdivideVideos() {
  var perRow = getNumPerRow();
  var numInRow = 0;
  for(var i = 0, len = videos.length; i < len; i++) {
    var video = videos[i];
    setWH(video, i);
    numInRow = (numInRow + 1) % perRow;
  }// esta funcion permite saber el numero de ventanas que se mostraran
}

function setWH(video, i) {
  var perRow = getNumPerRow();
  var perColumn = Math.ceil(videos.length / perRow);
  var width = Math.floor((window.innerWidth) / perRow);
  var height = Math.floor((window.innerHeight - 20) / perColumn);
  video.width = width;
  video.height = height;
  video.style.position = "absolute";
  video.style.left = (i % perRow) * width + "px";
  video.style.top = Math.floor(i / perRow) * height + "px";
}// determina el ancho y diseño de las ventanas .. asi como la posicion

function cloneVideo(domId, socketId) {
  var video = document.getElementById(domId);
  var clone = video.cloneNode(false);
  clone.id = "remote" + socketId;
  document.getElementById('videos').appendChild(clone);
  videos.push(clone);
  return clone;
}// esta funcion permite clonar las propiedades de tu video y audio .. como si esta muteado o el volumen  

function removeVideo(socketId) {
  var video = document.getElementById('remote' + socketId);
  if(video) {
    videos.splice(videos.indexOf(video), 1);
    video.parentNode.removeChild(video);
  }// esta funcion es para cuando se desconecta un usuario para poder removerla de la pagina web
}

function initFullScreen() {
  var button = document.getElementById("fullscreen");
  button.addEventListener('click', function(event) {
    var elem = document.getElementById("videos");
    //Mostrar Pantalla completa
    elem.webkitRequestFullScreen();
  });
}
function initNewRoom() {
  var button = document.getElementById("newRoom");

  button.addEventListener('click', function(event) {
//CAMBIAR DE MANERA QUE SEA ALGO FACIL DE IDENTIFICAR LA SALA
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ";
    var string_length = 8;
    var randomstring = '';
    for(var i = 0; i < string_length; i++) {
      var rnum = Math.floor(Math.random() * chars.length);
      randomstring += chars.substring(rnum, rnum + 1);
    }

    window.location.hash = randomstring;
    location.reload();
  })
}//toda la funcion es con la que creamos el nombre de la sala que vamos a llamar .. como se ve es random

function init() {//es el motor .. llama al video y el audio para mandarlo en una variable y añadirlo a la pagina web.. y alli mismo hace posible que el otro se conecte por la url del canal que se creo 
  if(PeerConnection) {
    rtc.createStream({
      "video": {"mandatory": {}, "optional": []},
      "audio": true
    }, function(stream) {
             document.getElementById('you').src = URL.createObjectURL(stream);
             videos.push(document.getElementById('you'));
      subdivideVideos();
    });
  } else {
    alert('Tu navegador no soporta webrtc o estan desactivadas las banderas experimentales. En google chrome poner en url ://flags y encender PeerConnection y recuerda restear google chrome');
  }
var room = window.location.hash.slice(1);

  rtc.connect("ws:" + window.location.href.substring(window.location.protocol.length).split('#')[0], room);
  
  

  rtc.on('add remote stream', function(stream, socketId) {
    console.log("ADDING REMOTE STREAM...");
    var clone = cloneVideo('tu', socketId);
    document.getElementById(clone.id).setAttribute("class", "");
    //document.getElementById(clone.id).setAttribute("muted", "true");
    rtc.attachStream(stream, clone.id);
    subdivideVideos();
  });
  rtc.on('disconnect stream', function(data) {
    console.log('remove ' + data);
    removeVideo(data);
  });
  initFullScreen();
  initNewRoom();
  muteMicro();
}
function muteMicro() {
  var button = document.getElementById("muteMicro");
  button.addEventListener('click', function(event) {
   var identificador ="remote" + socketId;
   // var clone = cloneVideo('tu', socketId);
    alert('funciona');
//stream.getAudioTracks()[0].enabled = false;
   //var audioTracks=stream.getAudioTracks();
       //for(var i=0, 1=audioTracks.length; i<1; i++)
         //  {audioTracks[i].enabled = !audioTracks[i].enabled;}
         //audioTracks[0].enabled= false;
         //document.getElementById('tu').setAttribute("muted", "true");
       document.getElementById(identificador).setAttribute("muted", "false");

  });
}

window.onresize = function(event) {
  subdivideVideos();
};// simplemente es el que devuelve a su tamaño la ventana
