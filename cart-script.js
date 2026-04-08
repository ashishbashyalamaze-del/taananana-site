document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById('cart-items');
    let cart = JSON.parse(localStorage.getItem('taananana-cart')) || [];

    const calculateFinal = (subtotal) => {
        let discount = subtotal > 200 ? subtotal * 0.15 : 0; 
        let shipping = subtotal > 100 ? 0 : 15; 
        return { discount, shipping, total: subtotal - discount + shipping };
    };

    const render = () => {
        container.innerHTML = cart.length ? '' : '<p>Your cart is empty</p>';
        let subtotal = 0;

        cart.forEach((item, index) => {
            const itemTotal = item.price * item.qty;
            subtotal += itemTotal;

            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <div>
                    <strong>${item.name}</strong><br>
                    <div style="display:flex; align-items:center; gap:10px; margin-top:5px;">
                        <button onclick="changeQty(${index}, -1)" class="qty-btn">-</button>
                        <span>${item.qty}</span>
                        <button onclick="changeQty(${index}, 1)" class="qty-btn">+</button>
                        <small>x $${item.price.toFixed(2)}</small>
                    </div>
                </div>
                <div style="display:flex; align-items:center; gap:20px;">
                    <span>$${itemTotal.toFixed(2)}</span>
                    <button onclick="remove(${index})" style="background:none; border:none; color:var(--danger); cursor:pointer; font-weight:bold;">Remove</button>
                </div>
            `;
            container.appendChild(div);
        });

        const finalData = calculateFinal(subtotal);
        if (document.getElementById('subtotal-amount')) document.getElementById('subtotal-amount').innerText = `$${subtotal.toFixed(2)}`;
        if (document.getElementById('discount-amount')) document.getElementById('discount-amount').innerText = `-$${finalData.discount.toFixed(2)}`;
        if (document.getElementById('shipping-amount')) document.getElementById('shipping-amount').innerText = finalData.shipping === 0 ? "FREE" : `$${finalData.shipping.toFixed(2)}`;
        document.getElementById('total-amount').innerText = `$${finalData.total.toFixed(2)}`;
    };

    window.changeQty = (index, delta) => {
        cart[index].qty += delta;
        if (cart[index].qty <= 0) remove(index);
        else {
            localStorage.setItem('taananana-cart', JSON.stringify(cart));
            render();
        }
    };

    window.remove = (index) => {
        cart.splice(index, 1);
        localStorage.setItem('taananana-cart', JSON.stringify(cart));
        render();
    };

    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) return alert("Your cart is empty!");
            alert("Thank you for your purchase from TAANANANA! Your order has been placed.");
            cart = [];
            localStorage.removeItem('taananana-cart');
            render();
        });
    }

    render();
});