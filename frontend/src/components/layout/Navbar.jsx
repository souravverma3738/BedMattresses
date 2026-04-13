import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, User, ShoppingBag, ChevronDown, Package, Heart, Settings, HelpCircle, LogOut, Truck, MapPin } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from '../ui/dropdown-menu';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const bedCategories = [
  { name: 'Divan Beds', slug: 'divan-beds', description: 'Classic base with storage options' },
  { name: 'Ottoman Beds', slug: 'ottoman-beds', description: 'Maximum hidden storage' },
  { name: '2-Drawer Beds', slug: '2-drawer-beds', description: 'Practical under-bed storage' },
  { name: '4-Drawer Beds', slug: '4-drawer-beds', description: 'Double the storage space' },
  { name: 'TV Beds', slug: 'tv-beds', description: 'Built-in TV lift mechanism' },
  { name: "Kids' Beds", slug: 'kids-beds', description: 'Fun & safe designs for children' },
  { name: 'High Headboard Beds', slug: 'high-headboard-beds', description: 'Elegant statement pieces' },
  { name: 'Prestige Beds', slug: 'prestige-beds', description: 'Our premium collection' },
  { name: 'Clearance', slug: 'clearance', description: 'Great deals on selected items' },
];

const mattressCategories = [
  { name: 'Essential Comfort', slug: 'mattresses-essential', description: 'Great value, great sleep' },
  { name: 'Orthopaedic', slug: 'mattresses-orthopaedic', description: 'Maximum back support' },
  { name: 'Pocket Spring', slug: 'mattresses-pocket', description: 'Individual spring comfort' },
  { name: 'Luxury Signature', slug: 'mattresses-luxury', description: 'Our finest collection' },
];

const deals = [
  { name: 'Bed + Mattress from £299', slug: 'deals-bed-mattress', tag: "DOUBLE (4'6)" },
  { name: 'Storage Bed + Mattress from £399', slug: 'deals-storage', tag: "DOUBLE (4'6)" },
  { name: 'Luxury Bed + Pocket Mattress from £499', slug: 'deals-luxury', tag: "DOUBLE (4'6)" },
];

