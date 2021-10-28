const state = {
    maxFaces: 5,
    triangulateMesh: true
  };

// 2Dグラフィックの描画に特化したメソッドやプロパティを持つオブジェクトを取得し、
// 定数ctxに格納する。
let ctx;
let videoWidth;
let videoHeight;
// video要素
let video;
// outputが格納されている
let canvas;

videoWidth = 300;
videoHeight = 250;

const load_check = document.querySelector('h1');
window.onload = function() {
    // 実行したい処理
    const painting = document.querySelector('painting');
    console.log(painting);
 }

let Module = {
    onRuntimeInitialized() {
        main();
    }
}

async function main() {
await setupCamera();
video.play();
videoWidth = video.videoWidth;
videoHeight = video.videoHeight;
video.width = videoWidth;
video.height = videoHeight;

canvas = document.getElementById('output');
canvas.width = videoWidth;
canvas.height = videoHeight;
const canvasContainer = document.querySelector('.canvas-wrapper');
canvasContainer.style = `width: ${videoWidth}px; height: ${videoHeight}px`;

ctx = canvas.getContext('2d');
ctx.translate(canvas.width, 0);
ctx.scale(-1, 1);
ctx.fillStyle = '#32EEDB';
ctx.strokeStyle = '#32EEDB';
ctx.lineWidth = 0.5;

model = await facemesh.load({maxFaces: state.maxFaces});

renderPrediction();

// toggle
load_check.classList.add("display");
painting.classList.remove("nonvisible");
}

// mainの中で呼び出される
async function renderPrediction() {

const predictions = await model.estimateFaces(video);
ctx.drawImage(
    video, 0, 0, videoWidth, videoHeight, 0, 0, canvas.width, canvas.height);

// ここに処理を書く
if (predictions.length > 0) {
    painting.src = "see.png";
}
else{
    painting.src = "nosee.png";
}

requestAnimationFrame(renderPrediction);
}

async function setupCamera() {
video = document.getElementById('video');

const stream = await navigator.mediaDevices.getUserMedia({
    'audio': false,
    'video': {
    facingMode: 'user',
    // Only setting the video to a specified size in order to accommodate a
    // point cloud, so on mobile devices accept the default size.
    width: videoWidth,
    height: videoHeight
    },
});
video.srcObject = stream;

return new Promise((resolve) => {
    video.onloadedmetadata = () => {
    resolve(video);
    };
});
}