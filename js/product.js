const productUrl = window.location.href;
let url = new URL(productUrl);
let searchParams = new URLSearchParams(url);
let productId = url.searchParams.get("id");

let article = document.querySelector("article");
let option = document.getElementById("#colors");

fetch("http://localhost:3000/api/products/" + productId)
	.then((product) => {
		if (product.ok) {
			return product.json();
		}
		throw new error(product.statusText);
	})
	.then((product) => {
		article.insertAdjacentHTML(
			"afterbegin",
			`
            <div class="item__img">
            <img src="${product.imageUrl}" alt="${product.altTxt}">
          </div>
          <div class="item__content">

            <div class="item__content__titlePrice">
              <h1 id="title">"${product.name}"</h1>
              <p>Prix : <span id="price">"${product.price}"</span>€</p>
            </div>

            <div class="item__content__description">
              <p class="item__content__description__title">Description :</p>
              <p id="description">${product.description}</p>
            </div>`
		);
		colors.insertAdjacentHTML(
			"afterbegin",
			`<option value="">--SVP, choisissez une couleur --</option>`
		);
		let select = document.querySelector('select');
		
		for (let color of product.colors) {
			select.insertAdjacentHTML(
				"beforeend",
				`<option value=${color}>${color}</option>`)

			};

		console.log(product.colors);
	})
	.catch((err) => {
		console.error(err);
	});
