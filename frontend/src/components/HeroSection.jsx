import React, { useState } from 'react';
import { Chrome, Github, Apple, Facebook, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from '../hooks/use-toast';

const HeroSection = () => {
  const [email, setEmail] = useState('');

  const handleAuth = (provider) => {
    toast({
      title: "Authentication",
      description: `Redirecting to ${provider} login...`,
    });
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Email Submitted",
        description: `Check ${email} for login link`,
      });
      setEmail('');
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50">
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/50 to-transparent animate-pulse" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left Side - Hero Text & Auth */}
        <div className="flex-1 text-center lg:text-left">
          {/* Animated Logo */}
          <div className="inline-block mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-600 to-gray-900 rounded-2xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
              <span className="text-4xl font-bold text-white">E</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            Build Full-Stack
            <br />
            <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
              Web & Mobile Apps
            </span>
            {' '}in minutes
          </h1>

          {/* Auth Buttons */}
          <div className="max-w-md mx-auto lg:mx-0 space-y-4 mt-8">
            <Button
              onClick={() => handleAuth('Google')}
              className="w-full bg-black text-white hover:bg-gray-800 h-12 text-base rounded-lg"
            >
              <Chrome className="mr-2 h-5 w-5" />
              Continue with Google
            </Button>

            <div className="flex gap-3">
              <Button
                onClick={() => handleAuth('GitHub')}
                variant="outline"
                className="flex-1 h-12 rounded-lg border-gray-300 hover:bg-gray-50"
              >
                <Github className="h-5 w-5" />
              </Button>
              <Button
                onClick={() => handleAuth('Apple')}
                variant="outline"
                className="flex-1 h-12 rounded-lg border-gray-300 hover:bg-gray-50"
              >
                <Apple className="h-5 w-5" />
              </Button>
              <Button
                onClick={() => handleAuth('Facebook')}
                variant="outline"
                className="flex-1 h-12 rounded-lg border-gray-300 hover:bg-gray-50"
              >
                <Facebook className="h-5 w-5" />
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">OR</span>
              </div>
            </div>

            <form onSubmit={handleEmailSubmit}>
              <Button
                type="submit"
                variant="outline"
                className="w-full h-12 rounded-lg border-gray-300 hover:bg-gray-50"
              >
                <Mail className="mr-2 h-5 w-5" />
                Continue with Email
              </Button>
            </form>

            <p className="text-xs text-gray-500 text-center mt-4">
              By continuing, you agree to our{' '}
              <a href="#" className="underline hover:text-black">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="underline hover:text-black">Privacy Policy</a>.
            </p>
          </div>
        </div>

        {/* Right Side - Showcase Card */}
        <div className="flex-1 w-full max-w-2xl">
          <div className="relative bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-transform duration-300">
            {/* Y Combinator Badge */}
            <div className="absolute top-6 right-6 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              Y Combinator S24
            </div>

            <div className="text-center text-white mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Series B Funded 🎉</h2>
              <p className="text-lg opacity-90">
                Backed by leading investors to help you
                <br />
                build and launch faster than ever.
              </p>
            </div>

            {/* Mock Browser Window */}
            <div className="bg-white rounded-xl overflow-hidden shadow-xl">
              <div className="bg-gray-800 px-4 py-3 flex items-center space-x-2">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-12 text-center text-white">
                <div className="text-6xl font-bold mb-4">$70M</div>
                <p className="text-xl mb-6">in Series B funding round</p>
                <p className="text-sm opacity-90">
                  To celebrate this milestone we are giving a<br />
                  flat 75% off on our standard monthly plan.
                </p>
              </div>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center gap-2 mt-6">
              <div className="w-2 h-2 bg-white rounded-full" />
              <div className="w-8 h-2 bg-white rounded-full" />
              <div className="w-2 h-2 bg-white/50 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
