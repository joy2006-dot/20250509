# ✋🎈 使用 ml5.js 手部偵測互動控制紅色小球

## 📌 專案目標
透過 ml5.js 的 `handPose` 模型，偵測使用者的手部關鍵點，並讓手掌能「抓住」畫面中的紅色球，實現視覺上的互動效果。

---

## 🎯 技術重點

- 使用 `ml5.handPose()` 偵測手部 21 個關鍵點。
- 偵測骨架並畫出綠色線條。
- 若手部碰觸球心，讓球跟隨手掌移動（拖曳效果）。
- 支援左右手顏色區分。
- 顯示攝影機影像 + canvas 覆蓋圖形。

---

## 🧠 小提示（Tips）

> ✅ **小球互動提示**：使用 `dist()` 函數來計算球心與手指間的距離是否小於半徑，即可判定是否碰觸到球。  
> ✅ **手掌移動跟隨提示**：設定 `isHoldingBall` 為 true 後，將球的位置更新為「掌心位置」，這樣球就能被「拿起來」。

---

## 📦 程式碼（完整含註解）

```javascript
let video;
let handPose;
let hands = [];
let ball = { x: 320, y: 240, size: 100 };
let isHoldingBall = false;

// 手部關鍵點之間的骨架結構（index 對應 keypoints）
const skeleton = [
  [0, 1], [1, 2], [2, 3], [3, 4],       // 大拇指
  [0, 5], [5, 6], [6, 7], [7, 8],       // 食指
  [5, 9], [9, 10], [10, 11], [11, 12],  // 中指
  [9, 13], [13, 14], [14, 15], [15, 16],// 無名指
  [13, 17], [17, 18], [18, 19], [19, 20]// 小指
];

function preload() {
  // 載入手勢模型（flipped: true 表示左右反轉以符合鏡像）
  handPose = ml5.handPose({ flipped: true });
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // 啟動手勢偵測
  handPose.detectStart(video, gotHands);
}

function gotHands(results) {
  hands = results;
}

function draw() {
  image(video, 0, 0);

  // 畫出紅色球
  fill(255, 0, 0);
  noStroke();
  ellipse(ball.x, ball.y, ball.size);

  if (hands.length > 0) {
    for (let hand of
