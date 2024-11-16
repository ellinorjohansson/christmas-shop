// Hämta alla nödvändiga DOM-element
const cartContainer = document.querySelector("cart-container-script"); // Huvudbehållaren för kundvagnen
const cartOverlay = document.querySelector("cart-overlay-script"); // Overlay-elementet som visas när kundvagnen öppnas
const closeCartIcon = document.querySelector("close-cart-icon"); // Stäng-knappen för kundvagnen

// Funktion för att öppna kundvagnen
function openCart() {
  // Lägg till en klass som visar overlay
  cartOverlay.classList.add("active");
}

// Funktion för att stänga kundvagnen
function closeCart() {
  // Ta bort klassen som visar overlay
  cartOverlay.classList.remove("active");
}

// Lägg till event listeners
// När användaren klickar på kundvagnsikonen öppnas kundvagnen
cartContainer.addEventListener("click", openCart);

// När användaren klickar på stäng-ikonen stängs kundvagnen
closeCartIcon.addEventListener("click", closeCart);

// Alternativ: Om användaren klickar utanför kundvagnens innehåll (på själva overlay), stäng kundvagnen
cartOverlay.addEventListener("click", (event) => {
  if (event.target === cartOverlay) {
    closeCart();
  }
});



