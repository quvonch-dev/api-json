let container = document.querySelector('.container');
let searchInput = document.querySelector('#searchInput');

let cartBtn = document.querySelector('#cartBtn');
let cartCount = document.querySelector('#cartCount');

let cartModal = document.querySelector('#cartModal');
let closeCart = document.querySelector('#closeCart');

let cartItems = document.querySelector('#cartItems');
let cartTotal = document.querySelector('#cartTotal');

let products = [];

let cart = [];


// ================= API =================

fetch('https://dummyjson.com/products')
  .then((res) => {
    return res.json();
  })
  .then((data) => {

    products = data.products;

    showProducts(products);

  })
  .catch((error) => {

    console.log('Xatolik:', error);

  });


// ================= PRODUCTS =================

function showProducts(data) {

  container.innerHTML = '';

  if (data.length === 0) {

    container.innerHTML = `
      <h2 style="
        grid-column: 1 / -1;
        text-align: center;
        color: #718096;
      ">
        😔 Mahsulot topilmadi
      </h2>
    `;

    return;
  }


  data.forEach((item) => {

    const {
      id,
      title,
      brand,
      category,
      thumbnail,
      rating,
      description,
      price,
      stock
    } = item;


    container.innerHTML += `

      <div class="product-card">

        <div class="card-header">

          <span class="badge">
            ${title}
          </span>

          <img
            src="${thumbnail}"
            alt="${title}"
            class="product-image"
          >

        </div>


        <div class="card-body">

          <div class="meta-info">

            <span class="brand">
              ${brand || 'Brand'}
            </span>

            <span class="category">
              ${category}
            </span>

          </div>


          <h2 class="product-title">
            ${title}
          </h2>


          <div class="rating-container">

            <div class="stars">
              ★ ${rating}
            </div>

            <span class="reviews-count">
              Rating
            </span>

          </div>


          <p class="description">
            ${description}
          </p>


          <div class="price-container">

            <div>
              <span class="current-price">
                $${price}
              </span>
            </div>

            <span class="stock-status in-stock">
              Omborda bor (${stock} ta)
            </span>

          </div>

        </div>


        <div class="card-footer">

          <button
            class="add-to-cart-btn"
            onclick="addToCart(${id})"
          >

            🛒

            Savatga qo'shish

          </button>

        </div>

      </div>

    `;

  });

}


// ================= SEARCH =================

searchInput.addEventListener('input', () => {

  let searchValue =
    searchInput.value.toLowerCase().trim();


  let filteredProducts = products.filter((item) => {

    return (
      item.title.toLowerCase().includes(searchValue) ||
      item.category.toLowerCase().includes(searchValue) ||
      (item.brand &&
        item.brand.toLowerCase().includes(searchValue))
    );

  });


  showProducts(filteredProducts);

});


// ================= ADD TO CART =================

function addToCart(id) {

  let product = products.find((item) => item.id === id);

  if (!product) {
    return;
  }


  let existingProduct =
    cart.find((item) => item.id === id);


  if (existingProduct) {

    existingProduct.quantity += 1;

  } else {

    cart.push({
      ...product,
      quantity: 1
    });

  }


  updateCart();

}


// ================= UPDATE CART =================

function updateCart() {

  let totalQuantity = 0;

  let totalPrice = 0;


  cart.forEach((item) => {

    totalQuantity += item.quantity;

    totalPrice +=
      item.price * item.quantity;

  });


  // Savatdagi jami mahsulot
  cartCount.textContent = totalQuantity;


  // Jami narx
  cartTotal.textContent =
    `$${totalPrice.toFixed(2)}`;


  renderCart();

}


// ================= RENDER CART =================

function renderCart() {

  cartItems.innerHTML = '';


  if (cart.length === 0) {

    cartItems.innerHTML = `
      <p class="empty-cart">
        🛒 Savat hozircha bo‘sh
      </p>
    `;

    return;

  }


  cart.forEach((item) => {

    cartItems.innerHTML += `

      <div class="cart-item">

        <img
          src="${item.thumbnail}"
          alt="${item.title}"
        >


        <div class="cart-item-info">

          <h4>
            ${item.title}
          </h4>

          <p>
            $${item.price}
          </p>

        </div>


        <div class="quantity">

          <button
            onclick="decreaseQuantity(${item.id})"
          >
            −
          </button>


          <span>
            ${item.quantity}
          </span>


          <button
            onclick="increaseQuantity(${item.id})"
          >
            +
          </button>

        </div>

      </div>

    `;

  });

}


// ================= PLUS =================

function increaseQuantity(id) {

  let item =
    cart.find((product) => product.id === id);


  if (item) {

    item.quantity += 1;

  }


  updateCart();

}


// ================= MINUS =================

function decreaseQuantity(id) {

  let item =
    cart.find((product) => product.id === id);


  if (!item) {
    return;
  }


  item.quantity -= 1;


  if (item.quantity <= 0) {

    cart = cart.filter(
      (product) => product.id !== id
    );

  }


  updateCart();

}


// ================= OPEN CART =================

cartBtn.addEventListener('click', () => {

  cartModal.classList.add('active');

});


// ================= CLOSE CART =================

closeCart.addEventListener('click', () => {

  cartModal.classList.remove('active');

});


// ================= CLOSE OUTSIDE =================

cartModal.addEventListener('click', (event) => {

  if (event.target === cartModal) {

    cartModal.classList.remove('active');

  }

});