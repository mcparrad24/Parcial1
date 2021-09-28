const url = "https://gist.githubusercontent.com/josejbocanegra/9a28c356416badb8f9173daf36d1460b/raw/5ea84b9d43ff494fcbf5c5186544a18b42812f09/restaurant.json"

fetch(url).then(res=>res.json()).then(res=>{
    const datos = res;
    llenarPagina(datos);
})

const nav = document.getElementById("categorias");
const filaNav = document.createElement("tr");
const nomCat = document.getElementById("nomCat");
const div = document.getElementById("tarjetas");

nav.appendChild(filaNav);

let categorias = [];
let categoria = "";

function llenarPagina(json){
    for(let i = 0; i < json.length; i++){
        categorias.push(json[i].name);
    }
    for (let i = 0; i < categorias.length; i++){
        const botonNav = document.createElement("button");
        botonNav.textContent = categorias[i];

        filaNav.appendChild(botonNav);

        botonNav.onclick = function(){cargar(this.textContent, json);}
    }
}

function cargar(boton, json){
    if (div.hasChildNodes){
        div.removeChild(div.firstChild);
    }
    let categoria = "";
    let index = -1;

    console.log(boton);

    for (let i = 0; i < categorias.length; i++){
        if (boton == categorias[i]){
            categoria = categorias[i];
            index = i;
        }
    }
    console.log(categoria);
    console.log(index);

    nomCat.textContent = categoria;

    for(let i = 0; i < json[index].products.length; i++){
        const card = document.createElement("div");
        card.className = "card";

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

        const price = document.createElement("small");
        price.textContent = json[index].products[i].price;

        const botonCard = document.createElement("button");
        botonCard.innerHTML = "Add to Cart";
        botonCard.className = "btn btn-primary";

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText);
        cardBody.appendChild(botonCard);

        card.appendChild(cardIm);
        card.appendChild(cardBody);

        div.appendChild(card);
    }
}
