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
var catFast;
//Eventos
var timedEvent;
// var timedEventSucesos;
//Contadores
var contadorNormal = 0;
var contadorStrong = 0;
var contadorFast = 0;
// var contadorMaximo = 0;
//Limitadores
var maximoNormal = 10;
var maximoStrong = 10;
var maximoFast = 10;
//Variables para recursos
var recursos = 100;
var delay = 1000;
// var sucesos = 10000;
var mejoras = 1;
// var temporizador = 0;
// var total= 0;
var recursosSegundo;
// Costes
var costesMejora = 50;
var costeCat = 50;
var costeCatStrong = 100;
var costeCatFast = 75;
// Otros
var group;
var enemies= ["Dio","una Arpia","un Dragon"];
var acciones= ["encontro","robó","extrajo"];
var cantidadEvento= [100,50,20];

// funciones anonimas
var maximizar= function(){
     $(".nivelMejora").html("MAX");
     $(".recursos").html("MAX");
     $(".proximaMejora").html("MAX");
     $(".costeEnanos").html("MAX");
};

function preload(){
  //Fondo del juego
  this.load.image("background", "./assets/graphics/background.jpg");
  this.load.image("catNormal", "./assets/graphics/catNormal.png");
  this.load.image("catStrong", "./assets/graphics/catStrong.png");
  this.load.image("catFast", "./assets/graphics/catFast.png");
}

function create(){
  // Background del juego
  background = this.add.image(0, 0, "background").setOrigin(0, 0).setScale(2);
  // Limites del mapa
  this.physics.world.setBounds(0, 0, 660, 340);

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

  catFast = this.add.group();
  catFast = this.physics.add.group();

  // Eventos secuenciales
  //Evento que va contando los recursos
  timedEventResources = this.time.addEvent({
    delay: delay,
    callback: actualizarRecursos,
    callbackScope: this,
    loop: true
  });

 //Evento que va asignando tareas
  timedEventJob = this.time.addEvent({
    delay: 1000,
    callback: tareasCat,
    callbackScope: this,
    loop: true
  });

  //Eventos de botones
  $(".normal").click({ game: this, tipo: "normal" }, createCat);
  $(".fuerte").click({ game: this, tipo: "fuerte" }, createCat);
  $(".rapido").click({ game: this, tipo: "rapido" }, createCat);

  $(".mejorar").click(function(e) {
    e.preventDefault();
    mejoraRecursos(timedEvent);
  });

  $(".jobs").click(function(e) {
    e.preventDefault();
    deleteCat("normal");
  });
}

function update(){
}

// Funciones para el juego
function createCat(event){
  switch (event.data.tipo) {
    case "normal":
        if (recursos - costeCat >= 0 && contadorNormal < maximoNormal) {
            creador("normal",contadorNormal);
            $(".total").html(contadorNormal);
            $(".costeEnanos").html(costeCat);
            actualizarRecursos();
        }
    break;
    case "fuerte":
        if (recursos - costeCatStrong >= 0 && contadorStrong < maximoStrong) {
            creador("fuerte",contadorStrong);
            $(".totalFuerte").html(contadorStrong);
            $(".costeCatStrong").html(costeCatStrong);
            actualizarRecursos();
       }
    break;
    case "rapido":
        if (recursos - costeCatFast >= 0 && contadorFast < maximoFast) {
            creador("rapido",contadorFast);
            $(".totalFuerte").html(contadorFast);
            $(".costeCatFast").html(costeCatFast);
            actualizarRecursos();
       }
    break;
  }
}

function creador(tipo,contador){
    switch (tipo) {
      case "normal":
        cat[contador] = group.create(100, 100, 'catNormal').setVelocity(Math.random() * 100 - 100, Math.random() * 100 - 100).setScale(0.32);
        cat[contador].job = "unemployed";
        contadorNormal++;
        recursos = recursos - costeCat;
        costeCat =  Math.trunc(costeCat *1.7);
        //Los eventos aparecen mas frecuentemente segun la cantidad de gatos.
        timedEventJob.delay = timedEventJob.delay - (timedEventJob.delay * (contadorNormal*0.01));
      break;
      case "fuerte":
        catStrong[contador] = group.create(100, 100, 'catStrong').setVelocity(Math.random() * 25 - 50, Math.random() * 25 - 50).setScale(0.32);
        catStrong[contador].job = "unemployed";
        contadorStrong++;
        recursos = recursos - costeCatStrong;
        costeCatStrong =  Math.trunc(costeCatStrong *1.7);
        //Los eventos aparecen mas frecuentemente segun la cantidad de gatos.
        timedEventJob.delay = timedEventJob.delay - (timedEventJob.delay * (contadorStrong*0.01));
      break;
      case "rapido":
        catFast[contador] = group.create(100, 100, 'catFast').setVelocity(Math.random() * 100 - 100, Math.random() * 100 - 100).setScale(0.32);
        catFast[contador].job = "unemployed";
        contadorFast++;
        recursos = recursos - costeCatFast;
        costeCatFast =  Math.trunc(costeCatFast *1.7);
      break;
    }
}

