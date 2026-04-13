import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import axios from 'axios';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await axios.post(`${API}/newsletter`, { email });
      toast.success('Successfully subscribed to our newsletter!');
      setEmail('');
    } catch (err) {
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-[#1a1a2e] text-[#FAFAF9]" data-testid="footer">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-['Playfair_Display'] text-3xl md:text-4xl mb-4">Join the Snug Scotland Family</h3>
            <p className="text-[#a8a29e] mb-6">Subscribe for exclusive offers, sleep tips, and early access to new arrivals.</p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" data-testid="newsletter-form">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 flex-1"
                required
                data-testid="newsletter-email"
              />
              <Button
                type="submit"
                className="bg-[#BC4C2E] hover:bg-[#9A3412] text-white btn-press"
                disabled={loading}
                data-testid="newsletter-submit"
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 lg:col-span-1">
            <Link to="/" className="font-bold text-2xl">
              Snug<span className="text-[#BC4C2E]">Scotland</span>
            </Link>
            <p className="text-[#a8a29e] text-sm mt-4 mb-6">Premium beds & mattresses delivered across the UK. Sleep better, live better.</p>
            <div className="flex gap-4">
              <a href="#" className="text-[#a8a29e] hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="text-[#a8a29e] hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-[#a8a29e] hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Shop</h4>
            <ul className="space-y-3 text-sm text-[#a8a29e]">
              <li><Link to="/category/divan-beds" className="hover:text-white transition-colors" data-testid="footer-divan">Divan Beds</Link></li>
              <li><Link to="/category/bed-frames" className="hover:text-white transition-colors" data-testid="footer-frames">Bed Frames</Link></li>
              <li><Link to="/category/ottoman-beds" className="hover:text-white transition-colors" data-testid="footer-ottoman">Ottoman Beds</Link></li>
              <li><Link to="/category/mattresses-luxury" className="hover:text-white transition-colors" data-testid="footer-mattresses">Mattresses</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Help</h4>
            <ul className="space-y-3 text-sm text-[#a8a29e]">
              <li><Link to="/delivery" className="hover:text-white transition-colors" data-testid="footer-delivery">Delivery Information</Link></li>
              <li><Link to="/returns" className="hover:text-white transition-colors" data-testid="footer-returns">Returns & Cancellations</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors" data-testid="footer-contact">Contact Us</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors" data-testid="footer-about">About Us</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Legal</h4>
            <ul className="space-y-3 text-sm text-[#a8a29e]">
              <li><Link to="/terms" className="hover:text-white transition-colors" data-testid="footer-terms">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors" data-testid="footer-privacy">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3 text-sm text-[#a8a29e]">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>0800 123 4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>hello@snugscotland.co.uk</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>123 Sleep Street, Edinburgh, EH1 1AB</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[#a8a29e]">
          <p>© 2024 Snug Scotland. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <img src="https://cdn-icons-png.flaticon.com/32/349/349221.png" alt="Visa" className="h-6 opacity-60" />
            <img src="https://cdn-icons-png.flaticon.com/32/349/349228.png" alt="Mastercard" className="h-6 opacity-60" />
            <img src="https://cdn-icons-png.flaticon.com/32/174/174861.png" alt="PayPal" className="h-6 opacity-60" />
            <img src="https://cdn-icons-png.flaticon.com/32/5968/5968144.png" alt="Apple Pay" className="h-6 opacity-60" />
          </div>
        </div>
      </div>
    </footer>
  );
}
