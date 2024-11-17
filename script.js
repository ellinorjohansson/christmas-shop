let cartCount = 0;
let cartTotal = 0;
 
// Function to update total and products in HTML
function initializeCart() {
    document.querySelector('#cart-count').innerText = cartCount;
    document.querySelector('#cart-total-header').innerText = "Total: " + cartTotal + " SEK";
    document.querySelector('#cart-total').innerText = cartTotal + " SEK";  // För varukorgen
}
 
initializeCart();
 
// Open shopping cart when clicked
document.querySelector('#cart-container').addEventListener('click', toggleCart);
 
// Close shopping cart when clicked
document.querySelector('#close-cart').addEventListener('click', toggleCart);
 
// Get all buttons to add products
const addItemButtons = document.querySelectorAll('.add-item');
addItemButtons.forEach(button => {
    button.addEventListener('click', function () {
        // Get the price
        const price = parseInt(button.getAttribute('data-price'));
        addItem(price);
    });
});
 
// Function to hide/show shopping cart
function toggleCart() {
    const cartOverlay = document.querySelector('#cart-overlay');
    // Switch between show and hide shopping cart
    cartOverlay.style.display = cartOverlay.style.display === 'block' ? 'none' : 'block';
}
 
// Function to add a product
function addItem(price) {
    // Increase the number of items and add the price to the total
    cartCount++;
    cartTotal += price;
   
    // Update the HTML elements with the current count and total amount
    document.querySelector('#cart-count').innerText = cartCount;
    document.querySelector('#cart-total').innerText = cartTotal + " SEK";  
    document.querySelector('#cart-total-header').innerText = "Total: " + cartTotal + " SEK"; 
    document.querySelector('#cart-items').innerText = `Total products: ${cartCount}`;
}
 
 // To open shopping cart with enter
document.querySelector('#cart-container').addEventListener('keydown', function(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        toggleCart();
    }
});
 
 
//Shopping product
const products = [
  { name: "Christmas Tree 1", category: "Christmas Tree", price: 500, rating: 4.8, 
    image: { url: "assets/images/Christmas_tree1.avif.avif", width: 200, height: 300, alt: "Picture of a Christmas tree with snow over it in porcelain. In the background are more similar Christmas trees." } },
  { name: "Christmas Tree 2", category: "Christmas Tree", price: 100, rating: 4.5, 
    image: { url: "assets/images/Christmas_tree2.avif.avif", width: 150, height: 150, alt: "Picture of a Christmas tree with snow on it and a present under the tree, made in porcelain." } },
  { name: "Christmas Tree 3", category: "Christmas Tree", price: 200, rating: 4.7, 
    image: { url: "assets/images/Christmas_tree3.avif.avif", width: 200, height: 200, alt: "Picture of two Christmas trees with snow on them and are decorated in porcelain standing next to each other and under them is a glass box." } },
  { name: "Gingerbread 1", category: "Gingerbread", price: 300, rating: 4.3, 
    image: { url: "assets/images/Gingerbread_1.avif.avif", width: 180, height: 250, alt: "Decorated gingerbread house with a snowman standing outside wearing a red hat and scarf. Made in porcelain." } },
  { name: "Gingerbread 2", category: "Gingerbread", price: 150, rating: 4.9, 
    image: { url: "assets/images/Gingerbread_2-avif.avif", width: 150, height: 150, alt: "Decorated gingerbread house with a gingerbread standing outside the house. Made in porcelain." } },
  { name: "Gingerbread 3", category: "Gingerbread", price: 250, rating: 4.6, 
    image: { url: "assets/images/Gingerbread_3.avif.avif", width: 300, height: 100, alt: "Decorated gingerbread house with Christmas trees on either side of the door outside the house. Made in porcelain." } },
  { name: "Santa Plate 1", category: "Plate", price: 120, rating: 4.8, 
    image: { url: "assets/images/Santa_plate1.avif.avif", width: 200, height: 200, alt: "A Christmas plate with a red border all around and a pattern of a standing happy Santa Claus and around the Santa Claus there is a deer, polka dot pole and Christmas decorations." } },
  { name: "Santa Plate 2", category: "Plate", price: 200, rating: 4.2, 
    image: { url: "assets/images/Santa_plate2.avif.avif", width: 250, height: 200, alt: "A" } },
  { name: "Santa Plate 3", category: "Plate", price: 80, rating: 4.7, 
    image: { url: "assets/images/Santa_plate3.avif.avif", width: 150, height: 150, alt: "A" } },
  { name: "Gold Christmas Bauble", category: "Bauble", price: 50, rating: 4.4, 
    image: { url: "assets/images/Gold_Christmas_bauble.avif.avif", width: 120, height: 180, alt: "A" } },
  { name: "Red Christmas Bauble", category: "Bauble", price: 300, rating: 4.9, 
    image: { url: "assets/images/Red_Christmas_bauble.avif.avif", width: 200, height: 200, alt: "A" } },
  { name: "Snowflake Christmas Bauble", category: "Bauble", price: 400, rating: 4.5, 
    image: { url: "assets/images/Snowflake_Christmas_bauble.avif.avif", width: 250, height: 150, alt: "A" } },
];
 
 
// Function to show products in HTML
function displayProducts(productsToDisplay) {
    const shopContent = document.querySelector("#shopContent");
    shopContent.innerHTML = ""; // Clear content first
 
    productsToDisplay.forEach(product => {
        const productElement = document.createElement("div");
        productElement.className = "shop-item";
        productElement.innerHTML = `
            <img src="${product.image.url}" alt="${product.alt}">
            <p>${product.name}</p>
            <p>${product.price} SEK</p>
            <p>${product.category}</p>
            <button class="add-item" data-price="${product.price}">Add product for ${product.price} SEK</button>
        `;
        shopContent.appendChild(productElement);
    });
 
    // Add button for every Add Product
    const addItemButtons = document.querySelectorAll('.add-item');
    addItemButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Get the price
            const price = parseInt(button.getAttribute('data-price'));
            addItem(price); // Add product to shopping cart
        });
    });
}
 
 
// Function to sort products
function sortProducts() {
    const sortBy = document.getElementById("sort").value;
    let sortedProducts = [...products]; // Copy array to not disturb the original
 
    sortedProducts.sort((a, b) => {
        if (sortBy === "price") {
            return a.price - b.price;
        } else if (sortBy === "name") {
            return a.name.localeCompare(b.name);
        } else if (sortBy === "category") {
            return a.category.localeCompare(b.category);
        }
    });
 
    displayProducts(sortedProducts); // Update product list
}
 
 
// Eventlistener for sort by
document.getElementById("sort").addEventListener("change", sortProducts);
 
// Show when reload
document.addEventListener("DOMContentLoaded", () => displayProducts(products));
 
 
 

// Switch between dark/light mode
document.addEventListener("DOMContentLoaded", function () {
    const themeToggleButton = document.querySelector(".btn");
    const body = document.body;
 
    themeToggleButton.addEventListener("click", () => {
        body.classList.toggle("dark-theme");
 
        // Update icon based on what theme
        if (body.classList.contains("dark-theme")) {
            themeToggleButton.innerHTML = `<span class="material-symbols-outlined">light_mode</span>`;
        } else {
            themeToggleButton.innerHTML = `<span class="material-symbols-outlined">dark_mode</span>`;
        }
    });
});
