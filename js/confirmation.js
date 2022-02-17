const orderUrl = window.location.href;
let url = new URL(orderUrl);
let searchParams = new URLSearchParams(url);
let orderId = url.searchParams.get("id");

document.querySelector("#orderId").textContent = orderId;