const address = "https://us-central1-cupboard-1.cloudfunctions.net/function-1";

async function request(img) {
	const payload = {
		'imageBytes': img.src.substr(23)
	};
	
	const params = {
		'score_threshold': 0.02
	};
	
	const req = {
		'name': 'cupboard2_m1',
		'payload': payload,
		'params': params
	};
	
	const headers = {
		'content-type': 'application/json'
	};
	
	const data = {
		'headers': headers,
		'method': 'POST',
		'body': JSON.stringify(req)
	};
	
	const res = await fetch(address, data);//.then(r => r.json());
	
	return res;
}
