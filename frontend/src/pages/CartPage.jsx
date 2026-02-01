import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function CartPage() {
  const { cart, updateCart, removeItem, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const updateQuantity = async (item, delta) => {
    const newQty = item.quantity + delta;
    if (newQty < 1) return;
    
    const updatedItems = cart.items.map(i => {
      if (i.product_id === item.product_id && i.size === item.size) {
        return { ...i, quantity: newQty };
      }
      return i;
    });
    
    await updateCart(updatedItems.map(i => ({
      product_id: i.product_id,
      quantity: i.quantity,
      size: i.size,
      color: i.color,
      storage_option: i.storage_option
    })));
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  const deliveryFree = cart.total >= 500;
  const deliveryCost = deliveryFree ? 0 : 39.99;
  const totalWithDelivery = cart.total + deliveryCost;

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center" data-testid="cart-page-empty">
        <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="font-['Playfair_Display'] text-3xl font-medium mb-4">Your Cart</h1>
        <p className="text-muted-foreground mb-6">Please login to view your cart</p>
        <Link to="/login">
          <Button className="bg-[#BC4C2E] hover:bg-[#9A3412]" data-testid="login-to-view-cart">
            Login to Continue
          </Button>
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Loading cart...</p>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center" data-testid="cart-page-empty">
        <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="font-['Playfair_Display'] text-3xl font-medium mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-6">Looks like you haven't added anything yet</p>
        <Link to="/category/divan-beds">
          <Button className="bg-[#BC4C2E] hover:bg-[#9A3412]" data-testid="start-shopping-btn">
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12" data-testid="cart-page">
      <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl font-medium mb-8">Your Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item, idx) => (
            <div key={idx} className="flex gap-4 bg-white rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]" data-testid={`cart-item-${idx}`}>
              <Link to={`/product/${item.product?.slug}`} className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-[#F5F5F4] shrink-0">
                <img 
                  src={item.product?.images?.[0]} 
                  alt={item.product?.name}
                  className="w-full h-full object-cover"
                />
              </Link>
              
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.product?.slug}`}>
                  <h3 className="font-semibold text-[#1C1917] hover:text-[#BC4C2E] transition-colors line-clamp-1">
                    {item.product?.name}
                  </h3>
                </Link>
                <p className="text-sm text-muted-foreground mt-1">
                  Size: {item.size}
                  {item.color && ` • ${item.color}`}
                  {item.storage_option && ` • ${item.storage_option}`}
                </p>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item, -1)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item, 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-lg">
                      £{(item.item_total || 0).toFixed(2)}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-muted-foreground hover:text-red-600"
                      onClick={() => removeItem(item.product_id, item.size)}
                      data-testid={`remove-item-${idx}`}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] sticky top-24">
            <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>£{cart.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                {deliveryFree ? (
                  <span className="text-green-600">FREE</span>
                ) : (
                  <span>£{deliveryCost.toFixed(2)}</span>
                )}
              </div>
              
              {!deliveryFree && (
                <div className="bg-[#F5F5F4] rounded-lg p-3 flex items-start gap-2">
                  <Truck className="w-4 h-4 text-[#BC4C2E] mt-0.5 shrink-0" />
                  <p className="text-xs">
                    Spend £{(500 - cart.total).toFixed(2)} more for <strong>FREE delivery</strong>
                  </p>
                </div>
              )}
            </div>

            <div className="border-t my-4 pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>£{totalWithDelivery.toFixed(2)}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Including VAT</p>
            </div>

            <Button 
              size="lg" 
              className="w-full bg-[#BC4C2E] hover:bg-[#9A3412] btn-press"
              onClick={handleCheckout}
              data-testid="checkout-btn"
            >
              Checkout <ArrowRight className="ml-2 w-5 h-5" />
            </Button>

            <p className="text-xs text-center text-muted-foreground mt-4">
              Secure checkout powered by Stripe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
