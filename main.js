let canvas = document.getElementById("canvas");
let thin = document.getElementById("thin");
let thick = document.getElementById("thick");
let black = document.getElementById("black");
let red = document.getElementById("red");
let yellow = document.getElementById("yellow");
let blue = document.getElementById("blue");
let eraser = document.getElementById("eraser");
let pen = document.getElementById("pen");
let clear = document.getElementById("clear");


canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
let ctx = canvas.getContext("2d");

ctx.fillStyle = "black";
ctx.strokeStyle = "none";
ctx.lineWidth = 5;
ctx.lineCap = "round";//线条转折处为圆，而不是直角锯齿状

let painting = false; //控制画画触发时机，是否按下
let eraserEnabled = false //控制橡皮擦触发时机，是否擦除
let lastPoint = [undefined,undefined];

monitor()
function monitor(){
  thin.onclick = ()=>{
    ctx.lineWidth = 5
    thin.classList.add('active')
    thick.classList.remove('active')
  }
  thick.onclick = ()=>{
    ctx.lineWidth = 10
    thick.classList.add('active')
    thin.classList.remove('active')
  }
  black.onclick = ()=>{
    black.classList.add("active")
    red.classList.remove("active")
    yellow.classList.remove("active")
    blue.classList.remove("active")
    ctx.strokeStyle = "black"
  }
  red.onclick = ()=>{
    red.classList.add("active")
    black.classList.remove("active")
    yellow.classList.remove("active")
    blue.classList.remove("active")
    ctx.strokeStyle = "red"
  }
  yellow.onclick = ()=>{
      yellow.classList.add("active")
      black.classList.remove("active")
      red.classList.remove("active")
      blue.classList.remove("active")
      ctx.strokeStyle = "yellow"
  }
  blue.onclick = ()=>{
      blue.classList.add("active")
      black.classList.remove("active")
      red.classList.remove("active")
      yellow.classList.remove("active")
      ctx.strokeStyle = "blue"
  }
  eraser.onclick = ()=>{
    eraserEnabled = true
    painting = false//需要同时将painting 置为false，否则会画笔和橡皮擦会同时开启
    eraser.classList.add('active')
    pen.classList.remove('active')
  }
  pen.onclick = ()=>{
    eraserEnabled = false
    // painting = true//不能开启，否则鼠标没有按下就开始画画
    pen.classList.add("active")
    eraser.classList.remove("active")
  }
  clear.onclick = ()=>{
    ctx.clearRect(0,0,canvas.width,canvas.height)
  }
  download.onclick = ()=>{
    let a = document.createElement('a')
    a.download = '我的涂鸦.png'
    let url = canvas.toDataURL()
    a.href = url
    a.click()
  }
// 兼容手机
let isTouchDevice = "ontouchstart" in document.documentElement;//唯一检测是否为移动端的方法
if (isTouchDevice) {
  canvas.ontouchstart = (e) => { //开始触摸
    painting = true
    let x = e.touches[0].clientX;
    let y = e.touches[0].clientY;
    lastPoint = [x, y]; //记下第一次鼠标点击的位置，以作为画线的终点的参考点
  };
  canvas.ontouchmove = (e) => { //手指移动
    let x = e.touches[0].clientX;
    let y = e.touches[0].clientY;
    if(painting){
      if(eraserEnabled){   
        ctx.clearRect(x-10,y-10,30,30)
      }else{
        drawLine(lastPoint[0], lastPoint[1], x, y);
        lastPoint = [x, y];//需要实时更新画线的 起点，记录每次点击位置
      }
    }


  };
  canvas.ontouchend = ()=>{ //结束触摸
    painting = false
  }
} else {
  //PC端
  canvas.onmousedown = (e) => { //鼠标按下
    painting = true;
    lastPoint = [e.clientX, e.clientY];
  };

  canvas.onmousemove = (e) => { //鼠标移动
    let x = e.clientX
    let y = e.clientY
    if(painting){
      if(eraserEnabled){
        ctx.clearRect(x-10,y-10,30,30)
      }else{
        drawLine(lastPoint[0], lastPoint[1],x,y );
        lastPoint = [x, y];
      }
    }

  };
  canvas.onmouseup = () => { //鼠标抬起
    painting = false;
  };
}

}
//连线
function drawLine(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);//起点
  ctx.lineTo(x2, y2);//终点
  ctx.stroke(); //描边
}
//清除笔迹
//更换画笔颜色
//重置画板
