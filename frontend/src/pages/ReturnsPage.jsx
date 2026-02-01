import { RotateCcw, Clock, CheckCircle } from 'lucide-react';

export default function ReturnsPage() {
  return (
    <div data-testid="returns-page">
      <div className="bg-[#1C1917] text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl font-medium mb-4">Returns & Cancellations</h1>
          <p className="text-[#a8a29e] max-w-2xl mx-auto text-lg">14-day hassle-free returns</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto space-y-8">
          <section>
            <h2 className="font-['Playfair_Display'] text-2xl font-medium mb-4">Our Returns Policy</h2>
            <p className="text-muted-foreground mb-4">We want you to be completely satisfied with your purchase. If for any reason you're not happy, you can return your item within 14 days of delivery for a full refund.</p>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { icon: RotateCcw, title: '14 Days', desc: 'To return your item' },
                { icon: Clock, title: '5-7 Days', desc: 'Refund processing time' },
                { icon: CheckCircle, title: 'Full Refund', desc: 'No questions asked' },
              ].map((item, i) => (
                <div key={i} className="text-center p-4 bg-[#F5F5F4] rounded-xl">
                  <item.icon className="w-8 h-8 text-[#BC4C2E] mx-auto mb-2" />
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-['Playfair_Display'] text-2xl font-medium mb-4">How to Return</h2>
            <ol className="space-y-4 text-muted-foreground">
              <li><strong>1. Contact Us:</strong> Email hello@pascalbeds.co.uk or call 0800 123 4567 with your order number</li>
              <li><strong>2. Arrange Collection:</strong> We'll arrange a convenient collection date at no extra cost</li>
              <li><strong>3. Prepare Your Item:</strong> Ensure the item is in original condition with all packaging</li>
              <li><strong>4. Receive Refund:</strong> Once inspected, your refund will be processed within 5-7 working days</li>
            </ol>
          </section>

          <section>
            <h2 className="font-['Playfair_Display'] text-2xl font-medium mb-4">Cancellations</h2>
            <p className="text-muted-foreground">You can cancel your order anytime before dispatch for a full refund. Simply contact us with your order number and we'll process your cancellation immediately.</p>
          </section>

          <section>
            <h2 className="font-['Playfair_Display'] text-2xl font-medium mb-4">Exceptions</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Mattresses must be returned in original packaging for hygiene reasons</li>
              <li>• Bespoke or made-to-order items cannot be returned unless faulty</li>
              <li>• Items must be unused and in resalable condition</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
