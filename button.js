var EventType = new function()
{
	this.UP = 0;
	this.DOWN = 1;
	this.MOVE = 2;
}

var ButtonState = new function()
{
	this.UP = 0;
	this.DOWN = 1;
	this.HOVER = 2;
}

var Button = function(t, x, y, w, h, e, i)
{
	this.text = t;
	this.x = Math.floor(x);
	this.y = Math.floor(y);
	this.width = w;
	this.height = h;
	this.event = e;
	this.img = (typeof(i) === "undefined") ? null : i;
	this.state = ButtonState.UP;
}

Button.prototype = {
	pick: function(x, y, type, down, dx, dy)
	{
		var hittest = true;
		var dval = true;
		if(x < this.x)
		{
			hittest = false;
		}
		else if(y < this.y)
		{
			hittest = false;
		}
		else if(x > this.x + this.width)
		{
			hittest = false;
		}
		else if(y > this.y + this.height)
		{
			hittest = false;
		}
		
		//hit check on dx and dy
		if(dx < this.x)
		{
			dval = false;
		}
		else if(dy < this.y)
		{
			dval = false;
		}
		else if(dx > this.x + this.width)
		{
			dval = false;
		}
		else if(dy > this.y + this.height)
		{
			dval = false;
		}
		
		if(this.state == ButtonState.UP)
		{
			if(type == EventType.MOVE)
			{
				if(hittest)
				{
					if(down)
					{
						if(dval)
						{
							this.state = ButtonState.DOWN;
						}
						else
						{
							this.state = ButtonState.HOVER;
						}
					}
					else
					{
						this.state = ButtonState.HOVER;
					}
				}
			}
			else if(type == EventType.UP)
			{
				if(hittest)
				{
					this.state = ButtonState.HOVER;
					hittest = false;
				}
			}
		}
		else if(this.state == ButtonState.DOWN)
		{
			if(hittest)
			{
				if(type == EventType.UP)
				{
					//this time they actually clicked it
					this.state = ButtonState.HOVER;
					this.event();
				}
			}
			else
			{
				if(type == EventType.MOVE)
				{
					this.state = ButtonState.UP;
				}
			}
		}
		else
		{
			if(hittest)
			{
				if(type == EventType.DOWN)
				{
					this.state = ButtonState.DOWN;
				}
				else if(type == EventType.UP)
				{
					hittest = false;
				}
			}
			else
			{
				this.state = ButtonState.UP;
			}
		}
	},
	draw: function(canvas)
	{
		if(this.img !== null)
		{
			//deal with image metrics
			var segment = 20;
			var dseg = segment * 2;
			var imgw = this.img.naturalWidth;
			
			if(this.width == 0)
			{
				canvas.font = "52px Arial, sans-serif";
				this.width = canvas.measureText(this.text).width + dseg;
			}
			
			if(this.height == 0)
			{
				this.height = this.img.naturalHeight / 3;
			}
			
			//actually draw the button image
			if(this.state == ButtonState.UP)
			{
				canvas.drawImage(this.img, 0, 0, segment, this.height, this.x, this.y, segment, this.height);
				canvas.drawImage(this.img, segment, 0, 1, this.height, this.x + segment, this.y, this.width - dseg, this.height);
				canvas.drawImage(this.img, imgw - segment, 0, segment, this.height, this.x + this.width - segment, this.y, segment, this.height);
				
				if(this.text.length > 0)
				{
					canvas.fillStyle = "#000000";
					canvas.textAlign = "center";
					canvas.font = "52px Arial, sans-serif";
					canvas.fillText(this.text, this.x + this.width / 2, this.y + (this.height / 2) + 18);
				}
			}
			else if(this.state == ButtonState.DOWN)
			{
				canvas.drawImage(this.img, 0, this.height, segment, this.height, this.x, this.y, segment, this.height);
				canvas.drawImage(this.img, segment, this.height, 1, this.height, this.x + segment, this.y, this.width - dseg, this.height);
				canvas.drawImage(this.img, imgw - segment, this.height, segment, this.height, this.x + this.width - segment, this.y, segment, this.height);
				
				if(this.text.length > 0)
				{
					canvas.fillStyle = "#000000";
					canvas.textAlign = "center";
					canvas.font = "52px Arial, sans-serif";
					canvas.fillText(this.text, this.x + this.width / 2, this.y + (this.height / 2) + 18);
				}
			}
			else
			{
				canvas.drawImage(this.img, 0, this.height * 2, segment, this.height, this.x, this.y, segment, this.height);
				canvas.drawImage(this.img, segment, this.height * 2, 1, this.height, this.x + segment, this.y, this.width - dseg, this.height);
				canvas.drawImage(this.img, imgw - segment, this.height * 2, segment, this.height, this.x + this.width - segment, this.y, segment, this.height);
				
				if(this.text.length > 0)
				{
					canvas.fillStyle = "#000000";
					canvas.textAlign = "center";
					canvas.font = "52px Arial, sans-serif";
					canvas.fillText(this.text, this.x + this.width / 2, this.y + (this.height / 2) + 18);
				}
			}
		}
		else
		{
			canvas.lineWidth = 2;
			canvas.strokeStyle = "#000000";
			canvas.fillStyle = (this.state == ButtonState.UP) ? "#CCCCCC" : (this.state == ButtonState.HOVER) ? "#FFFFFF" : "#AAAAAA";
			canvas.strokeRect(this.x, this.y, this.width, this.height);
			canvas.fillRect(this.x, this.y, this.width, this.height);
			
			canvas.fillStyle = "#000000";
			canvas.textAlign = "center";
			canvas.font = "52px Arial, sans-serif";
			canvas.fillText(this.text, this.x + this.width / 2, this.y + (this.height / 2) + 18);
		}
	}
}

