/// Sample product data
let products = [
    {
        id: 1,
        name: "Nivea Men and women ",
        price: 135.00,
        category: "Skincare",
        image: "s-960.jpg"
    },
    {
        id: 2,
        name: "BB clear",
        price: 50.00,
        category: "Makeup",
        image: "https://via.placeholder.com/300x300?text=Lipstick"
    },
    {
        id: 3,
        name: "kiss beauty",
        price: 50.00,
        category: "Makeup",
        image: "https://via.placeholder.com/300x300?text=Mascara"
    },
    {
        id: 4,
        name: "Miss white",
        price: 260.00,
        category: "Skincare",
        image: "https://via.placeholder.com/300x300?text=Face+Cream"
    },
    {
        id: 5,
        name: "Rasasi sprays",
        price: 75.00,
        category: "Fragrance",
        image: "https://via.placeholder.com/300x300?text=Perfume"
    },
    {
        id: 6,
        name: "Lemon Clear",
        price: 150.00,
        category: "Skincare",
        image: "https://via.placeholder.com/300x300?text=Cleansing+Oil"
    },
    {
        id: 7,
        name: "Eyeshadow Palette - Earth Tones",
        price: 45.00,
        category: "Makeup",
        image: "https://via.placeholder.com/300x300?text=Eyeshadow"
    },
    {
        id: 8,
        name: "mouldin gel",
        price: 95.00,
        category: "Hair Care",
        image: "https://via.placeholder.com/300x300?text=Hair+Mask"
    }
];

// Retailer credentials (in a real app, this would be handled by a backend)
const RETAILER_CREDENTIALS = {
    username: "retailer",
    password: "retailer123"
};

// Cart functionality
let cart = [];
let currentEditingProductId = null;

const cartCount = document.querySelector('.cart-count');
const cartItems = document.getElementById('cart-items');
const cartSubtotal = document.getElementById('cart-subtotal');
const cartTotal = document.getElementById('cart-total');
const cartModal = document.getElementById('cart-modal');
const cartBtn = document.getElementById('cart-btn');
const closeCartBtn = document.getElementById('close-cart');
const checkoutBtn = document.getElementById('checkout-btn');
const checkoutModal = document.getElementById('checkout-modal');
const closeCheckoutBtn = document.getElementById('close-checkout');
const placeOrderBtn = document.getElementById('place-order-btn');

// Retailer elements
const retailerLoginForm = document.getElementById('retailer-login-form');
const retailerDashboard = document.getElementById('retailer-dashboard-content');
const productsManagementList = document.getElementById('products-management-list');
const productModal = document.getElementById('product-modal');
const productForm = document.getElementById('product-form');
const addProductBtn = document.getElementById('add-product-btn');
const closeProductModal = document.getElementById('close-product-modal');
const cancelProductBtn = document.getElementById('cancel-product-btn');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    setupEventListeners();
    populateProductDropdowns();
    loadProductsManagement();
});