//Funcion para la IA de los cat

function jobsCat(tipo){
    //switch (event.data.tipo) {

   switch (tipo) {
    case "normal":
      for(var i =  0; i < contadorNormal; i++){
          if (cat[i].job == "unemployed") {
                cat[i].job = "changed";
          }
          console.log(cat[i].job + "funciona");
      }
    break;
    case "strong":
        if (tipo.job != "unemployed") {

        }
    break;
    case "fast":
        if (tipo.job != "unemployed") {

        }
    break;
  }
}

// Funcion que va actualizando los recursos
function actualizarRecursos() {
  recursos = Math.trunc(recursos + (contadorNormal * 2) + (contadorStrong * 4));
  recursosSegundo = Math.trunc(((contadorNormal * 2) + (contadorStrong * 4)) / (delay/1000) *2);
  actualizarHtmlRecursos();
}

function actualizarHtmlRecursos(){
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
        maximizar();
    }else{
     $(".nivelMejora").html(mejoras);
     $(".recursos").html(recursos);
     $(".proximaMejora").html(costesMejora);
    }
    timedEventResources.delay = timedEventResources.delay - timedEventResources.delay * 0.25;
  }
}

//Funcion que se encarga de darles tareas a los cat segun su oficio
function tareasCat(){
    console.log("delay de tareas:"+ timedEventJob.delay);
    var typeJobEvent = Math.floor(Math.random()*3);
    //Un tercio de probabilidad de que ocurra un evento.
    var probabilityEvent=Math.floor(Math.random()*3);
    var typeProbability  = Math.floor(Math.random()*4);
    if(probabilityEvent == 2){
        switch(typeJobEvent){
            //Buscar
            case 0:
                if(typeProbability<2){
                    eventos("normal", "recurso");
                }else{
                console.log("Un gato encontro una caja pero estaba vacia.");
                }
            break;

            //Pelea
            case 1:
                eventos("normal", "pelea");
            break;

            //Mejora
            case 2:
                if(typeProbability ==3){
                    eventos("normal", "mejora");
                }else{
                    console.log("Un gato estudio para mejorar pero no ha sido suficiente.");
                }
            break;
        }
    }

    // if(recursos < 100){
    //     for(i = 0 ; i < contadorNormal ; i++ ){
    //         if(cat[i].job = "normal"){
    //             console.log(cat[i].body.velocity.x);
    //             if(cat[i].body.velocity.x > -200){
    //                 cat[i].setVelocityX(cat[i].body.velocity.x * 2);
    //                 eventos("normal","mejora");
    //             }else{
    //                  if(cat[i].body.velocity.x < 200){
    //                      cat[i].setVelocityX(cat[i].body.velocity.x * 2);
    //                  }
    //             }
    //         }

    //         if(cat[i].job == "fast"){
    //             cat[i].setVelocityX(cat[i].body.velocity.x * 2);
    //             cat[i].setVelocityY(cat[i].body.velocity.y* 2);
    //         }
    //     }
    // }else{
    //      for(i = 0 ; i < contadorNormal ; i++ ){
    //         if(cat[i].body.velocity.x > -200){
    //                 cat[i].setVelocityX(-50);
    //             }else{
    //                  if(cat[i].body.velocity.x < 200){
    //                      cat[i].setVelocityX(50);
    //                  }
    //             }
    //     }
    // }
}



// Eventos del juego
function eventos(typeCat, typeEvent){

    switch(typeEvent){
        case "recurso":
            var resourceEvent= cantidadEvento[Math.floor((Math.random()*cantidadEvento.length))];
            console.log("Un gato "+ typeCat+ " "+acciones[Math.floor((Math.random()*acciones.length))]+" "+ resourceEvent + " recursos.");
            recursos = recursos + resourceEvent;
            actualizarHtmlRecursos();
        break;

        case "mejora":
             console.log("Un gato "+ typeCat+ "encontró un libro de entrenamiento! Ha subido un nivel de mejora!");
             mejoras++;
             $(".nivelMejora").html(mejoras);
             actualizarHtmlRecursos();
        break;

        case "pelea":
         var resultado = Math.floor(Math.random()*3);
            if(resultado == 1){
                console.log("Un gato "+typeCat+ " ha peleado contra "+ enemies[Math.floor(Math.random()*3)]+ " ha ganado!");
                addResources(250);
            }else if (resultado == 2){
                console.log("Un gato "+typeCat+ " ha peleado contra "+ enemies[Math.floor(Math.random()*3)]+ " ha empatado!");
            }else{
                console.log("Un gato "+typeCat+ " ha peleado contra "+ enemies[Math.floor(Math.random()*3)]+ " ha perdido!");
            }
        break;
    }
}

// Funcion para añadir recursos
function addResources(cantidad){
    recursos = recursos + cantidad;
    actualizarRecursos();
}

// Funcion para borrar tipos
function deleteCat(tipo){
    switch(tipo){
        case "normal":
        //sin acabar
            cat.remove(cat.children[0],true);
        break;
    }

}

});