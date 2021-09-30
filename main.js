const url =
  "https://gist.githubusercontent.com/josejbocanegra/9a28c356416badb8f9173daf36d1460b/raw/5ea84b9d43ff494fcbf5c5186544a18b42812f09/restaurant.json";

fetch(url)
  .then((res) => res.json())
  .then((res) => {
    const datos = res;
    llenarPagina(datos);
  });

const nav = document.getElementById("categorias");
const filaNav = document.createElement("form");
filaNav.className = "form-inline";
const nomCat = document.getElementById("nomCat");
const contOrder = document.getElementById("contOrder");
const div = document.getElementById("tarjetas");
const textoCart = document.getElementById("cart");
const cart = document.getElementById("carro");
const modal = document.querySelector(".modal");
const closeModal = document.getElementById("closeModal");
const cancelOrder = document.getElementById("cancelOrder");
const keepBuying = document.getElementById("keepBuying");

cart.onclick = cartDetail;
closeModal.addEventListener("click", function () {
  modal.style.display = "none";
});
keepBuying.addEventListener("click", function () {
  modal.style.display = "none";
});
cancelOrder.addEventListener("click", function () {
  reiniciarOrden();
  modal.style.display = "none";
});

nav.appendChild(filaNav);

let categorias = [];
let categoria = "";
let carrito = 0;
let orden = [];

function llenarPagina(json) {
  for (let i = 0; i < json.length; i++) {
    categorias.push(json[i].name);
  }
  for (let i = 0; i < categorias.length; i++) {
    const botonNav = document.createElement("button");
    botonNav.textContent = categorias[i];
    botonNav.className = "btn btn-dark";
    botonNav.type = "button";

    filaNav.appendChild(botonNav);

    botonNav.onclick = function () {
      cargar(this.textContent, json);
    };
  }
}

function cargar(boton, json) {
  if (div.hasChildNodes) {
    while (div.firstChild) {
      div.removeChild(div.firstChild);
    }
  }
  removeChildNodes(contOrder);

  let categoria = "";
  let index = -1;

  for (let i = 0; i < categorias.length; i++) {
    if (boton == categorias[i]) {
      categoria = categorias[i];
      index = i;
    }
  }

  nomCat.textContent = categoria;

  for (let i = 0; i < json[index].products.length; i++) {
    const card = document.createElement("div");
    card.className = "card";
    card.style = "width: 18rem;";

    const cardIm = document.createElement("img");
    cardIm.className = "card-img-top";
    cardIm.src = json[index].products[i].image;

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    const cardTitle = document.createElement("div");
    cardTitle.className = "card-title";
    cardTitle.textContent = json[index].products[i].name;

    const cardText = document.createElement("div");
    cardText.className = "card-text";

    const descrip = document.createElement("p");
    descrip.textContent = json[index].products[i].description;

    const price = document.createElement("p");
    price.textContent =
      "$ " + parseFloat(json[index].products[i].price).toFixed(2);
    price.className = "price";

    const botonCard = document.createElement("button");
    botonCard.textContent = "Add to Car";
    botonCard.className = "btn btn-dark";

    cardText.appendChild(descrip);
    cardText.appendChild(price);

    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);
    cardBody.appendChild(botonCard);

    card.appendChild(cardIm);
    card.appendChild(cardBody);

    div.appendChild(card);

    let items = "";

    botonCard.onclick = function () {
      carrito += 1;
      carrito == 1 ? (items = " item") : (items = " items");
      textoCart.textContent = carrito + items;
      createOrder(json, index, i);
    };
  }
}

