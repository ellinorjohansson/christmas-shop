import products from "./products.mjs";

// Variables for total and count
let cartCount = 0;
let cartTotal = 0;
let cartItems = [];

//Cart update
function updateCart() {
    const discount = updateMondayDiscount(); 
    const isWeekend = isWeekendSurge();     
    let totalAfterDiscount = cartTotal - discount; 

    // Weekendpris
    if (isWeekend) {
        totalAfterDiscount *= 1.15;  
    }

    const shippingCost = calculateShipping();
    const totalWithShipping = totalAfterDiscount + shippingCost;

    // Without shipping cost in header
    document.querySelector('#cart-count').innerText = cartCount;
    document.querySelector('#cart-total-header').innerText = "Total: " + totalAfterDiscount.toFixed(2) + " SEK";

    //Show shipping cost in overlay
    document.querySelector('#cart-total').innerText = totalWithShipping.toFixed(2) + " SEK";
    document.querySelector('#cart-items').innerText = `Total products: ${cartCount}`;

    const cartTotalHeader = document.querySelector('#cart-total-header');
    cartTotalHeader.style.color = '#752922';
    const originalColor = '#faebd7';

    setTimeout(function () {
        cartTotalHeader.style.color = originalColor; 
    }, 500); 

    handlePaymentMethodChange();
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

// Open shopping cart
function setupCartListeners() {
    document.querySelector('#cart-container').addEventListener('click', toggleCart);
    document.querySelector('#close-cart').addEventListener('click', toggleCart);
}

//TIMER ON WEBSITE

//For timer on the site
let timerStarted = false; 

// Add item to cart so the timer can start
function addItemToCart(name, price, quantity) {
    startCartTimer();

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

    // Update shopping count and total
    cartCount += quantity;
    cartTotal += price * quantity;

    applyDiscountToCart();
    updateCart();
    updateOverlay();
}

//Alert that the customer is too slow and start timer
function startCartTimer() {
    if (!timerStarted) {
        timerStarted = true;

        // Start 15 min timer
        setTimeout(() => {
            alert("You were too slow! Your cart is now being cleared.");
            location.reload(); 
        }, 15 * 60 * 1000); // 15 min
    }
}

//OVERLAY / SHOPPING CART

//Things you want to buy that views in overlay
function updateOverlay() {
    const cartDetails = document.querySelector('#cart-details');
    cartDetails.innerHTML = "";

    let totalCartPrice = 0;

    cartItems.forEach(item => {
        const product = products.find(product => product.name === item.name);

        if (product) {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';

            const displayedPrice = item.discountedPrice || item.price;
            const itemTotalPrice = displayedPrice * item.quantity;
            totalCartPrice += itemTotalPrice;

            itemElement.innerHTML = `
                <img src="${product.image.url}" alt="${product.image.alt}" class="cart-item-image" loading="lazy">
                <p><strong>${item.name}</strong></p>
                <p>Price for one: ${displayedPrice.toFixed(2)} SEK</p> 
                <p>Quantity: ${item.quantity}</p>
                <p>Total: ${itemTotalPrice.toFixed(2)} SEK</p> 
                <button class="remove-item" data-name="${item.name}">Remove</button>
            `;

            cartDetails.appendChild(itemElement);
        }
    });

    const cartTotalElement = document.querySelector('#cart-total-overlay');
    if (cartTotalElement) {
        cartTotalElement.innerText = "Total: " + totalCartPrice.toFixed(2) + " SEK"; 
    }

    setupRemoveButtons();
}

//Setup of remove button in overlay
function setupRemoveButtons() {
    const removeButtons = document.querySelectorAll('.remove-item');

    removeButtons.forEach(button => {
        button.addEventListener('click', function () {
            const productName = button.getAttribute('data-name');
            removeItemFromCart(productName);
        });
    });
}

//Remove button in overlay for every product
function removeItemFromCart(name) {
    const itemIndex = cartItems.findIndex(item => item.name === name);

    if (itemIndex > -1) {
        const item = cartItems[itemIndex];

        cartCount -= item.quantity;
        cartTotal -= item.totalPrice;

        cartItems.splice(itemIndex, 1);

        updateCart();
        updateOverlay();
    }
}

//Shipping cost
function calculateShipping() {
    let shippingCost = 0;

    if (cartCount > 14) {
        shippingCost = 0; 
    } else {
        shippingCost = 25 + (cartTotal * 0.1); 
    }

    document.querySelector('#shipping-cost').innerText = shippingCost.toFixed(2) + " SEK";

    return shippingCost;
}

// Handle payment method selection
function handlePaymentMethodChange() {
    const paymentMethodSelector = document.getElementById('payment-method');
    const personalNumberContainer = document.getElementById('personal-number-container');
    const cardFields = document.getElementById('card-fields');
    const personalNumberInput = document.getElementById('personal-number');
    
    // Default to card method
    paymentMethodSelector.value = 'card';
    cardFields.style.display = 'block';
    personalNumberContainer.style.display = 'none';
    personalNumberInput.required = false;

    // Disable invoice payment option if total exceeds 800 SEK
    if (cartTotal > 800) {
        const invoiceOption = document.querySelector('option[value="invoice"]');
        if (invoiceOption) {
            invoiceOption.disabled = true;
        }
    } else {
        const invoiceOption = document.querySelector('option[value="invoice"]');
        if (invoiceOption) {
            invoiceOption.disabled = false;
        }
    }

    // When payment method changes
    paymentMethodSelector.addEventListener('change', () => {
        const isCard = paymentMethodSelector.value === 'card';
        cardFields.style.display = isCard ? 'block' : 'none';
        personalNumberContainer.style.display = isCard ? 'none' : 'block';
        personalNumberInput.required = !isCard;  
    });
}

// Reset shopping cart button that is in the checkout form
function resetShop() {
    document.getElementById('reset-btn').addEventListener('click', function() {
        if (confirm("Are you sure you want to reset your order?")) {
        location.reload();
        }
    });
}

//PRODUCTS YOU CAN BUY

// Display all products
function displayProducts(productsToDisplay) {
    const shopContent = document.querySelector("#shopContent");
    shopContent.innerHTML = ""; // Clear content

    const isWeekend = isWeekendSurge(); //if it's between friday 3pm to monday 3am

    productsToDisplay.forEach(product => {
        let displayedPrice = product.price;

        if (isWeekend) {
            displayedPrice = product.price * 1.15;  
        }

        const productElement = document.createElement("div");
        productElement.className = "shop-item";

        productElement.innerHTML = `
            <img src="${product.image.url}" alt="${product.image.alt}" loading="lazy">
            <p>${product.name}</p>
            <p>${displayedPrice.toFixed(2)} SEK</p> 
            <div class="rating">${generateStar(product.rating)}</div>
            <p>${product.category}</p>
            <div class="quantity-controls">
                <button class="decrease" data-price="${product.price}" data-name="${product.name}">-</button>
                <span class="quantity" data-name="${product.name}">1</span>
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

    sortedProducts.sort((product1, product2) => {
        if (sortBy === "price") {
            return product1.price - product2.price;
        } else if (sortBy === "name") {
            return product1.name.localeCompare(product2.name);
        } else if (sortBy === "category") {
            return product1.category.localeCompare(product2.category);
        } else if (sortBy === "rating") {
            return product1.rating - product2.rating;
        }
    });

    displayProducts(sortedProducts);
}

// Function for generate stars based on rating
function generateStar(rating) {
    let stars = '';
    for (let i = 0; i < 5; i++) {
        if (i < rating) {
            stars += '<span class="material-symbols-outlined rating-star">star</span>'; // Filled star
        } else {
            stars += '<span class="material-symbols-outlined rating-star-empty">star</span>'; // Empty star
        }
    }
    return stars;
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
            if (currentQuantity > 1) {
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
                quantitySpan.innerText = 1; 
            }
        });
    });
}

//DISCOUNT

// If there is monday before 10am 
function isMondayMorning() {
    const now = new Date();
    return now.getDay() === 1 && now.getHours() < 10; //monday is 1
}

//Monday discount on total price
function calculateMondayDiscount(total) {
    if (isMondayMorning()) {
        return total * 0.1; 
    }
    return 0;
}

// Update discount monday
function updateMondayDiscount() {
    const mondayDiscountElement = document.querySelector('#monday-discount');
    const discount = calculateMondayDiscount(cartTotal);

    if (discount > 0) {
        mondayDiscountElement.style.display = 'block';
        mondayDiscountElement.innerText = `Monday discount: 10% on the entire order! (-${discount} SEK)`;
    } else {
        mondayDiscountElement.style.display = 'none';
    }
    return discount;
}

//Discount from friday 3pm to sunday 3am
function isWeekendSurge() {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const hourOfDay = now.getHours();

    if ((dayOfWeek === 5 && hourOfDay >= 15) ||  
        (dayOfWeek === 6) ||                 
        (dayOfWeek === 1 && hourOfDay < 3)) { 
        return true; 
    }
    return false;
}

// Apply 10% discount if quantity is 10 or more
function applyDiscountToCart() {
    let discountApplied = false;  

    cartItems.forEach(item => {
        if (item.quantity >= 10) {
            item.totalPrice = item.quantity * item.price * 0.9;  // 10% discount
            discountApplied = true;  
        } else {
            item.totalPrice = item.quantity * item.price; 
        }
    });

    const discountMessage = document.getElementById('discount-message');
    if (discountApplied) {
        discountMessage.style.display = 'block'; 
    } else {
        discountMessage.style.display = 'none';  
    }

    // Recalculate the total price after discounts
    cartTotal = cartItems.reduce((total, item) => total + item.totalPrice, 0);
}

//DOM

//DOMContentLoaded / validate form
document.addEventListener('DOMContentLoaded', function () {
    const phoneInput = document.getElementById('phone-input');
    const emailInput = document.getElementById('email-input');
    const personalNumberInput = document.getElementById('personal-number');
    const termsCheckbox = document.getElementById('terms-checkbox');

    const submitButton = document.getElementById('submit-form');
    const orderConfirmation = document.getElementById('order-confirmation');
    const closeConfirmation = document.getElementById('close-confirmation');
    const phoneError = document.getElementById('phone-error');
    const emailError = document.getElementById('email-error');
    const personalNumberError = document.getElementById('personal-number-error');
    const termsError = document.getElementById('terms-error');

    phoneError.style.display = 'none';
    emailError.style.display = 'none';
    personalNumberError.style.display = 'none';
    termsError.style.display = 'none';

    // Function to control if the form is valid
    function validateForm() {
        let isValid = true;

        // Clean error message
        phoneError.textContent = '';
        emailError.textContent = '';
        personalNumberError.textContent = '';
        termsError.textContent = '';

        // Validate phone number
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phoneInput.value)) {
            phoneError.innerHTML = '<span class="material-symbols-outlined">error</span> Invalid phone number!';
            phoneError.style.display = 'block'; 
            isValid = false;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            emailError.innerHTML = '<span class="material-symbols-outlined">error</span> Invalid mail! Enter a correct mail.';
            emailError.style.display = 'block'; 
            isValid = false;
        }

         // Check if card is selected and skip personal number validation if card is selected
        const isCardSelected = document.getElementById('payment-method').value === 'card';
        if (!isCardSelected) {
         const personalNumberRegex = /^\d{6}-\d{4}$/;
            if (!personalNumberRegex.test(personalNumberInput.value)) {
                personalNumberError.innerHTML = '<span class="material-symbols-outlined">error</span> Invalid personal number! Enter in: YYMMDD-XXXX.';
                personalNumberError.style.display = 'block'; 
                isValid = false;
        }
    }

        // Validate terms and condition
        if (!termsCheckbox.checked) {
            termsError.innerHTML = '<span class="material-symbols-outlined">error</span> You must accept the terms.';
            termsError.style.display = 'block'; 
            isValid = false;
        }

        // Update submit button
        if (isValid) {
            submitButton.classList.add('active');  
        } else {
            submitButton.classList.remove('active');  
        }
    }

    // Event listener on every input of form
    phoneInput.addEventListener('input', validateForm);
    emailInput.addEventListener('input', validateForm);
    personalNumberInput.addEventListener('input', validateForm);
    termsCheckbox.addEventListener('change', validateForm);

    // When the user click on 'place order', validate and show if there is error
    submitButton.addEventListener('click', function (event) {
        event.preventDefault(); 
    
        validateForm();
        //Show order confirmation
        if (submitButton.classList.contains('active')) {
            orderConfirmation.style.display = 'flex'; 
        }
    });

    closeConfirmation.addEventListener('click', function () {
        location.reload(); 
    });
    
    
    displayProducts(products);
    setupCartListeners();
    resetShop();
    toggleTheme();
    handlePaymentMethodChange();
    updateCart();

    document.getElementById("sort").addEventListener("change", sortProducts);

    updateCart();
});

//THINGS ON THE WEBSITE

//Time for shopping button
document.getElementById("shop-button").addEventListener("click", function () {
    const target = document.getElementById("shopContent");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });

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

  
