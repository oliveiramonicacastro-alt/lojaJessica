// Gerenciamento de produtos usando localStorage
class ProductManager {
    constructor() {
        this.storageKey = 'artesanato_produtos';
        this.products = this.loadProducts();
        this.init();
    }

    // Carregar produtos do localStorage
    loadProducts() {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : [];
    }

    // Salvar produtos no localStorage
    saveProducts() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.products));
    }

    // Adicionar novo produto
    addProduct(product) {
        const newProduct = {
            id: Date.now().toString(),
            categoria: product.categoria,
            produto: product.produto,
            preco: parseFloat(product.preco),
            descricao: product.descricao,
            foto: product.foto, // Base64 string
            dataCadastro: new Date().toISOString()
        };
        this.products.push(newProduct);
        this.saveProducts();
        return newProduct;
    }

    // Remover produto
    removeProduct(id) {
        this.products = this.products.filter(p => p.id !== id);
        this.saveProducts();
    }

    // Obter produtos filtrados por categoria
    getProducts(categoria = '') {
        if (!categoria) return this.products;
        return this.products.filter(p => p.categoria === categoria);
    }

    // Inicializar a aplicação
    init() {
        this.setupForm();
        this.setupFilter();
        this.renderProducts();
    }

    // Configurar o formulário
    setupForm() {
        const form = document.getElementById('productForm');
        const fotoInput = document.getElementById('foto');
        const imagePreview = document.getElementById('imagePreview');

        // Preview da imagem
        fotoInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    imagePreview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
                    imagePreview.classList.add('has-image');
                };
                reader.readAsDataURL(file);
            } else {
                imagePreview.innerHTML = '';
                imagePreview.classList.remove('has-image');
            }
        });

        // Submissão do formulário
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });
    }

    // Processar submissão do formulário
    async handleFormSubmit() {
        const form = document.getElementById('productForm');
        const formData = new FormData(form);

        const categoria = formData.get('categoria');
        const produto = formData.get('produto');
        const preco = formData.get('preco');
        const descricao = formData.get('descricao');
        const fotoFile = formData.get('foto');

        if (!fotoFile || fotoFile.size === 0) {
            alert('Por favor, selecione uma foto do produto.');
            return;
        }

        // Converter imagem para Base64
        const fotoBase64 = await this.fileToBase64(fotoFile);

        const productData = {
            categoria,
            produto,
            preco,
            descricao,
            foto: fotoBase64
        };

        this.addProduct(productData);
        this.renderProducts();
        form.reset();
        document.getElementById('imagePreview').innerHTML = '';
        document.getElementById('imagePreview').classList.remove('has-image');

        // Feedback visual
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Produto Cadastrado!';
        submitBtn.style.background = 'linear-gradient(135deg, #27ae60 0%, #229954 100%)';
        
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.background = '';
        }, 2000);
    }

    // Converter arquivo para Base64
    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // Configurar filtro de categoria
    setupFilter() {
        const filterSelect = document.getElementById('filterCategoria');
        filterSelect.addEventListener('change', (e) => {
            this.renderProducts(e.target.value);
        });
    }

    // Renderizar produtos na tela
    renderProducts(categoriaFiltro = '') {
        const productsList = document.getElementById('productsList');
        const emptyMessage = document.getElementById('emptyMessage');
        const products = this.getProducts(categoriaFiltro);

        if (products.length === 0) {
            productsList.innerHTML = '';
            emptyMessage.style.display = 'block';
            return;
        }

        emptyMessage.style.display = 'none';
        productsList.innerHTML = products.map(product => this.createProductCard(product)).join('');

        // Adicionar event listeners aos botões de excluir
        products.forEach(product => {
            const deleteBtn = document.getElementById(`delete-${product.id}`);
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => {
                    if (confirm(`Tem certeza que deseja excluir o produto "${product.produto}"?`)) {
                        this.removeProduct(product.id);
                        this.renderProducts(categoriaFiltro);
                    }
                });
            }
        });
    }

    // Criar card do produto
    createProductCard(product) {
        return `
            <div class="product-card">
                <img src="${product.foto}" alt="${product.produto}" class="product-image" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'400\' height=\'300\'%3E%3Crect fill=\'%23ddd\' width=\'400\' height=\'300\'/%3E%3Ctext fill=\'%23999\' font-family=\'sans-serif\' font-size=\'20\' x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dy=\'.3em\'%3EImagem não disponível%3C/text%3E%3C/svg%3E'">
                <div class="product-info">
                    <span class="product-category">${this.escapeHtml(product.categoria)}</span>
                    <h3 class="product-name">${this.escapeHtml(product.produto)}</h3>
                    <div class="product-price">R$ ${product.preco.toFixed(2).replace('.', ',')}</div>
                    <p class="product-description">${this.escapeHtml(product.descricao)}</p>
                    <div class="product-actions">
                        <button id="delete-${product.id}" class="btn btn-danger btn-small">Excluir</button>
                    </div>
                </div>
            </div>
        `;
    }

    // Escapar HTML para prevenir XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Inicializar a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new ProductManager();
});

// Formatação de moeda no input de preço
document.addEventListener('DOMContentLoaded', () => {
    const precoInput = document.getElementById('preco');
    if (precoInput) {
        precoInput.addEventListener('input', function(e) {
            // Permite apenas números e ponto decimal
            let value = e.target.value.replace(/[^\d.]/g, '');
            // Garante apenas um ponto decimal
            const parts = value.split('.');
            if (parts.length > 2) {
                value = parts[0] + '.' + parts.slice(1).join('');
            }
            // Limita a 2 casas decimais
            if (parts[1] && parts[1].length > 2) {
                value = parts[0] + '.' + parts[1].substring(0, 2);
            }
            e.target.value = value;
        });
    }
});

