import React from 'react';
import { Monitor, Bot, Plug, Zap, Shield, Code, Smartphone, Cloud, Users } from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from '../hooks/use-toast';

const Features = () => {
  const allFeatures = [
    {
      icon: Monitor,
      title: 'Web Applications',
      description: 'Build responsive, modern web apps with React, Vue, or your framework of choice.'
    },
    {
      icon: Smartphone,
      title: 'Mobile Apps',
      description: 'Create native mobile experiences for iOS and Android with React Native.'
    },
    {
      icon: Bot,
      title: 'AI Agents',
      description: 'Deploy intelligent AI agents that understand context and automate workflows.'
    },
    {
      icon: Plug,
      title: 'Integrations',
      description: 'Connect to any API, payment processor, or third-party service seamlessly.'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Ship production-ready code in minutes with AI-powered development.'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-grade security with SOC 2 compliance and data encryption.'
    },
    {
      icon: Code,
      title: 'Real Code',
      description: 'Own your code. Export and self-host anywhere. No vendor lock-in.'
    },
    {
      icon: Cloud,
      title: 'Auto Scaling',
      description: 'Handle traffic spikes effortlessly with automatic infrastructure scaling.'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work together seamlessly with built-in version control and team features.'
    }
  ];

  const handleGetStarted = () => {
    toast({
      title: "Get Started",
      description: "Redirecting to sign up...",
    });
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero */}
      <section className="py-24 bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-black mb-6">
            Everything you need to
            <br />
            <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
              build and scale
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            From idea to production in minutes. Emergent provides all the tools
            and infrastructure you need to build world-class applications.
          </p>
          <Button
            onClick={handleGetStarted}
            className="bg-black text-white hover:bg-gray-800 px-8 py-6 text-lg rounded-full"
          >
            Start Building Free
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group p-8 bg-white rounded-2xl border border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all cursor-pointer"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
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

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-cyan-500 to-blue-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to build something amazing?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of builders creating the future with Emergent.
          </p>
          <Button
            onClick={handleGetStarted}
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg rounded-full font-semibold"
          >
            Get Started for Free
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Features;
