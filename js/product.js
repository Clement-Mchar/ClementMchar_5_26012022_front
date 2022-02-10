const productUrl = window.location.href;
let url = new URL(productUrl);
let searchParams = new URLSearchParams(url);
let productId = url.searchParams.get("id");

const article = document.querySelector("article");
const option = document.getElementById("colors");
const select = document.querySelector("select");
const cartBtn = document.getElementById("addToCart");
const quantity = document.getElementById("quantity");

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
		for (let color of product.colors) {
			select.insertAdjacentHTML(
				"beforeend",
				`<option value="${color}">${color}</option>`
			);
		}
	})
	.catch((err) => {
		console.error(err);
	});

cartBtn.addEventListener("click", (submit) => {
	if (
		parseInt(quantity.value) <= 0 ||
		parseInt(quantity.value) > 100 ||
		!select.value
	) {
		return;
	};
	let addProduct = {
		id: productId,
		quantity: parseInt(quantity.value),
		color: select.value,
	};
	
	let savedProducts = JSON.parse(localStorage.getItem("cart"));
	if (savedProducts) {
		const res = savedProducts.findIndex((elem) => {
			return productId === elem.id && select.value === elem.color;
		});
		if (res >= 0) {
			savedProducts[res].quantity += parseInt(quantity.value);
		} else {
			savedProducts.push(addProduct);
		}
		if (res >= 0 && savedProducts[res].quantity + parseInt(quantity.value) > 100){
			return;
		}
		localStorage.setItem("cart", JSON.stringify(savedProducts));
	} else {
		savedProducts = [];
		savedProducts.push(addProduct);
		localStorage.setItem("cart", JSON.stringify(savedProducts));
	}

});
