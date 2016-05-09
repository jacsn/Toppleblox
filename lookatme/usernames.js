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
	var first = ["radio", "dark", "ninja", "death", "shadow", "diamond", "crystal", "rainbow", "cat", "marble", "granite", "coffee", "tea", "sushi", "ring", "sonic", "super", "crazy", "electric", "unicorn", "pegasus", "mega", "ultra", "lettuce", "banana", "coconut", "cyclone", "steel", "algebra", "fountain", "cake", "pie", "bug", "rose", "circle", "square", "triangle", "atom", "dandelion", "rabid", "mud", "belt", "white", "poison", "dance", "croquet", "needle", "lace", "ribbon", "puppy", "clover", "sleepy", "thunder", "lightning", "bright", "orange", "meat", "veggie", "oath", "asparagus", "quake", "pi", "liver", "dragon", "shark", "cape", "tau", "ant", "pirate", "glass", "ruby", "laser", "tiara", "widow", "big", "dry", "egg", "lantern", "milk", "engine", "distant", "triumph", "plush", "alicorn", "apple", "wheat", "pear", "pearl", "linux", "night", "quick", "box", "turnip", "black", "squash", "pixel", "elephant", "squid", "whale", "fish", "eagle", "ninja", "ice", "snow", "magic", "fairy", "cupcake", "owl", "math", "nuclear", "lizard", "corn", "phoenix", "disaster", "karate", "fenix", "ballet", "anvil", "stick", "pony", "quantum", "boat", "sad", "mint", "happy", "dragon", "raven", "crow", "fedora", "bubble", "window", "mad", "mummy", "angry", "robin", "bat", "princess", "squirrel", "blood", "red", "blue", "green", "pink", "tax", "prince", "grass", "lead", "cash", "snake", "leaf", "pixel", "wing", "fight", "club", "crown", "dog", "frog", "bird", "money", "clown", "jet", "knight", "flower", "cobra", "cat", "water", "air", "tech", "bit", "star", "light", "photon", "sun", "moon", "venom", "earth", "river", "ocean", "lake", "dirt", "fur", "feline", "tiger", "lion", "anti", "matter", "possum", "thorn", "brain", "pixie", "alien", "xeno", "mine", "cloud", "proton", "limousine", "ox", "yak", "submarine", "monster"];
	var second = ["bomber", "boy", "girl", "gurl", "flood", "head", "cadillac", "samurai", "thief", "grrl", "face", "breaker", "kitty", "hacker", "chef", "haxxor", "rider", "buster", "singer", "lunatic", "catcher", "hunter", "stinger", "shaker", "dodger", "watcher", "smasher", "dancer", "dash", "fixer", "cheater", "pirate", "lord", "queen", "player", "reaper", "man", "mom", "oil", "breaker", "lady", "knight", "cat", "statue", "killer", "ninja", "killa", "wife", "phantom", "ranger", "stalker", "guy", "person", "man", "girl", "woman", "dude", "craft", "monster", "dragon", "woman", "bomb", "stealer", "creep", "eater", "maniac", "lover", "clown", "guy", "feline", "walker", "rope", "ghost", "money", "king", "queen", "cat", "master", "flyer", "hat", "shoes", "blizzard", "tornado", "avalanche", "shaker", "heart", "foot", "faerie", "hand", "sword", "knife", "mum", "kid", "jedi", "runner", "wing", "wizard", "summoner", "demon", "lad", "chick", "playa", "maker", "taker", "fang", "tooth", "thorn", "mime", "fighter", "dancer", "fairy", "drinker", "explosion"];
	
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