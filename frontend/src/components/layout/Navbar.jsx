import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, User, ShoppingBag, ChevronDown } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const categories = [
  { name: 'Divan Beds', slug: 'divan-beds', description: 'Classic comfort with storage options' },
  { name: 'Bed Frames', slug: 'bed-frames', description: 'Stylish frames for any bedroom' },
  { name: 'Ottoman Beds', slug: 'ottoman-beds', description: 'Maximize your storage space' },
  { name: 'Mattresses', slug: 'mattresses', description: 'Premium comfort for better sleep' },
];

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { cartCount } = useCart();
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
    <header className="sticky top-0 z-50 glass border-b border-border/50" data-testid="navbar">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" data-testid="mobile-menu-trigger">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <nav className="flex flex-col gap-4 mt-8">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Categories</p>
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    to={`/category/${cat.slug}`}
                    className="text-lg font-medium hover:text-[#BC4C2E] transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid={`mobile-nav-${cat.slug}`}
                  >
                    {cat.name}
                  </Link>
                ))}
                <div className="border-t pt-4 mt-4">
                  <Link to="/about" className="block py-2 hover:text-[#BC4C2E]" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
                  <Link to="/contact" className="block py-2 hover:text-[#BC4C2E]" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
                  <Link to="/delivery" className="block py-2 hover:text-[#BC4C2E]" onClick={() => setMobileMenuOpen(false)}>Delivery Info</Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link to="/" className="flex items-center" data-testid="logo">
            <span className="font-['Playfair_Display'] text-2xl md:text-3xl font-semibold text-[#1C1917]">
              Pascal<span className="text-[#BC4C2E]">Beds</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium hover:text-[#BC4C2E] transition-colors" data-testid="shop-dropdown">
                Shop <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 p-2" align="center">
                {categories.map((cat) => (
                  <DropdownMenuItem key={cat.slug} asChild>
                    <Link to={`/category/${cat.slug}`} className="flex flex-col items-start py-3 cursor-pointer" data-testid={`nav-${cat.slug}`}>
                      <span className="font-medium">{cat.name}</span>
                      <span className="text-xs text-muted-foreground">{cat.description}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link to="/about" className="text-sm font-medium hover:text-[#BC4C2E] transition-colors" data-testid="nav-about">About</Link>
            <Link to="/contact" className="text-sm font-medium hover:text-[#BC4C2E] transition-colors" data-testid="nav-contact">Contact</Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            {searchOpen ? (
              <form onSubmit={handleSearch} className="absolute left-0 right-0 top-0 h-full bg-white flex items-center px-4 gap-2 z-50">
                <Input
                  type="search"
                  placeholder="Search beds, mattresses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                  autoFocus
                  data-testid="search-input"
                />
                <Button type="submit" size="sm" data-testid="search-submit">Search</Button>
                <Button type="button" variant="ghost" size="icon" onClick={() => setSearchOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </form>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)} data-testid="search-trigger">
                <Search className="w-5 h-5" />
              </Button>
            )}

            {/* Account */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" data-testid="account-trigger">
                  <User className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {isAuthenticated ? (
                  <>
                    <DropdownMenuItem className="font-medium">{user?.first_name}</DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/account" data-testid="account-link">My Account</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout} className="text-red-600" data-testid="logout-btn">
                      Sign Out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/login" data-testid="login-link">Sign In</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/register" data-testid="register-link">Create Account</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

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
  );
}
