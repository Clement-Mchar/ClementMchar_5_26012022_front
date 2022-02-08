const productUrl = window.location.href;
let url = new URL(productUrl);
let searchParams = new URLSearchParams(url);
let productId = url.searchParams.get("id");

const article = document.querySelector("article");
const option = document.getElementById("colors");
const select = document.querySelector("select");

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
			`<option>--SVP, choisissez une couleur --</option>`
		);

		for (let color of product.colors) {
			select.insertAdjacentHTML(
				"beforeend",
				`<option value=${color}>${color}</option>`
			);
		}
	})
	.catch((err) => {
		console.error(err);
	});

let cartBtn = document.getElementById("addToCart");
cartBtn.addEventListener("click", function (submit) {
	let addProduct = {
		id: url.searchParams.get("id"),
		quantity: document.getElementById("quantity").value,
		color: select.value,
	};
	let savedProduct = JSON.parse(localStorage.getItem("product"));
	if (savedProduct) {
		savedProduct.push(addProduct);
		localStorage.setItem("product", JSON.stringify(savedProduct));
		console.log(savedProduct);
	} else {
		savedProduct = [];
		savedProduct.push(addProduct);
		localStorage.setItem("product", JSON.stringify(savedProduct));
		console.log(savedProduct);
	}
});
