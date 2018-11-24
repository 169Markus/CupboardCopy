
// Setup code
let ingredients;
let recipes;

async function init() {
	ingredients = await fetch("./ingredients.js").then(r => r.json());
	recipes = await fetch("./recipes.js").then(r => r.json());
}

// Function
// cupboard = ["Pork", "Chicken", "Pasta", "Pasta Sauce"]
function findRecipes(cupboard) {
	let recipefound = new Array (501);
	for (let element in recipefound){
		recipefound[element] = [];
	}
	for (let recipe of recipes){
		let wrong = 0;
		recipe.nothave = [];
		for (let ingredient of recipe.ingredients){
			if (! cupboard.includes(ingredients[ingredient.sku])){
				wrong++;
				recipe.nothave.push(ingredients[ingredient.sku]);
			}
			
		}
		recipefound[wrong].push(recipe);
	}

	return recipefound.flat();
}

init();
