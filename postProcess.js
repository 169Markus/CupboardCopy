let categories;
let ingredients;
let ids;

const keywords = [
/*00*/	["Vegetable"],
/*01*/	["Cheese"],
/*02*/	["Chicken", "Duck", "Turkey", "Goose", "Bird", "Deli", "Butchers", "Vegetarian Food"],
/*03*/	["Beef", "Lamb", "Venison", "Deli", "Butchers", "Vegetarian Food"],
/*04*/	["Pork", "Bacon", "Gammon", "Ham", "Deli", "Butchers", "Vegetarian Food"],
/*05*/	["Sausage", "Chorizo", "Salami", "Halal", "Deli"],
/*06*/	["Burger", "Jamaican"],
/*07*/	["Fish", "Seafood", "Cod", "Haddock", "Mackerel", "Salmon", "Trout"],
/*08*/	["Fruit, Nut", "Fruit & Nut", "Berries", "Dried Fruit", "Nuts", "Seeds", "Apricot"],
/*09*/	["Apple", "Pear", "Plum"],
/*10*/	["Orange", "Lemon", "Citrus"],
/*11*/	["Melon", "Grape"],
/*12*/	["Peach", "Nectarine", "Mango", "Kiwi"],
/*13*/	["Potato"],
/*14*/	["Onion", "Leek"],
/*15*/	["Carrot", "Root"],
/*16*/	["Broccoli", "Cauliflower", "Spinach", "Cabbage", "Lettuce", "Celery"],
/*17*/	["Courgette", "Aubergine", "Cucumber"],
/*18*/	["Mushroom"],
/*19*/	["Pea", "Beans,", "Sweetcorn", "Asparagus"],
/*20*/	["Chilli"],
/*21*/	["Tomato", "Pizza Sauce"],
/*22*/	["Peppers"],
/*23*/	["Organic Salad", "Salad Pots"],
/*24*/	["Milk"],
/*25*/	["Butter"],
/*26*/	["Cream"],
/*27*/	["Egg"],
/*28*/	["Baking & Cooking"],
/*29*/	["Yoghurt"],
/*30*/	["Olive"],
/*31*/	["Pasta", "Cous", "Noodles"],
/*32*/	["Soup"],
/*33*/	["Bread", "Loave", "Bagel", "Baton", "Naan", "Pitta", "Sandwich Thins", "Flatbreads", "Farl", "Brioche"],
/*34*/	["Wraps", "Naan", "Pitta", "Sandwich Thins", "Flatbreads"],
/*35*/	["Roll"],
/*36*/	["Rice"],
/*37*/	["Chips"],
/*38*/	["Prawn", "Scampi", "Seafood", "Shellfish"],
/*39*/	["Chocolate"],
/*40*/	["Christmas Cooking Ingredients", "Herb", "Spice", "Seasonings", "Speciality Ingredients"],
/*41*/	["Cereals", "Granola", "Muesli", "Oats", "Porridge"],
/*42*/	["Tin", "Can"],
/*43*/	["Baking", "baking", "Flour"],
/*44*/	["Beer"],
/*45*/	["Coffee", "Tea"],
/*46*/	["Biscuit"],
/*47*/	["Crisps", "Tortilla Chips"],
/*48*/	["Toffee", "Fudge"],
/*49*/	["Baked Beans"],
/*50*/	["Pulse", "Lentil", " & Beans"],
/*51*/	["Salt"],
/*52*/	["Gravy", "Stock", "Pour Over Sauce"],
/*53*/	["Oil", "Fat"],
/*54*/	["Vinegar"],
/*55*/	["Curry", "Mexican", "World Flavours"],
/*56*/	["Oriental", "Chinese", "Thai"],
/*57*/	["Mayonnaise", "Salad Cream", "Salad Dressings"],
/*58*/	["Mustard"],
/*59*/	["Condiment"],
/*60*/	["Antipasti", "Pickled"],
/*61*/	["Chutney", "Relish", "Jam", "Marmalade", "Honey", "Curd", "Syrup"],
/*62*/	["Cracker", "Crispbread", "Oatcake"],
/*63*/	["Peanut Butter"],
/*64*/	["Spread"],
/*65*/	["Custard"],
/*66*/	["Jelly"],
/*67*/	["Meringue"],
/*68*/	["Sugar", "Sweeteners", "Icing"]
];

