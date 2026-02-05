import React from 'react';
import FAQSection from '../components/FAQSection';
import { Button } from '../components/ui/button';
import { MessageCircle } from 'lucide-react';
import { toast } from '../hooks/use-toast';

const FAQs = () => {
  const handleContact = () => {
    toast({
      title: "Contact Support",
      description: "Our support team will assist you shortly.",
    });
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero */}
      <section className="py-24 bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-black mb-6">
            How can we help you?
          </h1>
          <p className="text-xl text-gray-600">
            Find answers to common questions about Emergent
          </p>
        </div>
      </section>

      <FAQSection />

      {/* Contact CTA */}
      <section className="py-24 bg-gradient-to-br from-cyan-500 to-blue-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <MessageCircle className="h-16 w-16 text-white mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-white mb-6">
            Can't find what you're looking for?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Our support team is here to help you succeed.
          </p>
          <Button
            onClick={handleContact}
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg rounded-full font-semibold"
          >
            Contact Support
          </Button>
        </div>
      </section>
    </div>
  );
};

export default FAQs;
