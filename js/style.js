window.onload = init;
//鼠标滑动触发事件
window.onmousemove = mouseMoveHandler;
//画笔
var context;
//背景  小球 挡板
var bg_01, ball, board;

//Canvas画板的宽高
var cW = 1024;
var cH = 768;
//声明挡板的初始化位置
var boardX = 0;
var boardY = 630;
//定义小球的初始化位置
var ballX = 400;
var ballY = 400;
//小球的x轴y轴方向的速度
var vx = 4;
var vy = -8;
//创建一个存放砖块的数组-空的
var Breakers = [];


timmer=null;

//游戏的入口 进入游戏
function init() {
	log("进入游戏。。。");
	//先找到游戏的版面
	var canvas = document.getElementById("gameCanvas");
	context = canvas.getContext("2d");
	//	bg_01=new Image();
	//	bg_01.src="img/bg.png";
	//	context.drawImage(bg_01,0,0);
	bg_01 = addImg("img/bg.png");
	board = addImg("img/board.png");
	ball = addImg("img/ball.png");
	//加载砖块的方法
	createBreakers();
	//删除 左上角第一个
//	Breakers.splice(0,1);
	
	
	timmer=setInterval(gameTick, 1000 / 60);

}
//初始化的方法
function gameTick() {
	//清空屏幕
	cleanScreen();
	//绘制背景
	context.drawImage(bg_01, 0, 0);
	//绘制挡板
	context.drawImage(board, boardX, boardY);
	
	updateBreaker();

	//每秒刷新60次
	updateBall();
	//小球跟挡板的碰撞检测
	testballAndBoard();
	//小球跟砖块碰撞检测
	testballAndBreaker();
	
	

}







function testballAndBreaker()
{
	for(var i = Breakers.length -1;i>=0;i--){
		var item = Breakers[i];
		//                                  z砖宽    高
		var hit = hitTestPoint(item.x, item.y,192,66,ballX,ballY);
		if(hit){
			Breakers.splice(i,1);
			vy*=-1;
		}
	}
}
function testballAndBoard()
{
	//                                       挡板宽 挡板高
	var hit=hitTestPoint(boardX-60,boardY-60,242+60,18+60,ballX,ballY);
	if(hit)
	{
		ballY=boardY-60;
		vy*=-1;
	}
}
//碰撞满足的条件                x轴 y轴 宽 高  小球
function hitTestPoint(x1,y1,w1,h1,x2,y2)
{
	//小球碰撞的条件  以砖块为例子
	//         x1就无敌了
	if(x2>=x1&&x2<=x1+w1&&y2>=y1&&y2<=y1+h1){
		return true;
	}else{
		return false;
	}
}


function updateBreaker() {
	for (var i = 0; i < Breakers.length; i++) {
		var item = Breakers[i];
		//间接获取item:item,x:20+(192+6)*i,y:100
		context.drawImage(item.item,item.x,item.y);
	}
}






//创建砖块
function createBreakers() {
	for (var j=0;j<3;j++) {
		for (var i = 0; i < 5; i++) {
			var item = addImg("img/"+(j+4)+".png");
			//		item.x=20+(192+6)*i;
			//		item.y=100;
			//key:item value:item x y
			Breakers.push({
				item: item,
				x: 20 + 198 * i,
				y: 100+70*j
			});
		}
	}

}
//创建小球，更新小球位置
function updateBall() {
	//小球x,y方向的间接改变
	ballX += vx;
	ballY += vy;
//	log("x" + ballX + "y" + ballY);
	//判断小球碰撞到左右的墙壁
	if (ballX < 0) {
		//碰到左墙
		ballX = 0;
		vx *= -1;
	} else if (ballX > cW - ball.width) {
		//碰到右墙
		ballX = cW - ball.width;
		vx *= -1;
	}
	//判断小球碰撞到上的墙壁
	if (ballY < 90) {
		ballY = 90;
		vy *= -1;
	} else if (ballY > 700) {
		clearInterval(timmer);
		cleanScreen();
		document.write("<h1>游戏结束！</h1>");
		document.write("<a href='page2.html' style='font-size:2em;display:block;margin:200px;'>重新开始</a>");
		log("游戏结束");
		timmer=null;
		
	}
	context.drawImage(ball, ballX, ballY);
}
//鼠标滑动触发事件
function mouseMoveHandler(e) {
	//设置挡板的x坐标，并且根据挡板的中心点移动
	boardX = e.x - board.width / 2;
	//防止左边挡板超出屏幕
	if (e.x < board.width / 2) {
		boardX = 0;
	}
	//防止右边挡板超出屏幕
	if (e.x > cW - board.width / 2) {
		boardX = cW - board.width;
	}
}
//清空屏幕的方法
function cleanScreen() {
	context.clearRect(0, 0, cW, cH);
}
//封装加载图片的方法
function addImg(url) {
	var img = new Image();
	img.src = url;
	return img;
}

//控制台的输出
function log(msg) {
	console.log(msg);
}