// Load products into the grid
function loadProducts() {
    const productsGrid = document.getElementById('products-grid');
    productsGrid.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-img">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">K${product.price.toFixed(2)}</p>
                <div class="product-actions">
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                    <button class="view-details" data-id="${product.id}">Details</button>
                </div>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Load products into management table
function loadProductsManagement() {
    productsManagementList.innerHTML = '';

    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="product-management-img">
                    <img src="${product.image}" alt="${product.name}">
                </div>
            </td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>K${product.price.toFixed(2)}</td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" data-id="${product.id}">Edit</button>
                    <button class="delete-btn" data-id="${product.id}">Delete</button>
                </div>
            </td>
        `;
        productsManagementList.appendChild(row);
    });
}

// Set up event listeners
function setupEventListeners() {
    // Add to cart buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            addToCart(productId);
        }
        
        // Remove item from cart
        if (e.target.classList.contains('remove-item')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            removeFromCart(productId);
        }
        
        // Quantity controls
        if (e.target.classList.contains('quantity-btn')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            const action = e.target.getAttribute('data-action');
            updateQuantity(productId, action);
        }
        
        // Edit product
        if (e.target.classList.contains('edit-btn')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            editProduct(productId);
        }
        
        // Delete product
        if (e.target.classList.contains('delete-btn')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            deleteProduct(productId);
        }
    });

    // Cart modal
    cartBtn.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);

    // Checkout
    checkoutBtn.addEventListener('click', openCheckout);
    closeCheckoutBtn.addEventListener('click', closeCheckout);
    placeOrderBtn.addEventListener('click', placeOrder);

    // Stakeholder tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            openTab(tabId);
        });
    });

    // Stakeholder forms
    document.getElementById('feedback-form').addEventListener('submit', handleFeedback);
    document.getElementById('questions-form').addEventListener('submit', handleQuestion);
    document.getElementById('suggestions-form').addEventListener('submit', handleSuggestion);

    // Payment method selection
    const paymentMethods = document.querySelectorAll('.payment-method');
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            paymentMethods.forEach(m => m.classList.remove('selected'));
            this.classList.add('selected');
            
            // Show/hide credit card form based on selection
            const paymentType = this.getAttribute('data-method');
            const creditCardForm = document.getElementById('credit-card-form');
            if (paymentType === 'credit') {
                creditCardForm.style.display = 'block';
            } else {
                creditCardForm.style.display = 'none';
            }
        });
    });

    // Retailer functionality
    retailerLoginForm.addEventListener('submit', handleRetailerLogin);
    addProductBtn.addEventListener('click', openAddProductModal);
    closeProductModal.addEventListener('click', closeProductModalFunc);
    cancelProductBtn.addEventListener('click', closeProductModalFunc);
    productForm.addEventListener('submit', handleProductSave);
}

// Handle retailer login
function handleRetailerLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('retailer-username').value;
    const password = document.getElementById('retailer-password').value;
    
    if (username === RETAILER_CREDENTIALS.username && password === RETAILER_CREDENTIALS.password) {
        retailerDashboard.style.display = 'block';
        retailerLoginForm.style.display = 'none';
        showNotification('Retailer login successful!', 'success');
    } else {
        showNotification('Invalid credentials!', 'error');
    }
}

// Open add product modal
function openAddProductModal() {
    currentEditingProductId = null;
    document.getElementById('product-modal-title').textContent = 'Add New Product';
    productForm.reset();
    productModal.style.display = 'flex';
}

// Close product modal
function closeProductModalFunc() {
    productModal.style.display = 'none';
    currentEditingProductId = null;
}

// Edit product
function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        currentEditingProductId = productId;
        document.getElementById('product-modal-title').textContent = 'Edit Product';
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-category').value = product.category;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-image').value = product.image;
        productModal.style.display = 'flex';
    }
}

// Delete product
function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== productId);
        loadProducts();
        loadProductsManagement();
        showNotification('Product deleted successfully!', 'success');
    }
}

// Handle product save (add or edit)
function handleProductSave(e) {
    e.preventDefault();
    
    const name = document.getElementById('product-name').value;
    const category = document.getElementById('product-category').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const image = document.getElementById('product-image').value;
    
    if (currentEditingProductId) {
        // Edit existing product
        const productIndex = products.findIndex(p => p.id === currentEditingProductId);
        if (productIndex !== -1) {
            products[productIndex] = {
                ...products[productIndex],
                name,
                category,
                price,
                image
            };
            showNotification('Product updated successfully!', 'success');
        }
    } else {
        // Add new product
        const newProduct = {
            id: Math.max(...products.map(p => p.id)) + 1,
            name,
            category,
            price,
            image
        };
        products.push(newProduct);
        showNotification('Product added successfully!', 'success');
    }
    
    // Update both product displays
    loadProducts();
    loadProductsManagement();
    closeProductModalFunc();
    
    // Update product dropdowns in feedback form
    populateProductDropdowns();
}

// Populate product dropdowns in stakeholder forms
function populateProductDropdowns() {
    const productDropdown = document.getElementById('feedback-product');
    productDropdown.innerHTML = '<option value="">Choose a product</option>';
    
    products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.id;
        option.textContent = product.name;
        productDropdown.appendChild(option);
    });
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    updateCart();
    showNotification(`${product.name} added to cart!`);
}

// Remove product from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    showNotification('Item removed from cart!', 'error');
}

// Update product quantity in cart
function updateQuantity(productId, action) {
    const item = cart.find(item => item.id === productId);
    
    if (action === 'increase') {
        item.quantity += 1;
    } else if (action === 'decrease' && item.quantity > 1) {
        item.quantity -= 1;
    }
    
    updateCart();
}

// Update cart display
function updateCart() {
    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Update cart items
    cartItems.innerHTML = '';
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty</p>';
        checkoutBtn.disabled = true;
    } else {
        checkoutBtn.disabled = false;
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-img">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <p class="cart-item-price">K${item.price.toFixed(2)}</p>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-control">
                        <button class="quantity-btn" data-id="${item.id}" data-action="decrease">-</button>
                        <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                        <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
                    </div>
                    <button class="remove-item" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
    }

    // Update cart totals
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 5.00 : 0;
    const total = subtotal + shipping;

    cartSubtotal.textContent = `K${subtotal.toFixed(2)}`;
    cartTotal.textContent = `K${total.toFixed(2)}`;
}

// Open cart modal
function openCart() {
    cartModal.style.display = 'flex';
}

// Close cart modal
function closeCart() {
    cartModal.style.display = 'none';
}

// Open checkout modal
function openCheckout() {
    cartModal.style.display = 'none';
    checkoutModal.style.display = 'flex';
}

// Close checkout modal
function closeCheckout() {
    checkoutModal.style.display = 'none';
}

// Place order
function placeOrder(e) {
    e.preventDefault();
    
    // Validate form
    const firstName = document.getElementById('first-name').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    
    if (!firstName || !email || !address) {
        showNotification('Please fill in all required fields!', 'error');
        return;
    }
    
    // Simulate order processing
    showNotification('Order placed successfully! Thank you for your purchase.', 'success');
    
    // Reset cart and close modals
    cart = [];
    updateCart();
    checkoutModal.style.display = 'none';
    
    // Reset form
    document.getElementById('checkout-form').reset();
}

// Stakeholder tab functionality
function openTab(tabId) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => tab.classList.remove('active'));
    
    // Remove active class from all tab buttons
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab content
    document.getElementById(`${tabId}-tab`).classList.add('active');
    
    // Activate selected tab button
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
}

// Handle feedback form submission
function handleFeedback(e) {
    e.preventDefault();
    
    const productId = document.getElementById('feedback-product').value;
    const rating = document.getElementById('feedback-rating').value;
    const message = document.getElementById('feedback-message').value;
    
    if (!productId || !rating || !message) {
        showNotification('Please fill in all fields!', 'error');
        return;
    }
    
    const product = products.find(p => p.id === parseInt(productId));
    showNotification(`Thank you for your feedback on ${product.name}!`, 'success');
    e.target.reset();
}

// Handle question form submission
function handleQuestion(e) {
    e.preventDefault();
    
    const category = document.getElementById('question-category').value;
    const message = document.getElementById('question-message').value;
    
    if (!category || !message) {
        showNotification('Please fill in all fields!', 'error');
        return;
    }
    
    showNotification('Your question has been submitted! Our experts will respond within 24 hours.', 'success');
    e.target.reset();
}

// Handle suggestion form submission
function handleSuggestion(e) {
    e.preventDefault();
    
    const type = document.getElementById('suggestion-type').value;
    const message = document.getElementById('suggestion-message').value;
    
    if (!type || !message) {
        showNotification('Please fill in all fields!', 'error');
        return;
    }
    
    showNotification('Thank you for your suggestion! We appreciate your input.', 'success');
    e.target.reset();
}

// Show notification
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide and remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Close modals when clicking outside
document.addEventListener('click', function(e) {
    if (e.target === cartModal) {
        closeCart();
    }
    if (e.target === checkoutModal) {
        closeCheckout();
    }
    if (e.target === productModal) {
        closeProductModalFunc();
    }
});

// Close modals with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeCart();
        closeCheckout();
        closeProductModalFunc();
    }
});