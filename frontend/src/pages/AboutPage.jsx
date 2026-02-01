import { Truck, ShieldCheck, Star, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div data-testid="about-page">
      <div className="bg-[#1C1917] text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl font-medium mb-4">Our Story</h1>
          <p className="text-[#a8a29e] max-w-2xl mx-auto text-lg">Crafting the perfect night's sleep since 2010</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto prose prose-lg">
          <p className="text-muted-foreground leading-relaxed">
            Pascal Beds was founded with a simple mission: to help everyone in the UK experience the transformative power of a great night's sleep. What started as a small family business in Manchester has grown into one of the UK's most trusted bed retailers.
          </p>
          
          <h2 className="font-['Playfair_Display'] text-2xl font-medium mt-8 mb-4">Our Commitment to Quality</h2>
          <p className="text-muted-foreground leading-relaxed">
            We work directly with UK manufacturers to bring you beds and mattresses that combine traditional craftsmanship with modern sleep technology. Every product in our range has been personally tested and approved by our sleep experts.
          </p>

          <h2 className="font-['Playfair_Display'] text-2xl font-medium mt-8 mb-4">Why Choose Pascal Beds?</h2>
          <p className="text-muted-foreground leading-relaxed">
            We believe that everyone deserves a comfortable bed without breaking the bank. That's why we offer competitive prices, interest-free finance, and free delivery on orders over £500. Our dedicated customer service team is here to help you find the perfect sleep solution.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          {[
            { icon: Truck, title: '50,000+', desc: 'Beds Delivered' },
            { icon: Star, title: '4.9★', desc: 'Customer Rating' },
            { icon: Users, title: '5,000+', desc: 'Happy Customers' },
            { icon: ShieldCheck, title: '10 Years', desc: 'Warranty' },
          ].map((item, i) => (
            <div key={i} className="text-center p-6 bg-[#F5F5F4] rounded-xl">
              <item.icon className="w-8 h-8 text-[#BC4C2E] mx-auto mb-3" />
              <p className="text-2xl font-bold">{item.title}</p>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
