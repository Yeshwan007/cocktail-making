import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Menu, Search, User, ShoppingBag, Heart, X, 
  Plus, Minus, ChevronRight, Trash2, ArrowLeft,
  CheckCircle2, CreditCard, MapPin, History, LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types & Constants ---

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  contents: string[];
}

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "BACARDI LEMON RUM KIT",
    price: 1150,
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800",
    contents: ["Bacardi Lemon Rum – 375 ml", "Lemonade – 500 ml", "Campa Lemon Flavoured – 185 ml", "Soda or Sprite", "Lemon slices – 4", "Chupa Chups", "Ice"]
  },
  {
    id: 2,
    name: "MAGIC MOMENTS ORANGE KIT",
    price: 850,
    image: "https://images.unsplash.com/photo-1536935338213-d2c123348f0e?auto=format&fit=crop&q=80&w=800",
    contents: ["Magic Moments Orange Vodka – 375 ml", "Fresh Lemonade – 500 ml", "Orange Juice – 200 ml", "Soda or Sprite", "Orange slices – 4", "Chupa Chups", "Ice"]
  },
  {
    id: 3,
    name: "CRANBERRY VODKA KIT",
    price: 1000,
    image: "https://images.unsplash.com/photo-1544145945-f904253d0c71?auto=format&fit=crop&q=80&w=800",
    contents: ["Cranberry Vodka – 320 ml", "Cranberry Juice", "Sprite – 200 ml", "Lemon Juice – 500 ml", "Fruit slices – 4", "Chupa Chups", "Ice"]
  },
  {
    id: 4,
    name: "MAGIC MOMENTS GREEN APPLE KIT",
    price: 850,
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=800",
    contents: ["Green Apple Vodka – 375 ml", "Lemon Juice – 500 ml", "Apple slices – 4", "Sprite – 200 ml", "Ice", "Apple-flavoured lollipops – 2"]
  },
  {
    id: 5,
    name: "THE FRUIT PUNCH KIT",
    price: 1000,
    image: "https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&q=80&w=800",
    contents: ["Any Vodka", "Assorted fresh fruits", "Lemonade juice", "Ice"]
  }
];

// --- Components ---

const Logo = () => (
  <div className="flex items-center gap-3 cursor-pointer group">
    {/* Small size logo image beside the text */}
    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden shadow-md border border-stone-200 bg-white flex-shrink-0 transition-transform group-hover:scale-105">
      <img 
        src="https://raw.githubusercontent.com/stackblitz/stackblitz-images/main/cocktail-logo-placeholder.png" 
        alt="Shake & Sip Logo"
        className="w-full h-full object-cover"
        onError={(e) => {
          // Fallback if the placeholder isn't available
          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1551024731-03107074117b?auto=format&fit=crop&q=80&w=100";
        }}
      />
    </div>
    <div className="flex flex-col items-start leading-tight">
      <div className="text-base md:text-xl font-black tracking-widest text-olive serif">SHAKE & SIP</div>
      <div className="text-[7px] md:text-[9px] tracking-[0.25em] font-medium text-gold uppercase group-hover:translate-x-1 transition-transform">Cocktail Making Kits</div>
    </div>
  </div>
);

