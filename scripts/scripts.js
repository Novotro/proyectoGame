$(document).ready(function() {

	console.log("ready");

	var heightGame = window.screen.height * 0.675;
	var widthGame = window.screen.width;
	var game;


	var config = {
	type: Phaser.CANVAS,
	width: widthGame,
	height: heightGame,
	resolution: 1,
	parent: "game",
	autoResize: true,
	physics: {
		default: "arcade",
		arcade: {
			gravity: { y: 0 },
			debug: false
		}
	},
	scene: {
      // key: 'prueba',
      preload: preload,
      create: create,
      update: update
    }
  };

  game = new Phaser.Game(config);

  //Llamada a la funcion para que se adapte al tamaño automaticamente
  resize();
  window.addEventListener("resize", resize, false);

function resize() {
 var canvas = document.querySelector("canvas");
 var windowWidth = window.innerWidth;
 var windowHeight = window.innerHeight;
 var windowRatio = windowWidth / windowHeight;
 var gameRatio = game.config.width / game.config.height;

 if (windowRatio < gameRatio) {
  canvas.style.width = windowWidth + "px";
  canvas.style.height = windowWidth / gameRatio + "px";
 }else{
  canvas.style.width = windowHeight * gameRatio + "px";
  canvas.style.height = windowHeight + "px";
 }
}

var group;
var dwarf;
var timedEvent;
var timedEventSucesos;
var contadorNormal = 0;
var contadorMaximo = 0;
var maximoNormal = 10;
var maximoFuerte = 10;
var recursos = 100;
var delay = 1000;
var sucesos = 10000;
var mejoras = 1;
var costesMejora = 50;
var temporizador = 0;
var costeDwarf = 50;
var total= 0;

function preload(){
  //Fondo del juego
  this.load.image("background", "./assets/graphics/background.jpg");
  this.load.image("dwarf", "./assets/graphics/dwarf.png");
}

function create(){
  // Background del juego
  background = this.add.image(0, 0, "background").setOrigin(0, 0).setScale(2);
  // Limites del mapa
  this.physics.world.setBounds(0, 0, 660, 340);

  //Evento que va contando los recursos
  timedEvent = this.time.addEvent({
    delay: delay,
    callback: actualizarRecursos,
    callbackScope: this,
    loop: true
  });

  //Objetos
  group = this.physics.add.group({
    bounceX: 1,
    bounceY: 1,
    collideWorldBounds: true
  });

  dwarf = this.add.group();
  dwarf = this.physics.add.group();

  // Eventos secuenciales
  //Evento que va contando los recursos
  timedEvent = this.time.addEvent({
    delay: delay,
    callback: actualizarRecursos,
    callbackScope: this,
    loop: true
  });

  //Eventos de botones
  $(".normal").click({ game: this, tipo: "normal" }, createDwarf);

  $(".mejorar").click(function(e) {
    e.preventDefault();

    mejoraRecursos(timedEvent);
  });
}

function update(){
}

// Funciones para el juego
function createDwarf(event){
  switch (event.data.tipo) {
    case "normal":
        if (recursos - costeDwarf >= 0 && contadorNormal < maximoNormal) {
            dwarf[contadorNormal] = group.create(100, 100, 'dwarf').setVelocity(Math.random() * 100 - 100, Math.random() * 100 - 100).setScale(0.32);
            recursos = recursos - costeDwarf;
            actualizarRecursos();
            contadorNormal++;
            costeDwarf =  Math.trunc(costeDwarf *1.7);
            $(".total").html(contadorNormal);
            $(".costeEnanos").html(costeDwarf);
        }
    break;
  }
}

// Funcion que va actualizando los recursos
function actualizarRecursos() {
  recursos = recursos + contadorNormal + contadorMaximo;
  $(".recursos").html(recursos);
  $(".recursosSegundo").html((contadorNormal + contadorMaximo * 2) * mejoras);
}


function mejoraRecursos(timedEvent) {
  if (recursos > costesMejora && mejoras < 10 && contadorNormal > 0) {
    mejoras++;
    recursos = recursos - costesMejora;
    costesMejora = Math.trunc(costesMejora * 1.5);
    costeDwarf = costeDwarf * 1.25;
    if(mejoras >= 10){
     $(".nivelMejora").html("MAX");
     $(".recursos").html("MAX");
     $(".proximaMejora").html("MAX");
     $(".costeEnanos").html("MAX");
    }else{
     $(".nivelMejora").html(mejoras);
     $(".recursos").html(recursos);
     $(".proximaMejora").html(costesMejora);
    }

    timedEvent.delay = timedEvent.delay - timedEvent.delay * 0.25;
  }
}


});