function cartDetail() {
  removeChildNodes(div);
  removeChildNodes(contOrder);

  nomCat.textContent = "Order detail";

  const tabla = document.createElement("table");
  tabla.className = "table table-striped";

  const head = document.createElement("thead");
  const body = document.createElement("tbody");

  const filaPrincipal = document.createElement("tr");
  const col1Principal = document.createElement("th");
  const col2Principal = document.createElement("th");
  const col3Principal = document.createElement("th");
  const col4Principal = document.createElement("th");
  const col5Principal = document.createElement("th");
  const col6Principal = document.createElement("th");

  col1Principal.textContent = "Item";
  col2Principal.textContent = "Qty.";
  col3Principal.textContent = "Description";
  col4Principal.textContent = "Unit Prince";
  col5Principal.textContent = "Amount";
  col6Principal.textContent = "Modify";

  filaPrincipal.appendChild(col1Principal);
  filaPrincipal.appendChild(col2Principal);
  filaPrincipal.appendChild(col3Principal);
  filaPrincipal.appendChild(col4Principal);
  filaPrincipal.appendChild(col5Principal);
  filaPrincipal.appendChild(col6Principal);

  head.appendChild(filaPrincipal);

  tabla.appendChild(head);

  let precioTotal = 0;

  for (let i = 0; i < orden.length; i++) {
    const fila = document.createElement("tr");
    const col1 = document.createElement("td");
    const col2 = document.createElement("td");
    const col3 = document.createElement("td");
    const col4 = document.createElement("td");
    const col5 = document.createElement("td");
    const col6 = document.createElement("td");

    const plus = document.createElement("button");
    plus.textContent = "+";
    plus.className = "btn btn-secondary btn-sm";
    const minus = document.createElement("button");
    minus.textContent = "-";
    minus.className = "btn btn-secondary btn-sm";

    col1.textContent = i + 1;
    col2.textContent = orden[i][0];
    col3.textContent = orden[i][1];
    col4.textContent = orden[i][2];
    col5.textContent = orden[i][3];

    precioTotal = precioTotal + parseFloat(orden[i][3]);

    col6.appendChild(plus);
    col6.appendChild(minus);

    fila.appendChild(col1);
    fila.appendChild(col2);
    fila.appendChild(col3);
    fila.appendChild(col4);
    fila.appendChild(col5);
    fila.appendChild(col6);

    body.appendChild(fila);

    plus.onclick = function () {
      carrito += 1;
      carrito == 1 ? (items = " item") : (items = " items");
      textoCart.textContent = carrito + items;
      agregar(orden[i][1]);
    };
    minus.onclick = function () {
      carrito -= 1;
      carrito == 1 ? (items = " item") : (items = " items");
      textoCart.textContent = carrito + items;
      remover(orden[i][1]);
    };
  }

  tabla.appendChild(body);
  div.appendChild(tabla);

  const contFila = document.createElement("tr");
  contFila.className = "row d-flex";
  const col1 = document.createElement("td");
  col1.id = "botones";
  col1.className = "col-6";
  const cancel = document.createElement("button");
  cancel.textContent = "Cancel";
  cancel.type = "button";
  cancel.className = "btn btn-danger";

  const confirm = document.createElement("button");
  confirm.textContent = "Confirm order";
  confirm.className = "btn btn-outline-dark";
  col1.appendChild(cancel);
  col1.appendChild(confirm);

  const col2 = document.createElement("td");
  col2.id = "total";
  col2.className = "col-6";
  const total = document.createElement("p");
  total.textContent = "Total: $ " + precioTotal.toFixed(2);
  total.id = "valorTotal";
  col2.appendChild(total);

  contFila.appendChild(col2);
  contFila.appendChild(col1);

  confirm.onclick = function () {
    confirmar();
  };
  cancel.addEventListener("click", function () {
    modal.style.display = "block";
  });

  contOrder.appendChild(contFila);
}

function createOrder(json, index1, index2) {
  if (orden.length == 0) {
    let qty = 1;
    let ord = [
      qty,
      json[index1].products[index2].name,
      json[index1].products[index2].price,
      parseFloat(json[index1].products[index2].price).toFixed(2),
    ];
    orden.push(ord);
  } else {
    let esta = false;
    let pos = 0;
    for (let i = 0; i < orden.length; i++) {
      if (json[index1].products[index2].name == orden[i][1]) {
        esta = true;
        pos = i;
      }
    }
    if (esta) {
      orden[pos][0] = orden[pos][0] + 1;
      orden[pos][3] = (
        parseFloat(orden[pos][2]) * parseFloat(orden[pos][0])
      ).toFixed(2);
    } else {
      let qty = 1;
      let ord = [
        qty,
        json[index1].products[index2].name,
        json[index1].products[index2].price,
        parseFloat(json[index1].products[index2].price).toFixed(2),
      ];
      orden.push(ord);
    }
  }
}

function removeChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function agregar(nombre) {
  for (let i = 0; i < orden.length; i++) {
    if (orden[i][1] == nombre) {
      orden[i][0] = orden[i][0] + 1;
      orden[i][3] = (parseFloat(orden[i][2]) * parseFloat(orden[i][0])).toFixed(
        2,
      );
    }
  }
  cartDetail();
}

function remover(nombre) {
  for (let i = 0; i < orden.length; i++) {
    if (orden[i][1] == nombre) {
      orden[i][0] = orden[i][0] - 1;
      orden[i][3] = (parseFloat(orden[i][2]) * parseFloat(orden[i][0])).toFixed(
        2,
      );
      if (orden[i][0] == 0) {
        orden.splice(i, 1);
      }
    }
  }
  cartDetail();
}

function confirmar() {
  let dict = [];

  for (let i = 0; i < orden.length; i++) {
    dict.push({
      item: i + 1,
      quantity: orden[i][0],
      description: orden[i][1],
      unitPrice: parseFloat(orden[i][2]),
    });
  }
  console.log(dict);
}
function reiniciarOrden() {
  while (orden.length > 0) {
    orden.pop();
  }

  carrito = 0;
  if (carrito == 1) {
    items = " item";
  } else {
    items = " items";
  }
  textoCart.textContent = carrito + items;
  cartDetail();
}
