import { Link } from 'react-router-dom';
import { Star, ShoppingBag } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

export default function ProductCard({ product }) {
  const hasDiscount = product.sale_price && product.sale_price < product.price;
  const discountPercent = hasDiscount 
    ? Math.round((1 - product.sale_price / product.price) * 100) 
    : 0;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden card-hover" data-testid={`product-card-${product.slug}`}>
      <Link to={`/product/${product.slug}`} className="block">
        {/* Image */}
        <div className="relative aspect-[4/5] overflow-hidden bg-[#F5F5F4]">
          <img 
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400'} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {hasDiscount && (
              <Badge className="bg-[#BC4C2E] text-white border-0 font-semibold">
                -{discountPercent}%
              </Badge>
            )}
            {!product.in_stock && (
              <Badge variant="secondary" className="bg-[#1C1917] text-white">
                Out of Stock
              </Badge>
            )}
          </div>

          {/* Quick Add - Desktop */}
          <div className="absolute bottom-4 left-4 right-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hidden md:block">
            <Button 
              className="w-full bg-[#1C1917] hover:bg-[#292524] text-white btn-press"
              onClick={(e) => {
                e.preventDefault();
                // Navigate to product page for selection
              }}
            >
              <ShoppingBag className="w-4 h-4 mr-2" /> Quick View
            </Button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-4 h-4 fill-[#BC4C2E] text-[#BC4C2E]" />
            <span className="text-sm font-medium">{product.rating}</span>
            <span className="text-sm text-muted-foreground">({product.review_count})</span>
          </div>

          {/* Title */}
          <h3 className="font-['Playfair_Display'] text-lg font-medium text-[#1C1917] mb-2 line-clamp-2 group-hover:text-[#BC4C2E] transition-colors">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            {hasDiscount ? (
              <>
                <span className="text-xl font-bold text-[#BC4C2E]">
                  £{product.sale_price.toFixed(2)}
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  £{product.price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-xl font-bold text-[#1C1917]">
                £{product.price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Finance */}
          <p className="text-xs text-muted-foreground mt-2">
            or from £{Math.round((product.sale_price || product.price) / 12)}/mo
          </p>
        </div>
      </Link>

      {/* Mobile Add Button */}
      <div className="px-4 pb-4 md:hidden">
        <Link to={`/product/${product.slug}`}>
          <Button variant="outline" className="w-full btn-press">
            View Product
          </Button>
        </Link>
      </div>
    </div>
  );
}
