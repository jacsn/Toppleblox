'use strict';
window.onload = function()
{
var canvas = document.getElementById("canvas");
var screen = canvas.getContext("2d");
canvas.width = SCREEN_WIDTH + "";
canvas.height = SCREEN_HEIGHT + "";
canvas.style.display = "block";
canvas.style.margin = "0 auto";

//handle lookatme user button events
document.getElementById("logout").addEventListener("click", ToggleSite);
document.getElementById("myposts").addEventListener("click", LoadAllPosts);

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

var Replaying = false;
var replayfinished = false;
var singlepost = true;

var undostack = [];
var redostack = [];

var erasehack = [];

var boxes = [];

var Level = 2;

var Posts = [];
var curPost = -1;

var username = "Username";

var validboxoutline = true;

var ballcollisions = [];
var balltopspeed = 0;
var anytopspeed = 0;




var btnBegin = new Button("Begin", SCREEN_WIDTH / 2 - 120, 430, 240, 80, btnBegin_Click, ButtonImage);
var btnDone = new Button("Done", SCREEN_WIDTH / 2 - 120, 410, 240, 80, btnDone_Click, ButtonImage);
var btnDoneShared = new Button("Done", SCREEN_WIDTH / 2 - 120, 350, 240, 80, btnDone_Click, ButtonImage);
var btnShare = new Button("Share", SCREEN_WIDTH / 2 - 120, 310, 240, 80, btnShare_Click, ButtonImage);
var btnLookAtMe = new ImgButton("", SCREEN_WIDTH - 260, 20, 240, 80, btnLookAtMe_Click, LookAtMeButtonImage);
var btnGo = new Button("GO", SCREEN_WIDTH - 160, SCREEN_HEIGHT - 140, 140, 120, btnGo_Click);
var btnBoxTool = new ImgButton("", SCREEN_WIDTH - 160, 20, 140, 140, btnBoxTool_Click, BoxToolButtonImage);
var btnEraseTool = new ImgButton("", SCREEN_WIDTH - 160, 180, 140, 140, btnEraseTool_Click, EraseToolButtonImage);
var btnUndo = new ImgButton("", SCREEN_WIDTH - 160, 340, 60, 60, Undo, UndoButtonImage);
var btnRedo = new ImgButton("", SCREEN_WIDTH - 80, 340, 60, 60, Redo, RedoButtonImage);
var btnClear = new ImgButton("", SCREEN_WIDTH - 160, 420, 140, 60, btnClear_Click, ClearButtonImage);
var btnFlip = new ImgButton("", SCREEN_WIDTH - 202, 15, 30, 50, btnFlip_Click, FlipButtonImage);
var btnLevel1 = new ImgButton("", 52, 185, 280, 175, btnLevel1_Click, Level1Image);
var btnLevel2 = new ImgButton("", 372, 185, 280, 175, btnLevel2_Click, Level2Image);
var btnLevel3 = new ImgButton("", 692, 185, 280, 175, btnLevel3_Click, Level3Image);
var btnLevel4 = new ImgButton("", 52, 405, 280, 175, btnLevel4_Click, Level4Image);
var btnLevel5 = new ImgButton("", 372, 405, 280, 175, btnLevel5_Click, Level5Image);
var btnLevel6 = new ImgButton("", 692, 405, 280, 175, btnLevel6_Click, Level6Image);

function btnBegin_Click()
{
	//TODO:fix this please
	if(CheckGame())
	{
		LoadGame();
		ChangeMenu(Menus.LevelSelect);
	}
	else
	{
		ChangeMenu(Menus.Signup);
	}
}

function btnLookAtMe_Click()
{
	LoadAllPosts();
	ToggleSite();
}

function btnLevel1_Click()
{
	ChangeMenu(Menus.None);
	boxes = [];
	Level = 1;
	LoadLevel();
}

function btnLevel2_Click()
{
	ChangeMenu(Menus.None);
	boxes = [];
	Level = 2;
	LoadLevel();
}

function btnLevel3_Click()
{
	ChangeMenu(Menus.None);
	boxes = [];
	Level = 3;
	LoadLevel();
}

function btnLevel4_Click()
{
	ChangeMenu(Menus.None);
	boxes = [];
	Level = 4;
	LoadLevel();
}

function btnLevel5_Click()
{
	ChangeMenu(Menus.None);
	boxes = [];
	Level = 5;
	LoadLevel();
}

function btnLevel6_Click()
{
	ChangeMenu(Menus.None);
	boxes = [];
	Level = 6;
	LoadLevel();
}

function btnGo_Click()
{
	AddBoxes();
	ballcollisions = [];
	balltopspeed = 0;
	anytopspeed = 0;
	EditMode = false;
	Controls = [];
}

function btnDone_Click()
{
	redostack = [];
	undostack = [];
	EditTool = Tools.Box;
	ChangeMenu(Menus.LevelSelect);
}

function btnShare_Click()
{
	redostack = [];
	undostack = [];
	EditTool = Tools.Box;
	SaveReplay();
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
    Bodies = Matter.Bodies,
	Vertices = Matter.Vertices;

// create an engine
var engine = Engine.create({enableSleeping:true});

Matter.Events.on(engine, "collisionStart", trackCollisions);

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

var replayengine = null;
var replayrender = null;

// create two boxes and a ground
//var boxA = Bodies.rectangle(b.x, b.y, 60, 60, {render:{fillStyle:"#666", strokeStyle:"#000"}, chamfer:{radius:10}, friction:0.08, frictionAir:0, frictionStatic:0.3, restitution:0.2});
var ball = Bodies.circle(200, 549, 30, {render:{fillStyle:"#f00", strokeStyle:"000"}, friction:0.01, frictionAir:0, frictionStatic:0.2, restitution:0.3});
var reball = null;
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
	if(ButtonImage.ready && LookAtMeButtonImage.ready && DialogImage.ready && OutlineImage.ready && ToolboxImage.ready && BoxToolButtonImage.ready && EraseToolButtonImage.ready && CheckMarkImage.ready && UndoButtonImage.ready && RedoButtonImage.ready && ClearButtonImage.ready && FlipButtonImage.ready && PlayButtonImage.ready && ReplayButtonImage.ready && Level1Image.ready && Level2Image.ready && Level3Image.ready && Level4Image.ready && Level5Image.ready && Level6Image.ready) //load assets
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
	else if(menu == Menus.Signup)
	{
		var form = document.createElement("div");
		form.id = "usernameform";
		form.style.display = "block";
		form.style.margin = "0 auto";
		form.style.marginTop = "-" + SCREEN_HEIGHT + "px";
		form.style.width = SCREEN_WIDTH + "px";
		form.style.height = SCREEN_HEIGHT + "px";
		form.style.position = "relative";
		document.body.appendChild(form);
		
		var prompt = document.createElement("p");
		prompt.id = "prompt";
		prompt.innerHTML = "Please create an account:";
		form.appendChild(prompt);
		
		var txt = document.createElement("input");
		txt.id = "txtUsername";
		txt.placeholder = "Username";
		form.appendChild(txt);
		txt.focus();
		
		var btn = document.createElement("button");
		btn.id = "btnUsername";
		form.appendChild(btn);
		
		btn.addEventListener("click", SubmitUsername);
		
		var err = document.createElement("div");
		err.id = "error";
		form.appendChild(err);
		
	}
	else if(menu == Menus.LevelSelect)
	{
		if(Posts.length > 0)
		{
			Controls.push(btnLookAtMe);
		}
		Controls.push(btnLevel1);
		Controls.push(btnLevel2);
		Controls.push(btnLevel3);
		Controls.push(btnLevel4);
		Controls.push(btnLevel5);
		Controls.push(btnLevel6);
	}
	else if(menu == Menus.Victory)
	{
		Controls.push(btnShare);
		Controls.push(btnDone);
	}
	else if(menu == Menus.VictoryShared)
	{
		Controls.push(btnDoneShared);
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

function SubmitUsername()
{
	var uname = document.getElementById("txtUsername").value;
	
	if(uname == "")
	{
		username = "Username";
		document.getElementById("usernameform").remove();
		ChangeMenu(Menus.LevelSelect);
	}
	else if(/^[a-zA-Z0-9_]+$/.test(uname))
	{
		username = uname;
		document.getElementById("usernameform").remove();
		ChangeMenu(Menus.LevelSelect);
	}
	else
	{
		document.getElementById("error").innerHTML = "<p>Please use only alphanumeric characters and _underscores_.</p>";
	}
}

function drawScreen()
{
	if(Toppleblox())
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
	else if(singlepost)
	{
		if(replayrender !== null)
		{
			if(Replaying)
			{
				Engine.update(replayengine, 16.666);
				
				if(reball.position.y > SCREEN_HEIGHT + 50)
				{
					replayfinished = true;
					Replaying = false;
				}
				else
				{
					var sleepcount = 0;
					var bodies = Matter.Composite.allBodies(replayengine.world);
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
						replayfinished = true;
						Replaying = false;
					}
				}
			}
			Render.world(replayrender);
			if(!Replaying)
			{
				var replaycanvas = document.getElementById("replaycanvas");
				var rs = replaycanvas.getContext("2d");
				rs.fillStyle = "rgba(0, 0, 0, 0.5)";
				rs.fillRect(0, 0, replaycanvas.width, replaycanvas.height);
				if(replayfinished)
				{
					rs.drawImage(ReplayButtonImage, replaycanvas.width / 2 - 30, replaycanvas.height / 2 - 30);
				}
				else
				{
					rs.drawImage(PlayButtonImage, replaycanvas.width / 2 - 30, replaycanvas.height / 2 - 30);
				}
			}
		}
	}
}

function drawMenu()
{
	if(MenuID == Menus.Main)
	{
		FillWrapText("Toppleblox", 80, "center", SCREEN_WIDTH, SCREEN_WIDTH / 2, 180);
	}
	else if(MenuID == Menus.LevelSelect)
	{
		FillWrapText("Select a Level", 60, "center", SCREEN_WIDTH, SCREEN_WIDTH / 2, 110);
	}
	else if(MenuID == Menus.Victory)
	{
		Render.world(render);
		screen.fillStyle = "rgba(255, 255, 255, 0.5)";
		screen.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
		screen.drawImage(DialogImage, SCREEN_WIDTH / 2 - 200, SCREEN_HEIGHT / 2 - 200);
		
		FillWrapText("You Win!", 60, "center", 400, SCREEN_WIDTH / 2, 220);
		FillWrapText("Share your replay on LookAtMe!", 20, "center", 400, SCREEN_WIDTH / 2, 275);
	}
	else if(MenuID == Menus.VictoryShared)
	{
		Render.world(render);
		screen.fillStyle = "rgba(255, 255, 255, 0.5)";
		screen.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
		drawDialog(SCREEN_WIDTH / 2 - 200, SCREEN_HEIGHT / 2 - 150, 400, 300);
		
		FillWrapText("You Win!", 60, "center", 400, SCREEN_WIDTH / 2, 270);
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
		
		if(EditTool == Tools.Box && MouseDown)
		{
			if(validboxoutline)
			{
				screen.drawImage(OutlineImage, LastX - 30, LastY - 30);
			}
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
			
			//track ball speed
			if(bodies[i].label == "ball")
			{
				balltopspeed = Math.max(balltopspeed, bodies[i].speed);
			}
			
			anytopspeed = Math.max(anytopspeed, bodies[i].speed);
		}
		
		if(sleepcount == bodies.length)
		{
			LoadLevel();
		}
	}
}

function trackCollisions(e)
{
	if(engine.timing.timestamp > 50) //assures we're not counting until a few steps into the simulation
	{
		for(var i = 0; i < e.pairs.length; i++)
		{
			var pair = e.pairs[i];
			if(pair.bodyA.label == "ball")
			{
				if(pair.bodyB.label.substr(0, 3) == "box")
				{
					if(ballcollisions.indexOf(pair.bodyB.label) < 0)
					{
						ballcollisions.push(pair.bodyB.label);
					}
				}
			}
			else if(pair.bodyB.label == "ball")
			{
				if(pair.bodyA.label.substr(0, 3) == "box")
				{
					if(ballcollisions.indexOf(pair.bodyA.label) < 0)
					{
						ballcollisions.push(pair.bodyA.label);
					}
				}
			}
		}
	}
}

function LoadLevel()
{
	if(Level == 1)
	{
		ball = Bodies.circle(200, 549, 30, {label:"ball", render:{fillStyle:"#f00", strokeStyle:"000"}, friction:0.01, frictionAir:0, frictionStatic:0.2, restitution:0.3});
		var ground = Bodies.rectangle(400, 610, 1024, 60, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		var wall = Bodies.rectangle(0, SCREEN_HEIGHT / 2 - 60, 100, SCREEN_HEIGHT, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});

		//create new world and add all of the bodies to the world
		engine.world = World.create();
		World.add(engine.world, [ball, ground, wall]);
	}
	else if(Level == 2)
	{
		ball = Bodies.circle(200, 549, 30, {label:"ball", render:{fillStyle:"#f00", strokeStyle:"000"}, friction:0.01, frictionAir:0, frictionStatic:0.2, restitution:0.3});
		var ground = Bodies.rectangle(400, 610, 1024, 60, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		var wall = Bodies.rectangle(0, SCREEN_HEIGHT / 2 - 60, 100, SCREEN_HEIGHT, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		var rampvertices = Vertices.fromPath("0 0 50 0 50 -40");
		var ramp = Bodies.fromVertices(895, 566.5, rampvertices, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});

		//create new world and add all of the bodies to the world
		engine.world = World.create();
		World.add(engine.world, [ball, ground, wall, ramp]);
	}
	else if(Level == 3)
	{
		ball = Bodies.circle(510, 250, 30, {label:"ball", render:{fillStyle:"#f00", strokeStyle:"000"}, friction:0.01, frictionAir:0, frictionStatic:0.2, restitution:0.3});
		var wall1 = Bodies.rectangle(30, 280, 60, 600, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		var wall2 = Bodies.rectangle(994, 280, 60, 600, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		var floor1 = Bodies.rectangle(200, 610, 400, 60, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		var floor2 = Bodies.rectangle(824, 610, 400, 60, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		var platform = Bodies.rectangle(510, 310, 400, 60, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		
		//create new world and add all of the bodies to the world
		engine.world = World.create();
		World.add(engine.world, [ball, wall1, wall2, floor1, floor2, platform]);
	}
	else if(Level == 4)
	{
		ball = Bodies.circle(150, 290, 30, {label:"ball", render:{fillStyle:"#f00", strokeStyle:"000"}, friction:0.01, frictionAir:0, frictionStatic:0.2, restitution:0.3});
		var wall = Bodies.rectangle(30, 240, 60, 800, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		var starter = Bodies.rectangle(120, 450, 120, 260, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		var floor = Bodies.rectangle(510, 610, 900, 60, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		var obstacle = Bodies.rectangle(550, 530, 100, 100, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		
		//create new world and add all of the bodies to the world
		engine.world = World.create();
		World.add(engine.world, [ball, wall, starter, floor, obstacle]);
	}
	else if(Level == 5)
	{
		ball = Bodies.circle(400, 130, 30, {label:"ball", render:{fillStyle:"#f00", strokeStyle:"000"}, friction:0.01, frictionAir:0, frictionStatic:0.2, restitution:0.3});
		var wall1 = Bodies.rectangle(30, 290, 60, 620, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		var wall2 = Bodies.rectangle(1030, 290, 60, 620, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		var floor1 = Bodies.rectangle(300, 630, 600, 60, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		var floor2 = Bodies.rectangle(910, 630, 300, 60, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		var stopper = Bodies.rectangle(790, 530, 60, 140, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		var platform = Bodies.rectangle(400, 190, 120, 60, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		var rampvertices = Vertices.fromPath("0 0 220 160 220 220 0 60");
		var ramp = Bodies.fromVertices(570, 270, rampvertices, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		
		//create new world and add all of the bodies to the world
		engine.world = World.create();
		World.add(engine.world, [ball, wall1, wall2, floor1, floor2, stopper, platform, ramp]);
	}
	else if(Level == 6)
	{
		ball = Bodies.circle(512, 550, 30, {label:"ball", render:{fillStyle:"#f00", strokeStyle:"000"}, friction:0.01, frictionAir:0, frictionStatic:0.2, restitution:0.3});
		var floor = Bodies.rectangle(512, 610, 900, 60, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		var block1 = Bodies.rectangle(112, 530, 100, 100, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		var ramp1vertices = Vertices.fromPath("0 0 100 100 0 100");
		var ramp1 = Bodies.fromVertices(196, 547, ramp1vertices, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		var block2 = Bodies.rectangle(912, 530, 100, 100, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		var ramp2vertices = Vertices.fromPath("100 0 100 100 0 100");
		var ramp2 = Bodies.fromVertices(828, 547, ramp2vertices, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		
		//create new world and add all of the bodies to the world
		engine.world = World.create();
		World.add(engine.world, [ball, floor, block1, ramp1, block2, ramp2]);
	}
	
	EditMode = true;
	Controls.push(btnGo);
	Controls.push(btnBoxTool);
	Controls.push(btnEraseTool);
	Controls.push(btnUndo);
	Controls.push(btnRedo);
	Controls.push(btnClear);
	Controls.push(btnFlip);
}

function SaveReplay()
{
	var r = new Replay();
	r.level = Level;
	r.boxes = boxes.slice(0);
	
	var p = new Post();
	p.user = username;
	p.replay = r;
	
	var d = new Date();
	p.timestamp = d.getTime();
	
	//evaluate replay "quality" based on some pretty vague metrics
	var tsrating = (balltopspeed > 15) ? balltopspeed / 25 : balltopspeed / 50;
	var gsrating = (anytopspeed == balltopspeed) ? balltopspeed / 20 : anytopspeed / 300;
	var hitrating = ballcollisions.length / 30;
	
	var discard = Math.min(tsrating, gsrating, hitrating);
	var avgrating = (tsrating + gsrating + hitrating - discard) / 2;
	p.rating = Math.min(avgrating, 0.99);
	
	curPost = Posts.length;
	Posts.push(p);
	
	LoadPost();
	
	ChangeMenu(Menus.VictoryShared);
	
	ToggleSite();
}

function LoadPost()
{
	window.scrollTo(0, 0);
	clearSocialContent();
	var r = Posts[curPost].replay;
	singlepost = true;
	Replaying = false;
	replayfinished = false;
	
	var pc = document.getElementById("postcontent");
	pc.innerHTML = "<p>Look what I did in level " + r.level + " of #Toppleblox:</p>";
	var rc = document.createElement("canvas");
	rc.style.marginLeft = "20px";
	rc.style.border = "1px solid black";
	rc.id = "replaycanvas";
	pc.appendChild(rc);
	
	var mybounds = Matter.Bounds.create(Vertices.fromPath("0 0 1024 0 1024 640 0 640"));
	replayengine = Engine.create({enableSleeping:true});
	
	replayrender = Render.create({
    canvas: rc,
    engine: replayengine,
	bounds: mybounds,
	options: {
		width:440,
		height:275,
		hasBounds:true,
		wireframes:false,
		background:"#9af",
		showSleeping:false
	}
	});
	
	LoadReplayForPost();
	
	rc.addEventListener("click", ToggleReplay);
	
	//post header
	var ph = document.createElement("div");
	ph.id = "postcaption";
	ph.className = "postinfo";
	var datetime = new Date(Posts[curPost].timestamp);
	ph.innerHTML = username + " - " + datetime.toLocaleString();
	pc.insertBefore(ph, pc.childNodes[0]);
	
	var db = document.createElement("button");
	db.id = "btnDelete";
	db.innerHTML = "<img src='btnx.svg' />";
	ph.insertBefore(db, ph.childNodes[0]);
	db.addEventListener("click", TogglePostDeleteConfirm);
	
	//post footer
	updateViews();
	var viewsummary = document.createElement("p");
	viewsummary.className = "summary";
	if(Posts[curPost].viewcount == 0)
	{
		viewsummary.innerHTML = "This post has no views yet.";
	}
	else
	{
		viewsummary.innerHTML = "" + Posts[curPost].viewcount + " people have looked at this. " + Posts[curPost].likecount + " liked what they saw.";
	}
	pc.appendChild(viewsummary);
	
	var list = Posts[curPost].likes;
	var ul = document.getElementById("userlist");
	for(var i = 0; i < list.length; i++)
	{
		var li = document.createElement("li");
		li.innerHTML = list[i] + " likes this";
		ul.insertBefore(li, ul.childNodes[0]);
	}
	
	if(Posts[curPost].likecount > MAX_LIKES)
	{
		var post = document.getElementById("post");
		var more = document.createElement("p");
		more.className = "more";
		more.innerHTML = "And " + (Posts[curPost].likecount - MAX_LIKES) + " more...";
		post.appendChild(more);
	}
	
}

function TogglePostDeleteConfirm()
{
	var ph = document.getElementById("postcaption");
	
	if(ph.className == "postinfo")
	{
		ph.className = "confirm";
		ph.innerHTML = "Are you sure you want to delete this post?";
		var cb = document.createElement("button");
		cb.innerHTML = "Cancel";
		var db = document.createElement("button");
		db.innerHTML = "Delete";
		ph.appendChild(cb);
		ph.appendChild(db);
		
		cb.addEventListener("click", TogglePostDeleteConfirm);
		db.addEventListener("click", DeletePost);
	}
	else if(ph.className == "confirm")
	{
		var pc = document.getElementById("postcontent");
		ph.className = "postinfo";
		var datetime = new Date(Posts[curPost].timestamp);
		ph.innerHTML = username + " - " + datetime.toLocaleString();
		pc.insertBefore(ph, pc.childNodes[0]);
		
		var db = document.createElement("button");
		db.id = "btnDelete";
		db.innerHTML = "<img src='btnx.svg' />";
		ph.insertBefore(db, ph.childNodes[0]);
		db.addEventListener("click", TogglePostDeleteConfirm);
	}
}

function DeletePost()
{
	Posts.splice(curPost, 1);
	SaveGame();
	LoadAllPosts();
}

function updateViews(index)
{
	if(typeof(index) !== "undefined")
	{
		curPost = index;
	}
	var post = Posts[curPost];
	var now = new Date();
	var elapsed = now.getTime() - post.timestamp;
	if(elapsed > 60000 && elapsed < 86400000) //no views until a minute in
	{
		//compute how many views this replay should get
		var expectedviews = 0;
		if(curPost > 3)
		{
			expectedviews = Posts[curPost - 1].likecount + Posts[curPost - 2].likecount + Posts[curPost - 3].likecount + Posts[curPost - 4].likecount + Math.round(Math.random() * 200);
		}
		else if(curPost == 3)
		{
			expectedviews = Posts[curPost - 1].likecount + Posts[curPost - 2].likecount + Posts[curPost - 3].likecount + Math.round(Math.random() * 200);
		}
		else if(curPost == 2)
		{
			expectedviews = Posts[curPost - 1].likecount + Posts[curPost - 2].likecount + Math.round(Math.random() * 200);
		}
		else if(curPost == 1)
		{
			expectedviews = Posts[curPost - 1].likecount + Math.round(Math.random() * 200);
		}
		else
		{
			expectedviews = Math.round(Math.random() * 200 + 10);
		}
		
		var lifepercent = elapsed / 86400000;
		var viewsneeded = Math.round(expectedviews * lifepercent) - post.viewcount;
		if(viewsneeded > 0)
		{
			post.viewcount += viewsneeded + Math.round(Math.random() * 30 + 10);
		}
		
		//compute how many likes it should get
		var expectedlikes = Math.round(post.viewcount * post.rating);
		var likesneeded = expectedlikes - post.likecount;
		if(likesneeded > 0)
		{
			for(var i = 0; i < likesneeded; i++)
			{
				post.likes.push(generateUsername());
				if(post.likes.length > MAX_LIKES)
				{
					post.likes.shift();
				}
				post.likecount++;
			}
		}
	}
	else if(elapsed > 86400000) //traffic slows down after a day
	{
		var expectedviews = 0;
		if(curPost > 3)
		{
			expectedviews = Posts[curPost - 1].likecount + Posts[curPost - 2].likecount + Posts[curPost - 3].likecount + Posts[curPost - 4].likecount;
		}
		else if(curPost == 3)
		{
			expectedviews = Posts[curPost - 1].likecount + Posts[curPost - 2].likecount + Posts[curPost - 3].likecount;
		}
		else if(curPost == 2)
		{
			expectedviews = Posts[curPost - 1].likecount + Posts[curPost - 2].likecount;
		}
		else if(curPost == 1)
		{
			expectedviews = Posts[curPost - 1].likecount;
		}
		else
		{
			expectedviews = 50 + Math.round(Math.random() * 30);
		}
		
		//make sure the views get updated on old posts even if you haven't checked
		if(post.viewcount < expectedviews)
		{
			post.viewcount = expectedviews + Math.round(Math.random() * 20);
		}
		
		var expectedlikes = Math.round(post.viewcount * post.rating);
		if(post.likecount < expectedlikes)
		{
			//Due to the random elements, it might be possible for a post to get fewer likes than intended. If that happens, this should fix it.
			var deficit = expectedlikes - post.likecount;
			for(var i = 0; i < deficit; i++)
			{
				post.likes.push(generateUsername());
				if(post.likes.length > MAX_LIKES)
				{
					post.likes.shift();
				}
				post.likecount++;
			}
		}
	}
}

function LoadReplayForPost()
{
	var r = Posts[curPost].replay;
	if(r.level == 1)
	{
		reball = Bodies.circle(200, 549, 30, {render:{fillStyle:"#f00", strokeStyle:"000"}, friction:0.01, frictionAir:0, frictionStatic:0.2, restitution:0.3});
		var ground = Bodies.rectangle(400, 610, 1024, 60, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		var wall = Bodies.rectangle(0, SCREEN_HEIGHT / 2 - 60, 100, SCREEN_HEIGHT, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});

		//create new world and add all of the bodies to the world
		replayengine.world = World.create();
		World.add(replayengine.world, [reball, ground, wall]);
		AddReplayBoxes(r.boxes);
	}
	else if(r.level == 2)
	{
		reball = Bodies.circle(200, 549, 30, {render:{fillStyle:"#f00", strokeStyle:"000"}, friction:0.01, frictionAir:0, frictionStatic:0.2, restitution:0.3});
		var ground = Bodies.rectangle(400, 610, 1024, 60, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		var wall = Bodies.rectangle(0, SCREEN_HEIGHT / 2 - 60, 100, SCREEN_HEIGHT, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		var rampvertices = Vertices.fromPath("0 0 50 0 50 -40");
		var ramp = Bodies.fromVertices(895, 566.5, rampvertices, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});

		//create new world and add all of the bodies to the world
		replayengine.world = World.create();
		World.add(replayengine.world, [reball, ground, wall, ramp]);
		AddReplayBoxes(r.boxes);
	}
	else if(r.level == 3)
	{
		reball = Bodies.circle(510, 250, 30, {render:{fillStyle:"#f00", strokeStyle:"000"}, friction:0.01, frictionAir:0, frictionStatic:0.2, restitution:0.3});
		var wall1 = Bodies.rectangle(30, 280, 60, 600, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		var wall2 = Bodies.rectangle(994, 280, 60, 600, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		var floor1 = Bodies.rectangle(200, 610, 400, 60, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		var floor2 = Bodies.rectangle(824, 610, 400, 60, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		var platform = Bodies.rectangle(510, 310, 400, 60, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		
		//create new world and add all of the bodies to the world
		replayengine.world = World.create();
		World.add(replayengine.world, [reball, wall1, wall2, floor1, floor2, platform]);
		AddReplayBoxes(r.boxes);
	}
	else if(r.level == 4)
	{
		reball = Bodies.circle(150, 290, 30, {render:{fillStyle:"#f00", strokeStyle:"000"}, friction:0.01, frictionAir:0, frictionStatic:0.2, restitution:0.3});
		var wall = Bodies.rectangle(30, 240, 60, 800, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		var starter = Bodies.rectangle(120, 450, 120, 260, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		var floor = Bodies.rectangle(510, 610, 900, 60, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		var obstacle = Bodies.rectangle(550, 530, 100, 100, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		
		//create new world and add all of the bodies to the world
		replayengine.world = World.create();
		World.add(replayengine.world, [reball, wall, starter, floor, obstacle]);
		AddReplayBoxes(r.boxes);
	}
	else if(r.level == 5)
	{
		reball = Bodies.circle(400, 130, 30, {label:"ball", render:{fillStyle:"#f00", strokeStyle:"000"}, friction:0.01, frictionAir:0, frictionStatic:0.2, restitution:0.3});
		var wall1 = Bodies.rectangle(30, 290, 60, 620, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		var wall2 = Bodies.rectangle(1030, 290, 60, 620, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		var floor1 = Bodies.rectangle(300, 630, 600, 60, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		var floor2 = Bodies.rectangle(910, 630, 300, 60, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		var stopper = Bodies.rectangle(790, 530, 60, 140, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		var platform = Bodies.rectangle(400, 190, 120, 60, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		var rampvertices = Vertices.fromPath("0 0 220 160 220 220 0 60");
		var ramp = Bodies.fromVertices(570, 270, rampvertices, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		
		//create new world and add all of the bodies to the world
		replayengine.world = World.create();
		World.add(replayengine.world, [reball, wall1, wall2, floor1, floor2, stopper, platform, ramp]);
		AddReplayBoxes(r.boxes);
	}
	else if(r.level == 6)
	{
		reball = Bodies.circle(512, 550, 30, {label:"ball", render:{fillStyle:"#f00", strokeStyle:"000"}, friction:0.01, frictionAir:0, frictionStatic:0.2, restitution:0.3});
		var floor = Bodies.rectangle(512, 610, 900, 60, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		var block1 = Bodies.rectangle(112, 530, 100, 100, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		var ramp1vertices = Vertices.fromPath("0 0 100 100 0 100");
		var ramp1 = Bodies.fromVertices(196, 547, ramp1vertices, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		var block2 = Bodies.rectangle(912, 530, 100, 100, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		var ramp2vertices = Vertices.fromPath("100 0 100 100 0 100");
		var ramp2 = Bodies.fromVertices(828, 547, ramp2vertices, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		
		//create new world and add all of the bodies to the world
		replayengine.world = World.create();
		World.add(replayengine.world, [reball, floor, block1, ramp1, block2, ramp2]);
		AddReplayBoxes(r.boxes);
	}
}

function ToggleReplay()
{
	if(!Replaying && replayfinished)
	{
		replayfinished = false;
		LoadReplayForPost();
	}
	Replaying = !Replaying;
}

function Toppleblox()
{
	if(document.body.className == "toppleblox")
	{
		return true;
	}
	else
	{
		return false;
	}
}

function ToggleSite()
{
	//this won't often matter, but it gives me peace of mind
	for(var c = 0; c < Controls.length; c++)
	{
		Controls[c].state = ButtonState.UP;
	}
	
	if(Toppleblox())
	{
		document.title = "LookAtMe";
		document.body.className = "lookatme";
		document.getElementById("toppleblox").style.display = "none";
		document.getElementById("lookatme").style.display = "inline";
		
		var un = document.getElementById("username");
		var width = un.offsetWidth - 100;
		
		var size = 26;
		screen.font = size + "px Arial, sans-serif";
		while(screen.measureText(username).width > width)
		{
			size--;
			screen.font = size + "px Arial, sans-serif";
		}
		
		un.innerHTML = username
		un.style.fontSize = size + "px";
	}
	else
	{
		document.title = "Toppleblox";
		document.body.className = "toppleblox";
		document.getElementById("lookatme").style.display = "none";
		document.getElementById("toppleblox").style.display = "inline";
		replayfinished = false;
	}
	
	SaveGame();
	return false; //used to prevent buttons
}

function LoadAllPosts()
{
	window.scrollTo(0, 0);
	singlepost = false;
	
	//clear out the main content area
	clearSocialContent();
	
	var headtext = document.createElement("p");
	headtext.className = "postcount";
	if(Posts.length == 1)
	{
		headtext.innerHTML = username + " has 1 post:";
	}
	else
	{
		headtext.innerHTML = username + " has " + Posts.length + " posts:";
	}
	var theguy = document.getElementById("post");
	theguy.insertBefore(headtext, theguy.childNodes[0]);
	
	for(var i = Posts.length - 1; i >= 0; i--)
	{
		var post = Posts[i];
		
		//deal with thumbnail
		if(post.thumbnail === null)
		{
			post.thumbnail = GenerateThumbnail(post.replay);
		}
		
		var d = new Date(post.timestamp);
		var time = d.toLocaleString().replace(", ", "<br />");
		var list = document.getElementById("postlist");
		var li = document.createElement("li");
		li.innerHTML = "<a id='viewpost" + i + "' href='viewpost?id=" + i + "' onclick='return false;'><div class='thumbnail'><img src='" + post.thumbnail.src + "' /></div><div class='posttext'>Look what I did in level " + post.replay.level + " of #Toppleblox:</div><span class='timestamp'>" + time + "</span></a>";
		list.appendChild(li);
	}
	
	for(var i = 0; i < Posts.length; i++)
	{
		updateViews(i);
		var a = document.getElementById("viewpost" + i);
		a.addEventListener("click", viewpostCallbackHandler(i));
	}
}

function viewpostCallbackHandler(index)
{
	return function(event){LoadThisPost(index);};
}

function LoadThisPost(i)
{
	curPost = i;
	LoadPost();
}

function clearSocialContent()
{
	//clears out all current content on the LookAtMe portion of the site, so that new content can be loaded in its place
	document.getElementById("post").innerHTML = "<div id='postcontent'></div><ul id='userlist'></ul><ul id='postlist'></ul>";
}

function GenerateThumbnail(r)
{
	// create an engine
	var thumbnailengine = Engine.create({enableSleeping:true});
	
	var mybounds = Matter.Bounds.create(Vertices.fromPath("0 0 1024 0 1024 640 0 640"));
	
	var thumbnailcanvas = document.createElement("canvas");

	// create a renderer
	var thumbnailrender = Render.create({
		canvas: thumbnailcanvas,
		engine: thumbnailengine,
		bounds: mybounds,
		options: {
			width:80,
			height:50,
			wireframes:false,
			background:"#9af",
			showSleeping:false,
			hasBounds:true
		}
	});
	
	if(r.level == 1)
	{
		var myball = Bodies.circle(200, 549, 30, {render:{fillStyle:"#f00", strokeStyle:"000"}, friction:0.01, frictionAir:0, frictionStatic:0.2, restitution:0.3});
		var ground = Bodies.rectangle(400, 610, 1024, 60, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		var wall = Bodies.rectangle(0, SCREEN_HEIGHT / 2 - 60, 100, SCREEN_HEIGHT, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});

		//create new world and add all of the bodies to the world
		thumbnailengine.world = World.create();
		World.add(thumbnailengine.world, [myball, ground, wall]);
		AddThumbnailBoxes(thumbnailengine, r.boxes);
		
		Render.world(thumbnailrender);
		var img = new Image();
		img.src = thumbnailcanvas.toDataURL();
		return img;
	}
	else if(r.level == 2)
	{
		var myball = Bodies.circle(200, 549, 30, {render:{fillStyle:"#f00", strokeStyle:"000"}, friction:0.01, frictionAir:0, frictionStatic:0.2, restitution:0.3});
		var ground = Bodies.rectangle(400, 610, 1024, 60, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		var wall = Bodies.rectangle(0, SCREEN_HEIGHT / 2 - 60, 100, SCREEN_HEIGHT, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		var rampvertices = Vertices.fromPath("0 0 50 0 50 -40");
		var ramp = Bodies.fromVertices(895, 566.5, rampvertices, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});

		//create new world and add all of the bodies to the world
		thumbnailengine.world = World.create();
		World.add(thumbnailengine.world, [myball, ground, wall, ramp]);
		AddThumbnailBoxes(thumbnailengine, r.boxes);
		
		Render.world(thumbnailrender);
		var img = new Image();
		img.src = thumbnailcanvas.toDataURL();
		return img;
	}
	else if(r.level == 3)
	{
		var myball = Bodies.circle(510, 250, 30, {render:{fillStyle:"#f00", strokeStyle:"000"}, friction:0.01, frictionAir:0, frictionStatic:0.2, restitution:0.3});
		var wall1 = Bodies.rectangle(30, 280, 60, 600, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		var wall2 = Bodies.rectangle(994, 280, 60, 600, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		var floor1 = Bodies.rectangle(200, 610, 400, 60, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		var floor2 = Bodies.rectangle(824, 610, 400, 60, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		var platform = Bodies.rectangle(510, 310, 400, 60, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		
		//create new world and add all of the bodies to the world
		thumbnailengine.world = World.create();
		World.add(thumbnailengine.world, [myball, wall1, wall2, floor1, floor2, platform]);
		AddThumbnailBoxes(thumbnailengine, r.boxes);
		
		Render.world(thumbnailrender);
		var img = new Image();
		img.src = thumbnailcanvas.toDataURL();
		return img;
	}
	else if(r.level == 4)
	{
		var myball = Bodies.circle(150, 290, 30, {render:{fillStyle:"#f00", strokeStyle:"000"}, friction:0.01, frictionAir:0, frictionStatic:0.2, restitution:0.3});
		var wall = Bodies.rectangle(30, 240, 60, 800, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		var starter = Bodies.rectangle(120, 450, 120, 260, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		var floor = Bodies.rectangle(510, 610, 900, 60, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		var obstacle = Bodies.rectangle(550, 530, 100, 100, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		
		//create new world and add all of the bodies to the world
		thumbnailengine.world = World.create();
		World.add(thumbnailengine.world, [myball, wall, starter, floor, obstacle]);
		AddThumbnailBoxes(thumbnailengine, r.boxes);
		
		Render.world(thumbnailrender);
		var img = new Image();
		img.src = thumbnailcanvas.toDataURL();
		return img;
	}
	else if(r.level == 5)
	{
		var myball = Bodies.circle(400, 130, 30, {render:{fillStyle:"#f00", strokeStyle:"000"}, friction:0.01, frictionAir:0, frictionStatic:0.2, restitution:0.3});
		var wall1 = Bodies.rectangle(30, 290, 60, 620, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		var wall2 = Bodies.rectangle(1030, 290, 60, 620, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		var floor1 = Bodies.rectangle(300, 630, 600, 60, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		var floor2 = Bodies.rectangle(910, 630, 300, 60, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		var stopper = Bodies.rectangle(790, 530, 60, 140, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		var platform = Bodies.rectangle(400, 190, 120, 60, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		var rampvertices = Vertices.fromPath("0 0 220 160 220 220 0 60");
		var ramp = Bodies.fromVertices(570, 270, rampvertices, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		
		//create new world and add all of the bodies to the world
		thumbnailengine.world = World.create();
		World.add(thumbnailengine.world, [myball, wall1, wall2, floor1, floor2, stopper, platform, ramp]);
		AddThumbnailBoxes(thumbnailengine, r.boxes);
		
		Render.world(thumbnailrender);
		var img = new Image();
		img.src = thumbnailcanvas.toDataURL();
		return img;
	}
	else if(r.level == 6)
	{
		var myball = Bodies.circle(512, 550, 30, {render:{fillStyle:"#f00", strokeStyle:"000"}, friction:0.01, frictionAir:0, frictionStatic:0.2, restitution:0.3});
		var floor = Bodies.rectangle(512, 610, 900, 60, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		var block1 = Bodies.rectangle(112, 530, 100, 100, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		var ramp1vertices = Vertices.fromPath("0 0 100 100 0 100");
		var ramp1 = Bodies.fromVertices(196, 547, ramp1vertices, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		var block2 = Bodies.rectangle(912, 530, 100, 100, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		var ramp2vertices = Vertices.fromPath("100 0 100 100 0 100");
		var ramp2 = Bodies.fromVertices(828, 547, ramp2vertices, {isStatic:true, render:{fillStyle:"#999", strokeStyle:"#000"}});
		
		//create new world and add all of the bodies to the world
		thumbnailengine.world = World.create();
		World.add(thumbnailengine.world, [myball, floor, block1, ramp1, block2, ramp2]);
		AddThumbnailBoxes(thumbnailengine, r.boxes);
		
		Render.world(thumbnailrender);
		var img = new Image();
		img.src = thumbnailcanvas.toDataURL();
		return img;
	}
}

function AddBoxes()
{
	var bodies = [];
	for(var i = 0; i < boxes.length; i++)
	{
		var b = boxes[i];
		bodies.push(Bodies.rectangle(b.x, b.y, 60, 60, {label:"box" + i, render:{fillStyle:"#666", strokeStyle:"#000"}, chamfer:{radius:10}, friction:0.08, frictionAir:0, frictionStatic:0.3, restitution:0.2}));
	}
	
	World.add(engine.world, bodies);
}

function AddReplayBoxes(rb)
{
	var bodies = [];
	for(var i = 0; i < rb.length; i++)
	{
		var b = rb[i];
		bodies.push(Bodies.rectangle(b.x, b.y, 60, 60, {render:{fillStyle:"#666", strokeStyle:"#000"}, chamfer:{radius:10}, friction:0.08, frictionAir:0, frictionStatic:0.3, restitution:0.2}));
	}
	
	World.add(replayengine.world, bodies);
}

function AddThumbnailBoxes(eng, rb)
{
	var bodies = [];
	for(var i = 0; i < rb.length; i++)
	{
		var b = rb[i];
		bodies.push(Bodies.rectangle(b.x, b.y, 60, 60, {render:{fillStyle:"#666", strokeStyle:"#000"}, chamfer:{radius:10}, friction:0.08, frictionAir:0, frictionStatic:0.3, restitution:0.2}));
	}
	
	World.add(eng.world, bodies);
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

function drawDialog(x, y, w, h)
{
	if(w == 400 && h == 400)
	{
		screen.drawImage(DialogImage, x, y);
	}
	else
	{
		screen.drawImage(DialogImage, 0, 0, 20, 20, x, y, 20, 20); //top left
		screen.drawImage(DialogImage, 20, 0, 1, 20, x + 20, y, w - 40, 20); //top mid
		screen.drawImage(DialogImage, 380, 0, 20, 20, x + w - 20, y, 20, 20); //top right
		screen.drawImage(DialogImage, 0, 20, 20, 1, x, y + 20, 20, h - 40); //mid left
		screen.drawImage(DialogImage, 20, 20, 1, 1, x + 20, y + 20, w - 40, h - 40); //mid mid
		screen.drawImage(DialogImage, 380, 20, 20, 1, x + w - 20, y + 20, 20, h - 40); //mid right
		screen.drawImage(DialogImage, 0, 380, 20, 20, x, y + h - 20, 20, 20); //bottom left
		screen.drawImage(DialogImage, 20, 380, 1, 20, x + 20, y + h - 20, w - 40, 20); //bottom mid
		screen.drawImage(DialogImage, 380, 380, 20, 20, x + w - 20, y + h - 20, 20, 20); //bottom right
	}
}

//level;x:y,x:y,x:y;timestamp;rating;viewcount;likecount;name,name,name~
function SaveGame()
{
	if(typeof(Storage) !== "undefined")
	{
		var savestring = "";
		
		for(var i = 0; i < Posts.length; i++)
		{
			var p = Posts[i];
			
			if(i > 0)
			{
				savestring += "~";
			}
			
			var r = p.replay;
			savestring += r.level + ";";
			for(var j = 0; j < r.boxes.length; j++)
			{
				var xypair = r.boxes[j];
				if(j > 0)
				{
					savestring += ",";
				}
				savestring += xypair.x + ":" + xypair.y;
			}
			savestring += ";";
			
			savestring += p.timestamp + ";";
			savestring += p.rating + ";";
			savestring += p.viewcount + ";";
			savestring += p.likecount + ";";
			
			for(var j = 0; j < p.likes.length; j++)
			{
				if(j > 0)
				{
					savestring += ",";
				}
				savestring += p.likes[j];
			}
		}
		
		localStorage.setItem("LOOKATME_USERNAME", username);
		localStorage.setItem("TOPPLEBLOX_PROGRESS", savestring);
	}
}

//level;x:y,x:y,x:y;timestamp;rating;viewcount;likecount;name,name,name~
function LoadGame()
{
	if(typeof(Storage) !== "undefined")
	{
		username = localStorage.getItem("LOOKATME_USERNAME");
		if(username === null)
		{
			username = "Username";
		}
		
		var savestring = localStorage.getItem("TOPPLEBLOX_PROGRESS");
		if(savestring !== null && savestring != "")
		{
			Posts = [];
			var postarray = savestring.split("~");
			for(var i = 0; i < postarray.length; i++)
			{
				var mypost = new Post();
				var myreplay = new Replay();
				
				var postdata = postarray[i].split(";");
				myreplay.level = parseInt(postdata[0]);
				
				var boxarray = postdata[1].split(",");
				for(var j = 0; j < boxarray.length; j++)
				{
					var bxy = boxarray[j].split(":");
					myreplay.boxes.push(new Point(parseFloat(bxy[0]), parseFloat(bxy[1])));
				}
				mypost.replay = myreplay;
				
				mypost.timestamp = parseInt(postdata[2]);
				mypost.rating = parseFloat(postdata[3]);
				mypost.viewcount = parseInt(postdata[4]);
				mypost.likecount = parseInt(postdata[5]);
				
				var likearray = postdata[6].split(",");
				for(var j = 0; j < likearray.length; j++)
				{
					if(likearray[j] != "")
					{
						mypost.likes.push(likearray[j]);
					}
				}
				
				Posts.push(mypost);
			}
		}
		else
		{
			Posts = [];
		}
	}
}

function EraseGame()
{
	if(typeof(Storage) !== "undefined")
	{
		localStorage.removeItem("LOOKATME_USERNAME");
		localStorage.removeItem("TOPPLEBLOX_PROGRESS");
	}
}

function CheckGame()
{
	if(typeof(Storage) !== "undefined")
	{
		if(localStorage.getItem("LOOKATME_USERNAME") !== null)
		{
			if(localStorage.getItem("LOOKATME_USERNAME") == "")
			{
				return false;
			}
			else
			{
				return true;
			}
		}
		else
		{
			return false;
		}
	}
	else
	{
		return false;
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

window.addEventListener("keydown", function (e) {
	if(e.which == K_ENTER)
	{
		e.preventDefault();
		if(MenuShowing && MenuID == Menus.Signup)
		{
			document.getElementById("btnUsername").click();
		}
	}
});

window.addEventListener("mousemove", function (event) {
	var left = (window.pageXOffset || document.body.scrollLeft) - (document.body.clientLeft || 0);
	var top = (window.pageYOffset || document.body.scrollTop)  - (document.body.clientTop || 0);
	var x = event.clientX - canvas.offsetLeft + left;
	var y = event.clientY - canvas.offsetTop + top;
	LastX = x;
	LastY = y;
	
	if(Toppleblox())
	{
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
	
	if(Toppleblox())
	{
		if(!MenuShowing && EditMode)
		{
			if(EditTool == Tools.Erase)
			{
				erasehack = boxes.slice(0);
				EraseBoxes(x, y);
			}
			else if(EditTool == Tools.Box)
			{
				if((btnGo.x > 20 && x < SCREEN_WIDTH - 200) || (btnGo.x < 50 && x > 200))
				{
					validboxoutline = true;
				}
				else
				{
					validboxoutline = false;
				}
			}
		}
	
		//pick controls
		for(var c = 0; c < Controls.length; c++)
		{
			Controls[c].pick(x, y, EventType.DOWN, MouseDown, MouseDownX, MouseDownY);
		}
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
	
	if(Toppleblox())
	{
		if(!MenuShowing && EditMode)
		{
			if(EditTool == Tools.Box)
			{
				if(validboxoutline)
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

function pinUserbar()
{
	var top = document.documentElement.scrollTop || document.body.scrollTop;
	if(top > 10)
	{
		var ub = document.getElementById("userbar");
		var ut = document.getElementById("usertools");
		ub.style.position = "relative";
		ub.style.top = (top - 10) + "px";
		ut.style.borderRadius = "0 0 10px 10px";
	}
	else
	{
		var ub = document.getElementById("userbar");
		var ut = document.getElementById("usertools");
		ub.style.position = "static";
		ut.style.borderRadius = "10px";
	}
}

window.onscroll = pinUserbar;

function addUsername()
{
	var list = document.getElementById("userlist");
	var li = document.createElement("li");
	li.innerHTML = generateUsername() + " likes this";
	list.insertBefore(li, list.childNodes[0]);
}

function generateUsername()
{
	var first = ["radio", "dark", "ninja", "death", "shadow", "diamond", "crystal", "bad", "good", "fox", "wolf", "rainbow", "butterfly", "cat", "bee", "speed", "leather", "marble", "granite", "wicked", "coffee", "tea", "sushi", "ring", "sonic", "super", "crazy", "electric", "unicorn", "pegasus", "mega", "ultra", "lettuce", "banana", "coconut", "cyclone", "steel", "algebra", "fountain", "cake", "pie", "bug", "rose", "circle", "square", "triangle", "atom", "dandelion", "rabid", "mud", "belt", "white", "poison", "dance", "croquet", "needle", "lace", "ribbon", "puppy", "clover", "sleepy", "thunder", "lightning", "bright", "orange", "meat", "veggie", "oath", "asparagus", "quake", "pi", "liver", "dragon", "shark", "cape", "tau", "ant", "pirate", "glass", "ruby", "laser", "tiara", "widow", "big", "dry", "egg", "lantern", "milk", "engine", "distant", "triumph", "plush", "alicorn", "apple", "wheat", "pear", "pearl", "linux", "night", "quick", "box", "turnip", "black", "squash", "pixel", "elephant", "squid", "whale", "fish", "eagle", "ninja", "ice", "snow", "magic", "fairy", "cupcake", "owl", "math", "nuclear", "lizard", "corn", "phoenix", "disaster", "karate", "fenix", "ballet", "anvil", "stick", "pony", "quantum", "boat", "sad", "mint", "happy", "dragon", "raven", "crow", "fedora", "bubble", "window", "mad", "mummy", "angry", "robin", "bat", "princess", "squirrel", "blood", "red", "blue", "green", "pink", "tax", "prince", "grass", "lead", "cash", "snake", "leaf", "pixel", "wing", "fight", "club", "crown", "dog", "frog", "bird", "money", "clown", "jet", "knight", "flower", "cobra", "cat", "water", "air", "tech", "bit", "star", "light", "photon", "sun", "moon", "venom", "earth", "river", "ocean", "lake", "dirt", "fur", "feline", "tiger", "lion", "anti", "matter", "possum", "thorn", "brain", "pixie", "alien", "xeno", "mine", "cloud", "proton", "limousine", "ox", "yak", "submarine", "monster"];
	var second = ["bomber", "boy", "girl", "gurl", "flood", "head", "cadillac", "samurai", "thief", "grrl", "driver", "face", "breaker", "kitty", "hacker", "chef", "haxxor", "rider", "buster", "singer", "lunatic", "catcher", "hunter", "stinger", "shaker", "dodger", "watcher", "smasher", "dancer", "dash", "fixer", "cheater", "pirate", "lord", "queen", "player", "reaper", "man", "mom", "oil", "breaker", "lady", "knight", "cat", "statue", "killer", "ninja", "killa", "wife", "phantom", "ranger", "stalker", "guy", "person", "man", "girl", "woman", "dude", "craft", "monster", "dragon", "woman", "bomb", "stealer", "creep", "eater", "maniac", "lover", "clown", "guy", "feline", "walker", "rope", "ghost", "money", "king", "queen", "cat", "master", "flyer", "hat", "shoes", "blizzard", "tornado", "avalanche", "shaker", "heart", "foot", "faerie", "hand", "sword", "knife", "mum", "kid", "jedi", "runner", "wing", "wizard", "summoner", "demon", "lad", "chick", "playa", "maker", "taker", "fang", "tooth", "thorn", "mime", "fighter", "dancer", "fairy", "drinker", "explosion"];
	
	if(Math.random() < 0.95) //two names
	{
		var part1 = Math.floor(Math.random() * first.length);
		var part2 = Math.floor(Math.random() * second.length);
		var num = generateUsernum(2);
		var mid = "";
		if(Math.random() < 0.3)
		{
			mid = "_";
		}
		var the = "";
		if(Math.random() < 0.1)
		{
			the = "the" + mid;
		}
		
		if(Math.random() < 0.8)
		{
			var username = the + first[part1] + mid + second[part2] + num;
			return username;
		}
		else
		{
			part2 = Math.floor(Math.random() * first.length);
			var username = the + first[part1] + mid + first[part2] + num;
			return username;
		}
	}
	else
	{
		if(Math.random() < 0.5)
		{
			var name = Math.floor(Math.random() * first.length);
			var num = generateUsernum(1);
			
			var username = first[name] + num;
			return username;
		}
		else
		{
			var name = Math.floor(Math.random() * second.length);
			var num = generateUsernum(1);
			
			var username = second[name] + num;
			return username;
		}
	}
}

function generateUsernum(names)
{
	if(names == 1)
	{
		var num = "";
		
		if(Math.random() < 0.99)
		{
			num = Math.floor(Math.random() * 1000);
			if(num == 0)
			{
				num = 1337;
			}
			var digits = (num + "").length;
			if(digits == 1)
			{
				if(Math.random() < 0.7)
				{
					if(Math.random() < 0.2)
					{
						num = "0" + num;
					}
					else
					{
						num = "00" + num;
					}
				}
			}
			else if(digits == 2)
			{
				if(Math.random() < 0.3)
				{
					if(Math.random() < 0.9)
					{
						num = "0" + num;
					}
					else
					{
						num = "00" + num;
					}
				}
			}
		}
		
		return num;
	}
	else
	{
		var num = "";
		
		if(Math.random() < 0.9)
		{
			num = Math.floor(Math.random() * 100);
			if(num == 0)
			{
				num = 1337;
			}
			var digits = (num + "").length;
			if(digits == 1)
			{
				if(Math.random() < 0.6)
				{
					if(Math.random() < 0.85)
					{
						num = "0" + num;
					}
					else
					{
						num = "00" + num;
					}
				}
			}
			else if(digits == 2)
			{
				if(Math.random() < 0.2)
				{
					num = "0" + num;
				}
			}
		}
		
		if(num == "069") //seriously, this happens way too often (even for the internet)
		{
			num = "1337";
		}
		
		return num;
	}
}

}