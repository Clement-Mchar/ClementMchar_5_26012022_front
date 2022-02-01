const item = document.getElementById("items");

fetch("http://localhost:3000/api/products")
	.then((products) => {
		if (products.ok) {
			return products.json();
		}
		throw new error(products.statusText);
	})
	.then((products) => {
		let card = "";
		for (let product of products) {
			card += `<a href="./html/product.html?id=${product._id}">
                    <article>
                        <img src="${product.imageUrl}"alt="${product.altTxt}">
                        <h3 class="productName">${product.name}</h3>
                        <p class="productDescription">${product.description}</p>
                    </article>
                </a>`;
		}
		item.insertAdjacentHTML("afterbegin", card);
	})
	.catch((err) => {
		console.error(err);
	});
