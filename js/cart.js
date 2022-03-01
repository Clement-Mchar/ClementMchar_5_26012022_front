const productsDisplay = document.querySelector("#cart__items");
let savedProducts = JSON.parse(localStorage.getItem("cart"));
let articleToBeInserted = "";
let input = document.querySelectorAll("input");
let articles = document.querySelectorAll("article.cart__item");

//--------- fonction async s'exécutant après la requète permettant de modifier la quantité/supprimer un produit du panier -----//

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

					if (id >= 0) {
						savedProducts[id].quantity = parseInt(e.target.value);
					}
					if (
						(id >= 0 && savedProducts[id].quantity > 100) ||
						savedProducts[id].quantity <= 0
					) {
						return;
					}
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
			const id = savedProducts.findIndex((savedProduct) => {
				return (
					savedProduct.id === articleFinded.getAttribute("data-id") &&
					savedProduct.color === articleFinded.getAttribute("data-color")
				);
			});
			if (savedProducts > 0) {
				savedProducts.splice(id, 1);
				articleFinded.remove();
			} else {
				savedProducts.splice(id, 1);
				articleFinded.remove();
			}
			totalProducts();
			localStorage.setItem("cart", JSON.stringify(savedProducts));
		});
	});
}

//--------- boucle d'insertion du HTML en fonction du nombre de produits dans le panier ------------//

async function fetchData() {
	for (let savedProduct of savedProducts) {
		productJson = await fetch(
			"https://kanap-ecommerce.herokuapp.com/api/products/" + savedProduct.id
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
//---------- fonction qui calcule le prix et la quantité totale du panier  -------//
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
	const totalPriceSum = totalPrice.reduce(reducer, 0);
	const totalQtySum = totalQty.reduce(reducer, 0);

	document.querySelector("#totalPrice").textContent = totalPriceSum;

	document.querySelector("#totalQuantity").textContent = totalQtySum;
}

const cartForm = document.querySelector("#order");

//----------- évènement qui vérifie le correct remplissage du formulaire et redirige sur la page confirmation -------------//

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
	//---------- les regExp qui régissent les règles de remplissage du formulaire --------------//

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
			alert("Veuillez respecter la casse.");
			return false;
		}
	}

	function emailField() {
		const email = contact.email;
		if (emailCheck(email)) {
			return true;
		} else {
			alert("veuillez entrer une adresse email valide.");
			return false;
		}
	}

	function addressField() {
		const address = contact.address;
		if (addressCheck(address)) {
			return true;
		} else {
			alert("Veuillez entrer une adresse valide.");
			return false;
		}
	}
	const order = {
		products,
		contact,
	};
	//---------- vérification et validation du formulaire ----------//
	if (lettersOnlyFields() && emailField() && addressField && savedProduct) {
		fetch("https://kanap-ecommerce.herokuapp.com/api/products/order", {
			method: "POST",

			body: JSON.stringify(order),

			headers: {
				"Content-type": "application/json; charset=UTF-8",
			},
		})
			.then((response) => response.json())
			//---------- redirection et suppression du panier ----------//
			.then(
				(json) =>
					(window.location.href = `../html/confirmation.html?id=${json.orderId}`),
				savedProducts.pop(),
				localStorage.setItem("cart", JSON.stringify(savedProducts))
			);
	} else {
		alert(
			"Oups ! Une erreur a eu lieu lors de la commande. Merci de bien vérifier les données saisies."
		);
	}
});
