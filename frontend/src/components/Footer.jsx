import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <h3 className="text-xl font-bold text-black mb-4">emergent</h3>
            <p className="text-gray-600 text-sm">
              Build full-stack web and mobile apps in minutes with AI.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-black mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/features" className="text-gray-600 hover:text-black text-sm transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-600 hover:text-black text-sm transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/enterprise" className="text-gray-600 hover:text-black text-sm transition-colors">
                  Enterprise
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-black mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-black text-sm transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <Link to="/faqs" className="text-gray-600 hover:text-black text-sm transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-black text-sm transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-black mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-black text-sm transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-black text-sm transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-black text-sm transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">
            © 2025 Emergent. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-600 hover:text-black transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-600 hover:text-black transition-colors">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-600 hover:text-black transition-colors">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-600 hover:text-black transition-colors">
              <Youtube className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
