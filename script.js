//Shopping product
const products = [
    { name: "Christmas Tree 1", category: "Christmas Tree", price: 500, rating: 4.8, 
      image: { url: "assets/images/Christmas_tree1.avif.avif", width: 300, height: 300, alt: "Picture of a Christmas tree with snow over it in porcelain. In the background are more similar Christmas trees." } },
    { name: "Christmas Tree 2", category: "Christmas Tree", price: 100, rating: 4.5, 
      image: { url: "assets/images/Christmas_tree2.avif.avif", width: 300, height: 3000, alt: "Picture of a Christmas tree with snow on it and a present under the tree, made in porcelain." } },
    { name: "Christmas Tree 3", category: "Christmas Tree", price: 200, rating: 4.7, 
      image: { url: "assets/images/Christmas_tree3.avif.avif", width: 300, height: 300, alt: "Picture of two Christmas trees with snow on them and are decorated in porcelain standing next to each other and under them is a glass box." } },
    { name: "Gingerbread 1", category: "Gingerbread", price: 300, rating: 4.3, 
      image: { url: "assets/images/Gingerbread_1.avif.avif", width: 300, height: 300, alt: "Decorated gingerbread house with a snowman standing outside wearing a red hat and scarf. Made in porcelain." } },
    { name: "Gingerbread 2", category: "Gingerbread", price: 150, rating: 4.9, 
      image: { url: "assets/images/Gingerbread_2-avif.avif", width: 300, height: 300, alt: "Decorated gingerbread house with a gingerbread standing outside the house. Made in porcelain." } },
    { name: "Gingerbread 3", category: "Gingerbread", price: 250, rating: 4.6, 
      image: { url: "assets/images/Gingerbread_3.avif.avif", width: 300, height: 300, alt: "Decorated gingerbread house with Christmas trees on either side of the door outside the house. Made in porcelain." } },
    { name: "Santa Plate 1", category: "Plate", price: 120, rating: 4.8, 
      image: { url: "assets/images/Santa_plate1.avif.avif", width: 300, height: 300, alt: "A Christmas plate with a red border all around and a pattern of a standing happy Santa Claus and around the Santa Claus there is a deer, polka dot pole and Christmas decorations." } },
    { name: "Santa Plate 2", category: "Plate", price: 200, rating: 4.2, 
      image: { url: "assets/images/Santa_plate2.avif.avif", width: 300, height: 300, alt: "Christmas plate with a blue border all around with a Santa's face in the middle and Christmas decoration in the form of deer and polka." } },
    { name: "Santa Plate 3", category: "Plate", price: 80, rating: 4.7, 
      image: { url: "assets/images/Santa_plate3.avif.avif", width: 300, height: 300, alt: "Christmas plate with a red white border all around with Santa in the center of the plate. Around Santa there are Christmas decorations in the form of stars and deer." } },
    { name: "Gold Christmas Bauble", category: "Bauble", price: 50, rating: 4.4, 
      image: { url: "assets/images/Gold_Christmas_bauble.avif.avif", width: 300, height: 300, alt: "Close-up of a golden Christmas bauble hanging from a Christmas tree." } },
    { name: "Red Christmas Bauble", category: "Bauble", price: 300, rating: 4.9, 
      image: { url: "assets/images/Red_Christmas_bauble.avif.avif", width: 300, height: 300, alt: "Close-up of a red and white Christmas bauble hanging from a Christmas tree." } },
    { name: "Snowflake Christmas Bauble", category: "Bauble", price: 400, rating: 4.5, 
      image: { url: "assets/images/Snowflake_Christmas_bauble.avif.avif", width: 300, height: 300, alt: "Close-up of a snowflake Christmas bauble hanging from a Christmas tree." } },
  ];

// Variables for total and count
let cartCount = 0;
let cartTotal = 0;
let cartItems = [];

