import React from 'react';
import PricingSection from '../components/PricingSection';
import { Button } from '../components/ui/button';
import { Check } from 'lucide-react';
import { toast } from '../hooks/use-toast';

const Pricing = () => {
  const handleContact = () => {
    toast({
      title: "Contact Sales",
      description: "Our team will reach out to you shortly.",
    });
  };

  const comparisonFeatures = [
    { name: 'Projects', free: '1', standard: '5', pro: 'Unlimited' },
    { name: 'AI Assistance', free: 'Basic', standard: 'Advanced', pro: 'Premium' },
    { name: 'Storage', free: '1GB', standard: '10GB', pro: '100GB' },
    { name: 'Custom Domain', free: false, standard: true, pro: true },
    { name: 'Analytics', free: false, standard: true, pro: true },
    { name: 'Team Collaboration', free: false, standard: false, pro: true },
    { name: 'API Access', free: false, standard: false, pro: true },
    { name: 'Priority Support', free: false, standard: true, pro: true },
  ];

  return (
    <div className="min-h-screen bg-white pt-20">
      <PricingSection />

      {/* Comparison Table */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-black text-center mb-12">
            Compare Plans
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-6 text-gray-600 font-semibold">Feature</th>
                  <th className="text-center py-4 px-6 text-gray-900 font-bold">Free</th>
                  <th className="text-center py-4 px-6 text-gray-900 font-bold">Standard</th>
                  <th className="text-center py-4 px-6 text-gray-900 font-bold">Pro</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6 font-medium text-gray-900">{feature.name}</td>
                    <td className="py-4 px-6 text-center">
                      {typeof feature.free === 'boolean' ? (
                        feature.free ? (
                          <Check className="h-5 w-5 text-green-600 mx-auto" />
                        ) : (
                          <span className="text-gray-400">-</span>
                        )
                      ) : (
                        <span className="text-gray-700">{feature.free}</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {typeof feature.standard === 'boolean' ? (
                        feature.standard ? (
                          <Check className="h-5 w-5 text-green-600 mx-auto" />
                        ) : (
                          <span className="text-gray-400">-</span>
                        )
                      ) : (
                        <span className="text-gray-700">{feature.standard}</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {typeof feature.pro === 'boolean' ? (
                        feature.pro ? (
                          <Check className="h-5 w-5 text-green-600 mx-auto" />
                        ) : (
                          <span className="text-gray-400">-</span>
                        )
                      ) : (
                        <span className="text-gray-700">{feature.pro}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Enterprise CTA */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-black mb-6">
            Need a custom solution?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Our Enterprise plan offers unlimited scalability, dedicated support,
            and custom features tailored to your needs.
          </p>
          <Button
            onClick={handleContact}
            className="bg-black text-white hover:bg-gray-800 px-8 py-6 text-lg rounded-full"
          >
            Contact Sales
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
