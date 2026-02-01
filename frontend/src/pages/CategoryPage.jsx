import { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { ChevronRight, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '../components/ui/sheet';
import { Slider } from '../components/ui/slider';
import ProductCard from '../components/product/ProductCard';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const categoryInfo = {
  'divan-beds': { title: 'Divan Beds', description: 'Classic comfort with built-in storage options. Our divan beds combine timeless design with practical functionality.' },
  'bed-frames': { title: 'Bed Frames', description: 'Stylish and sturdy bed frames to complement any bedroom. From modern minimalist to classic elegance.' },
  'ottoman-beds': { title: 'Ottoman Beds', description: 'Maximize your storage space with our gas-lift ottoman beds. Perfect for smaller bedrooms.' },
  'mattresses': { title: 'Mattresses', description: 'Premium mattresses for the perfect night\'s sleep. From pocket springs to memory foam.' },
};

export default function CategoryPage() {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search');
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('default');
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [filterOpen, setFilterOpen] = useState(false);

  const info = categoryInfo[category] || { title: 'All Products', description: 'Browse our complete collection of beds and mattresses.' };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `${API}/products`;
        if (category && category !== 'all') {
          url = `${API}/products/category/${category}?sort=${sort}`;
        }
        if (search) {
          url = `${API}/products?search=${encodeURIComponent(search)}`;
        }
        const res = await axios.get(url);
        // Filter by price on frontend for now
        const filtered = res.data.filter(p => {
          const price = p.sale_price || p.price;
          return price >= priceRange[0] && price <= priceRange[1];
        });
        setProducts(filtered);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, sort, search, priceRange]);

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold mb-4">Price Range</h4>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          min={0}
          max={2000}
          step={50}
          className="mb-4"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>£{priceRange[0]}</span>
          <span>£{priceRange[1]}</span>
        </div>
      </div>
      
      <div>
        <h4 className="font-semibold mb-4">Categories</h4>
        <div className="space-y-2">
          {Object.entries(categoryInfo).map(([slug, info]) => (
            <Link
              key={slug}
              to={`/category/${slug}`}
              className={`block py-2 px-3 rounded-lg transition-colors ${category === slug ? 'bg-[#BC4C2E] text-white' : 'hover:bg-[#F5F5F4]'}`}
              onClick={() => setFilterOpen(false)}
            >
              {info.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div data-testid="category-page">
      {/* Breadcrumb */}
      <div className="bg-[#F5F5F4] py-4">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-[#1C1917]">Home</Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{search ? `Search: "${search}"` : info.title}</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="bg-[#1C1917] text-white py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl font-medium mb-4" data-testid="category-title">
            {search ? `Results for "${search}"` : info.title}
          </h1>
          <p className="text-[#a8a29e] max-w-2xl mx-auto">{info.description}</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 bg-white rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <h3 className="font-semibold mb-6">Filters</h3>
              <FilterContent />
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <p className="text-muted-foreground">
                {loading ? 'Loading...' : `${products.length} products`}
              </p>
              
              <div className="flex items-center gap-3">
                {/* Mobile Filter */}
                <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
                  <SheetTrigger asChild className="lg:hidden">
                    <Button variant="outline" size="sm" data-testid="mobile-filter-trigger">
                      <SlidersHorizontal className="w-4 h-4 mr-2" /> Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Sort */}
                <Select value={sort} onValueChange={setSort}>
                  <SelectTrigger className="w-[180px]" data-testid="sort-select">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Product Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="aspect-[4/5] rounded-2xl bg-[#F5F5F4] animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-lg text-muted-foreground mb-4">No products found</p>
                <Link to="/category/divan-beds">
                  <Button>Browse All Products</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="product-grid">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
