let canvas = document.getElementById("canvas");
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
let ctx = canvas.getContext("2d");

ctx.fillStyle = "black";
ctx.strokeStyle = "none";
ctx.lineWidth = 8;
ctx.lineCap = "round";

let painting = false; //控制画画触发时机
let last;

// 兼容手机
var isTouchDevice = "ontouchstart" in document.documentElement;
if (isTouchDevice) {
  canvas.ontouchstart = (e) => {
    let x = e.touches[0].clientX;
    let y = e.touches[0].clientY;
    last = [x, y];
  };
  canvas.ontouchmove = (e) => {
    let x = e.touches[0].clientX;
    let y = e.touches[0].clientY;
    drawLine(last[0], last[1], x, y);
    last = [x, y];
  };
} else {
  canvas.onmousedown = (e) => {
    painting = true;
    last = [e.clientX, e.clientY];
  };

  canvas.onmousemove = (e) => {
    if (painting === true) {
      drawLine(last[0], last[1], e.clientX, e.clientY);
      last = [e.clientX, e.clientY];
    }
  };
  canvas.onmouseup = () => {
    painting = false;
  };
}

function drawLine(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}
//清除笔迹
//更换画笔颜色
//重置画板
