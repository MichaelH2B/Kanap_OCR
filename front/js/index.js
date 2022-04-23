// Fonction qui récupère les données de l'API via fetch
// si nous avons une reponse, on apelle la fonction displayProducts
async function getProducts() {
  let call = await fetch("http://localhost:3000/api/products");
  if (call.ok) {
    let product = await call.json();
    // console.log(product);
    displayProducts(product);
  } else {
    console.log("Problem. error: " + call.status)
  }
}
getProducts();

// function displayProducts(products) {
//   products.forEach(product => {

//     let productLink = document.createElement("a");
//     productLink.href = "./product.html?id=" + product._id;

//     let htmlProduct = "";
//     htmlProduct += `<article>`;
//       htmlProduct += `<img src="${product.imageUrl}" alt="${product.altTxt}"/>`;
//       htmlProduct += `<h3 class="productName">${product.name}</h3>`;
//       htmlProduct += `<p class="productDescription">${product.description}</p>`;
//     htmlProduct += `</article>`;

//     productLink.innerHTML = htmlProduct;
//     document.querySelector("#items").append(productLink);
//   });
// }
//  NE PAS UTILISER innerHTML.

// fonction qui creer toute la section items en html pour contenir les données de l'api
function displayProducts(products) {
  products.forEach(product => {

    // Crée l'élément "a"
    const link = document.createElement("a");
    document.querySelector(".items").append(link);
    link.href = "./product.html?id=" + product._id;
    // console.log(link);

    // Crée l'élément "article"
    const article = document.createElement("article");
    link.append(article);

    // Crée l'élément "img"
    const img = document.createElement("img");
    img.src = product.imageUrl;
    img.alt = product.altTxt;
    article.append(img);

    // Crée l'élément "h3"
    let name = document.createElement("h3");
    name.classList.add("productName");
    name.textContent = product.name;
    article.append(name);

    // Crée l'élément "p"
    let description = document.createElement("p");
    description.classList.add("productDescription");
    description.textContent = product.description;
    article.append(description);
  });
}


