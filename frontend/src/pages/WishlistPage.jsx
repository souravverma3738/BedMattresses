import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = async (product) => {
    await addToCart({
      product_id: product.id,
      quantity: 1,
      size: product.sizes?.[0] || 'Double',
      color: product.colors?.[0] || null,
      storage_option: product.storage_options?.[0] || null,
    });
    removeFromWishlist(product.id);
  };

  return (
    <div data-testid="wishlist-page">
      {/* Header */}
      <div className="bg-[#1C1917] text-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-red-400 fill-red-400" />
            <div>
              <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl font-medium">My Wishlist</h1>
              <p className="text-[#a8a29e] mt-1">{wishlist.length} saved {wishlist.length === 1 ? 'item' : 'items'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        {wishlist.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-red-300" />
            </div>
            <h2 className="font-['Playfair_Display'] text-2xl font-medium mb-3">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Save products you love by clicking the heart icon on any product. They'll appear here for easy access.
            </p>
            <Link to="/category/divan-beds">
              <Button className="bg-[#BC4C2E] hover:bg-[#9A3412]">
                Browse Products <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlist.map((product) => {
                const hasDiscount = product.sale_price && product.sale_price < product.price;
                const displayPrice = product.sale_price || product.price;

                return (
                  <div key={product.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#F5F5F4]">
                      <Link to={`/product/${product.slug}`}>
                        <img
                          src={product.images?.[0]}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </Link>

                      {hasDiscount && (
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-[#BC4C2E] text-white border-0 font-semibold">
                            -{Math.round((1 - product.sale_price / product.price) * 100)}%
                          </Badge>
                        </div>
                      )}

                      {/* Remove button */}
                      <button
                        onClick={() => removeFromWishlist(product.id)}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white shadow transition-all"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <Link to={`/product/${product.slug}`}>
                        <h3 className="font-['Playfair_Display'] font-medium text-[#1C1917] hover:text-[#BC4C2E] transition-colors line-clamp-2 mb-2">
                          {product.name}
                        </h3>
                      </Link>

                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-lg font-bold text-[#BC4C2E]">£{displayPrice?.toFixed(2)}</span>
                        {hasDiscount && (
                          <span className="text-sm text-muted-foreground line-through">£{product.price?.toFixed(2)}</span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1 bg-[#BC4C2E] hover:bg-[#9A3412] text-white text-xs"
                          onClick={() => handleMoveToCart(product)}
                        >
                          <ShoppingBag className="w-3.5 h-3.5 mr-1.5" /> Add to Cart
                        </Button>
                        <Link to={`/product/${product.slug}`}>
                          <Button size="sm" variant="outline" className="text-xs px-3">
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 text-center">
              <Link to="/category/divan-beds">
                <Button variant="outline" className="border-[#1C1917]">
                  Continue Shopping <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
