import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Check, Building2, Users, Shield, Headphones, Zap, Lock } from 'lucide-react';
import { toast } from '../hooks/use-toast';

const Enterprise = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Request Submitted",
      description: "Our enterprise team will contact you within 24 hours.",
    });
    setFormData({ name: '', email: '', company: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const enterpriseFeatures = [
    {
      icon: Building2,
      title: 'Dedicated Infrastructure',
      description: 'Private cloud deployment with guaranteed uptime and performance.'
    },
    {
      icon: Users,
      title: 'Team Management',
      description: 'Advanced team controls, permissions, and collaboration tools.'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'SOC 2 compliance, SSO, and advanced security features.'
    },
    {
      icon: Headphones,
      title: '24/7 Priority Support',
      description: 'Dedicated account manager and round-the-clock technical support.'
    },
    {
      icon: Zap,
      title: 'Custom Integrations',
      description: 'Tailored integrations with your existing tools and workflows.'
    },
    {
      icon: Lock,
      title: 'Data Residency',
      description: 'Choose where your data is stored to meet compliance requirements.'
    }
  ];

  const benefits = [
    'Unlimited projects and team members',
    'Custom AI model training',
    'White-label solutions',
    'SLA guarantees',
    'Advanced analytics and reporting',
    'Migration assistance',
    'Training and onboarding',
    'Custom contract terms'
  ];

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero */}
      <section className="py-24 bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-black mb-6">
              Built for
              <br />
              <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                Enterprise Scale
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Empower your organization with enterprise-grade tools, security,
              and support to build and scale applications faster.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-black text-center mb-16">
            Everything you need for enterprise success
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {enterpriseFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="p-8 bg-gray-50 rounded-2xl hover:shadow-lg transition-shadow"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-black mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-black mb-6">
                Enterprise benefits
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Get access to premium features and services designed for
                large-scale deployments and mission-critical applications.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-black mb-6">
                Get in touch with our team
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="john@company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Company Inc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell us about your needs..."
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 h-12 text-lg rounded-lg"
                >
                  Request Demo
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-black mb-4">
            Trusted by industry leaders
          </h2>
          <p className="text-lg text-gray-600 mb-12">
            Join hundreds of enterprises building the future with Emergent
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-32 h-16 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Enterprise;
