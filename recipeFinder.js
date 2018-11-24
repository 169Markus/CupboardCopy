
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
	
	
	
}

init();
