const item = document.getElementById("items");

//------- requète à l'api pour obtenir les infos produits et les injecter dynamiquement dans le HTML ------//

fetch("https://kanap-ecommerce.herokuapp.com/api/products")
	.then((products) => {
		if (products.ok) {
			return products.json();
		}
		throw new error(products.statusText);

		//-------------- on injecte les valeurs de chaque produit dans sa carte via le json ----------//

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

	//------------------- on affiche l'erreur s'il y en a une ---------------------------//

	.catch((err) => {
		console.error(err);
	});