function findID(id) {
	if (ingredients[id]) return ingredients[id];
	
	let from = 0, to = ids.length - 1;
	
	while (from + 1 != to) {
		let middle = Math.floor((from + to) / 2);
		
		if (ids[middle] > id) to = middle;
		else from = middle;
	}
	
	if (ids[to] - id > id - ids[from]) return ingredients[ids[from]];
	else return ingredients[ids[to]];
}

function save(json, name) {
	const encoded = new Uint8Array([...JSON.stringify(json)].map(s => s.charCodeAt(0)));
	const blob = new Blob([encoded], {
		type: 'application/octet-stream'
	});
	const link = document.createElement('A');
	link.setAttribute('href', URL.createObjectURL(blob));
	link.setAttribute('download', name + ".json");
	const event = document.createEvent('MouseEvents');
	event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
	link.dispatchEvent(event);
}

function saveRaw(text, name) {
	const encoded = new Uint8Array([...text].map(s => s.charCodeAt(0)));
	const blob = new Blob([encoded], {
		type: 'application/octet-stream'
	});
	const link = document.createElement('A');
	link.setAttribute('href', URL.createObjectURL(blob));
	link.setAttribute('download', name);
	const event = document.createEvent('MouseEvents');
	event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
	link.dispatchEvent(event);
}

async function reduce() {
	let allcats = await fetch("./categories.json").then(r => r.json());
	ingredients = await fetch("./ingredients.json").then(r => r.json());
	ids = Object.keys(ingredients);
	
	let set = {};
	for (let recipe of recipes) {
		for (let ingredient of recipe.ingredients) {
			set[findID(ingredient.sku)] = true;
		}
	}
	let included = Object.keys(set);
	for (let c in allcats) {
		if (included.includes(c)) categories[c] = allcats[c];
	}
	
	save(categories, 'filteredCategories');
}

async function combine() {
	let allcats = await fetch("./categories.json").then(r => r.json());
	ingredients = await fetch("./ingredients.json").then(r => r.json());
	ids = Object.keys(ingredients);
	recipes = await fetch("./recipes.json").then(r => r.json());
	categories = new Array(keywords.length).fill(0).map(() => []);
	
	for (let c in allcats) {
		for (let i in keywords) {
			if (keywords[i].some(k => c.includes(k))) {
				categories[i].push(...allcats[c]);
			}
		}
	}
	
	for (let id in ingredients) {
		ingredients[id] = {img: undefined, cats: []};
		
		for (let i in categories) {
			if (categories[i].some(c => c.id == id)) ingredients[id].cats.push(parseInt(i));
		}
	}
		
	for (let cat of Object.values(allcats))
		for (let item of cat)
			ingredients[item.id].img = item.img;
	
	save(categories, 'combinedCategories');
	save(ingredients, 'combinedIngredients');
}

async function fileNames() {
	ingredients = await fetch("./combinedIngredients.json").then(r => r.json());
	
	let lines = Object.entries(ingredients).filter(e => e[1].cats.length).map(e => `${e[0]},${e[1].img}`);
	
	saveRaw(lines.join('\r\n'), 'files.txt');
}

async function gcImages() {
	ingredients = await fetch("./combinedIngredients.json").then(r => r.json());
	
	let filtered = Object.entries(ingredients).filter(e => e[1].cats.length);
	
	let lines = filtered.map(e => `gs://cupboard-1-vcm/Images/${e[0]}.jpg,${e[1].cats.join(',')}`);
	
	saveRaw(lines.join('\r\n'), 'images.csv');
}
