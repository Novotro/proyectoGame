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
//Enanos
var cat;
var catStrong;
//Eventos
var timedEvent;
var timedEventSucesos;
//Contadores
var contadorNormal = 0;
var contadorStrong = 0;
var contadorMaximo = 0;
//Limitadores
var maximoNormal = 10;
var maximoStrong = 10;
//Variables para recursos
var recursos = 100;
var delay = 1000;
var sucesos = 10000;
var mejoras = 1;
var temporizador = 0;
var total= 0;
var recursosSegundo;
// Costes
var costesMejora = 50;
var costeCat = 50;
var costeCatStrong = 100;
// Otros
var group;


function preload(){
  //Fondo del juego
  this.load.image("background", "./assets/graphics/background.jpg");
  this.load.image("cat", "./assets/graphics/cat.png");
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

  cat = this.add.group();
  cat = this.physics.add.group();

  catStrong = this.add.group();
  catStrong = this.physics.add.group();

  catStrong = this.add.group();
  catStrong = this.physics.add.group();

  // Eventos secuenciales
  //Evento que va contando los recursos
  timedEvent = this.time.addEvent({
    delay: delay,
    callback: actualizarRecursos,
    callbackScope: this,
    loop: true
  });

  //Eventos de botones

  $(".normal").click({ game: this, tipo: "normal" }, createCat);
  $(".fuerte").click({ game: this, tipo: "fuerte" }, createCat);
  $(".mejorar").click(function(e) {
    e.preventDefault();

    mejoraRecursos(timedEvent);
  });
}

function update(){
}

// Funciones para el juego
function createCat(event){
  switch (event.data.tipo) {
    case "normal":
        if (recursos - costeCat >= 0 && contadorNormal < maximoNormal) {
            cat[contadorNormal] = group.create(100, 100, 'cat').setVelocity(Math.random() * 100 - 100, Math.random() * 100 - 100).setScale(0.32);
            recursos = recursos - costeCat;
            contadorNormal++;
            costeCat =  Math.trunc(costeCat *1.7);
            $(".total").html(contadorNormal);
            $(".costeEnanos").html(costeCat);

            actualizarRecursos();
        }
    break;
    case "fuerte":
        if (recursos - costeCatStrong >= 0 && contadorStrong < maximoStrong) {
            catStrong[contadorStrong] = group.create(100, 100, 'cat').setVelocity(Math.random() * 25 - 50, Math.random() * 25 - 50).setScale(0.32);
            recursos = recursos - costeCatStrong;
            contadorStrong++;
            costeCatStrong =  Math.trunc(costeCatStrong *1.7);
            $(".totalFuerte").html(contadorStrong);
            $(".costeCatStrong").html(costeCatStrong);
            actualizarRecursos();
       }
    break;
    case "rapido":
        if (recursos - costeCatStrong >= 0 && contadorStrong < maximoStrong) {
            catStrong[contadorStrong] = group.create(100, 100, 'dwarf').setVelocity(Math.random() * 100 - 100, Math.random() * 100 - 100).setScale(0.32);
            recursos = recursos - costeCatStrong;
            contadorStrong++;
            costeCatStrong =  Math.trunc(costeCatStrong *1.7);
            $(".totalFuerte").html(contadorStrong);
            $(".costeCatStrong").html(costeCatStrong);
            actualizarRecursos();
       }
    break;
  }
}

//Funcion para la IA de los cat

function iacat(){

}

// Funcion que va actualizando los recursos
function actualizarRecursos() {
  recursos = Math.trunc(recursos + (contadorNormal * 2) + (contadorStrong * 4));
  recursosSegundo = Math.trunc(((contadorNormal * 2) + (contadorStrong * 4)) / (delay/1000) *2);
  $(".recursos").html(recursos);
  $(".recursosSegundo").html(recursosSegundo);
}

function mejoraRecursos(timedEvent) {
  if (recursos > costesMejora && mejoras < 10 && contadorNormal > 0) {
    mejoras++;
    recursos = recursos - costesMejora;
    costesMejora = Math.trunc(costesMejora * 1.5);
    costeCat = costeCat * 1.25;

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
    delay = timedEvent.delay;
  }
}


});