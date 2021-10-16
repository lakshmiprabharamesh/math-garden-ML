var model;

async function loadModel(){

    model = await tf.loadGraphModel("TFJS/model.json")
    // console.log(model);

}

function predictImage(){
  console.log("processing......");

  let image = cv.imread(canvas);
  cv.cvtColor(image, image, cv.COLOR_RGBA2GRAY, 0);
  cv.threshold(image, image, 177, 255, cv.THRESH_BINARY);

  let contours = new cv.MatVector();
  let hierarchy = new cv.Mat();
  // You can try more different parameters
  cv.findContours(image, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);

  let cnt = contours.get(0);
  let rect = cv.boundingRect(cnt);
  image =image.roi(rect);


  var height = image.rows;
  var width = image.cols;


  if (height>width){
    height = 20;
    const scaleFactor= image.rows/height;
    width = Math.round(image.cols/scaleFactor);
  }else{
    width = 20;
    const scaleFactor= image.cols/width;
    height = Math.round(image.rows/scaleFactor);
  }

  let dsize = new cv.Size(width, height);
// You can try more different parameters
  cv.resize(image, image, dsize, 0, 0, cv.INTER_AREA);

  const LEFT = Math.ceil(4 + (20-width)/2);
  const RIGHT =Math.floor(4 + (20-width)/2);
  const TOP =Math.ceil(4 + (20-height)/2);
  const BOTTOM =Math.floor(4 + (20-height)/2);

  let s = new cv.Scalar(0, 0, 0,0);
  cv.copyMakeBorder(image, image,  TOP, BOTTOM,LEFT, RIGHT, cv.BORDER_CONSTANT, s);



  //Finding center of mass

  cv.findContours(image, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
  cnt = contours.get(0);
  // You can try more different parameters
  const Moments = cv.moments(cnt, false);

  const cx=Moments.m10/Moments.m00;
  const cy= Moments.m01/Moments.m00;
  console.log(`${Moments.m00} , ${cx} , ${cy}`);

  const X_shift = Math.round(image.cols/2.0 - cx);
  const Y_Shift = Math.round(image.rows/2.0 - cy);


  let M = cv.matFromArray(2, 3, cv.CV_64FC1, [1, 0, X_shift, 0, 1, Y_Shift]);
  let new_size = new cv.Size(image.cols, image.rows);
  cv.warpAffine(image, image, M, new_size, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());

  let pixel_value = image.data;
  console.log(`${pixel_value}`);

  pixel_value = Float32Array.from(pixel_value)

  pixel_value = pixel_value.map(function(item){
      return (item / 255.0);

  })
  console.log(`${pixel_value}`);

  // Creating a tensor
  const X = tf.tensor([pixel_value]);
  console.log(`${X.shape}`);
  console.log(`${X.dtype}`);

  // predict

  const result = model.predict(X);
  result.print();

  console.log(tf.memory());
  const output = result.dataSync()[0];

  //Testing only will delete later
  const outputCanvas = document.createElement("CANVAS");
  cv.imshow(outputCanvas,image);
  document.body.appendChild(outputCanvas);

  // Cleanup
  contours.delete();
  image.delete();
  cnt.delete();
  hierarchy.delete();
  M.delete();
  result.dispose();
  X.dispose();

  return output;
}
