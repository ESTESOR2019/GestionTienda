let cart = [];

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    toggleCartModal();
}

function updateQuantity(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== productId);
    }

    updateCartUI();
}

function updateCartUI() {
    const container = document.getElementById('cart-items-container');
    const badge = document.getElementById('cart-badge');
    const totalEl = document.getElementById('cart-total');

    const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    if (totalCount > 0) {
        badge.textContent = totalCount;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }

    if (cart.length === 0) {
        container.innerHTML = `<p class="text-center text-slate-400 text-sm py-8">Tu carrito está vacío.</p>`;
    } else {
        container.innerHTML = cart.map(item => `
            <div class="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <img src="${item.image}" alt="${item.name}" class="w-14 h-14 object-cover rounded-lg">
                <div class="flex-1">
                    <h4 class="font-bold text-slate-800 text-xs">${item.name}</h4>
                    <p class="text-[11px] text-slate-500">$${item.price.toLocaleString('es-AR')}</p>
                    <div class="flex items-center gap-2 mt-1">
                        <button onclick="updateQuantity('${item.id}', -1)" class="w-5 h-5 rounded bg-white border border-slate-300 text-xs font-bold">-</button>
                        <span class="text-xs font-bold">${item.quantity}</span>
                        <button onclick="updateQuantity('${item.id}', 1)" class="w-5 h-5 rounded bg-white border border-slate-300 text-xs font-bold">+</button>
                    </div>
                </div>
                <span class="font-bold text-emerald-950 text-sm">$${(item.price * item.quantity).toLocaleString('es-AR')}</span>
            </div>
        `).join('');
    }

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    totalEl.textContent = `$${total.toLocaleString('es-AR')}`;
    lucide.createIcons();
}

function sendWhatsAppOrder() {
    if (cart.length === 0) {
        alert('Agregá productos al carrito primero.');
        return;
    }

    let message = 'Hola GIBBOR! Quisiera coordinar el pedido de los siguientes productos:\n\n';
    cart.forEach(item => {
        message += `• ${item.name} (${item.id}) x${item.quantity} - $${(item.price * item.quantity).toLocaleString('es-AR')}\n`;
    });

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    message += `\n*Total Estimado:* $${total.toLocaleString('es-AR')}\n\n¿Tienen stock disponible?`;

    window.open(`https://wa.me/5491159238022?text=${encodeURIComponent(message)}`, '_blank');
}