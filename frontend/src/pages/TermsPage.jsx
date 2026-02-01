export default function TermsPage() {
  return (
    <div data-testid="terms-page">
      <div className="bg-[#1C1917] text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl font-medium mb-4">Terms & Conditions</h1>
          <p className="text-[#a8a29e]">Last updated: January 2024</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto prose prose-lg">
          <section className="mb-8">
            <h2 className="font-['Playfair_Display'] text-xl font-medium mb-4">1. Introduction</h2>
            <p className="text-muted-foreground">These terms and conditions govern your use of the Pascal Beds website and your purchase of products from us. By using this website and placing an order, you agree to be bound by these terms.</p>
          </section>

          <section className="mb-8">
            <h2 className="font-['Playfair_Display'] text-xl font-medium mb-4">2. Orders and Payment</h2>
            <p className="text-muted-foreground">All orders are subject to acceptance and availability. We reserve the right to refuse any order. Payment must be made in full at the time of ordering. We accept major credit/debit cards and PayPal.</p>
          </section>

          <section className="mb-8">
            <h2 className="font-['Playfair_Display'] text-xl font-medium mb-4">3. Pricing</h2>
            <p className="text-muted-foreground">All prices are in GBP and include VAT. Prices may change without notice. The price charged will be the price shown at the time of order.</p>
          </section>

          <section className="mb-8">
            <h2 className="font-['Playfair_Display'] text-xl font-medium mb-4">4. Delivery</h2>
            <p className="text-muted-foreground">We deliver to mainland UK addresses. Delivery times are estimates and not guaranteed. Please see our Delivery Information page for full details.</p>
          </section>

          <section className="mb-8">
            <h2 className="font-['Playfair_Display'] text-xl font-medium mb-4">5. Returns and Refunds</h2>
            <p className="text-muted-foreground">You have 14 days from delivery to return items for a refund. Items must be unused and in original condition. Please see our Returns Policy for full details.</p>
          </section>

          <section className="mb-8">
            <h2 className="font-['Playfair_Display'] text-xl font-medium mb-4">6. Warranty</h2>
            <p className="text-muted-foreground">All beds come with a 10-year frame warranty. Mattresses have varying warranty periods as specified on the product page. Warranties cover manufacturing defects only.</p>
          </section>

          <section className="mb-8">
            <h2 className="font-['Playfair_Display'] text-xl font-medium mb-4">7. Contact</h2>
            <p className="text-muted-foreground">For any questions regarding these terms, please contact us at hello@pascalbeds.co.uk or call 0800 123 4567.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
