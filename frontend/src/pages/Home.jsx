import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, ShieldCheck, CreditCard, Star, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import ProductCard from '../components/product/ProductCard';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const categories = [
  { name: 'Divan Beds', slug: 'divan-beds', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600', description: 'Classic comfort with storage' },
  { name: 'Bed Frames', slug: 'bed-frames', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600', description: 'Stylish & sturdy designs' },
  { name: 'Ottoman Beds', slug: 'ottoman-beds', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600', description: 'Maximum storage solutions' },
  { name: 'Mattresses', slug: 'mattresses', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600', description: 'Sleep like royalty' },
];

const trustItems = [
  { icon: Truck, title: 'Free UK Delivery', description: 'On orders over £500' },
  { icon: ShieldCheck, title: 'Price Promise', description: 'We won\'t be beaten on price' },
  { icon: CreditCard, title: 'Finance Available', description: 'Spread the cost from £25/mo' },
  { icon: Star, title: '4.9★ Trustpilot', description: 'Over 5,000 happy customers' },
];

const testimonials = [
  { name: 'Sarah M.', location: 'London', rating: 5, text: 'Absolutely love my new bed! The quality is amazing and delivery was so quick. Best sleep I\'ve had in years.' },
  { name: 'James T.', location: 'Manchester', rating: 5, text: 'Excellent service from start to finish. The ottoman bed has transformed our small bedroom with all the extra storage.' },
  { name: 'Emma R.', location: 'Birmingham', rating: 5, text: 'The mattress is incredibly comfortable. My back pain has completely gone since switching. Worth every penny!' },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // First seed the database
        await axios.post(`${API}/seed`);
        // Then fetch featured products
        const res = await axios.get(`${API}/products/featured`);
        setProducts(res.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div data-testid="home-page">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center" data-testid="hero-section">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1920&q=80" 
            alt="Luxury bedroom" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1C1917]/90 via-[#1C1917]/60 to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1.5 bg-[#BC4C2E] text-white text-sm font-medium rounded-full mb-6 animate-fade-in">
              Winter Sale — Up to 50% Off
            </span>
            <h1 className="font-['Playfair_Display'] text-5xl md:text-7xl font-medium text-white leading-tight mb-6 animate-fade-in-up">
              Sleep Like<br />You Mean It
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-lg animate-fade-in-up stagger-1">
              Discover premium beds and mattresses crafted for the perfect night's sleep. UK-made quality, delivered to your door.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in-up stagger-2">
              <Link to="/category/divan-beds">
                <Button size="lg" className="bg-[#BC4C2E] hover:bg-[#9A3412] text-white text-lg px-8 btn-press" data-testid="hero-cta-shop">
                  Shop Collection <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#1C1917] text-lg px-8" data-testid="hero-cta-about">
                  Our Story
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Trust Bar */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 hidden lg:block">
          <div className="glass rounded-2xl p-6 grid grid-cols-4 gap-6">
            {trustItems.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#BC4C2E]/10 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-[#BC4C2E]" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-[#1C1917]">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile Trust Bar */}
      <section className="lg:hidden bg-[#F5F5F4] py-8" data-testid="mobile-trust-section">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-4">
            {trustItems.map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-white rounded-xl p-4">
                <div className="w-10 h-10 rounded-full bg-[#BC4C2E]/10 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-[#BC4C2E]" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 md:py-24" data-testid="categories-section">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl font-medium mb-4">Shop by Category</h2>
            <p className="text-muted-foreground text-lg">Find your perfect bed from our curated collections</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <Link 
                key={cat.slug} 
                to={`/category/${cat.slug}`}
                className="group relative aspect-[4/5] rounded-2xl overflow-hidden card-hover"
                data-testid={`category-card-${cat.slug}`}
              >
                <img 
                  src={cat.image} 
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/80 via-[#1C1917]/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-['Playfair_Display'] text-2xl text-white mb-1">{cat.name}</h3>
                  <p className="text-white/70 text-sm mb-3">{cat.description}</p>
                  <span className="inline-flex items-center text-white text-sm font-medium group-hover:gap-2 transition-all">
                    Explore <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24 bg-[#F5F5F4]" data-testid="featured-products-section">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div>
              <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl font-medium mb-4">Bestsellers</h2>
              <p className="text-muted-foreground text-lg">Our most loved beds & mattresses</p>
            </div>
            <Link to="/category/divan-beds">
              <Button variant="outline" className="group" data-testid="view-all-products">
                View All <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1,2,3,4].map(i => (
                <div key={i} className="aspect-[4/5] rounded-2xl bg-white animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Finance Banner */}
      <section className="py-16 md:py-20 bg-[#1C1917]" data-testid="finance-section">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl text-white mb-4">
                Spread the Cost with 0% Finance
              </h2>
              <p className="text-[#a8a29e] text-lg max-w-xl">
                Buy now, pay later with interest-free credit. Enjoy your perfect night's sleep from just £25/month.
              </p>
            </div>
            <Link to="/category/divan-beds">
              <Button size="lg" className="bg-[#BC4C2E] hover:bg-[#9A3412] text-white btn-press whitespace-nowrap" data-testid="finance-cta">
                Shop with Finance <CreditCard className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24" data-testid="testimonials-section">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-1 mb-4">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className="w-6 h-6 fill-[#BC4C2E] text-[#BC4C2E]" />
              ))}
            </div>
            <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl font-medium mb-4">Loved by Thousands</h2>
            <p className="text-muted-foreground text-lg">Join over 5,000 happy customers sleeping better</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((review, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] card-hover" data-testid={`testimonial-${i}`}>
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className={`w-4 h-4 ${s <= review.rating ? 'fill-[#BC4C2E] text-[#BC4C2E]' : 'text-gray-200'}`} />
                  ))}
                </div>
                <p className="text-[#1C1917] mb-4">"{review.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#BC4C2E]/10 flex items-center justify-center">
                    <span className="font-semibold text-[#BC4C2E]">{review.name[0]}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{review.name}</p>
                    <p className="text-xs text-muted-foreground">{review.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