// Update cart total and count in HTML
function updateCart() {
    document.querySelector('#cart-count').innerText = cartCount;
    document.querySelector('#cart-total').innerText = cartTotal + " SEK";
    document.querySelector('#cart-total-header').innerText = "Total: " + cartTotal + " SEK";
    document.querySelector('#cart-items').innerText = `Total products: ${cartCount}`;
}


// Toggle shopping cart visibility
function toggleCart() {
    const cartOverlay = document.querySelector('#cart-overlay');
    const body = document.body;

    if (cartOverlay.style.display === 'block') {
        cartOverlay.style.display = 'none'; 
        body.classList.remove('overlay-open');
    } else {
        cartOverlay.style.display = 'block'; 
        body.classList.add('overlay-open');
    }
}

// Open shopping cart on cart container click or Enter key press
function setupCartListeners() {
    document.querySelector('#cart-container').addEventListener('click', toggleCart);
    document.querySelector('#close-cart').addEventListener('click', toggleCart);

    // Open cart with Enter key
    document.querySelector('#cart-container').addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            toggleCart();
        }
    });
}

// Handle adding product to cart
function addItemToCart(name, price, quantity) {
    let existingItem = cartItems.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.totalPrice = existingItem.quantity * price;
    } else {
        cartItems.push({
            name: name,
            price: price,
            quantity: quantity,
            totalPrice: quantity * price,
        });
    }

    cartCount += quantity;
    cartTotal += price * quantity;

    updateCart();
    updateOverlay();
}

//What you want to shop that views in overlay
function updateOverlay() {
    const cartDetails = document.querySelector('#cart-details');
    cartDetails.innerHTML = "";

    cartItems.forEach(item => {
        const product = products.find(product => product.name === item.name);

        if (product) {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';

            itemElement.innerHTML = `
                <img src="${product.image.url}" alt="${product.image.alt}" class="cart-item-image">
                <p><strong>${item.name}</strong></p>
                <p>Price: ${item.price} SEK</p>
                <p>Quantity: ${item.quantity}</p>
                <p>Total: ${item.totalPrice} SEK</p>
            `;

            cartDetails.appendChild(itemElement);
        }
    });
}



// Handle product quantity increase/decrease
function updateProductQuantity() {
    const increaseButtons = document.querySelectorAll('.increase');
    const decreaseButtons = document.querySelectorAll('.decrease');

    increaseButtons.forEach(button => {
        button.addEventListener('click', function () {
            const quantitySpan = document.querySelector(`.quantity[data-name="${button.getAttribute('data-name')}"]`);
            let currentQuantity = parseInt(quantitySpan.innerText);
            quantitySpan.innerText = currentQuantity + 1;
        });
    });

    decreaseButtons.forEach(button => {
        button.addEventListener('click', function () {
            const quantitySpan = document.querySelector(`.quantity[data-name="${button.getAttribute('data-name')}"]`);
            let currentQuantity = parseInt(quantitySpan.innerText);
            if (currentQuantity > 0) {
                quantitySpan.innerText = currentQuantity - 1;
            }
        });
    });
}

// Handle adding item to cart when 'Add product' button is clicked
function setupAddToCartButtons() {
    const addItemButtons = document.querySelectorAll('.add-item');
    addItemButtons.forEach(button => {
        button.addEventListener('click', function () {
            const price = parseInt(button.getAttribute('data-price'));
            const productName = button.getAttribute('data-name');
            const quantitySpan = document.querySelector(`.quantity[data-name="${productName}"]`);
            const quantity = parseInt(quantitySpan.innerText);

            if (quantity > 0) {
                addItemToCart(productName, price, quantity); 
                quantitySpan.innerText = 0; 
            }
        });
    });
}


