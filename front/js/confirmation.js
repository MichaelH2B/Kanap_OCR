// Recuperer l'URL ?id= 
const url = location.search;
console.log(url);

// Paramètres de l'URL
const urlSearchparams = new URLSearchParams(url);
console.log(urlSearchparams);

// on extrait l'id et on le stock
let orderId = urlSearchparams.get('order_id');
console.log(orderId);

// on selectionne notre p dans la div confirmation 
let order = document.querySelector('#orderId');

// on affiche le orderId en HTML
order.textContent = orderId;

// nettoyage du localStorage
localStorage.clear();