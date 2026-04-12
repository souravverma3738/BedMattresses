import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, ShieldCheck, CreditCard, Star, ChevronRight, MessageCircle, Mail, Phone, Tag, Package } from 'lucide-react';
import { Button } from '../components/ui/button';
import ProductCard from '../components/product/ProductCard';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// ── CATEGORIES (matches PDF exactly) ────────────────────────────────────────
const popularCategories = [
  { name: 'Luxury Bed Frames', slug: 'bed-frames', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80', from: '£199' },
  { name: 'Luxury Mattresses', slug: 'mattresses-luxury', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80', from: '£299' },
  { name: 'Ottoman Beds', slug: 'ottoman-beds', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80', from: '£449' },
  { name: 'Beds with Drawers', slug: '4-drawer-beds', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80', from: '£339' },
  { name: 'TV Beds', slug: 'tv-beds', image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&q=80', from: '£999' },
];

// ── TRUST BAR ────────────────────────────────────────────────────────────────
const trustItems = [
  { icon: Star, label: '5-Star Rated', sub: 'Over 5,000 reviews' },
  { icon: Truck, label: 'Free Delivery', sub: 'On orders over £499' },
  { icon: ShieldCheck, label: '2 Year Warranty', sub: 'On all products' },
  { icon: Package, label: 'Made in UK', sub: 'Quality guaranteed' },
];

// ── BUNDLE DEALS (from PDF) ───────────────────────────────────────────────────
const bundleDeals = [
  {
    title: 'Double Bed + Mattress',
    subtitle: 'Save More When You Buy As A Set',
    from: '£299',
    size: "Double (4'6)",
    slug: 'deals-bed-mattress',
    color: 'from-[#1a1a2e] to-[#16213e]',
    badge: 'BEST VALUE',
  },
  {
    title: 'King Bed + Mattress',
    subtitle: 'Save More When You Buy As A Set',
    from: '£399',
    size: "King (5'0)",
    slug: 'deals-king',
    color: 'from-[#BC4C2E] to-[#9A3412]',
    badge: 'POPULAR',
  },
];

// ── REVIEWS ───────────────────────────────────────────────────────────────────
const siteReviews = [
  { name: 'Sarah M.', location: 'London', rating: 5, text: 'Great quality and fast delivery! The ottoman bed has transformed our bedroom. Highly recommend!' },
  { name: 'James T.', location: 'Manchester', rating: 5, text: 'Amazing value for money. Delivered on time and assembled easily. The mattress is so comfortable.' },
  { name: 'Emma R.', location: 'Birmingham', rating: 5, text: 'Excellent comfort and finish. My back pain has completely gone since I switched to their orthopaedic mattress.' },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        await axios.post(`${API}/seed`);
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
    <div data-testid="home-page" className="overflow-x-hidden">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center" data-testid="hero-section">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1920&q=85"
            alt="Luxury bedroom"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d1a]/92 via-[#0d0d1a]/65 to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10 pt-8 pb-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-yellow-400 text-[#1a1a2e] px-4 py-1.5 rounded-full text-sm font-bold mb-6 shadow-lg">
              <Tag className="w-4 h-4" />
              50% SALE ON SELECTED ITEMS
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-6">
              Affordable<br />
              <span className="text-yellow-400">Beds</span> &<br />
              Mattresses
            </h1>
            <p className="text-lg md:text-xl text-white/75 mb-4 max-w-md">
              Free Delivery · 2 Year Warranty · Made in UK
            </p>
            <p className="text-white/60 text-base mb-8 max-w-md">
              Discover our extensive range of beds, ottomans, TV beds and premium mattresses — all at unbeatable prices.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/category/divan-beds">
                <Button size="lg" className="bg-[#BC4C2E] hover:bg-[#9A3412] text-white font-bold px-8 h-12 text-base shadow-lg shadow-red-900/30">
                  Shop Beds <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/category/mattresses-luxury">
                <Button size="lg" variant="outline" className="border-white/60 text-white hover:bg-white hover:text-[#1a1a2e] font-semibold px-8 h-12 text-base">
                  Shop Mattresses
                </Button>
              </Link>
              <Link to="/category/deals-bed-mattress">
                <Button size="lg" className="bg-yellow-400 hover:bg-yellow-300 text-[#1a1a2e] font-bold px-8 h-12 text-base">
                  View Deals 🔥
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ─────────────────────────────────────────────────────── */}
      <section className="bg-[#1a1a2e] py-5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trustItems.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-400/10 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{item.label}</p>
                  <p className="text-white/50 text-xs">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MOST POPULAR CATEGORIES ───────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-[#BC4C2E] font-semibold text-sm uppercase tracking-widest mb-2">Browse Our Range</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a2e]">Most Popular Categories</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {popularCategories.map((cat, i) => (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                data-testid={`category-card-${cat.slug}`}
              >
                <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-bold text-sm text-[#1a1a2e] mb-1 leading-tight">{cat.name}</h3>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
                  </div>
                  <p className="text-[#BC4C2E] font-bold text-sm">From {cat.from}</p>
                  <span className="inline-block mt-2 text-xs font-semibold text-[#BC4C2E] group-hover:underline">
                    Shop Now →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── LATEST BED DESIGNS ────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
            <div>
              <p className="text-[#BC4C2E] font-semibold text-sm uppercase tracking-widest mb-2">New Arrivals</p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a2e]">Latest Bed Designs</h2>
            </div>
            <Link to="/category/divan-beds">
              <Button variant="outline" className="border-[#1a1a2e] text-[#1a1a2e] hover:bg-[#1a1a2e] hover:text-white font-semibold" data-testid="view-all-products">
                View All Beds <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {[1,2,3,4,5,6,7,8].map(i => (
                <div key={i} className="aspect-[3/4] rounded-2xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {products.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── BUNDLE DEALS ──────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-[#BC4C2E] font-semibold text-sm uppercase tracking-widest mb-2">Best Value</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a2e]">Best Selling Bundle Deals</h2>
            <p className="text-gray-500 mt-2">Save more when you buy as a complete set</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {bundleDeals.map((deal, i) => (
              <div key={i} className={`bg-gradient-to-br ${deal.color} rounded-3xl p-8 text-white relative overflow-hidden`}>
                {/* Decorative circle */}
                <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/5" />
                <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/5" />

                <span className="inline-block bg-yellow-400 text-[#1a1a2e] text-xs font-bold px-3 py-1 rounded-full mb-4">
                  {deal.badge}
                </span>
                <h3 className="text-2xl font-bold mb-1">{deal.title}</h3>
                <p className="text-white/70 text-sm mb-6">{deal.subtitle}</p>

                <div className="flex items-end gap-4 mb-6">
                  <div>
                    <p className="text-white/60 text-xs mb-1">Starting from</p>
                    <p className="text-4xl font-black">{deal.from}</p>
                  </div>
                  <div className="bg-white/10 rounded-xl px-3 py-2 text-sm font-medium">
                    {deal.size}
                  </div>
                </div>

                <Link to={`/category/${deal.slug}`}>
                  <Button className="bg-white text-[#1a1a2e] hover:bg-gray-100 font-bold w-full">
                    VIEW ALL DEALS <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          {/* Third deal - luxury */}
          <div className="mt-6 max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-amber-700 to-amber-900 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <span className="inline-block bg-yellow-400 text-[#1a1a2e] text-xs font-bold px-3 py-1 rounded-full mb-3">PREMIUM</span>
                <h3 className="text-2xl font-bold">Luxury Bed + Pocket Mattress</h3>
                <p className="text-white/70 text-sm mt-1">Our finest combination — handcrafted quality</p>
              </div>
              <div className="text-center md:text-right shrink-0">
                <p className="text-white/60 text-xs mb-1">From</p>
                <p className="text-4xl font-black mb-1">£499</p>
                <p className="text-white/70 text-sm mb-4">Double (4'6)</p>
                <Link to="/category/deals-luxury">
                  <Button className="bg-yellow-400 text-[#1a1a2e] hover:bg-yellow-300 font-bold px-8">
                    VIEW ALL DEALS
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── REVIEWS ───────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-1 mb-3">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-7 h-7 fill-yellow-400 text-yellow-400" />)}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a2e]">Our Independent Reviews</h2>
            <p className="text-gray-500 mt-2">Trusted by thousands of happy customers across the UK</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {siteReviews.map((review, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-[#BC4C2E]/30 hover:shadow-lg transition-all duration-300">
                <div className="flex gap-1 mb-3">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className={`w-4 h-4 ${s <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">"{review.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#BC4C2E] flex items-center justify-center text-white font-bold text-sm">
                    {review.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-[#1a1a2e]">{review.name}</p>
                    <p className="text-xs text-gray-500">{review.location} · Verified Purchase ✓</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT / USP ───────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-[#1a1a2e]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-yellow-400 font-semibold text-sm uppercase tracking-widest mb-3">About Us</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Luxury Beds & Ottoman Beds — Affordable Prices
              </h2>
              <p className="text-white/65 text-base leading-relaxed mb-6">
                We provide high-quality, affordable beds designed for comfort and style. Our collection includes luxury bed frames and ottoman storage beds, helping you maximise space without compromising on design.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {[
                  '✔ Affordable Prices',
                  '✔ 2 Years Warranty',
                  '✔ Fast UK Delivery',
                  '✔ Built For Comfort & Durability',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-white/80 text-sm font-medium">
                    <span className="text-yellow-400">{item.split(' ')[0]}</span>
                    <span>{item.split(' ').slice(1).join(' ')}</span>
                  </div>
                ))}
              </div>
              <Link to="/about">
                <Button className="bg-yellow-400 hover:bg-yellow-300 text-[#1a1a2e] font-bold">
                  Learn More About Us
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { num: '50,000+', label: 'Beds Delivered' },
                { num: '5★', label: 'Average Rating' },
                { num: '5,000+', label: 'Happy Customers' },
                { num: '2 Years', label: 'Warranty' },
              ].map((stat, i) => (
                <div key={i} className="bg-white/5 rounded-2xl p-6 text-center border border-white/10">
                  <p className="text-3xl font-black text-yellow-400 mb-1">{stat.num}</p>
                  <p className="text-white/60 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT / HELP ────────────────────────────────────────────────── */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a2e] mb-2">Need Help?</h2>
          <p className="text-gray-500 mb-8">Our team is here to assist you with any questions or support you need.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto">
            <a href="https://wa.me/08001234567" className="flex-1">
              <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold h-12 gap-2">
                <MessageCircle className="w-5 h-5" /> WhatsApp Us
              </Button>
            </a>
            <Link to="/contact" className="flex-1">
              <Button className="w-full bg-[#BC4C2E] hover:bg-[#9A3412] text-white font-semibold h-12 gap-2">
                <Mail className="w-5 h-5" /> Email Us
              </Button>
            </Link>
            <a href="tel:08001234567" className="flex-1">
              <Button variant="outline" className="w-full border-[#1a1a2e] text-[#1a1a2e] hover:bg-[#1a1a2e] hover:text-white font-semibold h-12 gap-2">
                <Phone className="w-5 h-5" /> Call Us
              </Button>
            </a>
          </div>
          <p className="text-gray-400 text-sm mt-4">Fast, friendly support whenever you need it.</p>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-[#BC4C2E]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Upgrade Your Sleep Today
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            Don't miss out on our best deals. Discover high-quality beds at affordable prices with free delivery included.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/category/divan-beds">
              <Button size="lg" className="bg-white text-[#BC4C2E] hover:bg-gray-100 font-bold px-10 h-12 text-base">
                Shop Now <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/category/deals-bed-mattress">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-semibold px-10 h-12 text-base">
                View Bundle Deals 🔥
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
