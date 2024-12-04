//Shopping product
const products = [
    { name: "Christmas Tree 1", category: "Christmas Tree", price: 500, rating: 5, 
      image: { url: "assets/images/Christmas_tree1.avif.avif", width: 300, height: 300, alt: "Picture of a Christmas tree with snow over it in porcelain. In the background are more similar Christmas trees." } },
    { name: "Christmas Tree 2", category: "Christmas Tree", price: 100, rating: 4, 
      image: { url: "assets/images/Christmas_tree2.avif.avif", width: 300, height: 300, alt: "Picture of a Christmas tree with snow on it and a present under the tree, made in porcelain." } },
    { name: "Christmas Tree 3", category: "Christmas Tree", price: 200, rating: 4, 
      image: { url: "assets/images/Christmas_tree3.avif.avif", width: 300, height: 300, alt: "Picture of two Christmas trees with snow on them and are decorated in porcelain standing next to each other and under them is a glass box." } },
    { name: "Gingerbread 1", category: "Gingerbread", price: 300, rating: 4, 
      image: { url: "assets/images/Gingerbread_1.avif.avif", width: 300, height: 300, alt: "Decorated gingerbread house with a snowman standing outside wearing a red hat and scarf. Made in porcelain." } },
    { name: "Gingerbread 2", category: "Gingerbread", price: 150, rating: 5, 
      image: { url: "assets/images/Gingerbread_2-avif.avif", width: 300, height: 300, alt: "Decorated gingerbread house with a gingerbread standing outside the house. Made in porcelain." } },
    { name: "Gingerbread 3", category: "Gingerbread", price: 250, rating: 3, 
      image: { url: "assets/images/Gingerbread_3.avif.avif", width: 300, height: 300, alt: "Decorated gingerbread house with Christmas trees on either side of the door outside the house. Made in porcelain." } },
    { name: "Santa Plate 1", category: "Plate", price: 120, rating: 2, 
      image: { url: "assets/images/Santa_plate1.avif.avif", width: 300, height: 300, alt: "A Christmas plate with a red border all around and a pattern of a standing happy Santa Claus and around the Santa Claus there is a deer, polka dot pole and Christmas decorations." } },
    { name: "Santa Plate 2", category: "Plate", price: 200, rating: 3, 
      image: { url: "assets/images/Santa_plate2.avif.avif", width: 300, height: 300, alt: "Christmas plate with a blue border all around with a Santa's face in the middle and Christmas decoration in the form of deer and polka." } },
    { name: "Santa Plate 3", category: "Plate", price: 80, rating: 4, 
      image: { url: "assets/images/Santa_plate3.avif.avif", width: 300, height: 300, alt: "Christmas plate with a red white border all around with Santa in the center of the plate. Around Santa there are Christmas decorations in the form of stars and deer." } },
    { name: "Gold Christmas Bauble", category: "Bauble", price: 50, rating: 2, 
      image: { url: "assets/images/Gold_Christmas_Bauble.avif.avif", width: 300, height: 300, alt: "Close-up of a golden Christmas bauble hanging from a Christmas tree." } },
    { name: "Red Christmas Bauble", category: "Bauble", price: 300, rating: 4, 
      image: { url: "assets/images/Red_Christmas_Bauble.avif.avif", width: 300, height: 300, alt: "Close-up of a red and white Christmas bauble hanging from a Christmas tree." } },
    { name: "Snowflake Christmas Bauble", category: "Bauble", price: 400, rating: 1, 
      image: { url: "assets/images/Snowflake_Christmas_Bauble.avif.avif", width: 300, height: 300, alt: "Close-up of a snowflake Christmas bauble hanging from a Christmas tree." } },
  ];

// Variables for total and count
let cartCount = 0;
let cartTotal = 0;
let cartItems = [];

// Update cart total and count in HTML header
const originalColor = '#faebd7';

function updateCart() {
    const discount = updateMondayDiscount();
    const isWeekend = isWeekendSurge();  
    let totalAfterDiscount = cartTotal - discount;

    // Apply weekend price
    if (isWeekend) {
        totalAfterDiscount *= 1.15;  
    }

    totalAfterDiscount = totalAfterDiscount.toFixed(2);

    // Update the header elements with the total price after discount and surcharge
    document.querySelector('#cart-count').innerText = cartCount;
    document.querySelector('#cart-total').innerText = totalAfterDiscount + " SEK";
    document.querySelector('#cart-total-header').innerText = "Total: " + totalAfterDiscount + " SEK";

    const cartTotalHeader = document.querySelector('#cart-total-header');
    cartTotalHeader.style.color = '#752922';

    setTimeout(function () {
        cartTotalHeader.style.color = originalColor; 
    }, 500); 

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

// Open shopping cart on cart container click or enter key press
function setupCartListeners() {
    document.querySelector('#cart-container').addEventListener('click', toggleCart);
    document.querySelector('#close-cart').addEventListener('click', toggleCart);
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


//Things you want to buy that views in overlay
function updateOverlay() {
    const cartDetails = document.querySelector('#cart-details');
    cartDetails.innerHTML = "";

    const isWeekend = isWeekendSurge();  // Check if it's during the weekend

    let totalCartPrice = 0;  

    cartItems.forEach(item => {
        const product = products.find(product => product.name === item.name);

        if (product) {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';

            let displayedPrice = item.price;
            if (isWeekend) {
                displayedPrice = item.price * 1.15; 
            }

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

    // Update total cart price in overlay after applying the weekend surcharge
    const cartTotalElement = document.querySelector('#cart-total-overlay');
    if (cartTotalElement) {
        cartTotalElement.innerText = "Total: " + totalCartPrice.toFixed(2) + " SEK"; 
    }

    setupRemoveButtons();
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

function setupRemoveButtons() {
    const removeButtons = document.querySelectorAll('.remove-item');

    removeButtons.forEach(button => {
        button.addEventListener('click', function () {
            const productName = button.getAttribute('data-name');
            removeItemFromCart(productName);
        });
    });
}

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

// Handle payment method selection and validation
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

    // When payment method changes
    paymentMethodSelector.addEventListener('change', () => {
        const isCard = paymentMethodSelector.value === 'card';
        cardFields.style.display = isCard ? 'block' : 'none';
        personalNumberContainer.style.display = isCard ? 'none' : 'block';
        personalNumberInput.required = !isCard;  
    });
}

     // If there is monday before 10am
     function isMondayMorning() {
        const now = new Date();
        return now.getDay() === 1 && now.getHours() < 10; //monday is 1
    }

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

// Reset shopping cart
function resetShop() {
    document.getElementById('reset-btn').addEventListener('click', function() {
        if (confirm("Are you sure you want to reset your order?")) {
        location.reload();
        }
    });
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

document.getElementById("shop-button").addEventListener("click", function () {
    const target = document.getElementById("shopContent");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
  
