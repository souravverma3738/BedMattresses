import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Package, User, LogOut, Heart, MapPin, Bell, Shield,
  Camera, Edit3, Save, X, Check, ChevronRight, Star,
  Truck, CreditCard, Phone, Mail, Home, Plus, Trash2
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import axios from 'axios';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function AccountPage() {
  const { user, logout, isAuthenticated } = useAuth();
  const { wishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileImg, setProfileImg] = useState(() => localStorage.getItem('snug_profile_img') || null);
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    dob: '',
  });
  const [addresses, setAddresses] = useState(() => {
    try { return JSON.parse(localStorage.getItem('snug_addresses') || '[]'); } catch { return []; }
  });
  const [addingAddress, setAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: 'Home', line1: '', line2: '', city: '', county: '', postcode: '', is_default: false
  });

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    setProfileData({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      phone: '',
      dob: '',
    });
    fetchOrders();
  }, [isAuthenticated, navigate, user]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API}/orders`);
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileImgChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setProfileImg(dataUrl);
      localStorage.setItem('snug_profile_img', dataUrl);
      toast.success('Profile photo updated');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = () => {
    setEditingProfile(false);
    toast.success('Profile updated successfully');
  };

  const handleSaveAddress = () => {
    const updated = [...addresses, { ...newAddress, id: Date.now() }];
    setAddresses(updated);
    localStorage.setItem('snug_addresses', JSON.stringify(updated));
    setAddingAddress(false);
    setNewAddress({ label: 'Home', line1: '', line2: '', city: '', county: '', postcode: '', is_default: false });
    toast.success('Address saved');
  };

  const handleDeleteAddress = (id) => {
    const updated = addresses.filter(a => a.id !== id);
    setAddresses(updated);
    localStorage.setItem('snug_addresses', JSON.stringify(updated));
    toast.success('Address removed');
  };

  const getStatusColor = (status) => {
    const map = {
      pending_payment: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      paid: 'bg-green-100 text-green-700 border-green-200',
      shipped: 'bg-blue-100 text-blue-700 border-blue-200',
      delivered: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      cancelled: 'bg-red-100 text-red-700 border-red-200',
    };
    return map[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  if (!isAuthenticated) return null;

  const initials = `${user?.first_name?.[0] || ''}${user?.last_name?.[0] || ''}`.toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50" data-testid="account-page">

      {/* Profile Hero */}
      <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl bg-[#BC4C2E]">
                {profileImg ? (
                  <img src={profileImg} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white">
                    {initials}
                  </div>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#BC4C2E] hover:bg-[#9A3412] rounded-full flex items-center justify-center shadow-lg transition-colors border-2 border-white"
              >
                <Camera className="w-3.5 h-3.5 text-white" />
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleProfileImgChange} />
            </div>

            {/* Info */}
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl md:text-3xl font-bold">{user?.first_name} {user?.last_name}</h1>
              <p className="text-white/60 text-sm mt-1">{user?.email}</p>
              <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                <span className="inline-flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1 text-xs font-medium">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /> Verified Member
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1 text-xs font-medium">
                  <Package className="w-3 h-3 text-blue-300" /> {orders.length} Orders
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1 text-xs font-medium">
                  <Heart className="w-3 h-3 text-red-300 fill-red-300" /> {wishlist.length} Saved
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="border-white/30 text-white hover:bg-white/10 shrink-0"
              onClick={() => { logout(); navigate('/'); }}
            >
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="container mx-auto px-4 pb-0">
          <div className="grid grid-cols-3 gap-px bg-white/10 rounded-t-xl overflow-hidden">
            {[
              { label: 'Total Orders', value: orders.length, icon: Package },
              { label: 'Saved Items', value: wishlist.length, icon: Heart },
              { label: 'Addresses', value: addresses.length, icon: MapPin },
            ].map((stat, i) => (
              <div key={i} className="bg-white/5 py-4 px-4 text-center">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-white/50 text-xs mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-white shadow-sm border rounded-xl p-1.5 h-auto flex-wrap gap-1 w-full justify-start">
            {[
              { value: 'profile', icon: User, label: 'Profile' },
              { value: 'orders', icon: Package, label: 'Orders' },
              { value: 'wishlist', icon: Heart, label: `Wishlist (${wishlist.length})` },
              { value: 'addresses', icon: MapPin, label: 'Addresses' },
              { value: 'security', icon: Shield, label: 'Security' },
            ].map(tab => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg data-[state=active]:bg-[#1a1a2e] data-[state=active]:text-white"
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ── PROFILE TAB ─────────────────────────────────────── */}
          <TabsContent value="profile">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <div>
                  <h2 className="font-semibold text-lg">Personal Information</h2>
                  <p className="text-sm text-muted-foreground">Manage your personal details</p>
                </div>
                {!editingProfile ? (
                  <Button variant="outline" size="sm" onClick={() => setEditingProfile(true)} className="gap-2">
                    <Edit3 className="w-4 h-4" /> Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => setEditingProfile(false)}><X className="w-4 h-4" /></Button>
                    <Button size="sm" className="bg-[#BC4C2E] hover:bg-[#9A3412] gap-2" onClick={handleSaveProfile}>
                      <Save className="w-4 h-4" /> Save
                    </Button>
                  </div>
                )}
              </div>

              <div className="p-6">
                {/* Profile Photo section */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-6">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#BC4C2E] flex items-center justify-center shrink-0">
                    {profileImg ? (
                      <img src={profileImg} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white text-xl font-bold">{initials}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">Profile Photo</p>
                    <p className="text-xs text-muted-foreground mb-2">JPG or PNG. Max 5MB.</p>
                    <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()} className="text-xs h-7 gap-1.5">
                      <Camera className="w-3 h-3" /> Change Photo
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">First Name</Label>
                    {editingProfile ? (
                      <Input value={profileData.first_name} onChange={e => setProfileData({ ...profileData, first_name: e.target.value })} className="mt-1" />
                    ) : (
                      <p className="mt-1 font-medium">{profileData.first_name || '—'}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Last Name</Label>
                    {editingProfile ? (
                      <Input value={profileData.last_name} onChange={e => setProfileData({ ...profileData, last_name: e.target.value })} className="mt-1" />
                    ) : (
                      <p className="mt-1 font-medium">{profileData.last_name || '—'}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Email Address</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="font-medium">{profileData.email}</p>
                      <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3" /> Verified
                      </span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Phone Number</Label>
                    {editingProfile ? (
                      <Input value={profileData.phone} onChange={e => setProfileData({ ...profileData, phone: e.target.value })} placeholder="+44 7700 000000" className="mt-1" />
                    ) : (
                      <p className="mt-1 font-medium">{profileData.phone || <span className="text-muted-foreground text-sm">Not set</span>}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Date of Birth</Label>
                    {editingProfile ? (
                      <Input type="date" value={profileData.dob} onChange={e => setProfileData({ ...profileData, dob: e.target.value })} className="mt-1" />
                    ) : (
                      <p className="mt-1 font-medium">{profileData.dob || <span className="text-muted-foreground text-sm">Not set</span>}</p>
                    )}
                  </div>
                </div>

                {/* Preferences */}
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold mb-4 flex items-center gap-2"><Bell className="w-4 h-4 text-[#BC4C2E]" /> Notification Preferences</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Order updates & shipping', desc: 'Get notified when your order status changes', checked: true },
                      { label: 'Exclusive offers & deals', desc: 'Be first to know about sales and promotions', checked: true },
                      { label: 'New product arrivals', desc: 'Discover new beds and mattresses', checked: false },
                    ].map((pref, i) => (
                      <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                        <div>
                          <p className="text-sm font-medium">{pref.label}</p>
                          <p className="text-xs text-muted-foreground">{pref.desc}</p>
                        </div>
                        <div className={`w-10 h-5 rounded-full transition-colors cursor-pointer ${pref.checked ? 'bg-[#BC4C2E]' : 'bg-gray-200'} relative`}>
                          <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${pref.checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ── ORDERS TAB ─────────────────────────────────────── */}
          <TabsContent value="orders">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h2 className="font-semibold text-lg">Order History</h2>
                <p className="text-sm text-muted-foreground">{orders.length} orders placed</p>
              </div>

              {loading ? (
                <div className="p-8 text-center text-muted-foreground">Loading orders...</div>
              ) : orders.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="font-medium mb-1">No orders yet</p>
                  <p className="text-sm text-muted-foreground mb-6">Start shopping to see your orders here</p>
                  <Link to="/category/divan-beds">
                    <Button className="bg-[#BC4C2E] hover:bg-[#9A3412]">Shop Now</Button>
                  </Link>
                </div>
              ) : (
                <div className="divide-y">
                  {orders.map((order) => (
                    <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors" data-testid={`order-${order.id}`}>
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-sm">#{order.id.slice(0, 8).toUpperCase()}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${getStatusColor(order.status)}`}>
                              {order.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                        <p className="font-bold text-lg">£{order.total?.toFixed(2)}</p>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1.5 text-xs">
                            <span className="font-medium">{item.product_name}</span>
                            <span className="text-muted-foreground">× {item.quantity}</span>
                            <span className="text-[#BC4C2E] font-semibold">{item.size}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Truck className="w-3 h-3" /> Delivery: £{order.delivery?.toFixed(2)}</span>
                        <span className="flex items-center gap-1"><CreditCard className="w-3 h-3" /> Subtotal: £{order.subtotal?.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* ── WISHLIST TAB ─────────────────────────────────────── */}
          <TabsContent value="wishlist">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <div>
                  <h2 className="font-semibold text-lg">Saved Items</h2>
                  <p className="text-sm text-muted-foreground">{wishlist.length} items saved</p>
                </div>
                {wishlist.length > 0 && (
                  <Link to="/wishlist">
                    <Button variant="outline" size="sm">View All</Button>
                  </Link>
                )}
              </div>

              {wishlist.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-red-300" />
                  </div>
                  <p className="font-medium mb-1">Nothing saved yet</p>
                  <p className="text-sm text-muted-foreground mb-6">Click the heart icon on any product to save it here</p>
                  <Link to="/category/divan-beds">
                    <Button variant="outline">Browse Products</Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-6">
                  {wishlist.slice(0, 6).map((product) => (
                    <div key={product.id} className="group border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-all">
                      <div className="relative aspect-video overflow-hidden bg-gray-100">
                        <Link to={`/product/${product.slug}`}>
                          <img src={product.images?.[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </Link>
                        <button
                          onClick={() => removeFromWishlist(product.id)}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white shadow transition-all"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="p-3">
                        <Link to={`/product/${product.slug}`}>
                          <p className="text-sm font-medium line-clamp-1 hover:text-[#BC4C2E] transition-colors">{product.name}</p>
                        </Link>
                        <p className="text-[#BC4C2E] font-bold text-sm mt-0.5">£{(product.sale_price || product.price)?.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* ── ADDRESSES TAB ─────────────────────────────────────── */}
          <TabsContent value="addresses">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <div>
                  <h2 className="font-semibold text-lg">Saved Addresses</h2>
                  <p className="text-sm text-muted-foreground">Manage your delivery addresses</p>
                </div>
                <Button size="sm" className="bg-[#BC4C2E] hover:bg-[#9A3412] gap-2" onClick={() => setAddingAddress(true)}>
                  <Plus className="w-4 h-4" /> Add Address
                </Button>
              </div>

              <div className="p-6">
                {/* Add New Address Form */}
                {addingAddress && (
                  <div className="mb-6 p-5 border-2 border-dashed border-[#BC4C2E]/30 rounded-xl bg-[#BC4C2E]/5">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#BC4C2E]" /> New Address
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Label (Home / Work)</Label>
                        <Input value={newAddress.label} onChange={e => setNewAddress({ ...newAddress, label: e.target.value })} placeholder="Home" className="mt-1" />
                      </div>
                      <div className="md:col-span-2">
                        <Label className="text-xs">Address Line 1 *</Label>
                        <Input value={newAddress.line1} onChange={e => setNewAddress({ ...newAddress, line1: e.target.value })} placeholder="123 Main Street" className="mt-1" />
                      </div>
                      <div className="md:col-span-2">
                        <Label className="text-xs">Address Line 2</Label>
                        <Input value={newAddress.line2} onChange={e => setNewAddress({ ...newAddress, line2: e.target.value })} placeholder="Apartment, suite, etc." className="mt-1" />
                      </div>
                      <div>
                        <Label className="text-xs">City *</Label>
                        <Input value={newAddress.city} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })} className="mt-1" />
                      </div>
                      <div>
                        <Label className="text-xs">County</Label>
                        <Input value={newAddress.county} onChange={e => setNewAddress({ ...newAddress, county: e.target.value })} className="mt-1" />
                      </div>
                      <div>
                        <Label className="text-xs">Postcode *</Label>
                        <Input value={newAddress.postcode} onChange={e => setNewAddress({ ...newAddress, postcode: e.target.value })} className="mt-1" />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" className="bg-[#BC4C2E] hover:bg-[#9A3412]" onClick={handleSaveAddress}>
                        <Save className="w-4 h-4 mr-1.5" /> Save Address
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setAddingAddress(false)}>Cancel</Button>
                    </div>
                  </div>
                )}

                {addresses.length === 0 && !addingAddress ? (
                  <div className="text-center py-10">
                    <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                      <Home className="w-7 h-7 text-gray-400" />
                    </div>
                    <p className="font-medium mb-1">No addresses saved</p>
                    <p className="text-sm text-muted-foreground">Add a delivery address for faster checkout</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div key={addr.id} className="border border-gray-200 rounded-xl p-4 relative group hover:border-[#BC4C2E]/40 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-gray-100 px-2.5 py-1 rounded-full">
                            <Home className="w-3 h-3" /> {addr.label}
                          </span>
                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-sm font-medium">{addr.line1}</p>
                        {addr.line2 && <p className="text-sm text-muted-foreground">{addr.line2}</p>}
                        <p className="text-sm text-muted-foreground">{addr.city}{addr.county ? `, ${addr.county}` : ''}</p>
                        <p className="text-sm font-medium">{addr.postcode}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* ── SECURITY TAB ─────────────────────────────────────── */}
          <TabsContent value="security">
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b">
                  <h2 className="font-semibold text-lg">Security Settings</h2>
                  <p className="text-sm text-muted-foreground">Keep your account safe</p>
                </div>
                <div className="divide-y">
                  {[
                    { icon: Shield, title: 'Change Password', desc: 'Last changed: Never', action: 'Update', color: 'text-blue-600 bg-blue-50' },
                    { icon: Mail, title: 'Email Address', desc: user?.email, action: 'Verified', color: 'text-green-600 bg-green-50' },
                    { icon: Phone, title: 'Two-Factor Authentication', desc: 'Add extra security to your account', action: 'Enable', color: 'text-purple-600 bg-purple-50' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-6">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                      <Button variant="outline" size="sm" className="text-xs shrink-0">{item.action}</Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-red-100">
                  <h2 className="font-semibold text-lg text-red-600">Danger Zone</h2>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Delete Account</p>
                      <p className="text-xs text-muted-foreground">Permanently delete your account and all data</p>
                    </div>
                    <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50 text-xs">
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}