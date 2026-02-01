import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Package, ChevronRight, User, LogOut } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function AccountPage() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API}/orders`);
        setOrders(res.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending_payment: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      shipped: 'bg-blue-100 text-blue-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  if (!isAuthenticated) return null;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12" data-testid="account-page">
      <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl font-medium mb-8">My Account</h1>

      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList>
          <TabsTrigger value="orders" className="gap-2">
            <Package className="w-4 h-4" /> Orders
          </TabsTrigger>
          <TabsTrigger value="profile" className="gap-2">
            <User className="w-4 h-4" /> Profile
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="p-8 text-center">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">You haven't placed any orders yet</p>
                <Link to="/category/divan-beds">
                  <Button className="bg-[#BC4C2E] hover:bg-[#9A3412]">Start Shopping</Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y">
                {orders.map((order) => (
                  <div key={order.id} className="p-4 md:p-6" data-testid={`order-${order.id}`}>
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                      <Badge className={getStatusBadge(order.status)}>
                        {order.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 mb-4">
                      {order.items?.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="w-16 h-16 rounded-lg bg-[#F5F5F4] overflow-hidden">
                          {/* Placeholder for product image */}
                        </div>
                      ))}
                      {order.items?.length > 3 && (
                        <div className="w-16 h-16 rounded-lg bg-[#F5F5F4] flex items-center justify-center text-sm text-muted-foreground">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <p className="font-semibold">Total: £{order.total?.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="profile">
          <div className="bg-white rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <h2 className="font-semibold text-lg mb-6">Profile Information</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{user?.first_name} {user?.last_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="mt-8 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
              data-testid="logout-btn"
            >
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
