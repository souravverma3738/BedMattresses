export default function PrivacyPage() {
  return (
    <div data-testid="privacy-page">
      <div className="bg-[#1C1917] text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl font-medium mb-4">Privacy Policy</h1>
          <p className="text-[#a8a29e]">Last updated: January 2024</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto prose prose-lg">
          <section className="mb-8">
            <h2 className="font-['Playfair_Display'] text-xl font-medium mb-4">1. Information We Collect</h2>
            <p className="text-muted-foreground">We collect information you provide when creating an account, placing an order, or contacting us. This includes your name, email, phone number, delivery address, and payment details.</p>
          </section>

          <section className="mb-8">
            <h2 className="font-['Playfair_Display'] text-xl font-medium mb-4">2. How We Use Your Information</h2>
            <p className="text-muted-foreground">We use your information to process orders, deliver products, send order updates, provide customer support, and improve our services. With your consent, we may send marketing communications.</p>
          </section>

          <section className="mb-8">
            <h2 className="font-['Playfair_Display'] text-xl font-medium mb-4">3. Data Security</h2>
            <p className="text-muted-foreground">We implement appropriate security measures to protect your personal data. Payment information is processed securely through Stripe and is never stored on our servers.</p>
          </section>

          <section className="mb-8">
            <h2 className="font-['Playfair_Display'] text-xl font-medium mb-4">4. Cookies</h2>
            <p className="text-muted-foreground">We use cookies to improve your browsing experience and analyze website traffic. You can control cookies through your browser settings.</p>
          </section>

          <section className="mb-8">
            <h2 className="font-['Playfair_Display'] text-xl font-medium mb-4">5. Third Parties</h2>
            <p className="text-muted-foreground">We share your information with delivery partners and payment processors as necessary to fulfill orders. We do not sell your personal data to third parties.</p>
          </section>

          <section className="mb-8">
            <h2 className="font-['Playfair_Display'] text-xl font-medium mb-4">6. Your Rights</h2>
            <p className="text-muted-foreground">Under GDPR, you have the right to access, correct, or delete your personal data. Contact us at hello@pascalbeds.co.uk to exercise these rights.</p>
          </section>

          <section className="mb-8">
            <h2 className="font-['Playfair_Display'] text-xl font-medium mb-4">7. Contact</h2>
            <p className="text-muted-foreground">For privacy-related inquiries, email hello@pascalbeds.co.uk or write to: Pascal Beds, 123 Sleep Street, Manchester, M1 2AB.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
