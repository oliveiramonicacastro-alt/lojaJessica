import { useState } from "react";
import { ShoppingCart, MessageCircle } from "lucide-react";

const PRODUCTS = [
  { id: 1, name: "Vestido para Boneca (P)", price: 39.9, img: "https://placehold.co/400x500?text=Foto+do+Produto" },
  { id: 2, name: "Conjunto Casual para Boneca", price: 49.9, img: "https://placehold.co/400x500?text=Foto+do+Produto" },
  { id: 3, name: "Roupa Temática para Boneca", price: 59.9, img: "https://placehold.co/400x500?text=Foto+do+Produto" },
];

export default function LojaCacarekos() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const total = cart.reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-800">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Hobbies, colecionáveis e Cacarekos</h1>
          <div className="flex items-center gap-4">
            <a href="#contato" className="flex items-center gap-1 text-sm hover:underline">
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
            <div className="flex items-center gap-1 text-sm">
              <ShoppingCart className="w-4 h-4" /> {cart.length}
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-r from-rose-100 to-amber-100">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Roupas artesanais para bonecas</h2>
          <p className="max-w-2xl mx-auto text-neutral-700">
            Peças feitas com carinho, pensadas para encantar colecionadores e crianças.
          </p>
        </div>
      </section>

      {/* Produtos */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <h3 className="text-2xl font-semibold mb-6">Produtos</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {PRODUCTS.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl shadow hover:shadow-lg transition">
              <img src={p.img} alt={p.name} className="rounded-t-2xl w-full object-cover" />
              <div className="p-4">
                <h4 className="font-medium mb-2">{p.name}</h4>
                <p className="text-lg font-semibold mb-3">R$ {p.price.toFixed(2)}</p>
                <button
                  onClick={() => addToCart(p)}
                  className="w-full rounded-xl bg-neutral-900 text-white py-2 hover:bg-neutral-800"
                >
                  Adicionar ao carrinho
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Checkout simples */}
      <section className="bg-white border-t">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h3 className="text-xl font-semibold mb-4">Resumo do carrinho</h3>
          {cart.length === 0 ? (
            <p className="text-neutral-600">Seu carrinho está vazio.</p>
          ) : (
            <div className="space-y-2">
              {cart.map((p, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>{p.name}</span>
                  <span>R$ {p.price.toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between font-semibold pt-2 border-t">
                <span>Total</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
              <button className="mt-4 rounded-xl bg-emerald-600 text-white py-2 px-4 hover:bg-emerald-700">
                Finalizar compra (Pix / Cartão)
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Contato */}
      <footer id="contato" className="bg-neutral-900 text-neutral-100">
        <div className="max-w-6xl mx-auto px-4 py-10 text-center">
          <p className="mb-2">Fale com a gente</p>
          <p className="text-sm text-neutral-300">WhatsApp será usado apenas para comunicação e suporte.</p>
        </div>
      </footer>
    </div>
  );
}
