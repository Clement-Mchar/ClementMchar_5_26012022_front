//---- on récupère l'order-id affiché dans l'URL, et on l'affiche en numéro de commande dans le HTML -------//

const orderUrl = window.location.href;
let url = new URL(orderUrl);
let searchParams = new URLSearchParams(url);
let orderId = url.searchParams.get("id");

document.querySelector("#orderId").textContent = orderId;
