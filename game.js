'use strict';
window.onload = function()
{
var canvas = document.getElementById("canvas");
var screen = canvas.getContext("2d");
canvas.width = SCREEN_WIDTH + "";
canvas.height = SCREEN_HEIGHT + "";
canvas.style.display = "block";
canvas.style.margin = "0 auto";

var curframe = null;
var lastframe = null;
var delta = 0;

var keys = [];

var MenuShowing = true;
var MenuID = Menus.Main;
var PreviousMenu = Menus.Main;
var Controls = [];
var MouseDown = false;
var MouseDownX = 0;
var MouseDownY = 0;
var LastX = 0;
var LastY = 0;

var EditMode = true;
var EditTool = Tools.Box;

var undostack = [];
var redostack = [];

var erasehack = [];

var boxes = [];




var btnBegin = new Button("Begin", SCREEN_WIDTH / 2 - 120, 430, 240, 80, btnBegin_Click, ButtonImage);
var btnDone = new Button("Done", SCREEN_WIDTH / 2 - 120, 410, 240, 80, btnMain_Click, ButtonImage);
var btnShare = new Button("Share", SCREEN_WIDTH / 2 - 120, 310, 240, 80, btnMain_Click, ButtonImage);
var btnGo = new Button("GO", SCREEN_WIDTH - 160, SCREEN_HEIGHT - 140, 140, 120, btnGo_Click);
var btnBoxTool = new ImgButton("", SCREEN_WIDTH - 160, 20, 140, 140, btnBoxTool_Click, BoxToolButtonImage);
var btnEraseTool = new ImgButton("", SCREEN_WIDTH - 160, 180, 140, 140, btnEraseTool_Click, EraseToolButtonImage);
var btnUndo = new ImgButton("", SCREEN_WIDTH - 160, 340, 60, 60, Undo, UndoButtonImage);
var btnRedo = new ImgButton("", SCREEN_WIDTH - 80, 340, 60, 60, Redo, RedoButtonImage);
var btnClear = new ImgButton("", SCREEN_WIDTH - 160, 420, 140, 60, btnClear_Click, ClearButtonImage);
var btnFlip = new ImgButton("", SCREEN_WIDTH - 202, 15, 30, 50, btnFlip_Click, FlipButtonImage);

function btnBegin_Click()
{
	ChangeMenu(Menus.None);
	boxes = [];
	LoadLevel();
}

function btnGo_Click()
{
	AddBoxes();
	EditMode = false;
	Controls = [];
}

function btnMain_Click()
{
	redostack = [];
	undostack = [];
	EditTool = Tools.Box;
	ChangeMenu(Menus.Main);
}

function btnBoxTool_Click()
{
	EditTool = Tools.Box;
}

function btnEraseTool_Click()
{
	EditTool = Tools.Erase;
}

function btnClear_Click()
{
	if(boxes.length > 0)
	{
		undostack.push(boxes.slice(0));
		redostack = [];
		boxes = [];
	}
}

function btnFlip_Click()
{
	if(btnGo.x > 20)
	{
		btnBoxTool.x = 20;
		btnEraseTool.x = 20;
		btnUndo.x = 20;
		btnRedo.x = 100;
		btnClear.x = 20;
		btnGo.x = 20;
		btnFlip.x = 168;
	}
	else
	{
		btnBoxTool.x = SCREEN_WIDTH - 160;
		btnEraseTool.x = SCREEN_WIDTH - 160;
		btnUndo.x = SCREEN_WIDTH - 160;
		btnRedo.x = SCREEN_WIDTH - 80;
		btnClear.x = SCREEN_WIDTH - 160;
		btnGo.x = SCREEN_WIDTH - 160;
		btnFlip.x = SCREEN_WIDTH - 202;
	}
}






//////////////////////////////////////////////////////////
// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies;

// create an engine
var engine = Engine.create({enableSleeping:true});

// create a renderer
var render = Render.create({
    canvas: canvas,
    engine: engine,
	options: {
		width:SCREEN_WIDTH,
		height:SCREEN_HEIGHT,
		wireframes:false,
		background:"#9af",
		showSleeping:false
	}
});

// create two boxes and a ground
//var boxA = Bodies.rectangle(b.x, b.y, 60, 60, {render:{fillStyle:"#666", strokeStyle:"#000"}, chamfer:{radius:10}, friction:0.08, frictionAir:0, frictionStatic:0.3, restitution:0.2});
var ball = Bodies.circle(200, 549, 30, {render:{fillStyle:"#f00", strokeStyle:"000"}, friction:0.01, frictionAir:0, frictionStatic:0.2, restitution:0.3});
var ground = Bodies.rectangle(400, 610, 1024, 60, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
var wall = Bodies.rectangle(0, SCREEN_HEIGHT / 2 - 60, 100, SCREEN_HEIGHT, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
var stopblock = Bodies.rectangle(880, 570, 30, 40, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});

// add all of the bodies to the world
World.add(engine.world, [ball, ground, wall]);//, stopblock]);

// run the engine
//Engine.run(engine);

// run the renderer
//Render.run(render);
//////////////////////////////////////////////////////////




var loadcounter = 0;
var dots = "";

var preloader = setInterval(preloadloop, 10);
var gameloop;
function preloadloop()
{
	if(ButtonImage.ready && DialogImage.ready && OutlineImage.ready && ToolboxImage.ready && BoxToolButtonImage.ready && EraseToolButtonImage.ready && CheckMarkImage.ready && UndoButtonImage.ready && RedoButtonImage.ready && ClearButtonImage.ready && FlipButtonImage.ready) //load assets
	{
		clearInterval(preloader);
		
		gameloop = function(step)
		{
			if(lastframe !== null)
			{
				curframe = step;
				delta = curframe - lastframe;
				lastframe = curframe;
			}
			else
			{
				lastframe = step;
				curframe = step;
				ChangeMenu(Menus.Main);
			}
			
			if(!MenuShowing && !EditMode)
			{
				updateGame();
			}
			drawScreen();
		};
		
		//Gameloop setup in the browser is here
		var animationFrame = window.requestAnimationFrame;
		var recursiveAnimation = function(step)
		{
			gameloop(step);
			animationFrame(recursiveAnimation, canvas);
		};
		//start the game loop
		animationFrame(recursiveAnimation, canvas);
	}
	else
	{
		loadcounter++;
		if(loadcounter >= 30)
		{
			loadcounter = 0;
			if(dots == "...")
			{
				dots = "";
			}
			else
			{
				dots += ".";
			}
		}
		
		//show the loading message until it loads
		preloadClearScreen();
		screen.fillStyle = "#FFFFFF";
		screen.font = "60px Arial, sans-serif";
		screen.textAlign = "left";
		var loadx = SCREEN_WIDTH/2 - screen.measureText("Loading.").width/2;
		screen.fillText("Loading" + dots,loadx,SCREEN_HEIGHT/2);
	}
}

function clearScreen()
{
	screen.fillStyle = "#666666";
	screen.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
}

function preloadClearScreen()
{
	screen.fillStyle = "#000000";
	screen.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
}

function ChangeMenu(menu)
{
	for(var c = 0; c < Controls.length; c++)
	{
		Controls[c].state = ButtonState.UP;
	}
	Controls = [];
	MenuShowing = true;
	
	if(menu == Menus.Main)
	{
		Controls.push(btnBegin);
	}
	else if(menu == Menus.Victory)
	{
		Controls.push(btnShare);
		Controls.push(btnDone);
	}
	else if(menu == Menus.None)
	{
		MenuShowing = false;
	}
	
	PreviousMenu = MenuID;
	MenuID = menu;
	//send a mousemove event to all controls to prevent double-clicking
	for(var c = 0; c < Controls.length; c++)
	{
		Controls[c].pick(LastX, LastY, EventType.MOVE, MouseDown, MouseDownX, MouseDownY);
	}
}

function drawScreen()
{
	if(MenuShowing)
	{
		clearScreen();
		drawMenu();
	}
	else
	{
		Render.world(render);
		drawOutlines();
		drawToolbox();
	}
	
	drawControls();
	drawCheckMark();
}

function drawMenu()
{
	if(MenuID == Menus.Main)
	{
		FillWrapText("Toppleblox", 80, "center", SCREEN_WIDTH, SCREEN_WIDTH / 2, 180);
	}
	else if(MenuID == Menus.Victory)
	{
		Render.world(render);
		screen.fillStyle = "rgba(255, 255, 255, 0.5)";
		screen.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
		screen.drawImage(DialogImage, SCREEN_WIDTH / 2 - 200, SCREEN_HEIGHT / 2 - 200);
		
		FillWrapText("You Win!", 60, "center", SCREEN_WIDTH, SCREEN_WIDTH / 2, 220);
	}
}

function drawOutlines()
{
	if(EditMode)
	{
		for(var i = 0; i < boxes.length; i++)
		{
			var b = boxes[i];
			screen.drawImage(OutlineImage, b.x - 30, b.y - 30);
		}
	}
}

function drawToolbox()
{
	if(EditMode)
	{
		if(btnGo.x > 20)
		{
			screen.drawImage(ToolboxImage, SCREEN_WIDTH - 200, 0);
		}
		else
		{
			screen.drawImage(ToolboxImage, -200, 0);
		}
	}
}

function updateGame()
{
	Engine.update(engine, 16.666);
	
	var pos = ball.position;
	if(pos.y > SCREEN_HEIGHT + 50)
	{
		ChangeMenu(Menus.Victory);
	}
	else
	{
		var sleepcount = 0;
		var bodies = Matter.Composite.allBodies(engine.world);
		for(var i = 0; i < bodies.length; i++)
		{
			if(bodies[i].isSleeping)
			{
				sleepcount++;
			}
			else if(bodies[i].position.y > SCREEN_HEIGHT + 50)
			{
				sleepcount++;
			}
		}
		
		if(sleepcount == bodies.length)
		{
			LoadLevel();
		}
	}
}

function LoadLevel()
{
	ball = Bodies.circle(200, 549, 30, {render:{fillStyle:"#f00", strokeStyle:"000"}, friction:0.01, frictionAir:0, frictionStatic:0.2, restitution:0.3});
	var ground = Bodies.rectangle(400, 610, 1024, 60, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
	var wall = Bodies.rectangle(0, SCREEN_HEIGHT / 2 - 60, 100, SCREEN_HEIGHT, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});

	// add all of the bodies to the world
	engine.world = World.create();
	World.add(engine.world, [ball, ground, wall]);
	
	EditMode = true;
	Controls.push(btnGo);
	Controls.push(btnBoxTool);
	Controls.push(btnEraseTool);
	Controls.push(btnUndo);
	Controls.push(btnRedo);
	Controls.push(btnClear);
	Controls.push(btnFlip);
}

function AddBoxes()
{
	var bodies = [];
	for(var i = 0; i < boxes.length; i++)
	{
		var b = boxes[i];
		bodies.push(Bodies.rectangle(b.x, b.y, 60, 60, {render:{fillStyle:"#666", strokeStyle:"#000"}, chamfer:{radius:10}, friction:0.08, frictionAir:0, frictionStatic:0.3, restitution:0.2}));
	}
	
	World.add(engine.world, bodies);
}

function EraseBoxes(x, y)
{
	var erased = [];
	for(var i = 0; i < boxes.length; i++)
	{
		var b = boxes[i];
		var diffx = b.x - x;
		var diffy = b.y - y;
		
		if(diffx * diffx + diffy * diffy < 900) //30 * 30
		{
			erased.push(i);
		}
	}
	
	for(var i = erased.length - 1; i >= 0; i--)
	{
		boxes.splice(erased[i], 1);
	}
}

function Undo()
{
	if(undostack.length > 0)
	{
		redostack.push(boxes.slice(0));
		boxes = undostack.pop();
	}
}

function Redo()
{
	if(redostack.length > 0)
	{
		undostack.push(boxes.slice(0));
		boxes = redostack.pop();
	}
}





function drawCheckMark()
{
	if(!MenuShowing && EditMode)
	{
		if(EditTool == Tools.Box)
		{
			screen.drawImage(CheckMarkImage, btnBoxTool.x + 90, btnBoxTool.y + 5);
		}
		else if(EditTool == Tools.Erase)
		{
			screen.drawImage(CheckMarkImage, btnEraseTool.x + 90, btnEraseTool.y + 5);
		}
	}
}

function drawControls()
{
	for(var i = 0; i < Controls.length; i++)
	{
		Controls[i].draw(screen);
	}
}

window.addEventListener("mousemove", function (event) {
	var left = (window.pageXOffset || document.body.scrollLeft) - (document.body.clientLeft || 0);
	var top = (window.pageYOffset || document.body.scrollTop)  - (document.body.clientTop || 0);
	var x = event.clientX - canvas.offsetLeft + left;
	var y = event.clientY - canvas.offsetTop + top;
	LastX = x;
	LastY = y;
	
	if(!MenuShowing && EditMode)
	{
		if(MouseDown && EditTool == Tools.Erase)
		{
			EraseBoxes(x, y);
		}
	}
	
	//pick controls
	for(var c = 0; c < Controls.length; c++)
	{
		Controls[c].pick(x, y, EventType.MOVE, MouseDown, MouseDownX, MouseDownY);
	}
});

window.addEventListener("mousedown", function (event)
{
    keys[event.button] = true;
	var left = (window.pageXOffset || document.body.scrollLeft) - (document.body.clientLeft || 0);
	var top = (window.pageYOffset || document.body.scrollTop)  - (document.body.clientTop || 0);
	var x = event.clientX - canvas.offsetLeft + left;
	var y = event.clientY - canvas.offsetTop + top;
	
	MouseDown = true;
	MouseDownX = x;
	MouseDownY = y;
	
	if(!MenuShowing && EditMode)
	{
		if(EditTool == Tools.Erase)
		{
			erasehack = boxes.slice(0);
			EraseBoxes(x, y);
		}
	}
	
	//pick controls
	for(var c = 0; c < Controls.length; c++)
	{
		Controls[c].pick(x, y, EventType.DOWN, MouseDown, MouseDownX, MouseDownY);
	}
});

window.addEventListener("mouseup", function (event)
{
	keys[event.button] = false;
	var left = (window.pageXOffset || document.body.scrollLeft) - (document.body.clientLeft || 0);
	var top = (window.pageYOffset || document.body.scrollTop)  - (document.body.clientTop || 0);
	var x = event.clientX - canvas.offsetLeft + left;
	var y = event.clientY - canvas.offsetTop + top;
	
	MouseDown = false;
	
	if(!MenuShowing && EditMode)
	{
		if(EditTool == Tools.Box)
		{
			if((btnGo.x > 20 && x < SCREEN_WIDTH - 200) || (btnGo.x < 50 && x > 200))
			{
				undostack.push(boxes.slice(0));
				redostack = [];
				boxes.push(new Point(x, y));
			}
		}
		else if(EditTool == Tools.Erase)
		{
			if(erasehack.length != boxes.length)
			{
				undostack.push(erasehack.slice(0));
				redostack = [];
			}
			EraseBoxes(x, y);
		}
	}
	else if(!MenuShowing && !EditMode)
	{
		LoadLevel();
	}
	
	//pick controls
	for(var c = 0; c < Controls.length; c++)
	{
		Controls[c].pick(x, y, EventType.UP, MouseDown, MouseDownX, MouseDownY);
	}
});

function FillWrapText(text, size, align, maxwidth, x, y, color)
{
	var f_s = size;
	screen.font = f_s + "px Arial, sans-serif";
	screen.fillStyle = (typeof(color) === "undefined") ? "#000000" : color;
	screen.textAlign = align;
	if(screen.measureText(text).width > maxwidth)
	{
		var lines = [];
		var index = 0;
		var lineheight = f_s * 1.5;
		while(screen.measureText(text).width > maxwidth)
		{
			index = 1;
			while(screen.measureText(text.substr(0, index)).width < maxwidth)
			{
				index++;
			}
			
			index = text.substr(0, index).lastIndexOf(" ") + 1;
			lines.push(text.substr(0, index));
			text = text.substr(index);
		}
		
		//write each of the lines
		for(var i = 0; i < lines.length; i++)
		{
			screen.fillText(lines[i], x, y + (lineheight * i));
		}
		//write what's left of the text
		screen.fillText(text, x, y + lineheight * lines.length);
		
		return y + lineheight * lines.length + lineheight * 2;
	}
	else
	{
		screen.fillText(text, x, y);
		return y + 60;
	}
}

}