var answer;
var score=0;
var background_image = [];
function question(){
  const n1 = Math.round(Math.random() * 5);
  document.getElementById("n1").innerHTML = n1;
  const n2 = Math.round(Math.random() * 6);
  document.getElementById("n2").innerHTML = n2;
  answer = n1+n2
}

function checkAnswer(){
  const prediction = predictImage();
  console.log(`${answer} and ${prediction}`);

  if (prediction == answer){
    score++;
    console.log(`${score} Correct`);
    if (score < 6 || score == 6){
      background_image.push(`url('images/background${score}.svg')`);
      document.body.style.backgroundImage=background_image;
    }else{
      alert("COngratulations");
      score=0;
      background_image=[];
      document.body.style.backgroundImage=background_image;
    }

}else{
      if(score != 0){
      score--;}
      console.log(`${score} Wrong`);
      alert("Opps Wrong answer");
      setTimeout(function(){
        background_image.pop();
        document.body.style.backgroundImage=background_image;
      },1000);


  }
}
