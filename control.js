const file = document.getElementById('file');
const cupboard = document.getElementById('cupboard');

file.onchange = loadFile;

function loadFile() {
	let reader = new FileReader();
	reader.readAsDataURL(this.files[0]);
	reader.onload = async e => {
		let img = document.createElement('IMG');
		img.src = e.target.result;
		cupboard.innerHTML = "";
		cupboard.appendChild(img);
		img.classList.add('fill');
		let response = await request(img);
		console.log(response);
	};
}
