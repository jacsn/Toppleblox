function addUsername()
{
	var list = document.getElementById("userlist");
	var li = document.createElement("li");
	li.innerHTML = generateUsername() + " likes this";
	list.insertBefore(li, list.childNodes[0]);
}

function generateUsername()
{
	var first = ["radio", "dark", "ninja", "death", "shadow", "diamond", "crystal", "rainbow", "cat", "lettuce", "banana", "coconut", "cyclone", "steel", "algebra", "fountain", "cake", "pie", "bug", "rose", "circle", "square", "triangle", "atom", "dandelion", "rabid", "mud", "belt", "poison", "dance", "croquet", "needle", "lace", "ribbon", "puppy", "clover", "thunder", "lightning", "bright", "orange", "meat", "veggie", "oath", "asparagus", "quake", "pi", "liver", "dragon", "shark", "cape", "tau", "ant", "pirate", "ruby", "laser", "tiara", "widow", "big", "dry", "egg", "lantern", "milk", "engine", "distant", "triumph", "plush", "apple", "wheat", "pear", "pearl", "linux", "night", "quick", "box", "turnip", "squash", "pixel", "elephant", "squid", "whale", "fish", "eagle", "ninja", "magic", "fairy", "cupcake", "owl", "math", "nuclear", "lizard", "phoenix", "fenix", "ballet", "anvil", "stick", "pony", "quantum", "boat", "sad", "mint", "happy", "dragon", "raven", "crow", "fedora", "bubble", "window", "mad", "mummy", "angry", "robin", "bat", "princess", "squirrel", "blood", "red", "blue", "green", "pink", "prince", "grass", "lead", "cash", "snake", "leaf", "pixel", "wing", "fight", "club", "crown", "dog", "frog", "bird", "money", "clown", "jet", "knight", "flower", "cobra", "cat", "water", "air", "tech", "bit", "star", "light", "photon", "sun", "moon", "venom", "earth", "river", "ocean", "lake", "dirt", "fur", "feline", "tiger", "lion", "anti", "matter", "possum", "thorn", "brain", "alien", "xeno", "mine", "cloud", "proton", "limousine", "ox", "yak", "submarine", "monster"];
	var second = ["bomber", "boy", "girl", "gurl", "flood", "head", "cadillac", "thief", "grrl", "face", "breaker", "kitty", "buster", "singer", "stinger", "shaker", "watcher", "smasher", "dancer", "dash", "fixer", "cheater", "pirate", "lord", "queen", "player", "reaper", "man", "mom", "oil", "breaker", "lady", "knight", "cat", "statue", "killer", "ninja", "killa", "wife", "phantom", "ranger", "stalker", "guy", "person", "man", "girl", "woman", "dude", "craft", "monster", "dragon", "woman", "bomb", "stealer", "creep", "eater", "maniac", "lover", "clown", "guy", "feline", "walker", "rope", "ghost", "money", "king", "queen", "cat", "master", "flyer", "hat", "shoes", "blizzard", "tornado", "avalanche", "shaker", "heart", "foot", "hand", "sword", "knife", "mum", "kid", "jedi", "runner", "wing", "wizard", "summoner", "demon", "lad", "chick", "playa", "maker", "taker", "fang", "tooth", "thorn", "mime", "fighter", "dancer", "fairy"];
	
	if(Math.random() < 0.98) //two names
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
		
		return num;
	}
}