function AccountDropdownContent({ isAuthenticated, user, wishlistCount, logout, onClose }) {
  const navigate = useNavigate();

  return (
    <DropdownMenuContent align="end" className="w-64 p-0 overflow-hidden shadow-2xl border border-gray-100 rounded-2xl">
      {/* Header */}
      {!isAuthenticated ? (
        <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] px-5 py-5 text-center">
          <p className="text-white font-semibold mb-1">Welcome to Snug Scotland</p>
          <p className="text-white/50 text-xs mb-4">Sign in for a better experience</p>
          <div className="flex gap-2">
            <Link to="/login" className="flex-1" onClick={onClose}>
              <Button size="sm" className="w-full bg-[#BC4C2E] hover:bg-[#9A3412] text-white text-xs font-semibold h-8">
                Sign In
              </Button>
            </Link>
            <Link to="/register" className="flex-1" onClick={onClose}>
              <Button size="sm" variant="outline" className="w-full border-white/30 text-white hover:bg-white/10 text-xs font-semibold h-8">
                Register
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#BC4C2E] flex items-center justify-center text-white font-bold text-sm shrink-0">
            {user?.first_name?.[0]?.toUpperCase()}{user?.last_name?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-white font-semibold text-sm leading-tight truncate">{user?.first_name} {user?.last_name}</p>
            <p className="text-white/50 text-xs truncate">{user?.email}</p>
          </div>
        </div>
      )}

      {/* Menu */}
      <div className="p-2">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-[10px] text-gray-400 uppercase tracking-wider px-2 pt-2 pb-1">My Account</DropdownMenuLabel>

          <DropdownMenuItem asChild>
            <Link to="/account" className="flex items-center gap-3 px-2 py-2.5 rounded-xl cursor-pointer hover:bg-gray-50" onClick={onClose}>
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">My Profile</p>
                <p className="text-xs text-gray-400">Photo, details & settings</p>
              </div>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link to="/account" className="flex items-center gap-3 px-2 py-2.5 rounded-xl cursor-pointer hover:bg-gray-50" onClick={onClose}>
              <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                <Package className="w-4 h-4 text-orange-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">My Orders</p>
                <p className="text-xs text-gray-400">Track & manage orders</p>
              </div>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link to="/wishlist" className="flex items-center gap-3 px-2 py-2.5 rounded-xl cursor-pointer hover:bg-gray-50" onClick={onClose}>
              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                <Heart className="w-4 h-4 text-red-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Wishlist</p>
                <p className="text-xs text-gray-400">Your saved items</p>
              </div>
              {wishlistCount > 0 && (
                <span className="text-xs bg-red-500 text-white font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link to="/account" className="flex items-center gap-3 px-2 py-2.5 rounded-xl cursor-pointer hover:bg-gray-50" onClick={onClose}>
              <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">My Addresses</p>
                <p className="text-xs text-gray-400">Saved delivery addresses</p>
              </div>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-2" />

        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-[10px] text-gray-400 uppercase tracking-wider px-2 pb-1">Help</DropdownMenuLabel>

          <DropdownMenuItem asChild>
            <Link to="/delivery" className="flex items-center gap-3 px-2 py-2 rounded-xl cursor-pointer hover:bg-gray-50" onClick={onClose}>
              <div className="w-7 h-7 rounded-lg bg-sky-50 flex items-center justify-center shrink-0">
                <Truck className="w-3.5 h-3.5 text-sky-600" />
              </div>
              <p className="text-sm">Delivery Information</p>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link to="/contact" className="flex items-center gap-3 px-2 py-2 rounded-xl cursor-pointer hover:bg-gray-50" onClick={onClose}>
              <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
              </div>
              <p className="text-sm">Contact Support</p>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        {isAuthenticated && (
          <>
            <DropdownMenuSeparator className="my-2" />
            <DropdownMenuItem
              onClick={() => { logout(); onClose?.(); }}
              className="flex items-center gap-3 px-2 py-2.5 rounded-xl cursor-pointer text-red-600 hover:bg-red-50 hover:text-red-700"
              data-testid="logout-btn"
            >
              <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                <LogOut className="w-3.5 h-3.5 text-red-500" />
              </div>
              <p className="text-sm font-medium">Sign Out</p>
            </DropdownMenuItem>
          </>
        )}
      </div>
    </DropdownMenuContent>
  );
}

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState(null);
  const { user, logout, isAuthenticated } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/category/all?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-[#1a1a2e] text-white py-2 px-4 text-center text-xs md:text-sm font-medium tracking-wide">
        <span className="text-yellow-400 font-bold">HURRY — 50% SALE</span> on selected items &nbsp;|&nbsp;
        <span className="hidden sm:inline">Free Delivery on orders over £499 &nbsp;|&nbsp; </span>
        <span className="text-yellow-300">2 Year Warranty Included</span>
      </div>

      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm" data-testid="navbar">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" data-testid="mobile-menu-trigger">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b bg-[#1a1a2e]">
                    <span className="font-bold text-xl text-white">Snug <span className="text-yellow-400">Scotland</span></span>
                  </div>
                  <nav className="flex-1 overflow-y-auto p-4">
                    <button className="w-full flex justify-between items-center py-3 text-base font-semibold border-b"
                      onClick={() => setMobileSection(mobileSection === 'beds' ? null : 'beds')}>
                      Beds <ChevronDown className={`w-4 h-4 transition-transform ${mobileSection === 'beds' ? 'rotate-180' : ''}`} />
                    </button>
                    {mobileSection === 'beds' && (
                      <div className="pl-4 py-2 space-y-1">
                        {bedCategories.map(cat => (
                          <Link key={cat.slug} to={`/category/${cat.slug}`} className="block py-2 text-sm text-gray-700 hover:text-[#BC4C2E]" onClick={() => setMobileMenuOpen(false)}>{cat.name}</Link>
                        ))}
                      </div>
                    )}
                    <button className="w-full flex justify-between items-center py-3 text-base font-semibold border-b"
                      onClick={() => setMobileSection(mobileSection === 'mattresses' ? null : 'mattresses')}>
                      Mattresses <ChevronDown className={`w-4 h-4 transition-transform ${mobileSection === 'mattresses' ? 'rotate-180' : ''}`} />
                    </button>
                    {mobileSection === 'mattresses' && (
                      <div className="pl-4 py-2 space-y-1">
                        {mattressCategories.map(cat => (
                          <Link key={cat.slug} to={`/category/${cat.slug}`} className="block py-2 text-sm text-gray-700 hover:text-[#BC4C2E]" onClick={() => setMobileMenuOpen(false)}>{cat.name}</Link>
                        ))}
                      </div>
                    )}
                    <button className="w-full flex justify-between items-center py-3 text-base font-semibold border-b"
                      onClick={() => setMobileSection(mobileSection === 'deals' ? null : 'deals')}>
                      <span className="text-red-600">Deals</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${mobileSection === 'deals' ? 'rotate-180' : ''}`} />
                    </button>
                    {mobileSection === 'deals' && (
                      <div className="pl-4 py-2 space-y-1">
                        {deals.map(deal => (
                          <Link key={deal.slug} to={`/category/${deal.slug}`} className="block py-2 text-sm text-gray-700 hover:text-[#BC4C2E]" onClick={() => setMobileMenuOpen(false)}>{deal.name}</Link>
                        ))}
                      </div>
                    )}
                    <div className="mt-4 pt-4 border-t space-y-2">
                      <Link to="/wishlist" className="flex items-center gap-2 py-2 text-sm font-medium hover:text-[#BC4C2E]" onClick={() => setMobileMenuOpen(false)}>
                        <Heart className="w-4 h-4" /> Wishlist {wishlistCount > 0 && <span className="bg-red-500 text-white text-xs rounded-full px-1.5">{wishlistCount}</span>}
                      </Link>
                      <Link to="/contact" className="block py-2 text-sm font-medium hover:text-[#BC4C2E]" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
                    </div>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link to="/" className="flex items-center" data-testid="logo">
              <span className="font-bold text-2xl md:text-3xl text-[#1a1a2e]">
                Snug<span className="text-[#BC4C2E]">Scotland</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 px-4 py-2 text-sm font-semibold hover:text-[#BC4C2E] transition-colors rounded-lg hover:bg-gray-50">
                  Beds <ChevronDown className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-72 p-2" align="start">
                  <DropdownMenuLabel className="text-xs text-gray-400 uppercase tracking-wider px-2 pb-1">Shop All Beds</DropdownMenuLabel>
                  {bedCategories.map((cat) => (
                    <DropdownMenuItem key={cat.slug} asChild>
                      <Link to={`/category/${cat.slug}`} className="flex flex-col items-start py-2.5 px-2 cursor-pointer rounded-lg">
                        <span className="font-medium text-sm">{cat.name}</span>
                        <span className="text-xs text-gray-500">{cat.description}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 px-4 py-2 text-sm font-semibold hover:text-[#BC4C2E] transition-colors rounded-lg hover:bg-gray-50">
                  Mattresses <ChevronDown className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 p-2" align="start">
                  <DropdownMenuLabel className="text-xs text-gray-400 uppercase tracking-wider px-2 pb-1">Collections</DropdownMenuLabel>
                  {mattressCategories.map((cat) => (
                    <DropdownMenuItem key={cat.slug} asChild>
                      <Link to={`/category/${cat.slug}`} className="flex flex-col items-start py-2.5 px-2 cursor-pointer rounded-lg">
                        <span className="font-medium text-sm">{cat.name}</span>
                        <span className="text-xs text-gray-500">{cat.description}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 px-4 py-2 text-sm font-bold text-red-600 hover:text-red-700 transition-colors rounded-lg hover:bg-red-50">
                  Deals <ChevronDown className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-72 p-2" align="start">
                  <DropdownMenuLabel className="text-xs text-gray-400 uppercase tracking-wider px-2 pb-1">Bundle Deals — Save More</DropdownMenuLabel>
                  {deals.map((deal) => (
                    <DropdownMenuItem key={deal.slug} asChild>
                      <Link to={`/category/${deal.slug}`} className="flex items-center justify-between py-2.5 px-2 cursor-pointer rounded-lg">
                        <span className="font-medium text-sm">{deal.name}</span>
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold">{deal.tag}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Link to="/contact" className="px-4 py-2 text-sm font-semibold hover:text-[#BC4C2E] transition-colors rounded-lg hover:bg-gray-50">
                Contact
              </Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-1">
              {/* Search */}
              {searchOpen ? (
                <form onSubmit={handleSearch} className="absolute left-0 right-0 top-0 h-full bg-white flex items-center px-4 gap-2 z-50 border-b shadow-lg">
                  <Input type="search" placeholder="Search beds, mattresses..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 text-base" autoFocus data-testid="search-input" />
                  <Button type="submit" size="sm" className="bg-[#BC4C2E] hover:bg-[#9A3412]" data-testid="search-submit">Search</Button>
                  <Button type="button" variant="ghost" size="icon" onClick={() => setSearchOpen(false)}><X className="w-5 h-5" /></Button>
                </form>
              ) : (
                <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)} data-testid="search-trigger">
                  <Search className="w-5 h-5" />
                </Button>
              )}

              {/* Wishlist icon - desktop */}
              <Link to="/wishlist" className="relative hidden md:block">
                <Button variant="ghost" size="icon">
                  <Heart className="w-5 h-5" />
                </Button>
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Account — Desktop expanded */}
              <div className="hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-1.5 px-3 h-9 hover:bg-gray-50" data-testid="account-trigger">
                      <User className="w-4 h-4" />
                      <div className="text-left">
                        {isAuthenticated ? (
                          <>
                            <p className="text-[10px] text-gray-500 leading-none">Hello, {user?.first_name}</p>
                            <p className="text-xs font-bold leading-tight">Account &amp; Orders</p>
                          </>
                        ) : (
                          <>
                            <p className="text-[10px] text-gray-500 leading-none">Hello, sign in</p>
                            <p className="text-xs font-bold leading-tight">Account &amp; Lists</p>
                          </>
                        )}
                      </div>
                      <ChevronDown className="w-3 h-3 text-gray-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <AccountDropdownContent
                    isAuthenticated={isAuthenticated}
                    user={user}
                    wishlistCount={wishlistCount}
                    logout={logout}
                  />
                </DropdownMenu>
              </div>

              {/* Account — Mobile */}
              <div className="md:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" data-testid="account-trigger">
                      <User className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <AccountDropdownContent
                    isAuthenticated={isAuthenticated}
                    user={user}
                    wishlistCount={wishlistCount}
                    logout={logout}
                  />
                </DropdownMenu>
              </div>

              {/* Cart */}
              <Link to="/cart" className="relative" data-testid="cart-link">
                <Button variant="ghost" size="icon">
                  <ShoppingBag className="w-5 h-5" />
                </Button>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#BC4C2E] text-white text-xs font-bold rounded-full flex items-center justify-center" data-testid="cart-count">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}