const App = () => {
  const [page, setPage] = useState<'home' | 'cart' | 'checkout' | 'auth' | 'profile' | 'success'>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cart, setCart] = useState<{product: Product, quantity: number}[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [user, setUser] = useState<{email: string} | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState<any[]>([]);

  // Derived State
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  
  const filteredProducts = useMemo(() => 
    PRODUCTS.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())), 
  [searchQuery]);

  // Actions
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const toggleWishlist = (id: number) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleCheckout = () => {
    const newOrder = {
      id: `ORD-${Math.floor(Math.random() * 90000) + 10000}`,
      date: new Date().toLocaleDateString(),
      items: [...cart],
      total: cartTotal,
      status: 'Paid'
    };
    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    setPage('success');
  };

  // UI Sections
  const Header = () => (
    <header className="sticky top-0 z-50 bg-cream/80 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <button onClick={() => setIsMenuOpen(true)} className="p-2 -ml-2 text-dark">
          <Menu size={24} />
        </button>
        
        <div onClick={() => setPage('home')}>
          <Logo />
        </div>
        
        <div className="flex items-center gap-2">
          <button onClick={() => user ? setPage('profile') : setPage('auth')} className="p-2 text-dark">
            <User size={24} />
          </button>
          <button onClick={() => setPage('cart')} className="p-2 text-dark relative">
            <ShoppingBag size={24} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-olive text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
      
      {page === 'home' && (
        <div className="max-w-4xl mx-auto px-4 pb-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-olive transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search cocktail kits..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-100/50 border border-stone-200 rounded-full py-2.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-olive/10 transition-all text-sm"
            />
          </div>
        </div>
      )}
    </header>
  );

  const Sidebar = () => (
    <AnimatePresence>
      {isMenuOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 bg-dark/40 z-[60]"
          />
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-[80%] max-w-[300px] bg-cream z-[70] shadow-2xl flex flex-col"
          >
            <div className="p-6 flex items-center justify-between border-b border-stone-200">
              <Logo />
              <button onClick={() => setIsMenuOpen(false)}><X size={24} /></button>
            </div>
            <div className="flex-1 p-6 space-y-6">
              <nav className="space-y-4">
                <button onClick={() => { setPage('home'); setIsMenuOpen(false); }} className="flex items-center gap-4 text-lg font-medium serif hover:text-olive transition-colors">
                  Home
                </button>
                <button onClick={() => { setPage('profile'); setIsMenuOpen(false); }} className="flex items-center gap-4 text-lg font-medium serif hover:text-olive transition-colors">
                  My Profile
                </button>
                <button onClick={() => { setPage('cart'); setIsMenuOpen(false); }} className="flex items-center gap-4 text-lg font-medium serif hover:text-olive transition-colors">
                  My Cart
                </button>
                <button className="flex items-center gap-4 text-lg font-medium serif hover:text-olive transition-colors">
                  Wishlist
                </button>
              </nav>
              <div className="pt-6 border-t border-stone-200">
                <h4 className="text-xs uppercase tracking-widest text-stone-500 mb-4 font-bold">Categories</h4>
                <div className="space-y-3">
                  <div className="text-sm">Rum Kits</div>
                  <div className="text-sm">Vodka Kits</div>
                  <div className="text-sm">Gin Specials</div>
                  <div className="text-sm">Party Packs</div>
                </div>
              </div>
            </div>
            {user && (
              <div className="p-6 border-t border-stone-200">
                <button onClick={() => { setUser(null); setIsMenuOpen(false); }} className="flex items-center gap-2 text-stone-500 text-sm">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  const ProductCard = ({ product }: { product: Product; key?: React.Key }) => {
    const [showContents, setShowContents] = useState(false);
    return (
      <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-stone-100">
        <div className="relative aspect-[4/5] overflow-hidden group">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <button 
            onClick={() => toggleWishlist(product.id)}
            className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${wishlist.includes(product.id) ? 'bg-red-50 text-red-500' : 'bg-white/80 backdrop-blur-md text-dark'}`}
          >
            <Heart size={18} fill={wishlist.includes(product.id) ? 'currentColor' : 'none'} />
          </button>
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-olive mb-1 serif line-clamp-1">{product.name}</h3>
          <p className="text-base font-black text-dark mb-3">₹{product.price}</p>
          
          <div className="mb-4">
            <button 
              onClick={() => setShowContents(!showContents)}
              className="text-[11px] font-bold text-gold flex items-center gap-1 uppercase tracking-tighter hover:underline"
            >
              {showContents ? 'Hide Contents' : "What's inside?"}
              <ChevronRight size={12} className={`transition-transform ${showContents ? 'rotate-90' : ''}`} />
            </button>
            <AnimatePresence>
              {showContents && (
                <motion.ul 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-2 text-[10px] text-stone-600 space-y-1 list-disc list-inside overflow-hidden"
                >
                  {product.contents.map((item, idx) => <li key={idx} className="leading-tight">{item}</li>)}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
          
          <button 
            onClick={() => addToCart(product)}
            className="mt-auto w-full bg-olive text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-olive/90 active:scale-95 transition-all"
          >
            <Plus size={16} /> Add to Cart
          </button>
        </div>
      </div>
    );
  };

  const HomePage = () => (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-8 rounded-3xl overflow-hidden relative aspect-[16/9] shadow-xl">
        <img 
          src="https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&q=80&w=1200" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent flex flex-col justify-end p-6">
          <h1 className="text-white text-3xl font-black serif mb-2">Artisan Kits. <br/>Infinite Sips.</h1>
          <p className="text-cream/80 text-sm max-w-[200px]">Everything you need to shake up the perfect cocktail at home.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {filteredProducts.map(p => <ProductCard key={p.id} product={p} />)}
      </div>

      {filteredProducts.length === 0 && (
        <div className="py-20 text-center">
          <div className="text-olive mb-4"><Search size={48} className="mx-auto opacity-20" /></div>
          <p className="text-stone-500 serif">No kits found for "{searchQuery}"</p>
        </div>
      )}

      {/* Scroll to Top button */}
      <button 
        onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
        className="fixed bottom-6 right-6 w-12 h-12 bg-white shadow-xl rounded-full flex items-center justify-center text-olive z-40 border border-stone-100 active:scale-90 transition-transform"
      >
        <Plus className="rotate-45" size={24} />
      </button>
    </div>
  );

  const CartPage = () => (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => setPage('home')} className="p-2 -ml-2"><ArrowLeft size={24}/></button>
        <h2 className="text-2xl font-black serif">My Cart</h2>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-stone-100">
          <ShoppingBag size={48} className="mx-auto text-stone-200 mb-4" />
          <p className="text-stone-500 mb-6 font-medium">Your cart is empty.</p>
          <button 
            onClick={() => setPage('home')}
            className="px-8 py-3 bg-olive text-white rounded-full font-bold text-sm"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.product.id} className="flex gap-4 bg-white p-4 rounded-2xl shadow-sm border border-stone-50">
                <img src={item.product.image} className="w-20 h-20 object-cover rounded-xl" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-bold uppercase serif">{item.product.name}</h3>
                    <button onClick={() => removeFromCart(item.product.id)} className="text-stone-400 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <p className="text-gold font-bold mb-3">₹{item.product.price}</p>
                  <div className="flex items-center gap-3">
                    <button onClick={() => updateQuantity(item.product.id, -1)} className="w-8 h-8 rounded-lg border border-stone-200 flex items-center justify-center text-stone-600"><Minus size={14}/></button>
                    <span className="font-bold text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, 1)} className="w-8 h-8 rounded-lg border border-stone-200 flex items-center justify-center text-stone-600"><Plus size={14}/></button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm space-y-4 border border-stone-50">
            <div className="flex justify-between text-sm">
              <span className="text-stone-500">Subtotal</span>
              <span className="font-bold">₹{cartTotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-stone-500">Delivery</span>
              <span className="text-olive font-bold uppercase text-[10px] tracking-widest bg-olive/10 px-2 py-1 rounded">Free</span>
            </div>
            <div className="border-t border-dashed border-stone-200 pt-4 flex justify-between items-center">
              <span className="text-lg font-black serif">Total</span>
              <span className="text-2xl font-black text-olive">₹{cartTotal}</span>
            </div>
            <button 
              onClick={() => setPage('checkout')}
              className="w-full bg-dark text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-dark/20 active:scale-[0.98] transition-all"
            >
              Checkout Now
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const CheckoutPage = () => (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => setPage('cart')} className="p-2 -ml-2"><ArrowLeft size={24}/></button>
        <h2 className="text-2xl font-black serif">Checkout</h2>
      </div>

      <div className="space-y-6">
        <section className="bg-white p-6 rounded-3xl shadow-sm border border-stone-50">
          <h3 className="text-xs font-bold uppercase tracking-widest text-olive mb-4 flex items-center gap-2">
            <MapPin size={16}/> Shipping Address
          </h3>
          <div className="space-y-4">
            <input placeholder="Full Name" className="w-full bg-stone-50 border border-stone-100 p-3 rounded-xl text-sm" />
            <input placeholder="Phone Number" className="w-full bg-stone-50 border border-stone-100 p-3 rounded-xl text-sm" />
            <textarea placeholder="Complete Address" className="w-full bg-stone-50 border border-stone-100 p-3 rounded-xl text-sm min-h-[100px]"></textarea>
          </div>
        </section>

        <section className="bg-white p-6 rounded-3xl shadow-sm border border-stone-50">
          <h3 className="text-xs font-bold uppercase tracking-widest text-olive mb-4 flex items-center gap-2">
            <CreditCard size={16}/> Payment Method
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="border-2 border-olive bg-olive/5 p-4 rounded-2xl text-center flex flex-col items-center gap-2">
              <div className="font-bold text-sm">UPI</div>
              <div className="text-[10px] text-stone-500">GPay, PhonePe</div>
            </button>
            <button className="border border-stone-100 p-4 rounded-2xl text-center flex flex-col items-center gap-2">
              <div className="font-bold text-sm">Card</div>
              <div className="text-[10px] text-stone-500">Visa, Mastercard</div>
            </button>
          </div>
        </section>

        <section className="bg-white p-6 rounded-3xl shadow-sm border border-stone-50">
          <div className="flex items-center gap-2 mb-4">
            <input placeholder="Coupon Code" className="flex-1 bg-stone-50 border border-stone-100 p-3 rounded-xl text-sm" />
            <button className="bg-gold text-white px-6 py-3 rounded-xl text-xs font-bold">APPLY</button>
          </div>
          
          <div className="space-y-2 border-t border-stone-100 pt-4">
            <div className="flex justify-between text-xs text-stone-500">
              <span>Order Summary ({cartCount} items)</span>
              <span>₹{cartTotal}</span>
            </div>
            <div className="flex justify-between text-lg font-black serif mt-2">
              <span>Final Amount</span>
              <span className="text-olive">₹{cartTotal}</span>
            </div>
          </div>
        </section>

        <button 
          onClick={handleCheckout}
          className="w-full bg-olive text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-olive/20 active:scale-[0.98] transition-all"
        >
          Pay ₹{cartTotal} Securely
        </button>
      </div>
    </div>
  );

  const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="bg-white p-8 rounded-[40px] shadow-sm text-center border border-stone-50">
          <div className="mb-8 flex justify-center">
            <Logo />
          </div>
          <h2 className="text-3xl font-black serif mb-2">{isLogin ? 'Welcome Back' : 'Join the Club'}</h2>
          <p className="text-stone-500 text-sm mb-8">{isLogin ? 'Sign in to access your orders' : 'Create an account for rewards'}</p>
          
          <div className="space-y-4">
            {!isLogin && <input placeholder="Full Name" className="w-full bg-stone-50 border border-stone-100 p-4 rounded-2xl text-sm" />}
            <input placeholder="Email Address" className="w-full bg-stone-50 border border-stone-100 p-4 rounded-2xl text-sm" />
            <input type="password" placeholder="Password" className="w-full bg-stone-50 border border-stone-100 p-4 rounded-2xl text-sm" />
            
            <button 
              onClick={() => { setUser({ email: 'hello@user.com' }); setPage('home'); }}
              className="w-full bg-dark text-white py-4 rounded-2xl font-black mt-4 hover:bg-black transition-colors"
            >
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
          
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="mt-6 text-sm font-bold text-olive hover:underline"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    );
  };

  const ProfilePage = () => (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black serif">My Profile</h2>
        <button onClick={() => { setUser(null); setPage('home'); }} className="text-red-500 font-bold text-sm flex items-center gap-2">
          <LogOut size={16} /> Logout
        </button>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm flex items-center gap-6 mb-8 border border-stone-50">
        <div className="w-20 h-20 rounded-full bg-olive/10 flex items-center justify-center text-olive font-black text-2xl">
          {user?.email[0].toUpperCase()}
        </div>
        <div>
          <h3 className="font-black text-xl serif">Cheers, Enthusiast!</h3>
          <p className="text-stone-500 text-sm">{user?.email}</p>
        </div>
      </div>

      <section>
        <h3 className="text-xs font-bold uppercase tracking-widest text-olive mb-4 flex items-center gap-2">
          <History size={18}/> Order History
        </h3>
        
        {orders.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl text-center text-stone-400 border border-dashed border-stone-200">
            No orders yet. Start mixing!
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-white p-5 rounded-3xl shadow-sm border border-stone-50">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-xs font-bold text-gold mb-1">{order.id}</div>
                    <div className="text-sm font-medium text-stone-500">{order.date}</div>
                  </div>
                  <div className="bg-green-50 text-green-600 text-[10px] font-black uppercase px-2 py-1 rounded-full">
                    {order.status}
                  </div>
                </div>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                  {order.items.map((it: any) => (
                    <img key={it.product.id} src={it.product.image} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                  ))}
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-stone-50">
                  <span className="text-sm text-stone-500">{order.items.length} Kits</span>
                  <span className="font-black text-olive">₹{order.total}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );

  const SuccessPage = () => (
    <div className="max-w-md mx-auto px-4 py-32 text-center">
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 10 }}
        className="w-24 h-24 bg-olive/10 text-olive rounded-full flex items-center justify-center mx-auto mb-8"
      >
        <CheckCircle2 size={48} />
      </motion.div>
      <h2 className="text-3xl font-black serif mb-4">Order Placed!</h2>
      <p className="text-stone-500 mb-10">Your cocktail kit is being prepared and will be delivered shortly. Happy sipping!</p>
      <div className="flex flex-col gap-4">
        <button 
          onClick={() => setPage('profile')}
          className="bg-dark text-white py-4 rounded-2xl font-black"
        >
          View Order History
        </button>
        <button 
          onClick={() => setPage('home')}
          className="text-olive font-bold"
        >
          Back to Shop
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-20 overflow-x-hidden">
      <Header />
      <Sidebar />
      
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {page === 'home' && <HomePage />}
            {page === 'cart' && <CartPage />}
            {page === 'checkout' && <CheckoutPage />}
            {page === 'auth' && <AuthPage />}
            {page === 'profile' && <ProfilePage />}
            {page === 'success' && <SuccessPage />}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="bg-dark text-stone-400 py-16 px-6 mt-20">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          <div className="bg-white/5 p-4 rounded-2xl mb-8">
            <Logo />
          </div>
          <div className="flex gap-8 my-4">
            <span className="text-xs uppercase tracking-[0.2em] hover:text-white cursor-pointer transition-colors">Instagram</span>
            <span className="text-xs uppercase tracking-[0.2em] hover:text-white cursor-pointer transition-colors">Support</span>
            <span className="text-xs uppercase tracking-[0.2em] hover:text-white cursor-pointer transition-colors">Terms</span>
          </div>
          <p className="text-[10px] leading-relaxed max-w-xs opacity-50 mt-8 border-t border-white/10 pt-8">
            &copy; 2024 Shake & Sip. Premium Cocktail Kits. Drink responsibly. Must be of legal drinking age.
          </p>
        </div>
      </footer>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);