
// Setup code
let ingredients;
let ids;
let recipes;

let a = 0, b = 0;

async function init() {
	ingredients = await fetch("./ingredients.json").then(r => r.json());
	ids = Object.keys(ingredients);
	recipes = await fetch("./recipes.json").then(r => r.json());
}

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

// Function
// cupboard = cupboard = ["Pork", "Chicken", "Pasta", "Pasta Sauce"]
function findRecipes(cupboard) {
	for (let recipe of recipes){
		recipe.nothave = [];
		for (let ingredient of recipe.ingredients){
			let name = findID(ingredient.sku);
			
			if (!cupboard.includes(name)){
				recipe.nothave.push(name);
			}
		}
	}

	return recipes.sort((a, b) => a.nothave.length / a.ingredients.length - b.nothave.length / b.ingredients.length);
}

init();
