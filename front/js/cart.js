let cart = JSON.parse(localStorage.getItem("canap"));
console.table(cart);

// fonction pour recuperer toute la section cart_items
function displayProduct(product) {

  // <article>
  const sectionItems = document.querySelector("#cart__items");
  const article = document.createElement("article");
  article.classList.add("cart__item");
  article.setAttribute("data-id", product.productId);
  article.setAttribute("data-color", product.color);
  article.setAttribute("data-price", product.price);
  sectionItems.append(article);

  // image
  const divImg = document.createElement("div");
  divImg.classList.add("cart__item__img");
  const img = document.createElement("img");
  img.src = product.img;
  img.alt = product.alt;
  divImg.append(img);
  article.append(divImg);

  // h2 nom du produit et prix
  const divContent = document.createElement("div");
  divContent.classList.add("cart__item__content");
  article.append(divContent);
  const divTitlePrice = document.createElement("div");
  divTitlePrice.classList.add("cart__item__content__titlePrice");
  divContent.append(divTitlePrice);

  const h2Name = document.createElement("h2");
  h2Name.textContent = product.name + " - " + product.color;
  divTitlePrice.append(h2Name);

  const pPrix = document.createElement("p");
  pPrix.textContent = product.price * product.qty + " €";
  pPrix.classList.add("cart__item__content__titlePrice__price");
  divTitlePrice.append(pPrix);

  // quantité
  const divSettings = document.createElement("div");
  divSettings.classList.add("cart__item__content__settings");
  const divQuantity = document.createElement("div");
  divQuantity.classList.add("cart__item__content__settings__quantity");

  const pQuantity = document.createElement("p");
  pQuantity.textContent = "Qté :";
  divQuantity.append(pQuantity);

  const inputQuantity = document.createElement("input");
  inputQuantity.classList.add("itemQuantity");
  inputQuantity.setAttribute("type", "number");
  inputQuantity.setAttribute("value", product.qty);
  inputQuantity.name = "itemQuantity";
  inputQuantity.min = "1";
  inputQuantity.max = "100";
  divQuantity.append(inputQuantity);
  divSettings.append(divQuantity);
  divContent.append(divSettings);

  // ecouteur d'evenement pour modifier la quantité
  inputQuantity.addEventListener("change", (e) => {
    modifyQty(product.productId, product.color, parseInt(e.target.value));
  });

  // div supprimer
  const divDelete = document.createElement("div");
  divDelete.classList.add("cart__item__content__settings__delete");
  // bouton pour supprimer le produit
  const pDelete = document.createElement("p");
  pDelete.classList.add("deleteItem");
  pDelete.textContent = "Supprimer";

  // ecouteur d'evenement pour supprimer les produits
  pDelete.addEventListener("click", () => {
    deleteProduct(product.productId, product.color);
  });
  divDelete.append(pDelete);
  divSettings.append(divDelete);

}

//  Fonction async pour afficher le contenu du panier dans la page panier ainsi que le calcul des produits total et du prix.
async function displayCartProducts() {
  // Récupérer les données stockées dans le panier
  const stringifiedValue = localStorage.getItem("canap");
  if (stringifiedValue) {
    console.log("Panier a du contenu");
    cart = JSON.parse(stringifiedValue);
  } else {
    console.log("Panier est vide");
    cart = [];
  }
  // on definit les variables a 0 
  let totalPrice = 0;
  let totalQty = 0;
  // pour chaque produit dans cart
  cart.forEach(prd => {
    displayProduct(prd);
    totalPrice += prd.price * prd.qty;
    totalQty += prd.qty;
  });
  // on apelle la fonction qui affiche le resultat avec les parametre a prendre en compte
  calculateTotalPrices(totalPrice, totalQty);
}
displayCartProducts();

// fonction qui selectionne les id quantité total et prix total a afficher
function calculateTotalPrices(price, qty) {
  document.querySelector("#totalQuantity").textContent = qty;
  document.querySelector("#totalPrice").textContent = price;
}

// fonction qui permet de supprimer les articles dans le panier
function deleteProduct(id, color) {
  cart.forEach((prd, index) => {
    console.log(index);
    if (prd.productId == id && prd.color == color) {
      cart.splice(index, 1);
    }
  });
  localStorage.setItem('canap', JSON.stringify(cart));
  window.location.reload();
}

// fonction qui permet de modifier la quantité des produits
function modifyQty(id, color, qty) {
  cart.forEach((prd, index) => {
    console.log(index);
    if (prd.productId == id && prd.color == color) {
      prd.qty = qty;
    }
  });
  localStorage.setItem('canap', JSON.stringify(cart));
  window.location.reload();
}

// ---------------------- formulaire -------------------------------

// au click sur le bouton commander
// on selectionne notre id order et on fait un ecouteur d'evenement
document.querySelector("#order").addEventListener('click', function (e) {
  e.preventDefault();
  if (cart != null && cart.length != 0) {  // si le panier n'est pas vide 
    contact = getForm();
    // console.log(contact);
    if (contact != null) {   // si le formulaire est bien rempli
      let products = [];
      for (let product of cart) {
        products.push(product.productId)
      }
      // console.log(products);
      let order = { contact, products }
      console.log(order);
      fetch('http://localhost:3000/api/products/order', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order)
      })
        .then(reponse => reponse.json())
        .then(data => {
          console.log(data);
          document.location.href = `confirmation.html?order_id=${data.orderId}`;
        })
        .catch((err) => console.log(err));
    }
  } else {
    alert('Votre panier est vide');
  }
});

// recupération du contenu du formulaire sous forme d'objet
function getForm() {

  form = {
    'firstName': document.querySelector('#firstName').value,
    'lastName': document.querySelector('#lastName').value,
    'address': document.querySelector('#address').value,
    'city': document.querySelector('#city').value,
    'email': document.querySelector('#email').value
  }

  if (formValid(form)) {  // validation du formulaire
    return form;
  } else {
    return null;
  }
}

// validation du contenu du formulaire 
function formValid(form) {

  let valid = true;
  let emailRegExp = new RegExp('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$');
  let charRegExp = new RegExp("^[a-zA-Z ,.'-]+$");
  let addressRegExp = new RegExp("^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+");

  document.querySelector('#firstNameErrorMsg').textContent = ""; // mise à zero des messages d'erreur
  document.querySelector('#lastNameErrorMsg').textContent = "";
  document.querySelector('#addressErrorMsg').textContent = "";
  document.querySelector('#cityErrorMsg').textContent = "";
  document.querySelector('#emailErrorMsg').textContent = "";

  if (!charRegExp.test(form.firstName)) {
    document.querySelector('#firstNameErrorMsg').textContent = "Renseigner un prénom valide.";
    valid = false;
  }
  if (!charRegExp.test(form.lastName)) {
    document.querySelector('#lastNameErrorMsg').textContent = "Renseigner un nom valide.";
    valid = false;
  }
  if (!addressRegExp.test(form.address)) {
    document.querySelector('#addressErrorMsg').textContent = "Renseigner une adresse valide.";
    valid = false;
  }
  if (!charRegExp.test(form.city)) {
    document.querySelector('#cityErrorMsg').textContent = "Renseigner une ville valide.";
    valid = false;
  }
  if (!emailRegExp.test(form.email)) {
    document.querySelector('#emailErrorMsg').textContent = "Renseigner un Email valide.";
    valid = false;
  }
  return valid;
}

