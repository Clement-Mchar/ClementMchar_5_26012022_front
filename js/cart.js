const productsDisplay = document.querySelector("#cart__items");
let savedProducts = JSON.parse(localStorage.getItem("cart"));
let articleToBeInserted = "";
let input = document.querySelectorAll("input");
let articles = document.querySelectorAll("article.cart__item");

setup();
async function setup() {
	await fetchData();
	productsDisplay.insertAdjacentHTML("afterbegin", articleToBeInserted);
	totalProducts();
	document.querySelectorAll("input").forEach((elem) => {
		elem.addEventListener("change", (e) => {
			if (e.target.value) {
				let articleFinded = e.target.closest("article");
				if (articleFinded) {
					const id = savedProducts.findIndex((savedProduct) => {
						return (
							savedProduct.id === articleFinded.getAttribute("data-id") &&
							savedProduct.color === articleFinded.getAttribute("data-color")
						);
					});

					savedProducts[id].quantity = parseInt(e.target.value);
					totalProducts();
					localStorage.setItem("cart", JSON.stringify(savedProducts));
				}
			}
		});
	});
	document.querySelectorAll(".deleteItem").forEach((elem) => {
		elem.addEventListener("click", (e) => {
			e.preventDefault();
			let articleFinded = e.target.closest("article");
			{
				const id = savedProducts.findIndex((savedProduct) => {
					return (
						savedProduct.id === articleFinded.getAttribute("data-id") &&
						savedProduct.color === articleFinded.getAttribute("data-color")
					);
				});
			}
			savedProducts.splice(id, 1);
			totalProducts();
			articleFinded.remove();
			localStorage.setItem("cart", JSON.stringify(savedProducts));
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

function totalProducts() {
	let totalQty = [];
	let totalPrice = [];

	for (let savedProduct of savedProducts) {
		const qty = savedProduct.quantity;
		const price = product.price;
		const sumTotalPrice = price * qty;
		totalPrice.push(sumTotalPrice);
		totalQty.push(qty);
	}

	const reducer = (accumulator, currentValue) => accumulator + currentValue;
	const totalPriceSum = totalPrice.reduce(reducer);
	const totalQtySum = totalQty.reduce(reducer);

	document.querySelector("#totalPrice").textContent = totalPriceSum;

	document.querySelector("#totalQuantity").textContent = totalQtySum;
}

const cartForm = document.querySelector("#order");
cartForm.addEventListener("click", (e) => {
	e.preventDefault();
	const contact = {
		firstName: document.querySelector("#firstName").value,
		lastName: document.querySelector("#lastName").value,
		address: document.querySelector("#address").value,
		city: document.querySelector("#city").value,
		email: document.querySelector("#email").value,
	};

	let products = [];
	for (savedProduct of savedProducts) {
		products.push(savedProduct.id);
	}

	function fnLnC(value) {
		return /^[a-zA-Z]{2,30}$/.test(value);
	}

	function emailCheck(value) {
		return /^([a-z0-9_\-\.]+)@([a-z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(value);
	}

	function addressCheck(value) {
		return /^[a-zA-Z0-9]{3,50}$/.test(value);
	}

	function lettersOnlyFields() {
		const firstNameCheck = contact.firstName;
		const lastNameCheck = contact.lastName;
		const cityCheck = contact.city;
		if (fnLnC(firstNameCheck) && fnLnC(lastNameCheck) && fnLnC(cityCheck)) {
			return true;
		} else {
			alert("plus ou moins de lettres stp");
			return false;
		}
	}

	function emailField() {
		const email = contact.email;
		if (emailCheck(email)) {
			return true;
		} else {
			alert("écris un email valide stp");
			return false;
		}
	}

	function addressField() {
		const address = contact.address;
		if (addressCheck(address)) {
			return true;
		} else {
			alert("écrit une adresse valide stp");
			return false;
		}
	}
	const order = {
		products,
		contact,
	};
	if (lettersOnlyFields() && emailField() && addressField) {
		localStorage.setItem("order", JSON.stringify(order));
	} else {
		alert("wesh");
	}
	console.log(order)
});
