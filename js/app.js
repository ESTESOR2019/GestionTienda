

let currentCategory = 'Todas';

function navigateTo(pageId) {
    document.querySelectorAll('.page-view').forEach(view => view.classList.add('hidden'));
    const activePage = document.getElementById(`page-${pageId}`);
    if (activePage) activePage.classList.remove('hidden');

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('text-emerald-900', 'border-emerald-800');
        btn.classList.add('text-slate-600', 'border-transparent');
    });

    const activeBtn = document.getElementById(`nav-${pageId}`);
    if (activeBtn) {
        activeBtn.classList.add('text-emerald-900', 'border-emerald-800');
        activeBtn.classList.remove('text-slate-600', 'border-transparent');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleMobileMenu() {
    document.getElementById('mobile-menu').classList.toggle('hidden');
}

function toggleCartModal() {
    document.getElementById('cart-modal').classList.toggle('hidden');
}

function renderCategoryPills() {
    const container = document.getElementById('category-pills');
    container.innerHTML = categories.map(cat => `
        <button onclick="filterByCategory('${cat}')" class="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
            cat === currentCategory ? 'bg-emerald-900 text-amber-300' : 'bg-slate-100 text-slate-600'
        }">
            ${cat}
        </button>
    `).join('');
}

function filterByCategory(category) {
    currentCategory = category;
    document.getElementById('category-select').value = category;
    renderCategoryPills();
    applyFilters();
    navigateTo('productos');
}

function applyFilters() {
    const searchValue = document.getElementById('search-input').value.toLowerCase().trim();
    const selectedCategory = document.getElementById('category-select').value;
    const selectedSize = document.getElementById('size-select').value;

    currentCategory = selectedCategory;
    renderCategoryPills();

    const filtered = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchValue) || product.id.toLowerCase().includes(searchValue);
        const matchesCategory = selectedCategory === 'Todas' || product.category === selectedCategory;
        const matchesSize = selectedSize === 'Todos' || product.sizes.includes(selectedSize);

        return matchesSearch && matchesCategory && matchesSize;
    });

    renderProducts(filtered);
}

function resetFilters() {
    document.getElementById('search-input').value = '';
    document.getElementById('category-select').value = 'Todas';
    document.getElementById('size-select').value = 'Todos';
    currentCategory = 'Todas';
    renderCategoryPills();
    renderProducts(products);
}

function renderProducts(productList) {
    const grid = document.getElementById('products-grid');
    const noProductsMsg = document.getElementById('no-products');
    const countLabel = document.getElementById('products-count');

    countLabel.textContent = `${productList.length} prendas encontradas`;

    if (productList.length === 0) {
        grid.innerHTML = '';
        noProductsMsg.classList.remove('hidden');
        return;
    }

    noProductsMsg.classList.add('hidden');

    grid.innerHTML = productList.map(p => `
        <div class="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm flex flex-col justify-between group">
            <div class="relative aspect-[3/4] overflow-hidden bg-slate-100">
                <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                <span class="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-700 uppercase">
                    ${p.id}
                </span>
            </div>
            <div class="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                    <span class="text-[11px] font-semibold text-amber-700 uppercase">${p.category}</span>
                    <h3 class="font-serif font-bold text-slate-900 text-base leading-snug">${p.name}</h3>
                </div>
                <div class="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span class="font-bold text-emerald-950 text-lg">$${p.price.toLocaleString('es-AR')}</span>
                    <button onclick="addToCart('${p.id}')" class="px-3.5 py-2 bg-emerald-900 hover:bg-emerald-950 text-white rounded-xl text-xs font-medium">
                        Agregar
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    lucide.createIcons();
}

window.onload = function() {
    lucide.createIcons();
    renderCategoryPills();
    renderProducts(products);
    updateCartUI();
};