var ImgButton = function(t, x, y, w, h, e, i)
{
	this.text = t;
	this.x = Math.floor(x);
	this.y = Math.floor(y);
	this.width = w;
	this.height = h;
	this.event = e;
	this.img = (typeof(i) === "undefined") ? null : i;
	this.state = ButtonState.UP;
}

ImgButton.prototype = {
	pick: function(x, y, type, down, dx, dy)
	{
		var hittest = true;
		var dval = true;
		if(x < this.x)
		{
			hittest = false;
		}
		else if(y < this.y)
		{
			hittest = false;
		}
		else if(x > this.x + this.width)
		{
			hittest = false;
		}
		else if(y > this.y + this.height)
		{
			hittest = false;
		}
		
		//hit check on dx and dy
		if(dx < this.x)
		{
			dval = false;
		}
		else if(dy < this.y)
		{
			dval = false;
		}
		else if(dx > this.x + this.width)
		{
			dval = false;
		}
		else if(dy > this.y + this.height)
		{
			dval = false;
		}
		
		if(this.state == ButtonState.UP)
		{
			if(type == EventType.MOVE)
			{
				if(hittest)
				{
					if(down)
					{
						if(dval)
						{
							this.state = ButtonState.DOWN;
						}
						else
						{
							this.state = ButtonState.HOVER;
						}
					}
					else
					{
						this.state = ButtonState.HOVER;
					}
				}
			}
			else if(type == EventType.UP)
			{
				if(hittest)
				{
					this.state = ButtonState.HOVER;
					hittest = false;
				}
			}
		}
		else if(this.state == ButtonState.DOWN)
		{
			if(hittest)
			{
				if(type == EventType.UP)
				{
					//this time they actually clicked it
					this.state = ButtonState.HOVER;
					this.event();
				}
			}
			else
			{
				if(type == EventType.MOVE)
				{
					this.state = ButtonState.UP;
				}
			}
		}
		else
		{
			if(hittest)
			{
				if(type == EventType.DOWN)
				{
					this.state = ButtonState.DOWN;
				}
				else if(type == EventType.UP)
				{
					hittest = false;
				}
			}
			else
			{
				this.state = ButtonState.UP;
			}
		}
	},
	draw: function(canvas)
	{
		if(this.img !== null)
		{			
			//actually draw the button image
			if(this.state == ButtonState.UP)
			{
				canvas.drawImage(this.img, 0, 0, this.width, this.height, this.x, this.y, this.width, this.height);
				
				if(this.text.length > 0)
				{
					canvas.fillStyle = "#FFFFFF";
					canvas.textAlign = "left";
					canvas.font = "50px Arial, sans-serif";
					canvas.fillText(this.text, this.x + 10, this.y + (this.height / 2) + 18);
				}
			}
			else if(this.state == ButtonState.DOWN)
			{
				canvas.drawImage(this.img, 0, this.height, this.width, this.height, this.x, this.y, this.width, this.height);
				
				if(this.text.length > 0)
				{
					canvas.fillStyle = "#FFFFFF";
					canvas.textAlign = "left";
					canvas.font = "50px Arial, sans-serif";
					canvas.fillText(this.text, this.x + 10, this.y + (this.height / 2) + 18);
				}
			}
			else
			{
				canvas.drawImage(this.img, 0, this.height * 2, this.width, this.height, this.x, this.y, this.width, this.height);
				
				if(this.text.length > 0)
				{
					canvas.fillStyle = "#FFFFFF";
					canvas.textAlign = "left";
					canvas.font = "50px Arial, sans-serif";
					canvas.fillText(this.text, this.x + 10, this.y + (this.height / 2) + 18);
				}
			}
		}
		else
		{
			canvas.lineWidth = 2;
			canvas.strokeStyle = "#000000";
			canvas.fillStyle = (this.state == ButtonState.UP) ? "#CCCCCC" : (this.state == ButtonState.HOVER) ? "#FFFFFF" : "#AAAAAA";
			canvas.strokeRect(this.x, this.y, this.width, this.height);
			canvas.fillRect(this.x, this.y, this.width, this.height);
			
			canvas.fillStyle = "#000000";
			canvas.textAlign = "center";
			canvas.font = "52px Arial, sans-serif";
			canvas.fillText(this.text, this.x + this.width / 2, this.y + (this.height / 2) + 18);
		}
	}
}