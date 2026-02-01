import { Truck, Clock, MapPin, Phone } from 'lucide-react';

export default function DeliveryPage() {
  return (
    <div data-testid="delivery-page">
      <div className="bg-[#1C1917] text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl font-medium mb-4">Delivery Information</h1>
          <p className="text-[#a8a29e] max-w-2xl mx-auto text-lg">Free UK delivery on orders over £500</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: Truck, title: 'Free Delivery', desc: 'On orders over £500' },
            { icon: Clock, title: '3-5 Days', desc: 'Standard delivery time' },
            { icon: MapPin, title: 'UK Wide', desc: 'We deliver nationwide' },
          ].map((item, i) => (
            <div key={i} className="text-center p-6 bg-[#F5F5F4] rounded-xl">
              <item.icon className="w-10 h-10 text-[#BC4C2E] mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto space-y-8">
          <section>
            <h2 className="font-['Playfair_Display'] text-2xl font-medium mb-4">Delivery Options</h2>
            <div className="bg-white rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <table className="w-full">
                <thead>
                  <tr className="border-b"><th className="text-left py-3">Service</th><th className="text-left py-3">Timeframe</th><th className="text-right py-3">Cost</th></tr>
                </thead>
                <tbody>
                  <tr className="border-b"><td className="py-3">Standard Delivery</td><td className="py-3">3-5 working days</td><td className="py-3 text-right">£39.99</td></tr>
                  <tr className="border-b"><td className="py-3">Free Delivery</td><td className="py-3">3-5 working days</td><td className="py-3 text-right text-green-600">FREE (orders £500+)</td></tr>
                  <tr><td className="py-3">Premium Delivery</td><td className="py-3">Next working day</td><td className="py-3 text-right">£59.99</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="font-['Playfair_Display'] text-2xl font-medium mb-4">What to Expect</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li>• You'll receive an email confirmation with tracking details once dispatched</li>
              <li>• Our delivery team will call 30 minutes before arrival</li>
              <li>• All deliveries include a 2-hour delivery window</li>
              <li>• We'll bring your bed to your room of choice</li>
              <li>• Free removal of packaging materials</li>
            </ul>
          </section>

          <section>
            <h2 className="font-['Playfair_Display'] text-2xl font-medium mb-4">Contact Us</h2>
            <p className="text-muted-foreground">Questions about delivery? Call us on <strong>0800 123 4567</strong> or email <strong>hello@pascalbeds.co.uk</strong></p>
          </section>
        </div>
      </div>
    </div>
  );
}
