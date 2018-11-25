const appKey = "7fee9b134b394320bfc87ec3dedfe4f2";
const modelID = "ingredients";
const modelKey = "a4db3e76b5234c5f9b04d09ab4d7bbe6";
const modelVersionKey = "ebeff19edd6548138bd34e05bd2ca017";

const app = new Clarifai.App({ apiKey: appKey });

// Setup code
let categories = { };
let ingredients;
let ids;
let recipes;
let imgs = [ ];
let concepts = [ ];

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

async function init() {
	let allcats = await fetch("./categories.json").then(r => r.json());
	ingredients = await fetch("./ingredients.json").then(r => r.json());
	ids = Object.keys(ingredients);
	recipes = await fetch("./recipes.json").then(r => r.json());
	
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
	
	for (let name in categories) {
		if (categories[name].length) concepts.push({ id: name });
	}
}

function addImages() {
	let count = concepts.length;
	let i = 0, j=0;
	
	for (let name in categories) {
		for (let item of categories[name]) {
			//app.inputs.create({
			//	url: item.img,
			//	concepts: [{ id: name, value: true }]
			//});
			j++;
		}
		console.log(`Loaded ${++i} / ${count}`);
	}
	console.log(j);
}

function createModel() {
	app.models.create(modelID, concepts).then(console.log).catch(console.log);
}

function trainModel() {
	app.models.train(modelID).then(console.log).catch(console.log);
}

init();
