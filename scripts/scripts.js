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


function preload(){
    //Fondo del juego
    this.load.image("background", "./assets/graphics/background.jpg");
    this.load.image("object", "./assets/graphics/object.png");
    this.load.image("object2", "./assets/graphics/object.png");
}

function create(){
  // Background del juego
  background = this.add.image(0, 0, "background").setOrigin(0, 0).setScale(1.5);
  // background = this.add.image(0, 0, "background").setOrigin(0, 0).setScale(1.5).setInteractive();

  // Limites del mapa
  this.physics.world.setBounds(0, 0, 660, 340);

  // Creo el objeto
  object = this.physics.add.sprite(100, 100, 'object');
  // Le atribuyo que sea inteactivo
	object.setInteractive();
	//Añado un pequeño rebote al objeto cuando cae
  object.setBounce(0.05);
  //Evito que el objeto caiga por los bordes
  object.setCollideWorldBounds(true);
  //Añado gravedad al objeto
  object.body.setGravityY(300);

	// Permito que se pueda hacer drag con el objeto
  this.input.setDraggable(object);

  // Creo el objeto
  object2 = this.physics.add.sprite(500, 100, 'object2');
  //Evito que el objeto caiga por los bordes
  object2.setCollideWorldBounds(true);
  //Añado gravedad al objeto
  object2.body.setGravityY(-100);


  // Evento de arrastrar
  this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
        gameObject.x = dragX;
        gameObject.y = dragY;
    });

  // Colisiones
  this.physics.add.collider(object, object2,hitBox, null, this);

  function hitBox (){
		console.log('hit');

		object.setVelocityX(Math.random()*(-100 - (500)));
		object.setBounce(1);
	}


}

function update(){

	if(object2.y <= 100){
  	object2.body.setGravityY(10);
	}else{
  	object2.body.setGravityY(-100);
	}

}







});