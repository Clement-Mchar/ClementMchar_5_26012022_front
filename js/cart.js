const productsDisplay = document.querySelector("#cart__items");
let savedProducts = JSON.parse(localStorage.getItem("cart"));
let articleToBeInserted = "";
let input = document.querySelectorAll("input");
const articles = document.querySelectorAll("article.cart__item");

let total = 0;
setup();
async function setup() {
	await fetchData();
	productsDisplay.insertAdjacentHTML("afterbegin", articleToBeInserted);
	articles.forEach((elem) => {
		console.log(article);
		const price = article.querySelector(
			".cart__item__content__description>p:nth-of-type(2)"
		);
		const qty = article.querySelector(
			".cart__item__content__settings__quantity>p:nth-of-type(1)"
		);
		const subTotal = price * qty;
		total += subTotal;
		console.log(subTotal);
		document
			.querySelector("#totalQuantity")
			.insertAdjacentHTML("beforeend", `${totalQtySum}`);
	});

	document.querySelectorAll("input").forEach((elem) => {
		elem.addEventListener("change", (e) => {
			if (e.target.value) {
				let articleFinded = e.target.closest("article");
				const id = savedProducts.findIndex((savedProduct) => {
					return (
						savedProduct.id === articleFinded.getAttribute("data-id") &&
						savedProduct.color === articleFinded.getAttribute("data-color")
					);
				});
				savedProducts[id].quantity = parseInt(e.target.value);
				return localStorage.setItem("cart", JSON.stringify(savedProducts));
			}
		});
	});

	document.querySelectorAll(".deleteItem").forEach((elem) => {
		elem.addEventListener("click", (e) => {
			e.preventDefault();
			let articleFinded = e.target.closest("article");
			const id = savedProducts.findIndex((savedProduct) => {
				return (
					savedProduct.id === articleFinded.getAttribute("data-id") &&
					savedProduct.color === articleFinded.getAttribute("data-color")
				);
			});
			savedProducts.splice(id, 1);
			articleFinded.remove();
			return localStorage.setItem("cart", JSON.stringify(savedProducts));
		});
	});
}

async function fetchData() {
	for (let savedProduct of savedProducts) {
		productJson = await fetch(
			"http://localhost:3000/api/products/" + savedProduct.id
		);
		product = await productJson.json();
		articleToBeInserted += `<article class="cart__item" data-id="${savedProduct.id}" data-color="${savedProduct.color}">
              <div class="cart__item__img">
                <img src="${product.imageUrl}" alt="${product.altTxt}">
              </div>
              <div class="cart__item__content">
                <div class="cart__item__content__description">
                  <h2>${product.name}</h2>
                  <p>${savedProduct.color}</p>
                  <p>${product.price}€</p>
                </div>
                <div class="cart__item__content__settings">
                  <div class="cart__item__content__settings__quantity">
                    <p>Qté : </p>
                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value= "${savedProduct.quantity}">
                  </div>
                  <div class="cart__item__content__settings__delete">
                    <p class="deleteItem">Supprimer</p>
                  </div>
                </div>
              </div>
            </article>`;
	}
}
