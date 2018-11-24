const appKey = "7fee9b134b394320bfc87ec3dedfe4f2";
const modelID = "ingredients";
const modelKey = "a4db3e76b5234c5f9b04d09ab4d7bbe6";
const versionKey = "ebeff19edd6548138bd34e05bd2ca017";

const app = new Clarifai.App({ apiKey: appKey });

async function predict(url) {
	let response = await app.models.predict({ id: modelID, version: versionKey }, url);
	
	let predictions = { };
	
	for (let concept of response.outputs[0].data.concepts) {
		predictions[concept.id] = concept.value;
	}
	
	return predictions;
}
