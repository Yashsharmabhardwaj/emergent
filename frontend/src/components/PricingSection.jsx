import React, { useState } from 'react';
import { Check, Gift, Target, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { pricingPlans } from '../mock';
import { toast } from '../hooks/use-toast';

const iconMap = {
  gift: Gift,
  target: Target,
  sparkles: Sparkles
};

const PricingSection = () => {
  const [billingCycle, setBillingCycle] = useState('annual'); // 'monthly' or 'annual'

  const handleSelectPlan = (planName) => {
    toast({
      title: "Plan Selected",
      description: `You selected the ${planName} plan`,
    });
  };

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Transparent pricing for every builder
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Choose the plan that fits your building ambitions.
            <br />
            From weekend projects to enterprise applications, we've got you covered.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white rounded-full p-1 shadow-sm border border-gray-200">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              Individual
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                billingCycle === 'annual'
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              Enterprise
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan) => {
            const Icon = iconMap[plan.icon];
            const price = billingCycle === 'annual' ? plan.annualPrice / 12 : plan.monthlyPrice;
            
            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow ${
                  plan.popular ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Icon className="h-5 w-5 text-gray-700" />
                  </div>
                  <h3 className="text-2xl font-bold text-black">{plan.name}</h3>
                </div>

                <p className="text-gray-600 mb-6">{plan.description}</p>

                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-5xl font-bold text-black">${Math.floor(price)}</span>
                    <span className="text-gray-600 ml-2">/month</span>
                  </div>
                  {billingCycle === 'annual' && plan.annualSave && (
                    <div className="mt-2">
                      <span className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full font-medium">
                        Save ${plan.annualSave}
                      </span>
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => handleSelectPlan(plan.name)}
                  className={`w-full mb-6 h-12 rounded-lg ${
                    plan.popular
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700'
                      : 'bg-gray-100 text-black hover:bg-gray-200'
                  }`}
                >
                  Get Started
                </Button>

                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
