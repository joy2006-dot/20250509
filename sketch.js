// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];

// 定義手部骨架結構
const skeleton = [
  [0, 1], [1, 2], [2, 3], [3, 4], // 大拇指
  [0, 5], [5, 6], [6, 7], [7, 8], // 食指
  [5, 9], [9, 10], [10, 11], [11, 12], // 中指
  [9, 13], [13, 14], [14, 15], [15, 16], // 無名指
  [13, 17], [17, 18], [18, 19], [19, 20] // 小指
];

function preload() {
  // Initialize HandPose model with flipped video input
  handPose = ml5.handPose({ flipped: true });
}

function mousePressed() {
  console.log(hands);
}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // Start detecting hands
  handPose.detectStart(video, gotHands);
}

function draw() {
  image(video, 0, 0);

  // Ensure at least one hand is detected
  if (hands.length > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // 繪製骨架
        for (let [start, end] of skeleton) {
          let startPoint = hand.keypoints[start];
          let endPoint = hand.keypoints[end];

          stroke(0, 255, 0);
          strokeWeight(2);
          line(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
        }

        // 繪製關鍵點
        for (let i = 0; i < hand.keypoints.length; i++) {
          let keypoint = hand.keypoints[i];

          // Color-code based on left or right hand
          if (hand.handedness == "Left") {
            fill(255, 0, 255);
          } else {
            fill(255, 255, 0);
          }

          noStroke();
          circle(keypoint.x, keypoint.y, 16);
        }
      }
    }
  }
}