// Display all products
function displayProducts(productsToDisplay) {
    const shopContent = document.querySelector("#shopContent");
    shopContent.innerHTML = ""; // Clear content

    productsToDisplay.forEach(product => {
        const productElement = document.createElement("div");
        productElement.className = "shop-item";

        productElement.innerHTML = `
            <img src="${product.image.url}" alt="${product.image.alt}">
            <p>${product.name}</p>
            <p>${product.price} SEK</p>
            <p>Rating: ${product.rating}</p>
            <p>${product.category}</p>
            <div class="quantity-controls">
                <button class="decrease" data-price="${product.price}" data-name="${product.name}">-</button>
                <span class="quantity" data-name="${product.name}">0</span>
                <button class="increase" data-price="${product.price}" data-name="${product.name}">+</button>
            </div>
            <button class="add-item" data-price="${product.price}" data-name="${product.name}">Add product</button>
        `;
        shopContent.appendChild(productElement);
    });

    updateProductQuantity();
    setupAddToCartButtons();
}

// Handle product sorting
function sortProducts() {
    const sortBy = document.getElementById("sort").value;
    let sortedProducts = [...products];

    sortedProducts.sort((a, b) => {
        if (sortBy === "price") {
            return a.price - b.price;
        } else if (sortBy === "name") {
            return a.name.localeCompare(b.name);
        } else if (sortBy === "category") {
            return a.category.localeCompare(b.category);
        } else if (sortBy === "rating") {
            return b.rating - a.rating;
        }
    });

    displayProducts(sortedProducts);
}

// Reset shopping cart
function resetShop() {
    document.getElementById('reset-btn').addEventListener('click', function() {
        location.reload();
    });
}

// Handle payment method selection and validation
function handlePaymentMethodChange() {
    const paymentMethodSelector = document.getElementById('payment-method');
    const personalNumberContainer = document.getElementById('personal-number-container');
    const cardFields = document.getElementById('card-fields');
    const personalNumberInput = document.getElementById('personal-number');
    const submitButton = document.getElementById('submit-form');
    const form = document.querySelector('form');

    // Card as default
    paymentMethodSelector.value = 'card';
    cardFields.style.display = 'block';
    personalNumberContainer.style.display = 'none';
    personalNumberInput.required = false;

    // When payment method changes
    paymentMethodSelector.addEventListener('change', () => {
        const isCard = paymentMethodSelector.value === 'card';
        cardFields.style.display = isCard ? 'block' : 'none';
        personalNumberContainer.style.display = isCard ? 'none' : 'block';
        personalNumberInput.required = !isCard;  
        validateForm();
    });

    // Validation for personal number 
    personalNumberInput.addEventListener('input', () => {
        const regex = /^\d{8}-\d{4}$/;
        if (!regex.test(personalNumberInput.value.trim())) {
            personalNumberInput.setCustomValidity("Enter a valid social security number.");
        } else {
            personalNumberInput.setCustomValidity("");
        }
        validateForm();
    });

    // Form validation
    function validateForm() {
        const allValid = [...form.querySelectorAll('input:required')]
            .every(input => input.checkValidity() && input.value.trim());
        submitButton.disabled = !allValid;  
        submitButton.style.opacity = allValid ? '1' : '0.5';  
    }

    form.addEventListener('input', validateForm);  
    form.addEventListener('change', validateForm); 
}



// Toggle between dark and light mode
function toggleTheme() {
    const themeToggleButton = document.querySelector(".btn");
    const body = document.body;

    themeToggleButton.addEventListener("click", () => {
        body.classList.toggle("dark-theme");

        if (body.classList.contains("dark-theme")) {
            themeToggleButton.innerHTML = `<span class="material-symbols-outlined">light_mode</span>`;
        } else {
            themeToggleButton.innerHTML = `<span class="material-symbols-outlined">dark_mode</span>`;
        }
    });
}

// Initialize shop
document.addEventListener("DOMContentLoaded", () => {
    displayProducts(products);
    setupCartListeners();
    resetShop();
    toggleTheme();
    handlePaymentMethodChange();

    document.getElementById("sort").addEventListener("change", sortProducts);

    updateCart();
});
