document.addEventListener("DOMContentLoaded", () => {
    // State now includes hardcoded products to avoid Fetch/CORS errors
    let state = { 
        products: [
            {
                "id": 1,
                "name": "Classic Denim Jacket",
                "price": 59.99,
                "salePrice": 45.00,
                "category": "Fashion",
                "image": "https://via.placeholder.com/300x400?text=Denim+Jacket",
                "stock": 5,
                "rating": 4.5,
                "description": "Premium quality denim with a modern tailored fit."
            },
            {
                "id": 2,
                "name": "Smart Bluetooth Watch",
                "price": 129.50,
                "salePrice": null,
                "category": "Electronics",
                "image": "https://via.placeholder.com/300x400?text=Smart+Watch",
                "stock": 2,
                "rating": 4.8,
                "description": "High-resolution OLED display with 7-day battery life."
            },
            {
                "id": 3,
                "name": "Noise-Canceling Pods",
                "price": 89.99,
                "salePrice": 75.00,
                "category": "Electronics",
                "image": "https://via.placeholder.com/300x400?text=Earbuds",
                "stock": 0,
                "rating": 4.2,
                "description": "Industry-leading noise cancellation for travel."
            }
        ], 
        cart: JSON.parse(localStorage.getItem('taananana-cart')) || [], 
        currentFilter: 'all',
        searchQuery: '' 
    };

    const showToast = (msg) => {
        const t = document.createElement('div'); 
        t.className = 'toast'; 
        t.innerText = msg;
        document.getElementById('toast-container').appendChild(t);
        setTimeout(() => t.remove(), 3000);
    };

    const render = () => {
        const list = document.getElementById('product-list');
        
        const filtered = state.products.filter(p => {
            const matchesCategory = state.currentFilter === 'all' || p.category === state.currentFilter;
            const matchesSearch = p.name.toLowerCase().includes(state.searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
        
        list.innerHTML = filtered.length > 0 ? filtered.map(p => `
            <div class="product">
                ${p.salePrice ? `<span class="sale-badge" style="background:var(--danger); color:white; padding:2px 8px; border-radius:5px; font-size:12px; position:absolute; top:10px; right:10px;">SALE</span>` : ''}
                <img src="${p.image}" style="width:100%; border-radius:15px; cursor:pointer;">
                <h3 style="margin:15px 0 5px 0;">${p.name}</h3>
                <div style="margin-bottom:15px;">
                    ${p.salePrice ? `<span style="color:var(--danger); font-weight:700;">$${p.salePrice}</span> <span style="text-decoration:line-through; color:gray; margin-left:5px;">$${p.price}</span>` : `<span>$${p.price}</span>`}
                </div>
                <button onclick="window.buy(${p.id})" ${p.stock === 0 ? 'disabled' : ''} style="width:100%; padding:12px; border:none; border-radius:12px; background:var(--primary); color:var(--bg); cursor:pointer;">
                    ${p.stock === 0 ? 'Out of Stock' : 'Add to Bag'}
                </button>
            </div>
        `).join('') : '<p style="grid-column: 1/-1; text-align: center; padding: 50px;">No products found matching your search.</p>';

        document.getElementById('cart-count').innerText = state.cart.reduce((s, i) => s + i.qty, 0);
    };

    const searchInput = document.getElementById('search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            state.searchQuery = e.target.value;
            render();
        });
    }

    window.buy = (id) => {
        const p = state.products.find(x => x.id === id);
        const inCart = state.cart.find(x => x.id === id);
        const finalPrice = p.salePrice || p.price;
        
        if (inCart) inCart.qty++; 
        else state.cart.push({ ...p, price: finalPrice, qty: 1 });
        
        localStorage.setItem('taananana-cart', JSON.stringify(state.cart));
        showToast(`${p.name} added to bag!`);
        render();
    };

    // Initial render call replaces the fetch logic
    render();
});