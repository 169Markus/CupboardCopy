const proxy = "https://cors-anywhere.herokuapp.com/";
const ingredientsAddress = "https://www.tesco.com/groceries/en-GB/resources?names=taxonomy&params=JTdCJTIyaW5jbHVkZUNoaWxkcmVuJTIyJTNBdHJ1ZSU3RA==";
const categoryAddress = "https://www.tesco.com/groceries/en-GB/shop";

const scrapeCategories = [
	'fresh-food',
	'bakery',
	'frozen-food',
	'food-cupboard'
];

const fetchCors = (url, init) => fetch(proxy + url, init);

let loadCount = -1;

function flattenProducts(obj) {
	return obj.children ? obj.children.splice(1).map(flattenProducts).flat() : [obj];
}

function makeNormal(arr) {
	if (!(arr instanceof Array)) return arr;
	
	let start;
	
	if (arr[0] instanceof Array) return makeNormal(arr[0]);
	else if (arr[0] == "^ ") start = 1;
	else start = 0;
	
	const obj = { };
	for (let i = start; i < arr.length; i += 2) {
		obj[arr[i]] = makeNormal(arr[i + 1]);
	}
	return obj;
}

function waitOnLoad(elem) {
	return new Promise((res, rej) => {
		elem.onload = res;
	});
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

async function init() {
	const response = await fetchCors(ingredientsAddress).then(r => r.json());
	const products = [];
	
	for (const category of response.taxonomy) {
		if (scrapeCategories.includes(category.url.split('/').reverse()[0]))
			products.push(...flattenProducts(category));
	}
	
	const ingredients = { };
	const categories = { };
	
	const count = products.length;
	let i = 0;
	
	for (const product of products) {
		if (loadCount-- == 0) return;
		
		const html = document.createElement('HTML');
		
		html.innerHTML = await fetchCors(categoryAddress + product.url).then(r => r.text());
		
		const parsed = [ ];
		
		const items = makeNormal(JSON.parse(html.getElementsByTagName('BODY')[0].attributes['data-redux-state'].textContent)).results.pages['~#iL']['^2I']
		
		for (const item in items) {
			ingredients[item] = product.name;
			
			parsed.push({
				id: item,
				img: Object.values(Object.values(Object.values(Object.values(items[item])[0])[1])[2])[0]['defaultImageUrl']
			});
		}
		
		categories[product.name] = parsed;
		
		console.log(`Loaded ${++i}/${count}`);
	}
	
	save(ingredients, 'ingredients');
	save(categories, 'categories');
}

init();
