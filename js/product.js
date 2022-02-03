const zeo = window.location.href;
let url = new URL(zeo);
let searchParams = new URLSearchParams(url);
let productId = url.searchParams.get("id");
console.log(productId);

let article = document.querySelector("article");
let option = document.getElementById("#colors");

fetch("http://localhost:3000/api/products/" + productId)
	.then((products) => {
		if (products.ok) {
			return products.json();
		}
		throw new error(products.statusText);
	})
	.then((products) => {
		article.insertAdjacentHTML(
			"afterbegin",
			`
            <div class="item__img">
            <img src="${products.imageUrl}" alt="${products.altTxt}">
          </div>
          <div class="item__content">

            <div class="item__content__titlePrice">
              <h1 id="title">"${products.name}"</h1>
              <p>Prix : <span id="price">"${products.price}"</span>€</p>
            </div>

            <div class="item__content__description">
              <p class="item__content__description__title">Description :</p>
              <p id="description">${products.description}</p>
            </div>`
		);
        console.log(products.colors);
        colors.insertAdjacentHTML(
			"afterbegin",
			`<option value="">${products.colors[0]}</option>
            <option value="">${products.colors[1]}</option>
<!--                       <option value="vert">vert</option>
                                  <option value="blanc">blanc</option> -->`
		);
	})
	.catch((err) => {
		console.error(err);
	});


    