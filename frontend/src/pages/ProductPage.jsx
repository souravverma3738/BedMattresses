import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Star, Truck, RotateCcw, ShieldCheck, CreditCard, Minus, Plus, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000'}/api`;

export default function ProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedStorage, setSelectedStorage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const [productRes, reviewsRes] = await Promise.all([
          axios.get(`${API}/products/${slug}`),
          axios.get(`${API}/reviews/${slug}`).catch(() => ({ data: [] }))
        ]);
        setProduct(productRes.data);
        setReviews(reviewsRes.data);
        
        // Set defaults
        if (productRes.data.sizes?.length) setSelectedSize(productRes.data.sizes[0]);
        if (productRes.data.colors?.length) setSelectedColor(productRes.data.colors[0]);
        if (productRes.data.storage_options?.length) setSelectedStorage(productRes.data.storage_options[0]);
      } catch (err) {
        console.error('Error fetching product:', err);
        toast.error('Product not found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug, navigate]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }

    setAdding(true);
    const success = await addToCart({
      product_id: product.id,
      quantity,
      size: selectedSize,
      color: selectedColor || null,
      storage_option: selectedStorage || null
    });
    setAdding(false);
    
    if (success) {
      // Option to go to cart
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 w-64 bg-[#F5F5F4] rounded mb-8" />
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="aspect-square rounded-2xl bg-[#F5F5F4]" />
            <div className="space-y-4">
              <div className="h-10 w-3/4 bg-[#F5F5F4] rounded" />
              <div className="h-6 w-1/4 bg-[#F5F5F4] rounded" />
              <div className="h-32 bg-[#F5F5F4] rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const hasDiscount = product.sale_price && product.sale_price < product.price;
  const displayPrice = product.sale_price || product.price;

  return (
    <div data-testid="product-page">
      {/* Breadcrumb */}
      <div className="bg-[#F5F5F4] py-4">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm flex-wrap">
            <Link to="/" className="text-muted-foreground hover:text-[#1C1917]">Home</Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <Link to={`/category/${product.category}`} className="text-muted-foreground hover:text-[#1C1917] capitalize">
              {product.category.replace('-', ' ')}
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div>
            <div className="aspect-square rounded-2xl overflow-hidden bg-[#F5F5F4] mb-4">
              <img 
                src={product.images?.[selectedImage] || product.images?.[0]} 
                alt={product.name}
                className="w-full h-full object-cover"
                data-testid="product-main-image"
              />
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-lg overflow-hidden shrink-0 border-2 transition-colors ${selectedImage === i ? 'border-[#BC4C2E]' : 'border-transparent'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            {/* Badges */}
            <div className="flex gap-2 mb-4">
              {hasDiscount && (
                <Badge className="bg-[#BC4C2E] text-white border-0">
                  Save £{(product.price - product.sale_price).toFixed(0)}
                </Badge>
              )}
              {product.in_stock ? (
                <Badge variant="outline" className="border-green-500 text-green-600">
                  <Check className="w-3 h-3 mr-1" /> In Stock
                </Badge>
              ) : (
                <Badge variant="outline" className="border-red-500 text-red-600">Out of Stock</Badge>
              )}
            </div>

            {/* Title & Rating */}
            <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl font-medium text-[#1C1917] mb-3" data-testid="product-title">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className={`w-5 h-5 ${s <= Math.round(product.rating) ? 'fill-[#BC4C2E] text-[#BC4C2E]' : 'text-gray-200'}`} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.review_count} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-[#1C1917]" data-testid="product-price">
                £{displayPrice.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-xl text-muted-foreground line-through">
                  £{product.price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Finance */}
            <div className="bg-[#F5F5F4] rounded-xl p-4 mb-6">
              <p className="text-sm">
                <CreditCard className="w-4 h-4 inline mr-2" />
                Pay in 12 monthly instalments of <strong>£{(displayPrice / 12).toFixed(2)}</strong> with 0% finance
              </p>
            </div>

            {/* Description */}
            <p className="text-muted-foreground mb-6">{product.short_description}</p>

            {/* Options */}
            <div className="space-y-4 mb-6">
              {/* Size */}
              <div>
                <label className="block text-sm font-semibold mb-2">Size</label>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger data-testid="size-select">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.sizes?.map(size => (
                      <SelectItem key={size} value={size}>{size}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Color */}
              {product.colors?.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold mb-2">Colour</label>
                  <Select value={selectedColor} onValueChange={setSelectedColor}>
                    <SelectTrigger data-testid="color-select">
                      <SelectValue placeholder="Select colour" />
                    </SelectTrigger>
                    <SelectContent>
                      {product.colors.map(color => (
                        <SelectItem key={color} value={color}>{color}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Storage */}
              {product.storage_options?.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold mb-2">Storage Option</label>
                  <Select value={selectedStorage} onValueChange={setSelectedStorage}>
                    <SelectTrigger data-testid="storage-select">
                      <SelectValue placeholder="Select storage" />
                    </SelectTrigger>
                    <SelectContent>
                      {product.storage_options.map(opt => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Quantity */}
              <div>
                <label className="block text-sm font-semibold mb-2">Quantity</label>
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-semibold" data-testid="quantity-display">{quantity}</span>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Add to Cart */}
            <Button 
              size="lg" 
              className="w-full bg-[#BC4C2E] hover:bg-[#9A3412] text-white text-lg btn-press mb-4"
              onClick={handleAddToCart}
              disabled={!product.in_stock || adding}
              data-testid="add-to-cart-btn"
            >
              {adding ? 'Adding...' : 'Add to Cart'} — £{(displayPrice * quantity).toFixed(2)}
            </Button>

            {/* Trust Signals */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="flex items-center gap-2 text-sm">
                <Truck className="w-4 h-4 text-[#BC4C2E]" />
                <span>{product.delivery_time}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <RotateCcw className="w-4 h-4 text-[#BC4C2E]" />
                <span>14-day returns</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <ShieldCheck className="w-4 h-4 text-[#BC4C2E]" />
                <span>10-year warranty</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CreditCard className="w-4 h-4 text-[#BC4C2E]" />
                <span>0% finance available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="description" className="mt-12">
          <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
            <TabsTrigger value="description" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#BC4C2E] data-[state=active]:bg-transparent px-6 py-3">
              Description
            </TabsTrigger>
            <TabsTrigger value="features" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#BC4C2E] data-[state=active]:bg-transparent px-6 py-3">
              Features
            </TabsTrigger>
            <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#BC4C2E] data-[state=active]:bg-transparent px-6 py-3">
              Reviews ({product.review_count})
            </TabsTrigger>
            <TabsTrigger value="delivery" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#BC4C2E] data-[state=active]:bg-transparent px-6 py-3">
              Delivery
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="pt-6">
            <div className="prose max-w-none">
              <p className="text-muted-foreground">{product.description}</p>
            </div>
          </TabsContent>

          <TabsContent value="features" className="pt-6">
            <ul className="space-y-3">
              {product.features?.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#BC4C2E] mt-0.5 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </TabsContent>

          <TabsContent value="reviews" className="pt-6">
            {reviews.length === 0 ? (
              <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b pb-6">
                    <div className="flex items-center gap-1 mb-2">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className={`w-4 h-4 ${s <= review.rating ? 'fill-[#BC4C2E] text-[#BC4C2E]' : 'text-gray-200'}`} />
                      ))}
                    </div>
                    <h4 className="font-semibold mb-1">{review.title}</h4>
                    <p className="text-muted-foreground mb-2">{review.content}</p>
                    <p className="text-sm text-muted-foreground">
                      {review.user_name} {review.verified_purchase && <Badge variant="secondary" className="ml-2">Verified Purchase</Badge>}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="delivery" className="pt-6">
            <div className="space-y-4">
              <p><strong>Delivery Time:</strong> {product.delivery_time}</p>
              <p><strong>Free Delivery:</strong> On all orders over £500</p>
              <p><strong>Standard Delivery:</strong> £39.99 for orders under £500</p>
              <p className="text-muted-foreground">All deliveries include a 2-hour delivery slot and we'll call you 30 minutes before arrival.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
