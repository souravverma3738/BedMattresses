import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import axios from 'axios';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API}/contact`, formData);
      toast.success('Message sent! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="contact-page">
      <div className="bg-[#1C1917] text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl font-medium mb-4">Contact Us</h1>
          <p className="text-[#a8a29e] max-w-2xl mx-auto text-lg">We're here to help with any questions</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-['Playfair_Display'] text-2xl font-medium mb-6">Get in Touch</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#BC4C2E]/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-[#BC4C2E]" />
                </div>
                <div>
                  <p className="font-semibold">Phone</p>
                  <p className="text-muted-foreground">0800 123 4567</p>
                  <p className="text-sm text-muted-foreground">Mon-Fri 9am-6pm, Sat 10am-4pm</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#BC4C2E]/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-[#BC4C2E]" />
                </div>
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="text-muted-foreground">hello@pascalbeds.co.uk</p>
                  <p className="text-sm text-muted-foreground">We reply within 24 hours</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#BC4C2E]/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#BC4C2E]" />
                </div>
                <div>
                  <p className="font-semibold">Address</p>
                  <p className="text-muted-foreground">123 Sleep Street<br />Manchester, M1 2AB</p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]" data-testid="contact-form">
            <div className="space-y-4">
              <div>
                <Label>Name *</Label>
                <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required data-testid="contact-name" />
              </div>
              <div>
                <Label>Email *</Label>
                <Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required data-testid="contact-email" />
              </div>
              <div>
                <Label>Phone</Label>
                <Input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} data-testid="contact-phone" />
              </div>
              <div>
                <Label>Subject *</Label>
                <Input value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} required data-testid="contact-subject" />
              </div>
              <div>
                <Label>Message *</Label>
                <Textarea rows={4} value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} required data-testid="contact-message" />
              </div>
            </div>
            <Button type="submit" className="w-full mt-6 bg-[#BC4C2E] hover:bg-[#9A3412] btn-press" disabled={loading} data-testid="contact-submit">
              <Send className="w-4 h-4 mr-2" /> {loading ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
