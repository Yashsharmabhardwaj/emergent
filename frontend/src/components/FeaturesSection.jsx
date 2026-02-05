import React from 'react';
import { Monitor, Bot, Plug } from 'lucide-react';
import { features } from '../mock';

const iconMap = {
  monitor: Monitor,
  bot: Bot,
  plug: Plug
};

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            What can Emergent do for you?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            From concept to deployment, Emergent handles every aspect of software
            development so you can focus on what matters most - your vision!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Features List */}
          <div className="space-y-8">
            {features.map((feature) => {
              const Icon = iconMap[feature.icon];
              return (
                <div
                  key={feature.id}
                  className="flex gap-4 p-6 rounded-2xl hover:bg-gray-50 transition-colors group cursor-pointer"
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-cyan-500 group-hover:to-blue-600 transition-all">
                      <Icon className="h-6 w-6 text-gray-700 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-black mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mock Screenshot */}
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-8 shadow-xl">
              <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                <div className="bg-gray-800 px-4 py-3 flex items-center space-x-2">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                  </div>
                </div>
                <div className="p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="h-8 w-24 bg-gray-200 rounded" />
                    <div className="h-8 w-20 bg-blue-500 rounded" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="aspect-square bg-gradient-to-br from-cyan-200 to-blue-300 rounded-lg" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
