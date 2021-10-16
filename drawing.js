const BACKROUND_COLOR = "#000000";
const LINE_COLOUR = "#BCFF00"
const LINE_WIDTH = 15;

var currentX = 0;
var currentY = 0;
var previousX = 0;
var previousY = 0;
var canvas;
var context;

function PrepareCanvas() {
  console.log("Preparing Canvas");
  canvas = document.getElementById("myCanvas")
  context = canvas.getContext("2d")

  context.fillStyle = BACKROUND_COLOR
  context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  context.strokeStyle = LINE_COLOUR;
  context.lineWidth = LINE_WIDTH;
  context.lineJoin = "round";

  var isPainting = false;

  document.addEventListener("mousedown", function(event) {
    console.log("Mouse Pressed");
    isPainting = true;
    currentX = event.clientX - canvas.offsetLeft;
    currentY = event.clientY - canvas.offsetTop;

  });


  document.addEventListener("mousemove", function(event) {

    if (isPainting) {
      previousX = currentX;
      currentX = event.clientX - canvas.offsetLeft;

      previousY = currentY;
      currentY = event.clientY - canvas.offsetTop;


      draw();

    }



  });


  document.addEventListener("mouseup", function(event) {
    console.log("Mouse Released");
    isPainting = false;
  });

  canvas.addEventListener("mouseleave", function(event) {
    isPainting = false;
  });


  // Touch Event
  canvas.addEventListener("touchstart", function(event) {
  console.log("Touch Started");
  isPainting = true;
  currentX = event.touches[0].clientX - canvas.offsetLeft;
  currentY = event.touches[0].clientY - canvas.offsetTop;

});


  document.addEventListener("touchmove", function(event) {

  if (isPainting) {
    previousX = currentX;
    currentX = event.touches[0].clientX - canvas.offsetLeft;

    previousY = currentY;
    currentY = event.touches[0].clientY - canvas.offsetTop;

    draw();

  }

});


document.addEventListener("touchend", function(event) {
  console.log("Touch Ended");
  isPainting = false;
});

canvas.addEventListener("touchcancel", function(event) {
  isPainting = false;
});

}

function draw(){

  context.beginPath();
  context.moveTo(previousX, previousY);
  context.lineTo(currentX, currentY);
  context.closePath();
  context.stroke();
}
function clearCanvas() {

  currentX = 0;
  currentY = 0;
  previousX = 0;
  previousY = 0;
  context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight)

}
