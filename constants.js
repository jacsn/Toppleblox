var SCREEN_WIDTH = 1024;
var SCREEN_HEIGHT = 640;


var Menus = new function()
{
	this.Main = 0;
	this.Pause = 1;
	this.Victory = 2;
	this.Loss = 3;
	this.None = 4;
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
	this.user = "";
	this.replay = null;
	this.viewcount = 0;
	this.likecount = 0;
	this.likes = [];
}





//images
var ButtonImage = new Image();
ButtonImage.ready = false;
ButtonImage.onload = function(){this.ready = true;};
ButtonImage.src = "button.png";

var DialogImage = new Image();
DialogImage.ready = false;
DialogImage.onload = function(){this.ready = true;};
DialogImage.src = "dialog.png";

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

var FlipButtonImage = new Image();
FlipButtonImage.ready = false;
FlipButtonImage.onload = function(){this.ready = true;};
FlipButtonImage.src = "flipbutton.png";