let categories;
let ingredients;
let ids;

const keywords = [
	["Vegetable"],
	["Cheese"],
	["Chicken", "Duck", "Turkey", "Goose", "Bird", "Deli", "Butchers", "Vegetarian Food"],
	["Beef", "Lamb", "Venison", "Deli", "Butchers", "Vegetarian Food"],
	["Pork", "Bacon", "Gammon", "Ham", "Deli", "Butchers", "Vegetarian Food"],
	["Sausage", "Chorizo", "Salami", "Halal", "Deli"],
	["Burger", "Jamaican"],
	["Fish", "Seafood", "Cod", "Haddock", "Mackerel", "Salmon", "Trout"],
	["Fruit, Nut", "Fruit & Nut", "Berries", "Dried Fruit", "Nuts", "Seeds"],
	["Banana"],
	["Apple", "Pear"],
	["Orange", "Lemon", "Citrus"],
	["Plum", "Apricot"],
	["Melon", "Grape"],
	["Peach", "Nectarine", "Mango", "Kiwi"],
	["Potato"],
	["Onion", "Leek"],
	["Carrot", "Root"],
	["Broccoli", "Cauliflower", "Spinach", "Cabbage", "Lettuce", "Celery"],
	["Courgette", "Aubergine", "Cucumber"],
	["Mushroom"],
	["Pea", "Beans,", "Sweetcorn", "Asparagus"],
	["Chilli"],
	["Tomato", "Pizza Sauce"],
	["Peppers"],
	["Avocado"],
	["Organic Salad", "Salad Pots"],
	["Milk"],
	["Butter"],
	["Cream"],
	["Egg"],
	["Baking & Cooking"],
	["Yoghurt"],
	["Olive"],
	["Pasta", "Cous", "Noodles"],
	["Soup"],
	["Bread", "Loave", "Bagel", "Baton", "Naan", "Pitta", "Sandwich Thins", "Flatbreads", "Farl", "Brioche"],
	["Wraps", "Naan", "Pitta", "Sandwich Thins", "Flatbreads"],
	["Roll"],
	["Rice"],
	["Chips"],
	["Prawn", "Scampi", "Seafood", "Shellfish"],
	["Chocolate"],
	["Christmas Cooking Ingredients", "Herb", "Spice", "Seasonings", "Speciality Ingredients"],
	["Cereals", "Granola", "Muesli", "Oats", "Porridge"],
	["Tins", "Cans"],
	["Baking", "baking", "Flour"],
	["Beer"],
	["Coffee", "Tea"],
	["Biscuit"],
	["Crisps", "Tortilla Chips"],
	["Toffee", "Fudge"],
	["Baked Beans"],
	["Pulse", "Lentil", " & Beans"],
	["Salt"],
	["Gravy", "Stock", "Pour Over Sauce"],
	["Oil", "Fat"],
	["Vinegar"],
	["Curry", "Mexican", "World Flavours"],
	["Oriental", "Chinese", "Thai"],
	["Mayonnaise", "Salad Cream", "Salad Dressings"],
	["Mustard"],
	["Condiment"],
	["Antipasti", "Pickled"],
	["Chutney", "Relish", "Jam", "Marmalade", "Honey", "Curd", "Syrup"],
	["Cracker", "Crispbread", "Oatcake"],
	["Peanut Butter"],
	["Spread"],
	["Custard"],
	["Jelly"],
	["Meringue"],
	["Sugar", "Sweeteners", "Icing"]
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
	
	let files = {};
	
	for (let id in ingredients) {
		files[id] = ingredients[id].img;
	}
	
	save(files, 'files');
}
