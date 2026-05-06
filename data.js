let product = [];
let cardItem = [];

// Display
const Display = (prd) => {
    if (prd.length > 0) {
        prd.forEach((item) => {
            document.getElementById("show-product").innerHTML += `
            
            <div class="col-12 col-sm-6 col-md-4 col-lg-3">
            <div class="card h-100  border-0 product-card">
                <img src="${item.image}"
                    class="card-img-top" alt="..." />

                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${item.name}</h5>
                    <p class="card-text text-muted small">
                        ${item.discription}
                    </p>

                    <h6 class="text-primary mb-3">$${item.price}</h6>

                    <button onclick=' AddtoCard(${item.id})' class="btn btn-primary mt-auto w-100">
                        <i class="bi bi-cart-plus"></i> Add To Cart
                    </button>
                </div>
            </div>
        </div>
        
        `;
        });
    }
    Update();
};

fetch("https://thoenthonny.github.io/data-json-computer/")
    .then((res) => res.json())
    .then((pcdata) => {
        product = pcdata;
        Display(product);
    })
    .catch((err) => console.log(err));

// search names product

document.getElementById("search-data").addEventListener("input", function (e) {
    let search_value = e.target.value.toLowerCase();
    console.log(search_value);

    let found = product.filter((pro) => {
        return pro.name.toLowerCase().includes(search_value);
    });
    document.getElementById("show-product").innerHTML = "";
    if (found.length > 0) {
        Display(found);
        document.getElementById("txt-found").innerHTML = ``;
    } else {
        document.getElementById("txt-found").innerHTML = `Product is Not Found..!`;
    }
});

// fn add to card
const AddtoCard = (productId) => {
    console.log(productId);

    let prd = product.find((pro) => pro.id === productId);
    let itemcart = cardItem.find((i) => i.id === productId);
    if (itemcart) {
        itemcart.qty += 1;
    } else {
        cardItem.push({ ...prd, qty: 1 });
    }

    Swal.fire({
        title: `${prd.name} Add to Cart`,
        text: "Please Check Your Cart",
        icon: "success",
    });

    Update();
};

const Update = () => {
    let cartCount = document.getElementById("cart_count");
    let tocard = document.getElementById("cart-items");

    let totalItem = cardItem.reduce((sum, item) => sum + item.qty, 0);

    cartCount.innerHTML = totalItem;
    let show = ``;
    let showItem = ``;
    if (cardItem.length === 0) {
        tocard.innerHTML = `<h3 class=" text-center text-dark-emphasis">Your Cart is Empty</h3>`;
        show = `<div class="cart-footer">
                    <div class="d-flex justify-content-between fw-bold">
                        <span>Total Payments</span>
                        <span>$0</span>
                    </div>

                    <button onclick="Checkout()" class="btn btn-dark w-100 mt-3">Checkout</button>
                </div>`;
        document.getElementById('card-sumary').innerHTML = show;
    } else {
        cardItem.forEach(items => {
            showItem += `<div class="cart-item">
                    <img src="${items.image}" alt="">
                    <div class="cart-info">
                        <h6>${items.name}</h6>
                        <p>$${items.price}</p>

                        <div class="cart-actions">
                            <button onclick="UpdateQTY(${items.id},-1)">-</button>
                            <span>${items.qty}</span>
                            <button onclick="UpdateQTY(${items.id},1)">+</button>
                        </div>
                    </div>

                    <i onclick="RemoveCart(${items.id})" class="bi bi-trash remove-btn"></i>
                </div>`
            tocard.innerHTML = showItem

        })
        let totalpayments = cardItem.reduce((sum, i) => sum + i.qty * i.price, 0);
        show = `<div class="cart-footer">
                    <div class="d-flex justify-content-between fw-bold">
                        <span>Total Payments</span>
                        <span>$${totalpayments}</span>
                    </div>

                    <button onclick="Checkout()" class="btn btn-dark w-100 mt-3">Checkout</button>
            </div>`
        document.getElementById('card-sumary').innerHTML = show;
    }
};

const RemoveCart = (prdId) => {
    cardItem = cardItem.filter(i => i.id !== prdId);
    Update();
}

const UpdateQTY = (prdId, qtyucount) => {
    const qtyData = cardItem.find(i => i.id === prdId);
    if (qtyData) {
        qtyData.qty += qtyucount;
        if (qtyData.qty < 1) {
            RemoveCart(prdId);
        }

    }
    Update();
}

const Checkout = () => {
    if (cardItem.length === 0) {
        Swal.fire({
            icon: "error",
            title: "Your Cart Is empty",
            text: "You Can't Checkout",

        });
    } else {
        cardItem = [];
        Update();
        Swal.fire({
            title: "Thank You For Order ",
            icon: "success",
            draggable: true
        });
    }
}