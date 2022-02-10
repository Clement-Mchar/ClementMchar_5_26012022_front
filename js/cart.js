let productDisplay = document.querySelector("#cart__items");
let savedProducts = JSON.parse(localStorage.getItem("cart"));

for (let savedProduct of savedProducts) {
	console.log(savedProduct);
	fetch("http://localhost:3000/api/products/" + savedProduct.id)
		.then((product) => {
			if (product.ok) {
				return product.json();
			}
			throw new error(product.statusText);
		})
		.then((product) => {
			productDisplay.insertAdjacentHTML(
				"afterbegin",
				`<article class="cart__item" data-id="${savedProduct.id}" data-color="${savedProduct.color}">
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
          </article>`
			);
		})
		.catch((err) => {
			console.error(err);
		});
}
