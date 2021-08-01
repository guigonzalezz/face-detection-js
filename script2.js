
const webcamElement = document.getElementById('webcam');
const canvasElement = document.getElementById('canvas');
const webcam = new Webcam(webcamElement, 'user', canvasElement);


webcam.start()
  .then(result => {
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
      faceapi.nets.faceExpressionNet.loadFromUri('/models'),
    ])
  })
  .catch(err => {
    console.log(err);
  });



const video = document.getElementById('webcam');

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models'),
]).then(startVideo)

// function startVideo() {
//   navigator.mediaDevices.getUserMedia(
//     { video: {} },
//     stream => video.srcObject = stream,
//     err => console.error(err)
//   )
// }

video.addEventListener('play', () => {

  const canvas = faceapi.createCanvasFromMedia(video) // to add things to the webcam video
  document.overlay.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)// match canvas to display size
  setInterval(async () => {
    console.log("ENTREI AQUI")
    const detections = await faceapi.detectAllFaces(video,
      new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks()
      .withFaceExpressions()
    //console.log(detections)
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height) // to clear previous rect
    faceapi.draw.drawDetections(canvas, resizedDetections) // to drow the canvas and resize
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
  }, 100 // acync function

  ) // can use multiple times

}
)// what to do when video starts playing
