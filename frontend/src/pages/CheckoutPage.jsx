import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronRight, Lock, Truck, CreditCard } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000'}/api`;

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [sameAsBilling, setSameAsBilling] = useState(true);
  
  const [shippingAddress, setShippingAddress] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    county: '',
    postcode: ''
  });

  const [billingAddress, setBillingAddress] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    county: '',
    postcode: ''
  });

  const deliveryFree = cart.total >= 500;
  const deliveryCost = deliveryFree ? 0 : 39.99;
  const totalWithDelivery = cart.total + deliveryCost;

  if (!isAuthenticated) {
    navigate('/login?redirect=/checkout');
    return null;
  }

  if (cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleShippingChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handleBillingChange = (e) => {
    setBillingAddress({ ...billingAddress, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate
    const required = ['first_name', 'last_name', 'email', 'phone', 'address_line1', 'city', 'county', 'postcode'];
    for (const field of required) {
      if (!shippingAddress[field]) {
        toast.error(`Please fill in ${field.replace('_', ' ')}`);
        return;
      }
    }

    setLoading(true);
    try {
      // Create order
      const orderRes = await axios.post(`${API}/orders`, {
        shipping_address: shippingAddress,
        billing_address: sameAsBilling ? null : billingAddress,
        items: cart.items.map(i => ({
          product_id: i.product_id,
          quantity: i.quantity,
          size: i.size,
          color: i.color,
          storage_option: i.storage_option
        }))
      });

      // Create Stripe checkout session
      const checkoutRes = await axios.post(`${API}/checkout/create-session`, {
        origin_url: window.location.origin,
        order_id: orderRes.data.order_id
      });

      // Redirect to Stripe
      window.location.href = checkoutRes.data.url;
    } catch (err) {
      console.error('Checkout error:', err);
      toast.error(err.response?.data?.detail || 'Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="checkout-page">
      {/* Breadcrumb */}
      <div className="bg-[#F5F5F4] py-4">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-[#1C1917]">Home</Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <Link to="/cart" className="text-muted-foreground hover:text-[#1C1917]">Cart</Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">Checkout</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl font-medium mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Shipping */}
              <div className="bg-white rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[#BC4C2E]" /> Delivery Address
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name">First Name *</Label>
                    <Input id="first_name" name="first_name" value={shippingAddress.first_name} onChange={handleShippingChange} required data-testid="shipping-first-name" />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Last Name *</Label>
                    <Input id="last_name" name="last_name" value={shippingAddress.last_name} onChange={handleShippingChange} required data-testid="shipping-last-name" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" name="email" type="email" value={shippingAddress.email} onChange={handleShippingChange} required data-testid="shipping-email" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input id="phone" name="phone" type="tel" value={shippingAddress.phone} onChange={handleShippingChange} required data-testid="shipping-phone" />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address_line1">Address Line 1 *</Label>
                    <Input id="address_line1" name="address_line1" value={shippingAddress.address_line1} onChange={handleShippingChange} required data-testid="shipping-address1" />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address_line2">Address Line 2</Label>
                    <Input id="address_line2" name="address_line2" value={shippingAddress.address_line2} onChange={handleShippingChange} data-testid="shipping-address2" />
                  </div>
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input id="city" name="city" value={shippingAddress.city} onChange={handleShippingChange} required data-testid="shipping-city" />
                  </div>
                  <div>
                    <Label htmlFor="county">County *</Label>
                    <Input id="county" name="county" value={shippingAddress.county} onChange={handleShippingChange} required data-testid="shipping-county" />
                  </div>
                  <div>
                    <Label htmlFor="postcode">Postcode *</Label>
                    <Input id="postcode" name="postcode" value={shippingAddress.postcode} onChange={handleShippingChange} required data-testid="shipping-postcode" />
                  </div>
                </div>
              </div>

              {/* Billing */}
              <div className="bg-white rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#BC4C2E]" /> Billing Address
                </h2>
                
                <div className="flex items-center gap-2 mb-4">
                  <Checkbox 
                    id="sameAsBilling" 
                    checked={sameAsBilling} 
                    onCheckedChange={setSameAsBilling}
                    data-testid="same-as-billing"
                  />
                  <Label htmlFor="sameAsBilling" className="cursor-pointer">Same as delivery address</Label>
                </div>

                {!sameAsBilling && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>First Name *</Label>
                      <Input name="first_name" value={billingAddress.first_name} onChange={handleBillingChange} required />
                    </div>
                    <div>
                      <Label>Last Name *</Label>
                      <Input name="last_name" value={billingAddress.last_name} onChange={handleBillingChange} required />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Address Line 1 *</Label>
                      <Input name="address_line1" value={billingAddress.address_line1} onChange={handleBillingChange} required />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Address Line 2</Label>
                      <Input name="address_line2" value={billingAddress.address_line2} onChange={handleBillingChange} />
                    </div>
                    <div>
                      <Label>City *</Label>
                      <Input name="city" value={billingAddress.city} onChange={handleBillingChange} required />
                    </div>
                    <div>
                      <Label>County *</Label>
                      <Input name="county" value={billingAddress.county} onChange={handleBillingChange} required />
                    </div>
                    <div>
                      <Label>Postcode *</Label>
                      <Input name="postcode" value={billingAddress.postcode} onChange={handleBillingChange} required />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] sticky top-24">
                <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
                
                {/* Items */}
                <div className="space-y-3 mb-4">
                  {cart.items.map((item, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#F5F5F4] shrink-0">
                        <img src={item.product?.images?.[0]} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1">{item.product?.name}</p>
                        <p className="text-xs text-muted-foreground">{item.size} × {item.quantity}</p>
                        <p className="text-sm font-semibold">£{(item.item_total || 0).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2 text-sm">
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
                </div>

                <div className="border-t my-4 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>£{totalWithDelivery.toFixed(2)}</span>
                  </div>
                </div>

                <Button 
                  type="submit"
                  size="lg" 
                  className="w-full bg-[#BC4C2E] hover:bg-[#9A3412] btn-press"
                  disabled={loading}
                  data-testid="place-order-btn"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  {loading ? 'Processing...' : 'Pay Now'}
                </Button>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  You'll be redirected to Stripe for secure payment
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
