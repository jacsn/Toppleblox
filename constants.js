var SCREEN_WIDTH = 1024;
var SCREEN_HEIGHT = 640;

var MAX_LIKES = 20;

var K_ENTER = 13;

var Menus = new function()
{
	this.Main = 0;
	this.MainSim = 1;
	this.Signup = 2;
	this.LevelSelect = 3;
	this.Victory = 4;
	this.VictoryShared = 5;
	this.Quit = 6;
	this.None = 7;
}

var Tools = new function()
{
	this.Box = 0;
	this.Erase = 1;
}

var Point = function(x, y)
{
	this.x = x;
	this.y = y;
}

var Post = function()
{
	this.replay = null;
	this.viewcount = 0;
	this.likecount = 0;
	this.likes = [];
	this.thumbnail = null;
	this.timestamp = 0;
	this.rating = 0;
}

var FakePost = function()
{
	this.user = "Username";
	this.headline = "";
	this.text = "";
	this.replay = null;
	this.viewcount = 0;
	this.likecount = 0;
	this.likes = [];
	this.thumbnail = null;
	this.timestamp = 0;
	this.liked = false;
}

var Replay = function()
{
	this.level = 1;
	this.boxes = [];
}

//images
var ButtonImage = new Image();
ButtonImage.ready = false;
ButtonImage.onload = function(){this.ready = true;};
ButtonImage.src = "button.png";

var LookAtMeButtonImage = new Image();
LookAtMeButtonImage.ready = false;
LookAtMeButtonImage.onload = function(){this.ready = true;};
LookAtMeButtonImage.src = "lookatmebutton.png";

var DialogImage = new Image();
DialogImage.ready = false;
DialogImage.onload = function(){this.ready = true;};
DialogImage.src = "dialog.png";

var XButtonImage = new Image();
XButtonImage.ready = false;
XButtonImage.onload = function(){this.ready = true;};
XButtonImage.src = "xbutton.png";

var OutlineImage = new Image();
OutlineImage.ready = false;
OutlineImage.onload = function(){this.ready = true;};
OutlineImage.src = "outline.png";

var ToolboxImage = new Image();
ToolboxImage.ready = false;
ToolboxImage.onload = function(){this.ready = true;};
ToolboxImage.src = "toolbox.png";

var BoxToolButtonImage = new Image();
BoxToolButtonImage.ready = false;
BoxToolButtonImage.onload = function(){this.ready = true;};
BoxToolButtonImage.src = "boxtoolbutton.png";

var EraseToolButtonImage = new Image();
EraseToolButtonImage.ready = false;
EraseToolButtonImage.onload = function(){this.ready = true;};
EraseToolButtonImage.src = "erasetoolbutton.png";

var CheckMarkImage = new Image();
CheckMarkImage.ready = false;
CheckMarkImage.onload = function(){this.ready = true;};
CheckMarkImage.src = "checkmark.png";

var UndoButtonImage = new Image();
UndoButtonImage.ready = false;
UndoButtonImage.onload = function(){this.ready = true;};
UndoButtonImage.src = "undo.png";

var RedoButtonImage = new Image();
RedoButtonImage.ready = false;
RedoButtonImage.onload = function(){this.ready = true;};
RedoButtonImage.src = "redo.png";

var ClearButtonImage = new Image();
ClearButtonImage.ready = false;
ClearButtonImage.onload = function(){this.ready = true;};
ClearButtonImage.src = "clearbutton.png";

var GoButtonImage = new Image();
GoButtonImage.ready = false;
GoButtonImage.onload = function(){this.ready = true;};
GoButtonImage.src = "gobutton.png";

var FlipButtonImage = new Image();
FlipButtonImage.ready = false;
FlipButtonImage.onload = function(){this.ready = true;};
FlipButtonImage.src = "flipbutton.png";

var PlayButtonImage = new Image();
PlayButtonImage.ready = false;
PlayButtonImage.onload = function(){this.ready = true;};
PlayButtonImage.src = "playbutton.png";

var ReplayButtonImage = new Image();
ReplayButtonImage.ready = false;
ReplayButtonImage.onload = function(){this.ready = true;};
ReplayButtonImage.src = "replaybutton.png";

var Level1Image = new Image();
Level1Image.ready = false;
Level1Image.onload = function(){this.ready = true;};
Level1Image.src = "level1.png";

var Level2Image = new Image();
Level2Image.ready = false;
Level2Image.onload = function(){this.ready = true;};
Level2Image.src = "level2.png";

var Level3Image = new Image();
Level3Image.ready = false;
Level3Image.onload = function(){this.ready = true;};
Level3Image.src = "level3.png";

var Level4Image = new Image();
Level4Image.ready = false;
Level4Image.onload = function(){this.ready = true;};
Level4Image.src = "level4.png";

var Level5Image = new Image();
Level5Image.ready = false;
Level5Image.onload = function(){this.ready = true;};
Level5Image.src = "level5.png";

var Level6Image = new Image();
Level6Image.ready = false;
Level6Image.onload = function(){this.ready = true;};
Level6Image.src = "level6.png";