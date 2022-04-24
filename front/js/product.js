console.log(location);
// Recuperer l'URL ?id= 
const url = location.search;
console.log(url);

// Paramètres de l'URL
const urlSearchparams = new URLSearchParams(url); // Constructeur renvoyant un objet URLSearchParams
console.log(urlSearchparams);

// on extrait l'id et on le stock
const id = urlSearchparams.get("id");  // 'methode' .get nous retourne la valeur associée au paramètre de recherche donné.
console.log(id);


//fonction affichage produit 
function displayProductDetails(product) {

    // "img"
    const img = document.createElement("img");
    img.src = product.imageUrl;
    img.alt = product.altTxt;
    const itemImage = document.querySelector(".item__img");
    itemImage.append(img);

    // Title "h1"
    const title = document.querySelector("#title");
    title.textContent = product.name;

    // Prix "p"
    const price = document.querySelector("#price");
    price.textContent = product.price;

    // Description
    const description = document.querySelector("#description");
    description.textContent = product.description;

    // Choix de couleurs
    const select = document.querySelector("#colors");
    for (color of product.colors) {
        const option = document.createElement("option");
        option.value = color;
        option.textContent = color;
        select.append(option);
    }
}

function getProducts() {

    fetch("http://localhost:3000/api/products/" + id)
        .then(function (res) {
            if (res.ok) {
                return res.json();
            } else {
                console.log("Problem error")
            }
        })
        .then(function (product) {
            displayProductDetails(product);
        });
}
getProducts();

// Fonction log
// function addToCart(id, color, quantity){
//     console.group("produit");
//         console.log("id=" + id);
//         console.log("color=" + color);
//         console.log("qty=" + quantity);
//     console.groupEnd();
// }

// ecouteur d'evenement sur le click
document.querySelector("#addToCart").addEventListener("click", () => {

    let product = document.querySelector("#addToCart").closest(".item");
    let color = product.querySelector("#colors").value;
    let quantity = parseInt(product.querySelector("#quantity").value);
    let imageSrc = product.querySelector(".item__img img").src;
    let altText = product.querySelector(".item__img img").alt;
    let name = product.querySelector("#title").textContent;
    let price = parseInt(product.querySelector("#price").textContent);
    // addToCart(id, color, quantity);

    // Vérification de la couleur
    if (color === "") {
        alert("Couleur invalide");
        return;
    }
    // Vérification de quantité
    if (quantity < 1 || quantity > 100) {
        alert("Quantité invalide");
        return;
    }

    if (color && quantity) {
        // construction du produit a envoyer au panier
        let canap = {
            productId: id,
            color: color,
            qty: quantity,
            img: imageSrc,
            name: name,
            alt: altText,
            price: price,
        };

        // appel de la fonction de commande 
        sendToCart(canap);
    }
});

// passer l'article au panier
function pushProduct(product) {

    cart.push(product);
    localStorage.setItem('canap', JSON.stringify(cart));

};

// fonction de commande
function sendToCart(product) {

    // interroge le localStorage et verifie la presence de la clé canap
    if (localStorage.getItem('canap')) {
        checkParam(localStorage.getItem('canap'), product);

        // si le localStorage est vide, alors on crée la clé canap 
    } else {
        cart = [];
        pushProduct(product);
    }
    window.location.replace("./cart.html");
}

// fonction pour verifier les doublons
function checkParam(ls, product) {

    let cart = JSON.parse(ls);
    console.log(ls); // on stringify notre local storage.
    let inCart = false;
    cart.forEach(item => {
        if (item.productId == product.productId && item.color == product.color) {
            item.qty += product.qty;
            inCart = true;
        }
    });
    if (!inCart) { // on utilise l'operateur logique non (!) qui prend l'opposé de la valeur fournie par l'operante
        cart.push(product);
    }
    localStorage.setItem('canap', JSON.stringify(cart));
}
